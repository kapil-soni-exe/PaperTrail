import connectToDB from "@/libs/db";
import { getCurrentUser } from "@/libs/getCurrentUser";
import JobApplicationModel from "@/models/JobApplication.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDB();
    const userId = await getCurrentUser();
    const { id } = await params;

    const application = await JobApplicationModel.findOne({ _id: id, userId });

    if (!application) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Application not found" },
        { status: 404 },
      );
    }

    application.followUpCount = (application.followUpCount || 0) + 1;
    application.lastFollowUpAt = new Date();
    await application.save();

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Follow-up marked as sent",
      data: {
        followUpCount: application.followUpCount,
        lastFollowUpAt: application.lastFollowUpAt,
      },
    });
  } catch (err) {
    console.log("Error marking follow-up as sent:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

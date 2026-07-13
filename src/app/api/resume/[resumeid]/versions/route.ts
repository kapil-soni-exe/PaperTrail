import connectToDB from "@/libs/db";
import { getCurrentUser } from "@/libs/getCurrentUser";
import ResumeModel from "@/models/Resume.model";
import ResumeVersionModel from "@/models/ResumeVersion.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ resumeid: string }> },
) {
  try {
    await connectToDB();
    const userId = await getCurrentUser();
    const { resumeid } = await params;

    // Resume exists and belongs to this user
    const resume = await ResumeModel.findOne({
      _id: resumeid,
      user_id: userId,
    });

    if (!resume) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Resume not found or you do not have access to it",
        },
        { status: 404 },
      );
    }

    const versionHistory = await ResumeVersionModel.find({
      resumeId: resumeid,
    })
      .select("versionNumber commitMessages createdAt createdByAI")
      .sort({ versionNumber: -1 })
      .lean();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Resume version history fetched successfully",
        data: versionHistory,
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log("Error fetching version timeline:", err);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Failed to fetch version timeline",
        error: { err },
      },
      { status: 500 },
    );
  }
}

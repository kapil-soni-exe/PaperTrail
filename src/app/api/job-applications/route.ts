import connectToDB from "@/libs/db";
import { getCurrentUser } from "@/libs/getCurrentUser";
import JobApplicationModel from "@/models/JobApplication.model";
import { ApiResponse } from "@/types/api.types";
import { handleApiError } from "@/libs/apiError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const userId = await getCurrentUser();

    const applications = await JobApplicationModel.find({ userId })
      .sort({ lastUpdatedFromEmailAt: -1 }) //
      .lean();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Job applications fetched successfully",
        data: applications,
      },
      { status: 200 },
    );
  } catch (err) {
    return handleApiError(err);
  }
}

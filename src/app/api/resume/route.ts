import connectToDB from "@/libs/db";
import { getCurrentUser } from "@/libs/getCurrentUser";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const userId = await getCurrentUser();
    
    // Fetch all resumes for this user, sorted by updatedAt (newest first)
    const resumes = await ResumeModel.find({ user_id: userId }).sort({ updatedAt: -1 });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Resumes fetched successfully",
      data: resumes
    }, {
      status: 200
    });
  } catch (err) {
    console.error("Error fetching resumes:", err);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: "Error fetching resumes",
      error: { err }
    }, {
      status: 500
    });
  }
}

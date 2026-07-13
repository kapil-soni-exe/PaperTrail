import connectToDB from "@/libs/db";
import { getCurrentUser } from "@/libs/getCurrentUser";
import ResumeModel from "@/models/Resume.model";
import ResumeVersionModel from "@/models/ResumeVersion.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{ params }: { params: Promise<{ resumeid: string; versionid: string }> }) {

    try{
        await connectToDB();
        const userId= await getCurrentUser();
        const { resumeid, versionid } = await params;

        // Check if resume exists and belongs to the user
        const resume = await ResumeModel.findOne({
      _id: resumeid,
      user_id: userId
    });

    if(!resume){
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "Resume not found or you do not have access to it",
          },
          { status: 404 },
        );
    }

    const version = await ResumeVersionModel.findOne({
      _id: versionid,
      resumeId: resumeid
    }).lean();

    if(!version){
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "Version not found or you do not have access to it",
          },
          { status: 404 },
        );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Version fetched successfully",
      data: version
    }, { status: 200 });

  }catch (err) {
    console.log("Error fetching version:", err);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: "Failed to fetch version",
      error: { err }
    }, { status: 500 });
  }
}
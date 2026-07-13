import connectToDB from "@/libs/db";
import { getCurrentUser } from "@/libs/getCurrentUser";
import { createSnapshotIfNeeded } from "@/libs/Resumeversion.helper";
import ResumeModel from "@/models/Resume.model";
import ResumeVersionModel from "@/models/ResumeVersion.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ resumeid: string; versionid: string }> }
) {
  try {
    await connectToDB();
    const userId = await getCurrentUser();
    const { resumeid, versionid } = await params;

    // Ownership check 
    const resume = await ResumeModel.findOne({
      _id: resumeid,
      user_id: userId
    });

    if (!resume) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Resume not found or you do not have access to it" },
        { status: 404 }
      );
    }

    const versionToRestore = await ResumeVersionModel.findOne({
      _id: versionid,
      resumeId: resumeid,
    }).lean();

    if (!versionToRestore) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Version not found" },
        { status: 404 }
      );
    }


    const {
      _id,
      user_id,
      currentVersion,
      createdAt,
      updatedAt,
      __v,
      ...restorableFields
    } = versionToRestore.snapshot;

    const restoredResume = await ResumeModel.findByIdAndUpdate(
      resumeid,
      { $set: restorableFields },
      { new: true, runValidators: true }
    );

    if (!restoredResume) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Failed to restore resume" },
        { status: 500 }
      );
    }

    // Naya version banao (restore action ko bhi ek commit ki tarah treat karo)
    await createSnapshotIfNeeded(
      resumeid,
      resume.toObject(),        // restore se PEHLE ka data (old)
      restoredResume!.toObject() // restore ke BAAD ka data (new)
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      message: `Successfully restored to version ${versionToRestore.versionNumber}`,
      data: restoredResume
    }, { status: 200 });
    

  } catch (err) {
    console.log("Error restoring version:", err);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: "Failed to restore version",
      error: { err }
    }, { status: 500 });
  }
}
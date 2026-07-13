import connectToDB from "@/libs/db";
import { getCurrentUser } from "@/libs/getCurrentUser";
import { stripNoiseFields } from "@/libs/Resumeversion.helper";
import ResumeModel from "@/models/Resume.model";
import ResumeVersionModel from "@/models/ResumeVersion.model";
import { ApiResponse } from "@/types/api.types";
import { diffJson, diffWords } from "diff";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest, {params}:{params:Promise<{resumeid:string}>}) {
    try{
        await connectToDB();
        const userId = await getCurrentUser();
        const { resumeid } = await params;

        const fromVersionId=req.nextUrl.searchParams.get("from")
        const toVersionId=req.nextUrl.searchParams.get("to")

        if(!fromVersionId || !toVersionId){
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Both 'from' and 'to' version IDs are required",
            }, { status: 400 });
        }

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

    // Fetch both versions parallel
    const [fromVersion, toVersion] = await Promise.all([
        ResumeVersionModel.findOne({ _id: fromVersionId, resumeId: resumeid }),
        ResumeVersionModel.findOne({ _id: toVersionId, resumeId: resumeid })
    ]);


    if (!fromVersion || !toVersion) {
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "One or both versions not found"
        }, { status: 404 });
    }

    const oldSnapshot = fromVersion.snapshot;
    const newSnapshot = toVersion.snapshot;

    const summaryDiff = diffWords(
        oldSnapshot?.summary || "",
        newSnapshot?.summary || ""
    )

    const cleanOldSkills = stripNoiseFields(oldSnapshot.skills || []);
const cleanNewSkills = stripNoiseFields(newSnapshot.skills || []);
const skillsDiff = diffJson(cleanOldSkills, cleanNewSkills);

const cleanOldProjects = stripNoiseFields(oldSnapshot.projects || []);
const cleanNewProjects = stripNoiseFields(newSnapshot.projects || []);
const projectsDiff = diffJson(cleanOldProjects, cleanNewProjects);

const cleanOldWorkExp = stripNoiseFields(oldSnapshot.workExperience || []);
const cleanNewWorkExp = stripNoiseFields(newSnapshot.workExperience || []);
const workExperienceDiff = diffJson(cleanOldWorkExp, cleanNewWorkExp);

const cleanOldEducation = stripNoiseFields(oldSnapshot.education || []);
const cleanNewEducation = stripNoiseFields(newSnapshot.education || []);
const educationDiff = diffJson(cleanOldEducation, cleanNewEducation);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Versions compared successfully",
      data: {
        from: {
          versionNumber: fromVersion.versionNumber,
          commitMessages: fromVersion.commitMessages,
        },
        to: {
          versionNumber: toVersion.versionNumber,
          commitMessages: toVersion.commitMessages,
        },
        diff: {
          summary: summaryDiff,
          skills: skillsDiff,
          projects: projectsDiff,
          workExperience: workExperienceDiff,
          education: educationDiff,
        },
      },
    }, { status: 200 });

    } catch (err) {
    console.log("Error comparing versions:", err);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: "Failed to compare versions",
      error: { err }
    }, { status: 500 });
  }
}
import connectToDB from "@/libs/db";
import { getCurrentUser } from "@/libs/getCurrentUser";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";
import { handleApiError } from "@/libs/apiError";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const userId = await getCurrentUser();

        const newResume = await ResumeModel.create({
            user_id: userId,
            title: "",
            summary: "",
            personalInfo: {},
            workExperience: [],
            projects: [],
            education: [],
            certifications: [],
            skills: [],
        });

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Resume created successfully",
            data: newResume,
        }, { status: 201 });

    } catch (err) {
        return handleApiError(err);
    }
}
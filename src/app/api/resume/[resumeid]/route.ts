import connectToDB from "@/libs/db";
import { getCurrentUser } from "@/libs/getCurrentUser";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";
import { createSnapshotIfNeeded } from "@/libs/Resumeversion.helper";
import { handleApiError, NotFoundError, BadRequestError } from "@/libs/apiError";
import { ResumeUpdateSchema } from "@/libs/validation";

export async function GET(req: NextRequest, { params }: { params: Promise<{ resumeid: string }> }) {
    try {
        await connectToDB();
        const userId = await getCurrentUser();
        const { resumeid } = await params;

        const resume = await ResumeModel.findOne({ _id: resumeid, user_id: userId });
        if (!resume) {
            throw new NotFoundError("Resume not found");
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Resume fetched successfully",
            data: resume,
        }, { status: 200 });

    } catch (err) {
        return handleApiError(err);
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ resumeid: string }> }) {
    try {
        await connectToDB();
        const userId = await getCurrentUser();
        const body = await req.json();
        const { createVersion } = body;
        const { resumeid } = await params;
        console.log("createVersion received:", createVersion);

        // Validate the update payload
        const parsed = ResumeUpdateSchema.safeParse(body);
        if (!parsed.success) {
            throw new BadRequestError(parsed.error.issues[0].message);
        }

        const safeUpdates = parsed.data;

        const oldResume = await ResumeModel.findOne({ _id: resumeid, user_id: userId });
        if (!oldResume) {
            throw new NotFoundError("Resume not found");
        }

        const updatedResume = await ResumeModel.findOneAndUpdate(
            { _id: resumeid, user_id: userId },
            { $set: safeUpdates },
            { returnDocument: "after", runValidators: true }
        );

        if (!updatedResume) {
            throw new NotFoundError("Resume update failed — document not found");
        }

        let versionCreated = null;
        if (createVersion === true) {
            versionCreated = await createSnapshotIfNeeded(
                resumeid,
                oldResume.toObject(),
                updatedResume.toObject()
            );
        }
         
        const responseData = versionCreated
    ? { ...updatedResume.toObject(), currentVersion: versionCreated.versionNumber }
    : updatedResume;

        return NextResponse.json<ApiResponse>({
            success: true,
            message: versionCreated ? "Resume updated and version saved" : "Resume updated successfully",
            data: responseData,
        }, { status: 200 });

    } catch (err) {
        return handleApiError(err);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ resumeid: string }> }) {
    try {
        await connectToDB();
        const userId = await getCurrentUser();
        const { resumeid } = await params;

        const deletedResume = await ResumeModel.findOneAndDelete({
            _id: resumeid,
            user_id: userId,
        });

        if (!deletedResume) {
            throw new NotFoundError("Resume not found or already deleted");
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Resume deleted successfully",
        }, { status: 200 });

    } catch (err) {
        return handleApiError(err);
    }
}
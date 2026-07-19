import connectToDB from "@/libs/db";
import { getCurrentUser } from "@/libs/getCurrentUser";
import JobApplicationModel from "@/models/JobApplication.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";
import {
  handleApiError,
  NotFoundError,
  BadRequestError,
} from "@/libs/apiError";
import { JobApplicationUpdateSchema } from "@/libs/validation";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDB();
    const userId = await getCurrentUser();
    const { id } = await params;
    const json = await req.json();

    // Zod validation
    const parsed = JobApplicationUpdateSchema.safeParse(json);
    if (!parsed.success) {
      throw new BadRequestError(parsed.error.issues[0].message);
    }

    const application = await JobApplicationModel.findOne({ _id: id, userId });
    if (!application) {
      throw new NotFoundError("Application not found");
    }

    // Apply validated changes
    const updates = parsed.data;
    Object.keys(updates).forEach((key) => {
      const val = (updates as any)[key];
      if (val !== undefined) {
        (application as any)[key] = val;
      }
    });

    await application.save();

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Application updated successfully",
      data: application,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDB();
    const userId = await getCurrentUser();
    const { id } = await params;

    const deleted = await JobApplicationModel.findOneAndDelete({
      _id: id,
      userId,
    });
    if (!deleted) {
      throw new NotFoundError("Application not found");
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDB();
    const userId = await getCurrentUser();
    const { id } = await params;

    const application = await JobApplicationModel.findOne({ _id: id, userId });
    if (!application) {
      throw new NotFoundError("Application not found");
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Application fetched successfully",
      data: application,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

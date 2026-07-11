import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/libs/db";
import UserModel from "@/models/user.model";
import { generateToken } from "@/libs/jwt";
import { RegisterSchema } from "@/libs/validation";
import { handleApiError, BadRequestError, ConflictError } from "@/libs/apiError";
import { ApiResponse } from "@/types/api.types";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const json = await req.json();

        // Zod validation
        const parsed = RegisterSchema.safeParse(json);
        if (!parsed.success) {
            throw new BadRequestError(parsed.error.issues[0].message);
        }

        const { name, email, password, mobile } = parsed.data;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            throw new ConflictError("An account with this email already exists");
        }

        const newUser = await UserModel.create({ name, email, password, mobile });
        const token = generateToken({ userId: newUser._id.toString() });

        const response = NextResponse.json<ApiResponse>({
            success: true,
            message: "Account created successfully",
            data: {
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                },
            },
        }, { status: 201 });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return response;

    } catch (err) {
        return handleApiError(err);
    }
}
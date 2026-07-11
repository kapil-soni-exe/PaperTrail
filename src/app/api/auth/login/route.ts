import connectToDB from "@/libs/db";
import { generateToken } from "@/libs/jwt";
import UserModel from "@/models/user.model";
import { handleApiError, NotFoundError, UnauthorizedError, BadRequestError } from "@/libs/apiError";
import { LoginSchema } from "@/libs/validation";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const json = await req.json();
        
        // Zod validation
        const parsed = LoginSchema.safeParse(json);
        if (!parsed.success) {
            throw new BadRequestError(parsed.error.issues[0].message);
        }

        const { email, password } = parsed.data;

        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new NotFoundError("No account found with this email");
        }

        const isPasswordValid = user.comparePassword(password);
        if (!isPasswordValid) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const token = generateToken({ userId: user._id.toString() });

        const response = NextResponse.json<ApiResponse>({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                },
            },
        }, { status: 200 });

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
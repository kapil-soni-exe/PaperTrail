import { ApiResponse } from "@/types/api.types";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json<ApiResponse>({
    success: true,
    message: "Logged out successfully"
  }, {
    status: 200
  });

  // Clear the cookie by setting maxAge to 0
  response.cookies.set("token", "", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0
  });

  return response;
}

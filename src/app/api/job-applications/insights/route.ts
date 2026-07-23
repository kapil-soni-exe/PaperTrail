import connectToDB from "@/libs/db";
import { getCurrentUser } from "@/libs/getCurrentUser";
import JobApplicationModel from "@/models/JobApplication.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const userId = await getCurrentUser();

    const applications = await JobApplicationModel.find({ userId }).lean();

    const total = applications.length;

    const statusCounts: Record<string, number> = {
      applied: 0,
      interview_scheduled: 0,
      offer: 0,
      rejected: 0,
      cancelled: 0,
      unknown: 0,
    };

    for (const app of applications) {
      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    }

    const interviewRate =
      total > 0
        ? ((statusCounts.interview_scheduled + statusCounts.offer) / total) *
          100
        : 0;
    const rejectionRate = total > 0 ? (statusCounts.rejected / total) * 100 : 0;

    // Stale applications — "applied" status pending from 10days
    const now = Date.now();
    const staleApplications = applications.filter((app) => {
      if (app.status !== "applied") return false;
      const daysSince =
        (now - new Date(app.lastUpdatedFromEmailAt).getTime()) /
        (1000 * 60 * 60 * 24);
      return daysSince >= 10;
    });

    // Role frequency
    const roleFrequency: Record<string, number> = {};
    for (const app of applications) {
      if (!app.role) continue;
      const key = app.role.toLowerCase().trim();
      roleFrequency[key] = (roleFrequency[key] || 0) + 1;
    }
    const topRoles = Object.entries(roleFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([role, count]) => ({ role, count }));

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Insights generated successfully",
        data: {
          totalApplications: total,
          statusBreakdown: statusCounts,
          interviewRate: `${interviewRate.toFixed(1)}%`,
          rejectionRate: `${rejectionRate.toFixed(1)}%`,
          staleApplicationsCount: staleApplications.length,
          staleApplications: staleApplications.map((app) => ({
            id: app._id,
            company: app.company,
            role: app.role,
            daysPending: Math.floor(
              (now - new Date(app.lastUpdatedFromEmailAt).getTime()) /
                (1000 * 60 * 60 * 24),
            ),
          })),
          topRoles,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.log("Error generating insights:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Failed to generate insights" },
      { status: 500 },
    );
  }
}

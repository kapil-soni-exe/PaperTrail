import connectToDB from "@/libs/db";
import { generateAiContent } from "@/libs/gemini";
import { getCurrentUser } from "@/libs/getCurrentUser";
import JobApplicationModel from "@/models/JobApplication.model";
import UserModel from "@/models/user.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

/** Minimum days before a follow-up is appropriate, based on how the application was initiated. */
const MIN_FOLLOW_UP_DAYS: Record<string, number> = {
  cold_outreach: 5, // Cold email etiquette: follow up sooner (4-5 days)
  ats_confirmation: 7, // Formal application: standard 7-day window
  job_posting_reply: 7, // Human recruiter reply: same standard window
};

const DEFAULT_MIN_FOLLOW_UP_DAYS = 7;

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
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Application not found" },
        { status: 404 },
      );
    }

    const user = await UserModel.findById(userId).select("name");
    const rawName = user?.name?.split(" ")[0] || "the candidate";
    const userName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

    const daysSinceUpdate = Math.floor(
      (Date.now() - new Date(application.lastUpdatedFromEmailAt).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (application.status !== "applied") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message:
            "Follow-up is only relevant for applications still in 'applied' status",
        },
        { status: 400 },
      );
    }

    // ── Eligibility window: branch on source ──────────────────────────────
    const minDays =
      MIN_FOLLOW_UP_DAYS[application.source ?? ""] ??
      DEFAULT_MIN_FOLLOW_UP_DAYS;

    if (daysSinceUpdate < minDays) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: `Only ${daysSinceUpdate} days since ${application.source === "cold_outreach" ? "your outreach" : "application"} — too early for a follow-up (minimum: ${minDays} days)`,
        },
        { status: 400 },
      );
    }

    if (daysSinceUpdate > 60) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message:
            "This application is too old for a follow-up — likely no longer active",
        },
        { status: 400 },
      );
    }

    if (application.followUpCount >= 3) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Maximum follow-ups reached." },
        { status: 400 },
      );
    }

    const timeContext =
      daysSinceUpdate > 30
        ? "a while ago"
        : `about ${daysSinceUpdate} days ago`;

    // ── Prompt: branch on source 
    const isColdOutreach = application.source === "cold_outreach";

    const prompt = isColdOutreach
      ? `You're ${userName}, a fresher full-stack developer. You sent a cold email to ${application.company}${application.role ? ` expressing interest in a ${application.role} role` : " expressing interest in joining their team"} ${timeContext} and haven't heard back. Write a short follow-up email that sounds like "following up on my note from last week" — NOT like "following up on my application to a job posting".

Tone: warm, direct, slightly informal-but-professional. Don't sound corporate or desperate.

Subject line rules:
- Do NOT start with "Checking in", "Following up", "Follow-up on"
- Keep it specific and conversational — e.g. "Re: ${application.role ? `${application.role} at ${application.company}` : `joining ${application.company}`}" or similar

Body formatting (IMPORTANT):
- Start with a simple greeting on its own line (e.g. "Hi,") — generic since we may not know the recipient's name
- Write as a proper email — NOT one giant paragraph
- Put the sign-off ("Thanks," / "Best," + "${userName}") on its own separate line at the end, with a line break before it
- 80-120 words total
- Reference your original outreach briefly ("I reached out a few days ago...")
- Ask politely if there's any interest or a good time to connect
- Do NOT use phrases like "I applied", "my application", "application status" — this was a cold email, not a formal application

This is follow-up #${application.followUpCount + 1} — if it's the 2nd or 3rd, acknowledge lightly without being repetitive.

Return ONLY this JSON, nothing else. Use \\n for line breaks inside the email string:
{"subject": "...", "email": "..."}`
      : `You're ${userName}, a fresher full-stack developer. You applied to ${application.company}${application.role ? ` for the ${application.role} role` : ""} ${timeContext} and haven't heard back. Write a short follow-up email in your own voice — not corporate, not desperate, just a genuine, slightly informal-but-professional nudge.

Subject line rules:
- Do NOT start with "Checking in", "Following up", "Follow-up on"
- Make it specific and low-key — e.g. "Re: ${application.role || "my application"} at ${application.company}" or similar

Body formatting (IMPORTANT):
- Start with a simple greeting on its own line (e.g. "Hi,") — generic since we don't know the recruiter's name
- Write as a proper email with clear structure — NOT one giant paragraph
- Put the sign-off ("Thanks," / "Best," + "${userName}") on its own separate line at the end, with a line break before it
- 90-130 words total, not shorter
- Mention briefly why you're still interested, without inventing specific achievements
- Ask directly but politely if there's an update

This is follow-up #${application.followUpCount + 1} — if it's the 2nd or 3rd, acknowledge lightly without being repetitive.

Return ONLY this JSON, nothing else. Use \\n for line breaks inside the email string:
{"subject": "...", "email": "..."}`;

    const response = await generateAiContent(prompt);
    if (!response) throw new Error("AI did not return content");

    const cleaned = response.replace(/```json|```/g, "").trim();
    const draft = JSON.parse(cleaned);

    const mailtoLink = application.recruiterEmail
      ? `mailto:${application.recruiterEmail}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.email)}`
      : null;

    application.lastDraftGeneratedAt = new Date();
    await application.save();

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Follow-up generated.",
      data: {
        ...draft,
        recruiterEmail: application.recruiterEmail,
        mailtoLink,
        source: application.source,
      },
    });
  } catch (err) {
    console.log("Error generating follow-up draft:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

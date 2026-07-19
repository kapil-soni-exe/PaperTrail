import mongoose, { Types } from "mongoose";

export type ApplicationSource =
  | "cold_outreach"
  | "job_posting_reply"
  | "ats_confirmation"
  | null;

export interface IJobApplication {
  _id: string;
  userId: Types.ObjectId;
  company: string;
  role: string | null;
  status:
    | "applied"
    | "interview_scheduled"
    | "rejected"
    | "offer"
    | "cancelled"
    | "unknown";
  /** How this application was initiated. null = indeterminate (legacy records). */
  source: ApplicationSource;
  resumeVersionId?: Types.ObjectId;
  sourceEmailIds: string[];
  lastUpdatedFromEmailAt: Date;
  followUpCount: number;
  lastFollowUpAt?: Date;
  lastDraftGeneratedAt?: Date;
  recruiterEmail: string | null;
  appliedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const jobApplicationSchema = new mongoose.Schema<IJobApplication>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: [
        "applied",
        "interview_scheduled",
        "rejected",
        "offer",
        "cancelled",
        "unknown",
      ],
      default: "unknown",
    },
    resumeVersionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResumeVersion",
    },
    sourceEmailIds: {
      type: [String],
      default: [],
    },
    lastUpdatedFromEmailAt: {
      type: Date,
      required: true,
    },
    followUpCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastDraftGeneratedAt: {
      type: Date,
    },

    recruiterEmail: {
      type: String,
      default: null,
    },

    source: {
      type: String,
      enum: ["cold_outreach", "job_posting_reply", "ats_confirmation", null],
      default: null,
    },

    lastFollowUpAt: {
      type: Date,
    },
    appliedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

jobApplicationSchema.index(
  { userId: 1, company: 1, role: 1 },
  { unique: true },
);

const JobApplicationModel =
  mongoose.models.JobApplication ||
  mongoose.model<IJobApplication>("JobApplication", jobApplicationSchema);

export default JobApplicationModel;

import { IResume } from "@/types/resume.types";
import mongoose from "mongoose";

let resumeSchema = new mongoose.Schema<IResume>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true
    },
    title: {
      type: String,
      default: " ",
    },
    currentVersion: {
    type: Number,
    default: 0,
  },
    summary: {
      type: String,
      default: " ",
    },
    personalInfo: {
      type: {
        fullname: String,
        email: String,
        mobile: String,
        location: String,
        github: String,
        linkedIn: String,
        portfolio: String,
      },
      default: {},
    },

    education: {
      type: [
        {
          institution: String,
          degree: String,
          fieldOfStudy: String,
          startDate: Date,
          endDate: Date,
        },
      ],
      default: [],
    },
    workExperience: {
      type: [
        {
          jobTitle: String,
          company: String,
          location: String,
          startDate: Date,
          endDate: Date,
          description: String,
        },
      ],
      default: [],
    },
    projects: {
      type: [
        {
          title: String,
          description: String,
          technologies: [String],
          githubUrl: String,
          liveUrl: String,
        },
      ],
      default: [],
    },
    skills: {
      type: [
        {
          category: String,
          items: [String],
        },
      ],
      default: [],
    },
    certifications: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const ResumeModel =
  (mongoose.models.Resume as mongoose.Model<IResume>) ||
  mongoose.model<IResume>("Resume", resumeSchema);

export default ResumeModel;


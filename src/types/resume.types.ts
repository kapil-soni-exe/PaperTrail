import { Types } from "mongoose";

export interface IPersonalInfo {
    fullname: string;
    email: string;
    mobile: string;
    location: string;
    github: string;
    linkedIn: string;
    portfolio: string;
}

export interface IWorkExperience {
    jobTitle: string;
    company: string;
    location: string;
    startDate: Date;
    endDate: Date;
    description: string;
}

export interface IProject{
    title: string;
    description: string;
    technologies: string[];
    githubUrl: string;
    liveUrl: string;
}

export interface IEducation{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date;
    endDate: Date;
}

export interface ISkillCategory {
    category: string;
    items: string[];
}


export interface IResume {
    _id:string;
    user_id:Types.ObjectId;
    title: string;
    currentVersion:number;
    summary: string;
    personalInfo: IPersonalInfo;
    workExperience?: IWorkExperience[];
    skills?: ISkillCategory[];
    projects: IProject[];
    education: IEducation[];
    certifications?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IResumeVersion{
    _id: string;
    resumeId: Types.ObjectId;
    versionNumber: number;
    snapshot: Partial<IResume>;
    commitMessages: string[];
    createdByAI: boolean;
    createdAt?: Date;
}

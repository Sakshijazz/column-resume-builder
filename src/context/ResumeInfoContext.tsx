import { createContext } from "react";

interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Skills {
  id: string;
  skill: string;
}

export interface ResumeInfo {
  title?: string;
  resumeId?: string;
  userEmail?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  jobTitle?: string;
  phone?: string;
  email?: string;
  summary?: string;
  Education?: Education[];
  Experience?: Experience[];
  Skills?: Skills[];
  themeColor?: string;
}

export const ResumeInfoContext = createContext<ResumeInfo | null>(null);

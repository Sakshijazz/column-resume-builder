import { ResumeInfo } from "@/context/ResumeInfoContext";
import axios from "axios";

const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

const createNewResume = (data: any) => axiosClient.post("/user-resumes", data);

const getUserResumes = (userEmail: string | undefined) =>
  axiosClient.get("/user-resumes?filters[userEmail][$eq]=" + userEmail);

const updateResumeDetail = (id: string, data: any) =>
  axiosClient.put("/user-resumes/" + id, data);

const getResumeById = (id: string) =>
  axiosClient.get("/user-resumes/" + id + "?populate=*");

const deleteResumeById = (id: string) =>
  axiosClient.delete("/user-resumes/" + id);

export default {
  createNewResume,
  getUserResumes,
  updateResumeDetail,
  getResumeById,
  deleteResumeById,
};

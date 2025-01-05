import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { UserProfileHeader } from "./components/UserProfileHeader";
import AddResume from "./components/AddResume";
import ResumeCardItem from "./components/ResumeCardItem";
import apiService from "@/service/apiService";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Info } from "lucide-react";

interface Resume {
  documentId: string;
  title: string;
  updatedAt: string;
  themeColor: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  address: string;
  phone: string;
  email: string;
}

interface ResumeCardItemProps {
  resume: Resume;
  onUpdateResume: (documentId: string, updatedResume: Partial<Resume>) => void;
  onDeleteResume: (documentId: string) => void;
}

const Dashboard = () => {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    user && GetResumesList();
  }, [user]);

  const GetResumesList = async () => {
    setLoading(true);
    try {
      const response = await apiService.getUserResumes(
        user?.primaryEmailAddress?.emailAddress
      );
      setResumeList(response.data.data);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateResume = (
    documentId: string,
    updatedResume: Partial<Resume>
  ) => {
    setResumeList((prevList: Resume[]) =>
      prevList.map((resume) =>
        resume.documentId === documentId
          ? { ...resume, ...updatedResume }
          : resume
      )
    );
  };

  const handleDeleteResume = (documentId: string) => {
    setResumeList((prevList) =>
      prevList.filter((resume) => resume.documentId !== documentId)
    );
  };

  return (
    <div className="container mx-auto px-24 py-8">
      <UserProfileHeader />

      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">Quick Stats</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">Total Resumes:</span>
              <span className="font-semibold">{resumeList.length}</span>
            </div>
            {/* Add more stats here */}
          </div>
        </CardContent>
      </Card>

      <h3 className="text-xl font-semibold mb-4">My Resumes</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AddResume onResumeCreated={GetResumesList} />
        {loading ? (
          Array(3)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))
        ) : resumeList.length > 0 ? (
          resumeList.map((resume, index) => (
            <ResumeCardItem
              resume={resume}
              key={resume.documentId}
              onUpdateResume={handleUpdateResume}
              onDeleteResume={handleDeleteResume}
              reloadResumes={GetResumesList}
            />
          ))
        ) : (
          <Card className="p-8 flex flex-col gap-4 items-center justify-center">
            <Info className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground text-center">
              No resumes found. Create your first resume to get started!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

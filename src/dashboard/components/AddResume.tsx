import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import apiService from "@/service/apiService";
import { toast } from "sonner";

interface AddResumeProps {
  onResumeCreated: () => void;
}

const AddResume: React.FC<AddResumeProps> = ({ onResumeCreated }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  const createNewResume = async () => {
    setLoading(true);
    const uuid = uuidv4();
    const defaultTitle = `Resume ${new Date().toLocaleDateString()} - ${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    const data = {
      data: {
        title: defaultTitle,
        resumeId: uuid,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName,
      },
    };

    try {
      const resp = await apiService.createNewResume(data);
      if (resp && resp.data && resp.data.data) {
        toast.success("New resume created successfully!");
        onResumeCreated();
      }
    } catch (error) {
      console.error("Failed to create new resume:", error);
      toast.error("Failed to create new resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[280px]">
        <PlusCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h4 className="font-semibold mb-2">Create New Resume</h4>
        <p className="text-sm text-muted-foreground text-center mb-4">
          Start building your professional resume with AI assistance
        </p>
        <Button onClick={createNewResume} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Get Started
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddResume;

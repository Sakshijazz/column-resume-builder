import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import apiService from "@/service/apiService";
import {
  FileText,
  Edit2,
  Download,
  Trash2,
  MoreVertical,
  Loader2,
  Edit,
} from "lucide-react";
import { Input } from "@/components/ui/input";

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
  reloadResumes: () => void;
}

function ResumeCardItem({
  resume,
  onUpdateResume,
  onDeleteResume,
  reloadResumes,
}: ResumeCardItemProps) {
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isTitleUpdating, setIsTitleUpdating] = useState(false);
  const [newTitle, setNewTitle] = useState(resume.title);

  const onDelete = async () => {
    setLoading(true);
    try {
      await apiService.deleteResumeById(resume.documentId);
      toast("Resume Deleted!");
      onDeleteResume(resume.documentId);
      setOpenAlert(false);
      reloadResumes();
    } catch (error) {
      toast.error("Failed to delete resume");
    } finally {
      setLoading(false);
    }
  };

  const handleTitleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleTitleBlur = async () => {
    if (newTitle === resume.title) {
      setIsEditing(false);
      return;
    }

    setIsTitleUpdating(true);
    try {
      const data = { title: newTitle };
      const response = await apiService.updateResumeDetail(resume.documentId, {
        data,
      });
      onUpdateResume(resume.documentId, {
        ...resume,
        title: newTitle,
        updatedAt: new Date().toISOString(),
      });
      toast("Title Updated!");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update title");
      setNewTitle(resume.title);
    } finally {
      setIsTitleUpdating(false);
      setIsEditing(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      {isTitleUpdating ? (
        <div className="w-full h-full flex justify-center items-center">
          <Loader2 className="w-12 h-12 animate-spin" />
        </div>
      ) : (
        <>
          <CardContent className="p-6">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-full mb-4"
              style={{ backgroundColor: `${resume?.themeColor}20` }}
            >
              <FileText
                className="h-12 w-12"
                style={{ color: resume?.themeColor }}
              />
            </div>
            {isEditing ? (
              <Input
                type="text"
                value={newTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                className="font-semibold text-xl mb-2 truncate"
                autoFocus
                required
                disabled={isTitleUpdating}
              />
            ) : (
              <div className="flex items-center">
                <h4
                  className="font-semibold text-xl mb-2 truncate"
                  onDoubleClick={handleTitleDoubleClick}
                >
                  {resume.title}
                </h4>

                <Edit
                  className="h-4 w-4 ml-4 cursor-pointer"
                  onClick={handleTitleDoubleClick}
                />
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
            </p>
          </CardContent>
          <CardFooter className="bg-muted/50 p-4">
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(`/dashboard/resume/${resume.documentId}/edit`)
                }
              >
                <Edit2 className="w-4 h-4 mr-2" /> Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/my-resume/${resume.documentId}/view`)}
              >
                <FileText className="w-4 h-4 mr-2" /> View
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      navigate(`/my-resume/${resume.documentId}/view`)
                    }
                  >
                    <Download className="w-4 h-4 mr-2" /> Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOpenAlert(true)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardFooter>
        </>
      )}

      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              resume and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

export default ResumeCardItem;

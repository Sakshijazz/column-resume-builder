import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Brain, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import apiService from "@/service/apiService";
import { AIChatSession } from "@/service/aiService";

const prompt =
  "Job Title: {jobTitle} , Depends on job title give me list of  summary for 3 experience level, Mid Level and Freasher level in 3 -4 lines in array format, With summary and experience_level Field in JSON Format";
function Summary({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summary, setSummary] = useState();
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const [aiGeneratedSummaryList, setAiGenerateSummaryList] = useState([]);
  useEffect(() => {
    summary &&
      setResumeInfo({
        ...resumeInfo,
        summary: summary,
      });
  }, [summary]);

  const GenerateSummaryFromAI = async () => {
    setLoading(true);
    const PROMPT = prompt.replace("{jobTitle}", resumeInfo?.jobTitle);
    console.log("AI Prompt:", PROMPT);

    try {
      const result = await AIChatSession.sendMessage(PROMPT);
      const responseText = await result.response.text();
      console.log("Raw Response Text:", responseText);

      // Directly parse the responseText as a JSON array
      const summariesArray = JSON.parse(responseText);

      if (Array.isArray(summariesArray)) {
        console.log("Parsed Summaries Array:", summariesArray);
        setAiGenerateSummaryList(summariesArray);
      } else {
        throw new Error("Response is not in expected array format");
      }
    } catch (error) {
      console.error("Error processing AI response:", error);
      toast.error("Failed to generate summaries. Please try again.");
      setAiGenerateSummaryList([]); // Ensure state is reset
    } finally {
      setLoading(false);
    }
  };

  const onSave = (e) => {
    e.preventDefault();

    setLoading(true);
    const data = {
      data: {
        summary: summary,
      },
    };
    apiService.updateResumeDetail(params?.resumeId, data).then(
      (resp) => {
        console.log(resp);
        enabledNext(true);
        setLoading(false);
        toast("Details updated");
      },
      (error) => {
        setLoading(false);
      }
    );
  };
  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Summary</h2>
        <p>Add Summary for your job title</p>

        <form className="mt-7" onSubmit={onSave}>
          <div className="flex justify-between items-end">
            <label>Add Summary</label>
            <Button
              variant="outline"
              onClick={() => GenerateSummaryFromAI()}
              type="button"
              size="sm"
              className="border-primary text-primary flex gap-2"
            >
              <Brain className="h-4 w-4" /> Generate from AI
            </Button>
          </div>
          <Textarea
            className="mt-5"
            required
            value={summary}
            defaultValue={summary ? summary : resumeInfo?.summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </div>

      {Array.isArray(aiGeneratedSummaryList) &&
      aiGeneratedSummaryList.length > 0 ? (
        aiGeneratedSummaryList.map((item, index) => (
          <div
            key={index}
            onClick={() => setSummary(item?.summary)}
            className="p-5 shadow-lg my-4 rounded-lg cursor-pointer"
          >
            <h2 className="font-bold my-1 text-primary">
              Level: {item?.experience_level}
            </h2>
            <p>{item?.summary}</p>
          </div>
        ))
      ) : (
        <p>No suggestions available. Try generating again.</p>
      )}
    </div>
  );
}

export default Summary;

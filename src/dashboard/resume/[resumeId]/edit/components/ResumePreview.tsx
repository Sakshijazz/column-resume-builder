import React, { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import SummaryPreview from "./preview/SummaryPreview";
import PersonalDetailPreview from "./preview/PersonalDetailsPreview";
import ExperiencePreview from "./preview/ExperiancePreview";
import SkillsPreview from "./preview/SkillsPreview";
import EducationalPreview from "./preview/EducationalPreview";

const ResumePreview = () => {
  const { resumeInfo } = useContext(ResumeInfoContext);
  const [contentHeight, setContentHeight] = useState(0);
  const [numPages, setNumPages] = useState(1);

  useEffect(() => {
    const calculatePages = () => {
      // Get all section content
      const sections = document.querySelectorAll(".resume-section");
      let totalHeight = 0;
      sections.forEach((section) => {
        totalHeight += section.scrollHeight;
      });

      // A4 height in pixels (297mm at 96 DPI minus padding)
      const pageHeight = 1123 - 40; // 40px for padding
      const calculatedPages = Math.ceil(totalHeight / pageHeight);

      setContentHeight(totalHeight);
      setNumPages(calculatedPages);
    };

    calculatePages();
    window.addEventListener("resize", calculatePages);

    return () => {
      window.removeEventListener("resize", calculatePages);
    };
  }, [resumeInfo]);

  return (
    <div className="flex flex-col items-center gap-8 pb-8">
      {Array.from({ length: numPages }).map((_, pageIndex) => (
        <div
          key={pageIndex}
          className="w-[210mm] h-[297mm] bg-white shadow-lg relative"
          style={{
            padding: "15mm",
            breakAfter: "page",
            breakInside: "avoid",
            pageBreakAfter: "always",
          }}
        >
          <div className="h-full">
            {pageIndex === 0 && (
              <>
                <div className="resume-section">
                  <PersonalDetailPreview resumeInfo={resumeInfo} />
                </div>
                <div className="resume-section">
                  <SummaryPreview resumeInfo={resumeInfo} />
                </div>
              </>
            )}

            <div className="resume-section">
              {resumeInfo?.Experience?.length > 0 && pageIndex <= 1 && (
                <ExperiencePreview resumeInfo={resumeInfo} />
              )}
            </div>

            <div className="resume-section">
              {resumeInfo?.Education?.length > 0 && pageIndex <= 2 && (
                <EducationalPreview resumeInfo={resumeInfo} />
              )}
            </div>

            <div className="resume-section">
              {resumeInfo?.Skills?.length > 0 && pageIndex <= 2 && (
                <SkillsPreview resumeInfo={resumeInfo} />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResumePreview;

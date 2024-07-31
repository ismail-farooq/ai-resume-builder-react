import React, { useContext } from "react";
import PersonalDetails from "./previewSection/PersonalDetails";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import Experience from "./previewSection/Experience";
import Education from "./previewSection/Education";
import Projects from "./previewSection/Projects";
import Skills from "./previewSection/Skills";

function PreviewSection() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  return (
    <div
      className="shadow-lg h-full pt-4 pr-6 pl-6 border-t-[5px] font-times"
      style={{
        borderColor: resumeInfo?.themeColor,
      }}
    >
      {/* Personal Details */}
      <PersonalDetails resumeInfo={resumeInfo}></PersonalDetails>

      {/* Education */}
      <Education resumeInfo={resumeInfo}></Education>

      {/* Work Experience */}
      <Experience resumeInfo={resumeInfo}></Experience>
      {/* Projects */}
      <Projects resumeInfo={resumeInfo}></Projects>

      {/* Skills */}
      <Skills resumeInfo={resumeInfo}></Skills>
    </div>
  );
}

export default PreviewSection;

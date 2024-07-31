import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormSection from "../../components/FormSection";
import PreviewSection from "../../components/PreviewSection";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import dummy from "@/data/dummy";
import GlobalApi from "../../../../../../service/GlobalApi";

function EditResume() {
  const params = useParams();
  const [resumeInfo,setResumeInfo] = useState();

  useEffect(() => {
    GetResumeInfo(); 
  }, []);

  const GetResumeInfo=()=>{
    GlobalApi.getResumeData(params.resumeid).then(resp=>{
      setResumeInfo(resp.data.data)
    })
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
        {/* Form Section */}
        <FormSection></FormSection>

        {/* Preview Section */}
        <PreviewSection></PreviewSection>
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default EditResume;

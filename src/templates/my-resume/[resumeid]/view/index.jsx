import Header from "@/components/custom/Header";
import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import PreviewSection from "@/templates/dashboard/resume/components/PreviewSection";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GlobalApi from "../../../../../service/GlobalApi";

function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState();
  const params = useParams();

  useEffect(() => {
    GetUserInfo();
  },[]);

  const GetUserInfo = () => {
    GlobalApi.getResumeData(params.resumeid).then((resp) => {
      setResumeInfo(resp.data.data);
    });
  };

  const HandleDownload = () => {
    window.print();
  };

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div id="no-print">
        <Header></Header>

        <div className="my-10 mx-10 md:mx-20 lg:mx-36">
          <h2 className="text-center text-2xl font-medium">
            Your Resume is Ready
          </h2>
          <p className="text-center text-gray-400">
            Edit or Download your Resume Now!
          </p>
          <div className="flex justify-between px-44 my-10">
            <Link to={`/dashboard/resume/${params.resumeid}/edit`}>
              <Button>Edit Resume</Button>
            </Link>
            <Button onClick={HandleDownload}>Download</Button>
          </div>
        </div>
      </div>

      <div id="print-area" className="my-10 mx-10 md:mx-20 lg:mx-36">
        <PreviewSection></PreviewSection>
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default ViewResume;

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../../../service/GlobalApi";
import { toast } from "@/components/ui/use-toast";

function Experience({ resumeInfo }) {

  const params = useParams();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const resp = await GlobalApi.getResumeData(params?.resumeid);
        const data = resp.data.data;
      } catch (error) {
        toast({
          title: "Load Failed",
          description: "An error occurred while loading your details.",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, [resumeInfo]);
  
  return (
    <div className="my-4">
      <h2 className="font-bold" style={{ color: 'green' }}>
        Experience
      </h2>
      <hr className="border-[1.5px]" style={{ borderColor: "black" }}></hr>

      {resumeInfo?.Experience?.map((experience, index) => (
        <div key={index} className="my-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h2
                className="text-sm font-bold"
                style={{
                  color: 'green',
                }}
              >
                {experience?.companyName} - {experience?.title1}
              </h2>
              <h2 className="text-xs ml-4">
                {experience?.city}, {experience?.state}
              </h2>
            </div>
            <span className="text-xs">
              {experience?.startDate} -{" "}
              {experience?.currentlyWorking ? "Present" : experience?.endDate}
            </span>
          </div>
          <div className="mt-2">
            {experience?.workSummary.split("•").map((item, index) => (
              <li key={index} className="text-xs">
                {item.trim()}
              </li>
            ))}
          </div>{" "}
        </div>
      ))}
    </div>
  );
}

export default Experience;

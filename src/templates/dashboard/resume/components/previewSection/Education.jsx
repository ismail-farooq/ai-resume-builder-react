import React, { useEffect } from "react";


function Education({ resumeInfo }) {
 
  return (
    <div className="my-4">
      <h2 className="font-bold" style={{ color: 'green' }}>
        Education
      </h2>
      <hr className="border-[1.5px]" style={{ borderColor: "black" }}></hr>

      {resumeInfo?.Education?.map((education, index) => (
        <div key={index} className="my-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h2
                className="text-sm font-bold"
                style={{
                  color: 'green',
                }}
              >
                {education?.universityName}
              </h2>
            </div>
            <span className="text-xs">
              {education?.startDate1} -{" "}
              {education?.currentlyWorking ? "Present" : education?.endDate1}
            </span>
          </div>
          <h2 className="text-xs font-bold">
            {education?.degree} in {education?.major}
          </h2>
          <p className="text-xs">{education?.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Education;

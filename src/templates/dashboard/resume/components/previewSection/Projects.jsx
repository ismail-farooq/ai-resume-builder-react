import React from "react";

function Projects({ resumeInfo }) {
  return (
    <div className="my-4">
      <h2 className="font-bold" style={{ color: 'green' }}>
        Projects
      </h2>
      <hr className="border-[1.5px]" style={{ borderColor: "black" }}></hr>

      {resumeInfo?.Projects?.map((projects, index) => (
        <div key={index} className="my-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h2
                className="text-sm font-bold"
                style={{
                  color: 'green',
                }}
              >
                {projects?.projectName}
              </h2>
              <h2 className="text-xs ml-4">
                ({projects?.technologies})
              </h2>
            </div>
          </div>
          <div className="mt-2">
          {projects?.description.split("•").map((item, index) => (
              <li key={index} className="text-xs">
                {item.trim()}
              </li>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Projects;

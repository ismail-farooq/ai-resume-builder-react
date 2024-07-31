import React from "react";

function Skills({ resumeInfo }) {
  return (
    <div className="my-4">
      <h2 className="font-bold" style={{ color: 'green' }}>
        Skills
      </h2>
      <hr className="border-[1.5px]" style={{ borderColor: "black" }}></hr>

      <div className="my-2">
        <ul className="grid grid-cols-5 gap-3">
          {resumeInfo?.Skills?.map((skills, index) => (
            <li key={index} className="text-xs mx-2">
              • {skills?.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Skills;

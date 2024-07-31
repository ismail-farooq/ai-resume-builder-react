import React, { useEffect, useState } from "react";
import AddResume from "./components/AddResume";
import { useUser } from "@clerk/clerk-react";
import GlobalApi from "../../../service/GlobalApi";
import ResumeItem from "../dashboard/components/ResumeItem";

function Dashboard() {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState([]);

  useEffect(() => {
    if (user) {
      getUserResumeList();
    }
  }, [user]);

  const getUserResumeList = () => {
    GlobalApi.getUserResumes(user?.primaryEmailAddress.emailAddress).then(
      (resp) => {
        console.log(resp.data.data);
        setResumeList(resp.data.data); // Correctly set the list
      }
    );
  };

  return (
    <div className="p-10 md:px-20 lg:px-32">
      <h2 className="font-bold text-3xl">My Resume</h2>
      <p>Start creating AI Resume</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-10 gap-5">
        <AddResume />
        {resumeList.length > 0 &&
          resumeList.map((resume) => (
            <ResumeItem resume={resume} key={resume.id} refreshData={getUserResumeList}/>
          ))}
      </div>
    </div>
  );
}

export default Dashboard;

import React, { useContext, useEffect, useState } from "react";
import GlobalApi from "../../../../../../service/GlobalApi";
import { toast } from "@/components/ui/use-toast";
import { useParams } from "react-router-dom";

function PersonalDetails({ resumeInfo }) {

  return (
    <div>
      <h2
        className="font-bold text-3xl text-center"
        style={{ color: 'green' }}
      >
        {resumeInfo?.firstName} {resumeInfo?.lastName}
      </h2>
      <div>
      <h2 className="font-normal text-xs">
        <div className="flex justify-evenly">
          <span>{resumeInfo?.email}</span>
          <span>|</span>
          <span>{resumeInfo?.phone}</span>
          <span>|</span>
          <span>{resumeInfo?.address}</span>
          <span>|</span>
          <span>{resumeInfo?.portfolio}</span>
        </div>
      </h2>
    </div>
    </div>
  );
}

export default PersonalDetails;

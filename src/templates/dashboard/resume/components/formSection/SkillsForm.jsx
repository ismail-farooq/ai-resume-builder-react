import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, LoaderCircle } from "lucide-react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { toast } from "@/components/ui/use-toast";
import GlobalApi from "../../../../../../service/GlobalApi";
import { useParams } from "react-router-dom";

const formField = {
  name: "",
};

function SkillsForm({ enableNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [skillsList, setSkillsList] = useState([formField]);
  const params = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    resumeInfo && setSkillsList(resumeInfo?.Skills || [formField]);
  }, [resumeInfo]);

  const handleInputChange = (index, e) => {
    enableNext(false);
    const { name, value } = e.target;
    const newEntries = [...skillsList];
    newEntries[index][name] = value;
    setSkillsList(newEntries);
    setResumeInfo((prev) => ({
      ...prev,
      Skills: newEntries,
    }));
  };

  const addNewProject = () => {
    setSkillsList([...skillsList, { ...formField }]);
  };

  const removeProject = (index) => {
    const newSkillsList = skillsList.filter((_, i) => i !== index);
    setSkillsList(newSkillsList);
    setResumeInfo((prev) => ({
      ...prev,
      Skills: newSkillsList,
    }));
  };

  const formatDateTime = (date) => {
    const dateOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", dateOptions).format(
      date
    );
    const formattedTime = new Intl.DateTimeFormat("en-US", timeOptions).format(
      date
    );

    return `${formattedDate} at ${formattedTime}`;
  };

  const onSave = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      data: {
        Skills: skillsList.map(({ id, ...rest }) => rest),
      },
    };
    console.log("Saving data:", data);
    const now = new Date();
    const formattedDateTime = formatDateTime(now);

    GlobalApi.updateResumeData(params?.resumeid, data).then(
      (resp) => {
        console.log(resp);
        enableNext(true);
        setLoading(false);
        toast({
          title: "Details Updated",
          description: formattedDateTime,
        });
      },
      (error) => {
        setLoading(false);
        console.error("Update failed:", error);
        toast({
          title: "Update Failed",
          description: "An error occurred while updating your details.",
          variant: "destructive",
        });
      }
    );
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Skills</h2>
      <p>Enter the skills and technologies that you know</p>
      <form onSubmit={onSave}>
        <div>
          {skillsList.map((item, index) => (
            <React.Fragment key={index}>
              <div className="grid grid-cols-2 mt-5 gap-3 relative">
                <div className="col-span-2">
                  <label className="text-sm">
                    Skill Name<span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="name"
                    required
                    value={item.name}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
                {skillsList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="mt-2 mr-2 p-2 text-red-500"
                    aria-label="Remove Project"
                  >
                    <Trash2 />
                  </button>
                )}
              </div>
              {index < skillsList.length - 1 && (
                <hr className="my-6 border-t-2 border-gray-300" />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-3 flex justify-between">
          <Button
            variant="outline"
            className="text-primary"
            onClick={addNewProject}
          >
            + Add More Skills
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SkillsForm;

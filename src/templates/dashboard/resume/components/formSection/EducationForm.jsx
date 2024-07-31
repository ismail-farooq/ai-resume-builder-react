import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ChevronsUpDown, Check, Trash2, LoaderCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../../../service/GlobalApi";
import { toast } from "@/components/ui/use-toast";

const formField = {
  id: "",
  universityName: "",
  startDate1: "",
  endDate1: "",
  degree: "",
  major: "",
  description: "",
};

const degreeTypes = [
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate Degree",
  "Certificate",
  "Diploma",
];

function EducationForm({ enableNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [educationList, setEducationList] = useState([formField]);
  const [open, setOpen] = useState([false]); // Initialize as an array
  const [loading, setLoading] = useState(false);
  const params = useParams();

  useEffect(()=>{
    resumeInfo&&setEducationList(resumeInfo?.Education || [formField])
  },[resumeInfo])

  const handleInputChange=(index, event)=>{
    const newEntries=educationList.slice();
    const {name,value}=event.target;
    newEntries[index][name]=value;
    setEducationList(newEntries);
    setResumeInfo((prev) => ({
      ...prev,
      Education: newEntries,
    }));
    
  }


  const handleDegreeSelect = (index, degree) => {
    const newEducationList = [...educationList];
    newEducationList[index].degree = degree;
    setEducationList(newEducationList);
    const newOpen = [...open];
    newOpen[index] = false;
    setOpen(newOpen);
  };

  const addNewEducation = () => {
    setEducationList([...educationList, { ...formField }]);
    setOpen([...open, false]); // Add new entry to the open state array
  };

  const removeEducation = (index) => {
    const newEducationList = educationList.filter((_, i) => i !== index);
    setEducationList(newEducationList);
    const newOpen = open.filter((_, i) => i !== index); // Remove corresponding open state
    setOpen(newOpen);
    setResumeInfo((prev) => ({
      ...prev,
      Education: newEducationList,
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
    const data={
      data:{
        Education: educationList.map(({ id, ...rest }) => rest)
      }
    }    
    console.log("Saving data:", data); // Log the data to check its structure
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
      <h2 className="font-bold text-lg">Education</h2>
      <p>Fill out your Education Details</p>
      <form onSubmit={onSave}>
        <div>
          {educationList.map((item, index) => (
            <React.Fragment key={index}>
              <div className="grid grid-cols-2 mt-5 gap-3 relative">
                <div className="col-span-2">
                  <label className="text-sm">
                    University Name<span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="universityName"
                    required
                    defaultValue={item.universityName}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
                <div>
                  <label className="text-sm">
                    Degree<span className="text-red-500">*</span>
                  </label>
                  <Popover
                    open={open[index]}
                    onOpenChange={(isOpen) => {
                      const newOpen = [...open];
                      newOpen[index] = isOpen;
                      setOpen(newOpen);
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open[index]}
                        className="w-full justify-between"
                      >
                        {item.degree || "Select Degree..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 max-h-60 overflow-y-auto">
                      <ul>
                        {degreeTypes.map((degree) => (
                          <li
                            key={degree}
                            className="p-2 cursor-pointer hover:bg-gray-200"
                            onClick={() => handleDegreeSelect(index, degree)}
                          >
                            <Check
                              className={`mr-2 h-4 w-5 ${
                                item.degree === degree
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                            {degree}
                          </li>
                        ))}
                      </ul>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-sm">Major</label>
                  <Input
                    name="major"
                    defaultValue={item.major}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
                <div>
                  <label className="text-sm">
                    Start Date<span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="startDate1"
                    type="date"
                    required
                    defaultValue={item.startDate1}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
                <div>
                  <label className="text-sm">
                    End Date<span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="endDate1"
                    type="date"
                    required
                    defaultValue={item.endDate1}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm">
                    Description<span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="description"
                    required
                    defaultValue={item.description}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
                {educationList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="mt-2 mr-2 p-2 text-red-500"
                    aria-label="Remove Education"
                  >
                    <Trash2 />
                  </button>
                )}
              </div>
              {index < educationList.length - 1 && (
                <hr className="my-6 border-t-2 border-gray-300" />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-3 flex justify-between">
          <Button
            variant="outline"
            className="text-primary"
            onClick={addNewEducation}
          >
            + Add More Education
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <LoaderCircle className="animate-spin"></LoaderCircle>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EducationForm;

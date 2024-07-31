import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronsUpDown,
  Check,
  Trash2,
  Brain,
  Loader,
  LoaderCircle,
} from "lucide-react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { toast } from "@/components/ui/use-toast";
import { AIChatSession } from "../../../../../../service/AImodel";
import GlobalApi from "../../../../../../service/GlobalApi";
import { useParams } from "react-router-dom";

const formField = {
  title1: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  workSummary: "",
};

const states = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

function AutoResizeTextarea({ value, ...props }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Reset the height to auto to shrink the textarea if needed
      textareaRef.current.style.height = "auto";
      // Set the height to match the scrollHeight to fit the content
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]); // Run this effect when the value changes

  return (
    <textarea
      ref={textareaRef}
      value={value}
      style={{
        width: "100%",
        minHeight: "100px", // Set initial height
        resize: "none", // Prevent manual resizing by the user
        overflow: "hidden", // Hide scrollbar
      }}
      {...props}
    />
  );
}

function ExperienceForm({ enableNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [experienceList, setExperienceList] = useState([formField]);
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Function to format text with bullet points
  const formatTextWithBulletPoints = (text) => {
    // Split text into sentences based on periods followed by a space
    const sentences = text
      .split(/(?<=\.)\s+/)
      .filter((sentence) => sentence.trim());

    // Join sentences with bullet points
    return sentences
      .map((sentence, index) =>
        index === 0 ? sentence.trim() : `• ${sentence.trim()}`
      )
      .join("\n"); // Use new line for each sentence
  };

  const PROMPT =
    "Based on the job description for a [JOB TITLE] role at [COMPANY], write 3 bullet points for my work experience that include metrics and the most important 10 keywords from the job description. Write as many sentences as bullet points and do not include and headings like 'experience:' or 'keywords:', just plain text";

  const generateSummaryFromAI = async (index) => {
    setLoading(true);
    if (!experienceList[index].title1 || !experienceList[index].companyName) {
      toast({
        title: "Missing Fields",
        description:
          "An error occurred while processing your details. Please fill out missing fields",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const prompt = PROMPT.replace(
      "[JOB TITLE]",
      experienceList[index].title1
    ).replace("[COMPANY]", experienceList[index].companyName);

    try {
      const result = await AIChatSession.sendMessage(prompt);
      const responseText = await result.response.text();
      const cleanText = responseText
        .replace("[", "")
        .replace("]", "")
        .replace(/\"/g, "")
        .replace(/\,/g, "")
        .replace(/\*\*/g, "");

      const newEntries = [...experienceList];
      newEntries[index] = {
        ...newEntries[index],
        workSummary: formatTextWithBulletPoints(cleanText),
      };
      setExperienceList(newEntries);
      setFormData({
        ...formData,
        ["workSummary"]: formatTextWithBulletPoints(cleanText),
      });
      setResumeInfo({
        ...resumeInfo,
        ["Experience"]: newEntries,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while generating the summary.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, e) => {
    enableNext(false);
    const newEntries = experienceList.slice();
    const { name, value } = e.target;
    newEntries[index][name] = value;
    setExperienceList(newEntries);
    setResumeInfo((prev) => ({
      ...prev,
      Experience: newEntries,
    }));
  };

  const [x, setX] = useState(1);
  const addNewExperience = () => {
    setExperienceList([...experienceList, { ...formField }]);
    setX(x + 1);
  };

  const [openIndex, setOpenIndex] = useState(null);

  const handleStateSelect = (index, state) => {
    const newExperienceList = [...experienceList];
    newExperienceList[index].state = state.value;
    setExperienceList(newExperienceList);
    setResumeInfo({
      ...resumeInfo,
      ["state"]: state.value,
    });
    setOpenIndex(null);
  };

  const removeExperience = (index) => {
    const newExperienceList = experienceList.filter((_, i) => i !== index);
    setExperienceList(newExperienceList);
    setX(x - 1);
    setResumeInfo((prev) => ({
      ...prev,
      Experience: newExperienceList,
    }));
  };

  useEffect(() => {
    resumeInfo && setExperienceList(resumeInfo?.Experience || [formField]);
  }, [resumeInfo]);

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
        Experience: experienceList.map(({ id, ...rest }) => rest),
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
      <h2 className="font-bold text-lg">Professional Experience</h2>
      <p>Fill out your Professional Work Experiences</p>
      <form onSubmit={onSave}>
        <div>
          {experienceList.map((item, index) => (
            <React.Fragment key={index}>
              <div className="grid grid-cols-2 mt-5 gap-3 relative">
                <div>
                  <label className="text-sm">
                    Company Name<span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="companyName"
                    required
                    defaultValue={item.companyName}
                    onChange={(e) => handleInputChange(index, e)}
                  ></Input>
                </div>
                <div>
                  <label className="text-sm">
                    Position Title<span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="title1"
                    required
                    defaultValue={item.title1}
                    onChange={(e) => handleInputChange(index, e)}
                  ></Input>
                </div>
                <div>
                  <label className="text-sm">
                    City<span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="city"
                    required
                    defaultValue={item.city}
                    onChange={(e) => handleInputChange(index, e)}
                  ></Input>
                </div>
                <div>
                  <label className="text-sm">
                    State<span className="text-red-500">*</span>
                  </label>
                  <div>
                    <Popover
                      open={openIndex === index}
                      onOpenChange={() =>
                        setOpenIndex(openIndex === index ? null : index)
                      }
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openIndex === index}
                          className="w-[250px] justify-between"
                          name="state"
                        >
                          {item.state
                            ? states.find((state) => state.value === item.state)
                                ?.label
                            : "Select state..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0 max-h-60 overflow-y-auto">
                        <ul>
                          {states.map((state) => (
                            <li
                              key={state.value}
                              className="p-2 cursor-pointer hover:bg-gray-200"
                              onClick={() => handleStateSelect(index, state)}
                            >
                              <Check
                                className={`mr-2 h-4 w-5 ${
                                  item.state === state.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              />
                              {state.label}
                            </li>
                          ))}
                        </ul>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div>
                  <label className="text-sm">
                    Start Date<span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="startDate"
                    type="date"
                    required
                    defaultValue={item.startDate}
                    onChange={(e) => handleInputChange(index, e)}
                  ></Input>
                </div>
                <div>
                  <label className="text-sm">
                    End Date<span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="endDate"
                    type="date"
                    required
                    value={item.endDate}
                    onChange={(e) => handleInputChange(index, e)}
                  ></Input>
                </div>
                <div className="col-span-2">
                  <div className="flex justify-between col-span-2">
                    <label className="text-sm pt-7">
                      Work Summary<span className="text-red-500">*</span>
                    </label>
                    <Button
                      onClick={() => generateSummaryFromAI(index)}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex gap-2 border-primary text-primary my-2"
                    >
                      {loading ? (
                        <LoaderCircle className="animate-spin"></LoaderCircle>
                      ) : (
                        <Brain className="h-4 w-4"></Brain>
                      )}
                      Generate from AI
                    </Button>
                  </div>

                  <AutoResizeTextarea
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    rows={4} // Set initial number of rows
                    style={{
                      width: "100%", // Make it span the width of its container
                      minHeight: "100px", // Adjust as needed
                      resize: "vertical", // Allow vertical resizing
                      overflow: "auto", // Ensure scrollbar appears if necessary
                    }}
                    name="workSummary"
                    required
                    value={item.workSummary}
                    index={index}
                    onChange={(e) => handleInputChange(index, e)}
                  ></AutoResizeTextarea>
                </div>
                {x > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="mt-2 mr-2 p-2 text-red-500"
                    aria-label="Remove Experience"
                  >
                    <Trash2 />
                  </button>
                )}
              </div>
              {/* Add horizontal line if it's not the last item */}
              {index < experienceList.length - 1 && (
                <hr className="my-6 border-t-2 border-gray-300" />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-3 flex justify-between">
          <Button
            variant="outline"
            className="text-primary"
            onClick={addNewExperience}
          >
            + Add More Experience
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

export default ExperienceForm;

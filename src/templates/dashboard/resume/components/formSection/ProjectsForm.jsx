import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Brain, LoaderCircle } from "lucide-react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { toast } from "@/components/ui/use-toast";
import { AIChatSession } from "../../../../../../service/AImodel";
import GlobalApi from "../../../../../../service/GlobalApi";
import { useParams } from "react-router-dom";

const formField = {
  projectName: "",
  technologies: "",
  description: "",
};

function AutoResizeTextarea({ value, ...props }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      style={{
        width: "100%",
        minHeight: "100px",
        resize: "none",
        overflow: "hidden",
      }}
      {...props}
    />
  );
}

function ProjectsForm({ enableNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [projectList, setProjectList] = useState([formField]);
  const params = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    resumeInfo && setProjectList(resumeInfo?.Projects || [formField]);
  }, [resumeInfo]);

  const handleInputChange = (index, e) => {
    enableNext(false);
    const { name, value } = e.target;
    const newEntries = [...projectList];
    newEntries[index][name] = value;
    setProjectList(newEntries);
    setResumeInfo((prev) => ({
      ...prev,
      Projects: newEntries,
    }));
  };

  const addNewProject = () => {
    setProjectList([...projectList, { ...formField }]);
  }; 

  const removeProject = (index) => {
    const newProjectList = projectList.filter((_, i) => i !== index);
    setProjectList(newProjectList);
    setResumeInfo((prev) => ({
      ...prev,
      Projects: newProjectList,
    }));
  };

  const formatTextWithBulletPoints = (text) => {
    const sentences = text
      .split(/(?<=\.)\s+/)
      .filter((sentence) => sentence.trim());
    return sentences
      .map((sentence, index) =>
        index === 0 ? sentence.trim() : `• ${sentence.trim()}`
      )
      .join("\n");
  };

  const PROMPT =
    "Based on the [DESCRIPTION] for a [PROJECT NAME] using [TECHNOLOGIES], write only 2 bullet points for my project experience. Write as many sentences as bullet points and do not include any headings like 'project_title:' or 'keywords:', just plain text. Do not make it in first person perpective, second person or third person; always start each sentence with a unique verb";

  const generateSummaryFromAI = async (index) => {
    setLoading(true);
    const { projectName, technologies, description } = projectList[index];

    if (!projectName || !technologies || !description) {
      toast({
        title: "Missing Fields",
        description:
          "An error occurred while processing your details. Please fill out missing fields",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const prompt = PROMPT.replace("[PROJECT NAME]", projectName)
      .replace("[TECHNOLOGIES]", technologies)
      .replace("[DESCRIPTION]", description);

    try {
      const result = await AIChatSession.sendMessage(prompt);
      const responseText = await result.response.text();
      const cleanText = responseText
        .replace("[", "")
        .replace("]", "")
        .replace(/\"/g, "")
        .replace(/\,/g, "")
        .replace(/\*\*/g, "");

      const newEntries = projectList.slice();
      newEntries[index] = {
        ...newEntries[index],
        description: formatTextWithBulletPoints(cleanText),
      };
      setProjectList(newEntries);
      setResumeInfo((prev) => ({
        ...prev,
        Projects: newEntries,
      }));
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
        Projects: projectList.map(({ id, ...rest }) => rest),
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
      <h2 className="font-bold text-lg">Projects</h2>
      <p>Enter projects that you have worked on</p>
      <form onSubmit={onSave}>
        <div>
          {projectList.map((item, index) => (
            <React.Fragment key={index}>
              <div className="grid grid-cols-2 mt-5 gap-3 relative">
                <div className="col-span-2">
                  <label className="text-sm">
                    Project Name<span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="projectName"
                    required
                    value={item.projectName}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm">
                    Technologies <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="technologies"
                    required
                    value={item.technologies}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
                <div className="col-span-2">
                  <div className="flex justify-between col-span-2">
                    <label className="text-sm pt-7">
                      Project Description<span className="text-red-500">*</span>
                    </label>
                    <Button
                      onClick={() => generateSummaryFromAI(index)}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex gap-2 border-primary text-primary my-2"
                    >
                      {loading ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        <Brain className="h-4 w-4" />
                      )}
                      Generate from AI
                    </Button>
                  </div>
                  <AutoResizeTextarea
                    placeholder="Briefly write what your project does"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    rows={4}
                    name="description"
                    required
                    value={item.description}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
                {projectList.length > 1 && (
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
              {index < projectList.length - 1 && (
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
            + Add More Project
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

export default ProjectsForm;

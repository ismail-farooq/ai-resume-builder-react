import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../../../service/GlobalApi";
import { LoaderCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

function PersonalDetailsForm({ enableNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    enableNext(false);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setResumeInfo({
      ...resumeInfo,
      [name]: value,
    });
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
    const data = { data: formData };
    console.log(data);
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
          description: "An error occurred while updating your details." + error,
          variant: "destructive",
        });
      }
    );
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Personal Details</h2>
      <p>Fill out your Personal Details</p>

      <form onSubmit={onSave}>
        <div className="grid grid-cols-2 mt-5 gap-3">
          <div>
            <label className="text-sm">
              First Name
              <span className="text-red-500">*</span>
            </label>
            <Input
              name="firstName"
              required
              onChange={handleInputChange}
              defaultValue={resumeInfo?.firstName}
            />
          </div>
          <div>
            <label className="text-sm">
              Last Name<span className="text-red-500">*</span>
            </label>
            <Input
              name="lastName"
              required
              onChange={handleInputChange}
              defaultValue={resumeInfo?.lastName}
            />
          </div>
          <div>
            <label className="text-sm">
              Email<span className="text-red-500">*</span>
            </label>
            <Input
              name="email"
              type="email"
              required
              onChange={handleInputChange}
              defaultValue={resumeInfo?.email}
            />
          </div>
          <div>
            <label className="text-sm">
              Phone<span className="text-red-500">*</span>
            </label>
            <Input
              name="phone"
              required
              onChange={handleInputChange}
              defaultValue={resumeInfo?.phone}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm">
              Address<span className="text-red-500">*</span>
            </label>
            <Input
              name="address"
              required
              onChange={handleInputChange}
              defaultValue={resumeInfo?.address}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm">Portfolio Website</label>
            <Input
              name="portfolio"
              onChange={handleInputChange}
              defaultValue={resumeInfo?.portfolio}
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
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

export default PersonalDetailsForm;

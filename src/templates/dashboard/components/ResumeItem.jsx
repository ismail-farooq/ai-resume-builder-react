import { LoaderIcon, MoreVertical } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import GlobalApi from "../../../../service/GlobalApi";
import { toast } from "@/components/ui/use-toast";

function ResumeItem({ resume, refreshData }) {
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

  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const onDelete = () => {
    setLoading(true);

    GlobalApi.deleteResume(resume.documentId).then((resp) => {
      setOpenAlert(false);
      const now = new Date();
      const formattedDateTime = formatDateTime(now);
      toast({
        title: "Resume Deleted",
        description: formattedDateTime,
        variant: "destructive",
      });
      refreshData();
      setLoading(false);
    });
  };

  return (
    <div>
      <Link to={"/dashboard/resume/" + resume.documentId + "/edit"}>
        <div className="shadow-lg border-t-primary border-t-4 bg-gradient-to-b from-pink-100 via-purple-200 to-blue-200 flex items-center justify-center h-[280px] border-orange-600 rounded-lg hover:scale-105 transition-all hover:shadow-md shadow-primary ">
          <img src="/resume.png" width={80} height={80}></img>
        </div>
      </Link>
      <div className="flex justify-between p-3 text-primary">
        <h2 className="text-center my-1">{resume.title}</h2>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="h-5 w-5 cursor-pointer pt-1"></MoreVertical>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setOpenAlert(true)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={openAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                resume and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenAlert(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>
                {" "}
                {loading ? (
                  <LoaderIcon className="animate-spin"></LoaderIcon>
                ) : (
                  'Delete'
                )}{" "}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default ResumeItem;

import React, { useState, useEffect, useRef } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { UilEye, UilShare, UilTrashAlt } from "@iconscout/react-unicons";
import { useToast } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import {
  httpGetWithToken,
  httpPostWithToken,
} from "../../../../utils/http_utils";

interface Company {
  id: number;
  name: string;
  avatar: string;
  company_name: string;
  
}

interface Job {
  id: string;
  title: string;
  company: Company;
  location: string;
  appliedDate: string;
  salary: string;
  slug: string;
    date_applied: string;
  job_type: {
    title: string;
  };
  work_type: {
    title: string;
  };
  status: string;
}

const AppliedJobsPage: React.FC = () => {
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [action, setAction] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [shareEmail, setShareEmail] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const navigate = useNavigate();
  const itemsPerPage = 5;
  const totalPages = Math.ceil(appliedJobs.length / itemsPerPage);

  // Fetch applied jobs
  const getAppliedJobs = async () => {
    try {
      const res = await httpGetWithToken("jobs/applied");
      if (res.status === "success") {
        const mappedJobs = res.data.map((job: any) => ({
          id: job.id,
          title: job.title,
          company: {
            id: job.company.id,
            name: job.company.name,
            avatar: job.company.avatar,
            company_name: job.company.company_name,
          },
          location: job.location,
          date_applied: job.date_applied,
          salary: job.salary_narration || "N/A",
          job_type: job.job_type,
          work_type: job.work_type,
          status: job.status || "Pending", // Map status field
        }));
        setAppliedJobs(mappedJobs);
      } else {
        toast({
          title: "Failed to fetch jobs.",
          description: res.error,
          status: "error",
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: "Unable to fetch jobs. Please try again later.",
        status: "error",
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    getAppliedJobs();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleActionClick = (job: Job, actionType: string) => {
    setSelectedJob(job);
    setAction(actionType);
    setShowDropdown(null);
  };

  const handleDelete = async () => {
    if (selectedJob) {
      try {
        await httpPostWithToken(`job/delete/${selectedJob.id}`);
        setAppliedJobs(appliedJobs.filter((job) => job.id !== selectedJob.id));
        setSelectedJob(null);
        setAction(null);
        toast({
          title: "Job deleted successfully.",
          status: "success",
          isClosable: true,
        });
      } catch {
        toast({
          title: "Failed to delete job.",
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  const shareJob = async () => {
    if (!/\S+@\S+\.\S+/.test(shareEmail)) {
      toast({
        title: "Invalid email address.",
        status: "error",
        isClosable: true,
      });
      return;
    }

    try {
      const res = await httpPostWithToken(`job/share/${selectedJob?.id}`, {
        to: shareEmail,
      });
      if (res.status === "success") {
        toast({
          title: res.message,
          status: "success",
          isClosable: true,
        });
      } else {
        toast({
          title: "Failed to share job.",
          description: res.error,
          status: "error",
          isClosable: true,
        });
      }
      setSelectedJob(null);
      setAction(null);
    } catch {
      toast({
        title: "An error occurred.",
        description: "Unable to share job. Please try again later.",
        status: "error",
        isClosable: true,
      });
    }
  };

  const displayJobs = appliedJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="mt-[8rem] px-[2.5rem]">
      <h2 className="text-green-700 text-2xl font-semibold mb-6">
        Applied Jobs
      </h2>
      <div className="bg-white shadow-md rounded-xl p-4">
        <table className="min-w-full bg-white rounded-xl">
          <thead className="bg-pink-100">
            <tr className="text-[14px] font-sans text-[#2aa100] font-semibold">
              <th className="py-2 px-4 text-left">Job Title</th>
              <th className="py-2 px-4 text-left">Company Name</th>
              <th className="py-2 px-4 text-left">Location</th>
              <th className="py-2 px-4 text-left">Applied Date</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayJobs.map((job, index) => (
              <tr
                key={job.id}
                className="border-b text-[14px] font-sans font-medium"
              >
                <td className="py-4 px-4 flex items-center gap-4">
                  <img
                    src={job.company.avatar}
                    alt="Company Logo"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <Link to={"/job-details/" + job.slug}>
                    <p className="font-semibold hover:text-[#2aa100]">{job.title}</p>
                    </Link>
                    <p className="text-gray-600">{job.salary}</p>
                  </div>
                </td>
                <td className="py-4 px-4">{job.company.company_name}</td>
                <td className="py-4 px-4">{job.location}</td>
                <td className="py-4 px-4">
  {job.date_applied
    ? new Date(job.date_applied.replace(" ", "T")).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A"}
</td>
                <td className="py-4 px-4 text-[#000]">{job.status}</td>
                <td className="py-4 px-4 relative">
                  <button onClick={() => setShowDropdown(index)}>
                    <BiDotsVerticalRounded size={20} />
                  </button>
                  {showDropdown === index && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-lg z-10"
                    >
                      <button
                        onClick={() => handleActionClick(job, "View")}
                        className="w-full px-4 flex items-center gap-2 py-2 text-left hover:bg-gray-200"
                      >
                        <UilEye size={18} /> View
                      </button>
                      <button
                        onClick={() => handleActionClick(job, "Share")}
                        className="w-full px-4 py-2 flex items-center gap-2 text-left hover:bg-gray-200"
                      >
                        <UilShare size={18} /> Share
                      </button>
                      <button
                        onClick={() => handleActionClick(job, "Delete")}
                        className="w-full px-4 py-2 flex items-center gap-2 text-left hover:bg-gray-200"
                      >
                        <UilTrashAlt size={18} /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <ul className="flex list-none">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page} className="mx-1">
                <button
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-full ${
                    currentPage === page
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {selectedJob && action && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            {action === "View" && (
              <>
                <h3 className="text-xl font-semibold mb-4">
                  View Job: {selectedJob.title}
                </h3>
                <p>
                  <strong>Company:</strong> {selectedJob.company.company_name}
                </p>
                <p>
                  <strong>Location:</strong> {selectedJob.location}
                </p>
                <p>
                  <strong>Salary:</strong> {selectedJob.salary}
                </p>
              </>
            )}
            {action === "Share" && (
              <>
                <h3 className="text-xl font-semibold mb-4">
                  Share Job: {selectedJob.title}
                </h3>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  className="border w-full p-2 rounded"
                />
                <button
                  onClick={shareJob}
                  className="w-full bg-green-500 text-white p-2 rounded mt-4"
                >
                  Share
                </button>
              </>
            )}
            {action === "Delete" && (
              <>
                <h3 className="text-xl font-semibold mb-4">
                  Delete Job: {selectedJob.title}
                </h3>
                <p>Are you sure you want to delete this job?</p>
                <button
                  onClick={handleDelete}
                  className="w-full bg-red-500 text-white p-2 rounded mt-4"
                >
                  Delete
                </button>
              </>
            )}
            <button
              onClick={() => {
                setSelectedJob(null);
                setAction(null);
              }}
              className="w-full bg-gray-300 text-black p-2 rounded mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AppliedJobsPage;

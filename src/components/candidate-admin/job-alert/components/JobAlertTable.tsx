import React, { useState, useEffect, useRef } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { UilAngleDown, UilAngleUp, UilEye, UilShare, UilTrashAlt } from "@iconscout/react-unicons";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { httpGetWithToken, httpPostWithToken } from "../../../../utils/http_utils";
import { useNavigate } from "react-router-dom";
import { Button, Toast, useToast } from "@chakra-ui/react";

interface JobAlert {
  title: string;
  alert: string;
  salary: string;
  location: string;
  categories: string;
  jobsFound: string;
  frequency: string;
  departments: string;
}

const categories = [
  { value: "design", label: "Design", color: "#FF6347" },
  { value: "product", label: "Product", color: "#4682B4" },
  { value: "account", label: "Account", color: "#32CD32" },
  { value: "marketing", label: "Marketing", color: "#FFD700" },
];

const JobAlertTable: React.FC = () => {
  const [jobAlerts, setJobAlerts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const [action, setAction] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [shareEmail, setShareEmail] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const toast = useToast();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const navigate = useNavigate()
  const itemsPerPage = 5;
  const totalPages = Math.ceil(jobAlerts.length / itemsPerPage);
  const getJobAlert = async () => {
    const res = await httpGetWithToken("jobs-alert");
    if(res.status === "success") {
      setJobAlerts(res.data)
    }
    console.log(res)
  }
  
  useEffect(() => {
    getJobAlert()
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

  const handleActionClick = (alert: any, actionType: string) => {
    setSelectedAlert(alert);
    setAction(actionType);
    setShowDropdown(null);
  };

  const handleDelete = () => {
    if (selectedAlert) {
      setJobAlerts(jobAlerts.filter((jobAlert) => jobAlert !== selectedAlert));
      setSelectedAlert(null);
      setAction(null);
    }
  };

  
  const shareJob = async () => {
      const resp = await httpPostWithToken("job/share/"+selectedAlert.id, {
        to : shareEmail
      });
      if(resp.status == "success") {
        toast({
          status : "success",
          title : resp.message,
          isClosable : true,
        })
      }else{
        toast({
          status : "error",
          title : resp.error,
          isClosable : true,
        })
      }
      setSelectedAlert(null);
      setAction(null);
  };

  const displayAlerts = jobAlerts
    .filter((alert) => {
      if (filterType === "New") {
        return alert.location === "New";
      } else if (filterType === "Category") {
        return alert.categories === filterValue;
      } else if (filterType === "Job Type") {
        return alert.alert === filterValue;
      }
      return true;
    })
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFilterType = event.target.value;
    setFilterType(selectedFilterType);
    setFilterValue("");
  };

  const handleFilterValueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFilterValue = event.target.value;
    setFilterValue(selectedFilterValue);
  };

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    setDropdownOpen(false);
  };

  return (
    <section className="mt-[8rem] px-[2.5rem]">
      <section className="flex flex-col md:flex-row gap-4 md:gap-12 justify-between items-center">
        <h2 className="text-green-700 text-2xl sm:text-3xl md:text-4xl font-poppins font-semibold">
          Job Alerts
        </h2>
        {/* md:w-auto flex flex-col md:flex-row items-center gap-2 mb-4 */}
        <div className="w-full hidden">
          <label className="block font-medium text-green-600 text-md mb-2 md:mb-0">
            Sort by:
          </label>
          <div className="w-full md:w-40 relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full px-4 py-1 rounded-full focus:outline-none bg-white shadow-md text-gray-600 text-md flex justify-between items-center"
            >
              <span style={{ color: categories.find(cat => cat.value === selectedOption)?.color }}>
                {selectedOption || "New"}
              </span>
              {dropdownOpen ? <UilAngleUp/> : <UilAngleDown />}
            </button>
            {dropdownOpen && (
              <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
                {categories.map((category) => (
                  <li
                    key={category.value}
                    onClick={() => handleOptionChange(category.value)}
                    className="px-4 py-2 cursor-pointer text-gray-600 hover:bg-gray-100"
                    style={{ color: category.color }}
                  >
                    {category.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
      <div className="max-w-full mx-auto p-4 mt-4 bg-white shadow-md rounded-xl">
        <div className="overflow-x-auto p-4">
          <table className="min-w-full bg-white rounded-[20px]">
            <thead className="bg-pink-100 rounded-xl mt-2">
              <tr className="text-green-700 font-poppins font-medium">
                <th className="py-2 px-4 text-left">Title</th>
                <th className="py-2 px-4 text-left">Alert</th>
                <th className="py-2 px-4 text-left">Empl. Type</th>
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayAlerts.map((alert, index) => (
                <tr key={index} className="text-left border-b">
                  <td className="py-4 px-4 text-green-900 font-sans font-semibold">
                    {alert.title}
                  </td>
                  <td className="py-8 px-4 text-green-700">
                    {/* {alert.title ? alert.title : alert.job_role} */}
                    {alert.work_type.title}
                    <p className="text-gray-800 lg:w-[300px]">{alert?.salary_narration || 'N/A'}, {alert.location}</p>
                    <p className="text-gray-800">{alert?.departments.title || "no deparment"}</p>
                    {/* <p className="text-gray-800">{alert.salary}</p>
                    <p className="text-gray-800">{alert.departments[0].title}</p> */}
                  </td>
                  <td className="py-8 px-4 text-gray-800">{alert?.work_type.title}</td>
                  <td className="py-8 px-4 text-gray-800">{alert.job_type.title}</td>
                  <td className="py-8 px-4 text-gray-800 relative">
                    <button onClick={() => setShowDropdown(index)}>
                      <BiDotsVerticalRounded size={25} color="#ABB2B9" />
                    </button>
                    {showDropdown === index && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 mt-2 w-36 z-20 bg-white border rounded shadow-lg"
                      >
                        <button
                          onClick={() => handleActionClick(alert, "View")}
                          className="w-full flex items-center gap-2 text-left text-gray-600 font-poppins px-4 py-2 hover:bg-gray-200"
                        >
                          <UilEye size="18" /> View
                        </button>
                        <button
                          onClick={() => handleActionClick(alert, "Share")}
                          className="w-full flex items-center gap-2 text-left text-gray-600 font-poppins px-4 py-2 hover:bg-gray-200"
                        >
                          <UilShare size="18" /> Share
                        </button>
                       
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedAlert && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-30">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
              {action === "View" && (
                <>
                  <h3 className="text-xl font-semibold mb-4 text-green-600">
                    {selectedAlert.title}
                  </h3>
                  <p className="text-gray-700">
                    <strong>Alert:</strong> {selectedAlert.job_role}
                  </p>
                  <p className="text-gray-700">
                    <strong>Salary:</strong> {selectedAlert.salary}
                  </p>
                  <p className="text-gray-700">
                    <strong>Location:</strong> {selectedAlert.location}
                  </p>
                  <p className="text-gray-700">
                    <strong>Categories:</strong> {selectedAlert.departments[0].title}
                  </p>
                  <p className="text-gray-700">
                    <strong>Jobs Type:</strong> {selectedAlert.job_type.title}
                  </p>
                  <p className="text-gray-700">
                    <strong>Employment type:</strong> {selectedAlert.work_type.title}
                  </p>
                </>
              )}
              {action === "Share" && (
                <div className="flex items-center gap-4">
                  <input
                  value={shareEmail}
                  onChange={(e)=>setShareEmail(shareEmail)}
                    type="text"
                    className="border p-2 rounded-md flex-grow"
                    placeholder="Enter email address"
                  />
                </div>
              )}
              {action === "Delete" && (
                <div className="text-center">
                  <p className="text-gray-800 text-lg mb-4">
                    Are you sure you want to delete this job alert?
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={handleDelete}
                      className="bg-red-600 text-white px-4 py-2 rounded-md"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedAlert(null)}
                      className="bg-gray-400 text-white px-4 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {
                action == "View"
                &&
              <button
                onClick={() => navigate("/job-details/"+selectedAlert.slug)}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Job Details
              </button>
              }
              {
                action == "Share"

                &&
                <Button onClick={shareJob} isLoading={shareLoading} bg={"green"} color={"white"} px={4} py={2} rounded={2}>
                Send
              </Button>
              }

              <span className="mx-3"></span>
              <button
                onClick={() => setSelectedAlert(null)}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        )}
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
    </section>
  );
};

export default JobAlertTable;

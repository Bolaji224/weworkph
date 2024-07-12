import React, { useState, useRef, useEffect } from "react";
import { UilAngleDown, UilAngleUp } from "@iconscout/react-unicons";
import SavedJobsCard from "./SavedJobsCard";
import Images from "../../constant/Images";

const SavedJobs: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOption, setSelectedOption] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [action, setAction] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState([
    {
      companyLogo: Images.UberImage,
      jobTitle: "Chief Human Resource Officer",
      jobType: "Part-Time",
      salary: 3500,
      paymentTime: "Monthly. Fresher",
      location: "USA, Palo Alto",
      category: "Management, Product",
    },
    {
      companyLogo: Images.NetflixImage,
      jobTitle: "Software Engineer",
      jobType: "Freelance",
      salary: 50,
      paymentTime: "Hourly. intermediate",
      location: "Canada, Toronto",
      category: "IT, Software",
    },
    {
      companyLogo: Images.FirstBankImage,
      jobTitle: "Marketing Specialist",
      jobType: "Full-Time",
      salary: 4500,
      paymentTime: "Monthly. Senior level",
      location: "USA, New York",
      category: "Marketing, Sales",
    },
    {
      companyLogo: Images.AccessbankImage,
      jobTitle: "Data Analyst",
      jobType: "Contract",
      salary: 3000,
      paymentTime: "Monthly. Entry Level",
      location: "UK, London",
      category: "Data, Analytics",
    },
    {
      companyLogo: Images.FacebookImage,
      jobTitle: "UX/UI Designer",
      jobType: "Fixed-Price",
      salary: 4000,
      paymentTime: "Monthly. Intermediate",
      location: "Australia, Sydney",
      category: "Design, Creative",
    },
    {
      companyLogo: Images.AppleImage,
      jobTitle: "Project Manager",
      jobType: "Fixed-Price",
      salary: 5000,
      paymentTime: "Monthly. Senior level",
      location: "Germany, Berlin",
      category: "Management, Product",
    },
    {
      companyLogo: Images.SamsungImage,
      jobTitle: "Content Writer",
      jobType: "Hourly",
      salary: 30,
      paymentTime: "Hourly",
      location: "India, Bangalore",
      category: "Content, Writing",
    },
    {
      companyLogo: Images.OracleImage,
      jobTitle: "Customer Support Specialist",
      jobType: "Fixed-Price",
      salary: 2500,
      paymentTime: "Monthly",
      location: "USA, Austin",
      category: "Customer Support",
    },
    {
      companyLogo: Images.MoniepointImage,
      jobTitle: "Product Manager",
      jobType: "Fixed-Price",
      salary: 6000,
      paymentTime: "Monthly",
      location: "France, Paris",
      category: "Management, Product",
    },
    {
      companyLogo: Images.AmazonImage,
      jobTitle: "Financial Analyst",
      jobType: "Contract",
      salary: 5500,
      paymentTime: "Monthly",
      location: "Japan, Tokyo",
      category: "Finance, Accounting",
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const jobsPerPage = 5;

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = savedJobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  const handleActionClick = (job: any, action: string) => {
    setSelectedAlert(job);
    setAction(action);
    setShowDropdown(null);
  };

  const handleDelete = () => {
    setSavedJobs(savedJobs.filter((job) => job !== selectedAlert));
    setSelectedAlert(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const categories = [
    { value: "New", label: "New", color: "#2aa100" },
    { value: "Category", label: "Category", color: "#ff9900" },
    { value: "Job-Type", label: "Job Type", color: "#40E0D0" },
  ];

  return (
    <div className="container mx-auto mt-[8rem] px-4 md:px-4 lg:px-8">
      <section className="flex flex-col md:flex-row items-center justify-between md:space-x-4">
        <h2 className="text-[#2aa100] text-[24px] sm:text-[38px] font-poppins font-semibold mb-4 md:mb-0">Saved Jobs</h2>
        <div className="w-full md:w-1/3 lg:w-1/6 relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full py-1 px-4 rounded-[20px] focus:outline-none bg-[#fff] shadow-md text-[#646A73] text-[16px] flex justify-between items-center"
          >
            <span style={{ color: categories.find(cat => cat.value === selectedOption)?.color }}>
              {selectedOption || "New"}
            </span>
            {dropdownOpen ? <UilAngleUp /> : <UilAngleDown />}
          </button>
          {dropdownOpen && (
            <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
              {categories.map((category) => (
                <li
                  key={category.value}
                  onClick={() => handleOptionChange(category.value)}
                  className="px-4 py-2 cursor-pointer text-[#646A73] hover:bg-gray-100"
                  style={{ color: category.color }}
                >
                  {category.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <div className="py-8">
        <div className="flex justify-center">
          <div className="flex flex-col flex-1 space-y-4">
            {currentJobs.map((job, index) => (
              <SavedJobsCard
                key={index}
                companyLogo={job.companyLogo}
                jobTitle={job.jobTitle}
                jobType={job.jobType}
                salary={job.salary}
                paymentTime={job.paymentTime}
                location={job.location}
                category={job.category}
                onClickDots={() => setShowDropdown(index)}
                showDropdown={showDropdown === index}
                dropdownRef={dropdownRef}
                handleActionClick={handleActionClick}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-center space-x-1">
        {Array.from(Array(Math.ceil(savedJobs.length / jobsPerPage)).keys()).map((number) => (
          <button
            key={number + 1}
            onClick={() => paginate(number + 1)}
            className={`mx-1 px-3 py-1 rounded-full border ${currentPage === number + 1 ? "bg-[#EE009D] text-white" : "border-gray-300"}`}
          >
            {number + 1}
          </button>
        ))}
      </div>
      {selectedAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-30">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            {action === "View" && (
              <>
                <h3 className="text-xl font-semibold mb-4 text-green-600">
                  {selectedAlert.jobTitle}
                </h3>
                <p className="text-gray-700">
                  <strong>Salary:</strong> {selectedAlert.salary}
                </p>
                <p className="text-gray-700">
                  <strong>Location:</strong> {selectedAlert.location}
                </p>
                <p className="text-gray-700">
                  <strong>Category:</strong> {selectedAlert.category}
                </p>
              </>
            )}
            {action === "Share" && (
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  className="border p-2 rounded-md flex-grow"
                  placeholder="Enter email address"
                />
                <button className="bg-[#EE009D] text-white px-4 py-2 rounded-md">Send</button>
              </div>
            )}
            {action === "Delete" && (
              <>
                <p className="text-gray-700 mb-4">Are you sure you want to delete this job?</p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="bg-gray-200 px-4 py-2 rounded-md"
                  >
                    No
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Yes
                  </button>
                </div>
              </>
            )}
            <button
              onClick={() => setSelectedAlert(null)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedJobs;

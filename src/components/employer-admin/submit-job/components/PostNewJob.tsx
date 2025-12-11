import axios from "axios";
import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import ls  from 'localstorage-slim';

// Inline SVG icons as components
const AngleDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const AngleUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

// Mock data for demonstration
const mockDepartments = [
  { id: 1, title: "Design" },
  { id: 2, title: "IT & Development" },
  { id: 3, title: "Digital Marketing" },
  { id: 4, title: "Graphics" },
  { id: 5, title: "Product Management" },
  { id: 6, title: "Business" },
  { id: 7, title: "Engineering" },
];

const mockJobTypes = [
  { id: 1, title: "Full-Time" },
  { id: 2, title: "Part-Time" },
  { id: 3, title: "Freelance" },
  { id: 4, title: "Hourly-Contract" },
  { id: 5, title: "Fixed-Price" },
];

const mockWorkTypes = [
  { id: 1, title: "Remote" },
  { id: 2, title: "On-site" },
  { id: 3, title: "Hybrid" },
];

const mockCountries = [
  { code: "US", name: "United States", states: ["California", "Texas", "New York", "Florida", "Illinois"] },
  { code: "GB", name: "United Kingdom", states: ["England", "Scotland", "Wales", "Northern Ireland"] },
  { code: "CA", name: "Canada", states: ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba"] },
  { code: "NG", name: "Nigeria", states: ["Lagos", "Abuja", "Kano", "Rivers", "Oyo"] },
  { code: "DE", name: "Germany", states: ["Bavaria", "Berlin", "Hamburg", "Hesse", "Saxony"] },
  { code: "FR", name: "France", states: ["Île-de-France", "Provence-Alpes-Côte d'Azur", "Auvergne-Rhône-Alpes", "Nouvelle-Aquitaine"] },
  { code: "IN", name: "India", states: ["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Gujarat"] },
  { code: "AU", name: "Australia", states: ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia"] },
];

// Mock functions for demonstration 
const httpGetWithoutToken = async (url: string) => {
  // Mock implementation
  if (url === "countries") {
    return { data: mockCountries };
  }
  if (url.startsWith("countries/")) {
    const code = url.split("/")[1];
    const country = mockCountries.find(c => c.code === code);
    return { data: country?.states.map(s => ({ name: s })) || [] };
  }
  return { data: [] };
};

const httpGetWithToken = async (url: string) => {
  // Mock implementation
  return { 
    status: "success", 
    data: { 
      work_types: mockWorkTypes, 
      job_type: mockJobTypes, 
      departments: mockDepartments 
    } 
  };
};

const API_BASE_URL = "http://127.0.0.1:8000/api/v1/";

const httpPostWithToken = async (url: string, data: any) => {
  try {
    const token = ls.get("wwph_token", { decrypt: true });
    if (!token) {
      console.error("No token found in localstorage-slim");
      return { status: "error", message: "Authentication required" };
    }

    const res = await axios.post(`${API_BASE_URL}${url}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    return res.data;
  } catch (err: any) {
    console.error("Error posting data:", err.response?.data || err.message);
    return { status: "error", message: "Failed to connect to backend" };
  }
};


const jobSalary = ["Monthly", "Weekly", "Hourly"];

const PostNewJob: React.FC = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [job_types, setJobTypes] = useState<any[]>([]);
  const [work_types, setWorktypes] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [typeOpen, setTypeOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [workType, setWorkType] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [experience, setExperience] = useState("");

  const [selectedWorkType, setSelectedWorkType] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<any>(null);
  const [selectedSalary, setSelectedSalary] = useState("");
  const [salaryOpen, setSalaryOpen] = useState(false);
  const [budget, setBudget] = useState("");
  const [cvFiles, setCvFiles] = useState<File[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [country, setCountry] = useState<any>("");
  const [user_state, setUserState] = useState<any>("");
  const [city, setCity] = useState<any>("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Refs for click outside detection
  const categoryRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const workTypeRef = useRef<HTMLDivElement>(null);
  const salaryRef = useRef<HTMLDivElement>(null);

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setCategoryOpen(false);
    setTypeOpen(false);
    setWorkType(false);
    setSalaryOpen(false);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setCategoryOpen(false);
      }
      if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setTypeOpen(false);
      }
      if (
        workTypeRef.current &&
        !workTypeRef.current.contains(event.target as Node)
      ) {
        setWorkType(false);
      }
      if (
        salaryRef.current &&
        !salaryRef.current.contains(event.target as Node)
      ) {
        setSalaryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const toggleCategory = () => {
    closeAllDropdowns();
    setCategoryOpen((prev) => !prev);
  };

  const toggleType = () => {
    closeAllDropdowns();
    setTypeOpen((prev) => !prev);
  };

  const toggleWorkType = () => {
    closeAllDropdowns();
    setWorkType((prev) => !prev);
  };

  const toggleSalary = () => {
    closeAllDropdowns();
    setSalaryOpen((prev) => !prev);
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setCategoryOpen(false);
  };

  const handleSelectType = (type: string) => {
    setSelectedType(type);
    setTypeOpen(false);
  };

  const handleSelectWorktype = (type: string) => {
    setSelectedWorkType(type);
    setWorkType(false);
  };

  const handleSelectSalary = (salary: string) => {
    setSelectedSalary(salary);
    setSalaryOpen(false);
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFileState: React.Dispatch<React.SetStateAction<File[]>>
  ) => {
    const files = e.target.files;
    if (files) {
      setFileState(Array.from(files));
    }
  };

  const removeFile = (
    index: number,
    setFileState: React.Dispatch<React.SetStateAction<File[]>>
  ) => {
    setFileState((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const getResoures = async () => {
    setLoading(true);
    let resp = await httpGetWithToken("resources");
    if (resp.status == "success") {
      setWorktypes(resp.data.work_types);
      setJobTypes(resp.data.job_type);
      setDepartments(resp.data.departments);
      setLoading(false);
    }
  };

  const showToastMessage = (message: string, type: "success" | "error") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const throwError = (message: string) => {
    showToastMessage(message, "error");
  };

  const submit = async () => {
    if (loading) return;
    if (title === "") return throwError("Job title cannot be empty");
    if (description === "") return throwError("Job description cannot be empty");
    if (selectedWorkType === null) return throwError("Please select Work type");
    if (selectedType === null) return throwError("Please select Job type");
    if (selectedCategory == null) return throwError("Please select Job Category");
    if (selectedSalary === "") return throwError("Please select salary type");
    if (budget === "") return throwError("Enter salary budget");
    if (city === "") return throwError("City cannot be empty");
    if (user_state === "") return throwError("State cannot be empty");
    if (country === "") return throwError("Country cannot be empty");
    if (skills.length === 0) return throwError("Enter at least one skill");
    if (requirements === "") return throwError("Job requirement is required");

    const fd = {
      title,
  description,
  requirements,
  work_type: selectedWorkType?.id || 1,
  job_type: selectedType?.id || 1,
  category: selectedCategory?.id || 1,
  salary: selectedSalary || "Monthly",
  budget: budget || "0",
  experience: experience || "",
  job_cover: "default_cover.jpg",
  skills: skills.length > 0 ? skills.join(",") : "",
  city,
  state: user_state,
  country,
  naration: "",
  status: "active",
    };

    try {
      setLoading(true);
      const res = await httpPostWithToken("employer/jobs", fd);
      if (res.status === "success") {
        showToastMessage(" Job created successfully!", "success");
        console.log("Navigate to /my-jobs");
        // Optionally reset the form
      } else {
        throwError("Something went wrong. Please try again.");
      }
    } catch (err) {
      throwError("Failed to submit job. Check your network.");
    } finally {
      setLoading(false);
    }
  };

  const getCountries = async () => {
    try {
      let resp = await httpGetWithoutToken("countries");
      setCountries(resp.data || []);
    } catch (err) {
      console.error("Failed to fetch countries:", err);
      setCountries([]);
    }
  };

  const getStates = async (code: string) => {
    let resp = await httpGetWithoutToken("countries/" + code);
    setStates(resp.data);
  };

  useEffect(() => {
    setLoading(false);
    getResoures();
    getCountries();
  }, []);

  return (
    <>
      <section className="p-8 mt-[4rem]">
        <h2 className="text-green-700 text-2xl sm:text-3xl md:text-4xl font-poppins font-semibold">
          Post a New Job
        </h2>

        <div className="bg-white p-[4rem] rounded-[20px] shadow-md mb-6 mt-[2rem]">
          <h3 className="text-[24px] font-semibold text-[#EE009D] mb-4">
            Job Details
          </h3>
          <div>
            <div className="mb-4">
              <label className="block text-[#000000] text-[16px] font-medium">
                Job Title*
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                placeholder="Ex: Product Designer"
                className="mt-1 w-full px-4 py-4 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium text-[16px] text-[#000000] text-lg mb-2">
                Job Description*
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Write about the job in details..."
                rows={7}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                autoComplete="off"
                className="w-full text-black border rounded-lg border-gray-300 bg-white p-4 shadow-sm focus:ring-0 focus:outline-none"
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block font-medium text-[16px] text-[#000000] text-lg mb-2">
                Job Requirement*
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Write about the job in details..."
                rows={7}
                value={requirements}
                onChange={(e) => {
                  setRequirements(e.target.value);
                }}
                autoComplete="off"
                className="w-full text-black border rounded-lg border-gray-300 bg-white p-4 shadow-sm focus:ring-0 focus:outline-none"
              ></textarea>
            </div>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full sm:w-1/2 px-2 mb-4">
                <label className="block text-[#000000] text-[16px] mb-2 font-medium">
                  Job Category*
                </label>
                <div className="relative" ref={categoryRef}>
                  <button
                    type="button"
                    className="w-full border rounded-lg border-gray-300 bg-white p-4 shadow-sm focus:ring-0 focus:outline-none flex justify-between items-center"
                    onClick={toggleCategory}
                  >
                    <span className="text-gray-500">
                      {selectedCategory
                        ? selectedCategory.title
                        : "Select Category"}
                    </span>
                    {categoryOpen ? <AngleUpIcon /> : <AngleDownIcon />}
                  </button>
                  {categoryOpen && (
                    <ul className="absolute z-10 w-full text-gray-500 bg-white border rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
                      {departments?.map((category: any) => (
                        <li
                          key={category.title}
                          className="px-4 py-2 hover:bg-gray-100 hover:text-[#2aa100] cursor-pointer"
                          onClick={() => handleSelectCategory(category)}
                        >
                          {category.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="w-full sm:w-1/2 px-2 mb-4">
                <label className="block text-[#000000] text-[16px] mb-2 font-medium">
                  Job Type*
                </label>
                <div className="relative" ref={typeRef}>
                  <button
                    type="button"
                    className="w-full border rounded-lg border-gray-300 bg-white p-4 shadow-sm focus:ring-0 focus:outline-none flex justify-between items-center"
                    onClick={toggleType}
                  >
                    <span className="text-gray-500">
                      {selectedType ? selectedType.title : "Select Job Type"}
                    </span>
                    {typeOpen ? <AngleUpIcon /> : <AngleDownIcon />}
                  </button>
                  {typeOpen && (
                    <ul className="absolute z-10 w-full bg-white text-gray-500 border rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
                      {job_types?.map((type: any) => (
                        <li
                          key={type.id}
                          className="px-4 py-2 hover:bg-gray-100 hover:text-[#2aa100] cursor-pointer"
                          onClick={() => handleSelectType(type)}
                        >
                          {type.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="w-full sm:w-1/2 px-2 mb-4">
                <label className="block text-[#000000] text-[16px] mb-2 font-medium">
                  Work Type*
                </label>
                <div className="relative" ref={workTypeRef}>
                  <button
                    type="button"
                    className="w-full border rounded-lg border-gray-300 bg-white p-4 shadow-sm focus:ring-0 focus:outline-none flex justify-between items-center"
                    onClick={toggleWorkType}
                  >
                    <span className="text-gray-500">
                      {selectedWorkType
                        ? selectedWorkType.title
                        : "Select Work Type"}
                    </span>
                    {workType ? <AngleUpIcon /> : <AngleDownIcon />}
                  </button>
                  {workType && (
                    <ul className="absolute z-10 w-full bg-white text-gray-500 border rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
                      {work_types?.map((type: any) => (
                        <li
                          key={type.id}
                          className="px-4 py-2 hover:bg-gray-100 hover:text-[#2aa100] cursor-pointer"
                          onClick={() => handleSelectWorktype(type)}
                        >
                          {type.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="w-full sm:w-1/2 px-2 mb-4">
                <label className="block text-[#000000] text-[16px] mb-2 font-medium">
                  Salary*
                </label>
                <div className="relative" ref={salaryRef}>
                  <button
                    type="button"
                    className="w-full border rounded-lg border-gray-300 bg-white p-4 shadow-sm focus:ring-0 focus:outline-none flex justify-between items-center"
                    onClick={toggleSalary}
                  >
                    <span className="text-gray-500">
                      {selectedSalary || "Monthly"}
                    </span>
                    {salaryOpen ? <AngleUpIcon /> : <AngleDownIcon />}
                  </button>
                  {salaryOpen && (
                    <ul className="absolute z-10 w-full bg-white text-gray-500 border rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
                      {jobSalary.map((salary) => (
                        <li
                          key={salary}
                          className="px-4 py-2 hover:bg-gray-100 hover:text-[#2aa100] cursor-pointer"
                          onClick={() => handleSelectSalary(salary)}
                        >
                          {salary}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="w-full sm:w-1/2 px-2 mb-4">
                <label className="block text-[#000000] text-[16px] mb-2 font-medium">
                  Budgeted Amount*
                </label>
                <input
                  type="text"
                  placeholder="Enter budgeted amount"
                  className="mt-1 w-full px-4 py-4 border rounded-md"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-[4rem] rounded-lg shadow-md mb-6">
          <h3 className="text-[24px] font-semibold text-[#EE009D] mb-4">
            Skills & Experience
          </h3>
          <div>
            <div className="mb-4">
              <label className="block text-gray-700">Skills*</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-gray-200 px-4 py-1 rounded-full text-gray-700 flex items-center"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 text-red-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add Skills and press enter to save skill "
                className="mt-2 w-full px-4 py-4 border rounded-md"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    handleAddSkill(e.currentTarget.value.trim());
                    e.currentTarget.value = "";
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Experience*</label>
              <input
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                type="text"
                className="mt-1 w-full px-4 py-4 border rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-[4rem] mt-8">
          <label className="block font-semibold text-[#ee009d] text-xl tracking-wide mb-2">
            Location
          </label>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full px-2 mb-4">
              <label className="block font-semibold text-green-600 text-lg mb-2">
                Country*
              </label>
              <select
                value={country}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setStates([]);
                    setCountry("");
                    setUserState("");
                  } else {
                    getStates(e.target.value);
                    setCountry(e.target.value);
                    setUserState("");
                  }
                }}
                className="w-full border rounded-lg border-gray-300 bg-white p-2 shadow-sm focus:ring-0 focus:outline-none"
              >
                <option value="">Select Country</option>
                {countries.map((c: any) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-1/2 px-2 mb-4">
              <label className="block font-semibold text-green-600 text-lg mb-2">
                City*
              </label>
              <input
                id="city"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                }}
                type="text"
                placeholder=""
                className="w-full border rounded-lg border-gray-300 bg-white p-2 shadow-sm focus:ring-0 focus:outline-none"
              />
            </div>
            <div className="w-full sm:w-1/2 px-2 mb-4">
              <label className="block font-semibold text-green-600 text-lg mb-2">
                State*
              </label>
              {states.length > 0 ? (
                <select
                  value={user_state}
                  onChange={(e) => {
                    setUserState(e.target.value);
                  }}
                  className="w-full border rounded-lg border-gray-300 bg-white p-2 shadow-sm focus:ring-0 focus:outline-none"
                >
                  <option value="">Select State</option>
                  {states.map((state: any) => (
                    <option key={state.name} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={user_state}
                  onChange={(e) => {
                    setUserState(e.target.value);
                  }}
                  placeholder="Enter state"
                  className="w-full border rounded-lg border-gray-300 bg-white p-2 shadow-sm focus:ring-0 focus:outline-none"
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
            Cancel
          </button>
          <button
  onClick={() => {
    console.log("Next button clicked ");
    submit();
  }}
  disabled={loading}
  className={`px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition ${
    loading ? "opacity-50 cursor-not-allowed" : ""
  }`}
>
  {loading ? "Submitting..." : "Next"}
</button>
        </div>
      </section>

      {/* ✅ Toast Notification */}
      {showToast && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg text-white shadow-lg transition-all duration-300 ${
            toastType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toastMessage}
        </div>
      )}
    </>
  );
};

export default PostNewJob;
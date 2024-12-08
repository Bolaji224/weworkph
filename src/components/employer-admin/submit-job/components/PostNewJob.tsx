import { UilAngleDown, UilAngleUp, UilTimes } from "@iconscout/react-unicons";
import React, { ChangeEvent, useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  httpGetWithoutToken,
  httpGetWithToken,
  httpPostWithToken,
} from "../../../../utils/http_utils";
import { Button, Toast, useToast } from "@chakra-ui/react";
import { profile } from "console";
import { useNavigate } from "react-router-dom";

const jobCategories = [
  "Design",
  "IT & Development",
  "Digital",
  "Graphics",
  "Developer",
  "Product",
  "Microsoft",
  "Brand",
  "Photoshop",
  "Business",
  "IT & Technology",
  "Marketing",
  "Article",
  "Engineer",
  "HTML5",
  "Figma",
  "Automobile",
  "Account",
];

const jobTypes = [
  "Full-Time",
  "Part-Time",
  "Freelance",
  "Hourly-Contract",
  "Fixed-Price",
];

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

  const [resources, setResources] = useState<any>({
    work_types: [],
    job_type: [],
    departments: "",
  });

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
  const navigate = useNavigate();
  const handleAddSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const toggleCategory = () => {
    setCategoryOpen(!categoryOpen);
  };

  const toggleType = () => {
    setTypeOpen(!typeOpen);
  };
  const toggleWorkType = () => {
    setWorkType(!workType);
  };

  const toggleSalary = () => {
    setSalaryOpen(!salaryOpen);
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

  const handleSingleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFileState: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0] || null;
    setFileState(file);
  };

  // const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0] || null;
  //   if (file) {
  //     setLogoFile(file);
  //   }
  // };

  const removeFile = (
    index: number,
    setFileState: React.Dispatch<React.SetStateAction<File[]>>
  ) => {
    setFileState((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const getResoures = async () => {
    let resp = await httpGetWithToken("resources");
    if (resp.status == "success") {
      setWorktypes(resp.data.work_types);
      setJobTypes(resp.data.job_type);
      setDepartments(resp.data.departments);
      setLoading(false);
    }
  };
  const toast = useToast();
  const throwError = (message: string) => {
    toast({
      title: "Oops.. We hit a snag",
      description: message,
      isClosable: true,
      status: "error",
    });
  };

  const submit = async () => {
    if (title === "") return throwError("Job title cannot be empty");
    if (description === "") return throwError("Job description cannot be empty");
    if (selectedWorkType === null) return throwError("Please select Work type");
    if (selectedType === null) return throwError("Please select Job type");
    if (selectedCategory == null)
      return throwError("Please select Job Category");
    if (selectedSalary === "") return throwError("Please selecte salary type");
    if (budget === "") return throwError("Enter salary budget");
    if (city === "") return throwError("City cannot be empty");
    if (user_state === "") return throwError("State cannot be empty");
    if (country === "") return throwError("Country cannot be empty");
    if (skills.length === 0) return throwError("Enter at least one skill");
    if (requirements === "") return throwError("Job requirement is required");
    // if (logoFile == null) return throwError ("company logo is require")

    let fd = {
      title: title,
      description: description,
      work_type: selectedWorkType.id,
      job_type: selectedType.id,
      category: selectedCategory.id,
      salary: selectedSalary,
      budget: budget,
      experience: experience,
      requirements: requirements,
      job_cover: "required",
      skills: skills.join(","),
      city: city,
      state: user_state,
      country: country,
    };

    const res = await httpPostWithToken("employer/jobs", fd);
    // console.log(res)
    if (res.status === "success") {
      toast({
        title: "Job created successful1",
        isClosable: true,
        status: "success",
      });
      return navigate("/my-jobs");
    } else {
      return throwError(res.message || res.error);
    }
  };
  const getCountries = async () => {
    let resp = await httpGetWithoutToken("countries");
    setCountries(resp.data);
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
                <div className="relative">
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
                    {categoryOpen ? <UilAngleUp /> : <UilAngleDown />}
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
                <div className="relative">
                  <button
                    type="button"
                    className="w-full border rounded-lg border-gray-300 bg-white p-4 shadow-sm focus:ring-0 focus:outline-none flex justify-between items-center"
                    onClick={toggleType}
                  >
                    <span className="text-gray-500">
                      {selectedType ? selectedType.title : "Select Job Type"}
                    </span>
                    {typeOpen ? <UilAngleUp /> : <UilAngleDown />}
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
                <div className="relative">
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
                    {workType ? <UilAngleUp /> : <UilAngleDown />}
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
                <div className="relative">
                  <button
                    type="button"
                    className="w-full border rounded-lg border-gray-300 bg-white p-4 shadow-sm focus:ring-0 focus:outline-none flex justify-between items-center"
                    onClick={toggleSalary}
                  >
                    <span className="text-gray-500">
                      {selectedSalary || "Monthly"}
                    </span>
                    {salaryOpen ? <UilAngleUp /> : <UilAngleDown />}
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
                placeholder="Add Skills"
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
            Address & Location
          </label>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full px-2 mb-4">
              <label className="block font-semibold text-green-600 text-lg mb-2">
                Country*
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value == "") {
                    setStates([]);
                  } else {
                    getStates(e.target.value);
                    setCountry(e.target.value);
                  }
                }}
                className="w-full border rounded-lg border-gray-300 bg-white p-2 shadow-sm focus:ring-0 focus:outline-none"
                defaultValue=""
              >
                <option value="" disabled>
                  Country
                </option>
                {countries.map((c: any) => (
                  <>
                    {country === c.code ? (
                      <option selected value={c.code}>
                        {c.name}
                      </option>
                    ) : (
                      <option value={c.code}>{c.name}</option>
                    )}
                  </>
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
              <select
                onChange={(e) => {
                  setUserState(e.target.value);
                }}
                className="w-full border rounded-lg border-gray-300 bg-white p-2 shadow-sm focus:ring-0 focus:outline-none"
                defaultValue=""
              >
                <option value="" disabled>
                  State
                </option>
                {user_state !== "" && (
                  <option value={user_state}>{user_state}</option>
                )}
                {states.map((state) => (
                  <option key={state.name} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-2">{/* <MapComponent /> */}</div>
        </div>

        {/* <div className="mb-4">
          <label className="block text-[#000000] text-[16px] font-medium">
            Company Logo*
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleLogoChange(e)}
            className="mt-1 w-full px-4 py-4 border rounded-md"
          />
        </div> */}

        {/* <div className="bg-white p-[4rem] rounded-lg shadow-md mb-6">
        {/* <div className="py-[2rem]">
          <h2 className="text-xl font-semibold mb-4 text-[#EE009d] text-[16px] tracking-[0.3px] font-sans">File Attachment*</h2>
          <div className='flex items-center  gap-[1rem]'>
          <label className="cursor-pointer bg-green-100 text-green-600 font-medium py-2 px-4 rounded-[8px]">
              Upload File
              <input
                type="file"
                accept=".pdf, .doc, .docx"
                onChange={(e) => handleFileChange(e, setCvFiles)} 
                className="hidden"
              />
            </label>
            <p>Upload file .pdf, .doc, .docx</p>
          </div>
          {cvFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-green-100 p-4 mt-[2rem] rounded-[10px]">
              <span>{file.name}</span>
              <UilTimes onClick={() => removeFile(index, setCvFiles)} className="cursor-pointer text-red-500" />
            </div>
          ))}
        </div> 
          <h3 className="text-xl font-semibold mb-4 text-[#EE009d] text-[16px] tracking-[0.3px] font-sans">Address & Location</h3>
          <div>
            <div className="mb-4">
              <label className="block text-gray-700">Address*</label>
              <input
                type="text"
                placeholder="Cowrasta, Chandana, Gazipur Sadar"
                className="mt-1 w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Country*</label>
              <input
                type="text"
                className="mt-1 w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">City*</label>
              <input
                type="text"
                className="mt-1 w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">State*</label>
              <input
                type="text"
                className="mt-1 w-full px-4 py-2 border rounded-md"
              />
            </div>
          
          </div>
        </div> */}

        <div className="flex justify-end space-x-4">
          <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">
            Cancel
          </button>
          <Button
            bg={"green"}
            isLoading={loading}
            onClick={() => submit()}
            px={4}
            py={2}
            textColor={"white"}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
            rounded={"2"}
          >
            Next
          </Button>
        </div>
      </section>
    </>
  );
};

export default PostNewJob;

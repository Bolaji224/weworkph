import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import {
  UilPlay,
  UilPlusCircle,
  UilTimes,
  UilTimesCircle,
} from "@iconscout/react-unicons";
import Modal from "react-modal";
import { httpGetWithToken, httpPostWithToken } from "../../utils/http_utils";
import { Button, useToast } from "@chakra-ui/react";

const ProfileForm: React.FC = () => {
  const [cvFiles, setCvFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [overview, setOverview] = useState<string>("");
  const [intro, setIntro] = useState<string>("");
  const [cv, setCv] = useState<string>("");
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cvFile, setCvFile] = useState("");
  const [salary, setSalary] = useState<string>("");
  const [jobTitle, setJobTitle] = useState<string>("");
  const [experience, setExperience] = useState("");

  const [loading, setLoading] = useState(false);
  const [education, setEducation] = useState([
    {
      title: "",
      academy: "",
      year: "",
      description: "",
    },
  ]);
  const [skills, setSkills] = useState([
    "Figma",
    "HTML5",
    "Illustrator",
    "Adobe Photoshop",
  ]);

  const toast = useToast();
  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setVideoFile(null);
    setTimeout(() => {
      setVideoFile(file);
    }, 1000);
  };
  const [portfolioImages, setPortfolioImages] = useState<any[]>([]); // State for portfolio images

  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to handle file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files!.length > 0) {
      for (let index = 0; index < files!.length; index++) {
        const file = files![index];
        const fd = new FormData();
        fd.append("portfolio", file);
        await httpPostWithToken("resume/update", fd);
      }
      getResume();
    }
  };

  const saveSalaryAndJobTitle = async () => {
    if (loading) return;
  
    if (!salary || !jobTitle || !experience) {
      toast({
        status: "warning",
        title: "Salary, Job Title, and Experience are required.",
        isClosable: true,
        duration: 5000,
      });
      return;
    }
  
    setLoading(true);
    try {
      const fd = {
        salary,
        jobTitle,
        experience,
      };
  
      const res = await httpPostWithToken("resume/update", fd);
  
      if (res.status === "success") {
        getResume();
        toast({
          status: "success",
          title: "Salary, Job Title, and Experience updated successfully.",
          isClosable: true,
          duration: 5000,
        });
      } else {
        toast({
          status: "error",
          title: res.message || "Failed to update the information. Please try again.",
          isClosable: true,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error updating salary and job title:", error);
      toast({
        status: "error",
        title: "An error occurred while updating the information.",
        isClosable: true,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };
  

  // Function to remove a portfolio image
  const removePortfolioImage = async (index: number) => {
    await httpGetWithToken("resume/delete-portolio/" + index);
    getResume();
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setIsPlaying(false);
  };
  const removeVideoReal = async () => {
    const res = await httpPostWithToken("resume/update/intro");
    toast({
      status: "success",
      title: "Intro video removed",
      isClosable: true,
      duration: 5000,
    });
  };

  const openModal = () => {
    setModalIsOpen(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }, 100);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const saveOveriview = async () => {
    if (overview === "") return;
    if (loading) return;
    setLoading(true);
    const res = await httpPostWithToken("resume/update", {
      overview: overview,
    });
    if (res.status === "success") {
      setOverview(res.data.overview);
      toast({
        status: "success",
        title: "Resume updated",
        isClosable: true,
        duration: 5000,
      });
    }
    setLoading(false);
  };

  const saveEducation = async () => {
    if (loading) return;
    setLoading(true);
    const fd = {
      education: education,
    };

    const res = await httpPostWithToken("resume/update", fd);

    if (res.status === "success") {
      getResume();
      toast({
        status: "success",
        title: "Resume updated",
        isClosable: true,
        duration: 5000,
      });

      setVideoFile(null);
    }
    setLoading(false);
  };
  const saveSkills = async () => {
    if (loading) return;
    setLoading(true);
    const fd = {
      skills: skills.length > 0 ? skills.join(",") : "",
    };

    const res = await httpPostWithToken("resume/update", fd);

    if (res.status === "success") {
      getResume();
      toast({
        status: "success",
        title: "Resume updated",
        isClosable: true,
        duration: 5000,
      });

      setVideoFile(null);
    }
    setLoading(false);
  };

  const saveIntro = async () => {
    if (!videoFile) return;
    if (loading) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("intro", videoFile);

    const res = await httpPostWithToken("resume/update", fd);

    if (res.status === "success") {
      getResume();
      toast({
        status: "success",
        title: "Resume updated",
        isClosable: true,
        duration: 5000,
      });

      setVideoFile(null);
    }
    setLoading(false);
  };

  const removeFileReal = async () => {
    if (loading) return;
    setLoading(true);
    const res = await httpPostWithToken("resume/remove-resume");
    if (res.status === "success") {
      getResume();
      toast({
        status: "success",
        title: "Resume removed successfully",
        isClosable: true,
        duration: 5000,
      });

      setCvFile("");
      setCv("");
    }
    setLoading(false);
  };

  const saveResume = async () => {
    if (cvFiles!.length === 0) return;
    if (loading) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("cv", cvFiles[0]);

    const res = await httpPostWithToken("resume/update", fd);

    if (res.status === "success") {
      getResume();
      toast({
        status: "success",
        title: "Resume updated",
        isClosable: true,
        duration: 5000,
      });

      setCvFiles([]);
    }
    setLoading(false);
  };

  const getResume = async () => {
    const res = await httpGetWithToken("resume");
    if (res.status === "success") {
      setOverview(res.data.overview);
      setIntro(res.data.intro);
      if (res.data.educations) {
        setEducation(res.data.educations);
      }
      setPortfolioImages(res.data.portfolio);
      setSkills(res.data.skills.split(","));
      setSalary(res.data.salary);
      setJobTitle(res.data.job_title);
      setExperience(res.data.experiences);
      if (res.data.resume_title) {
        setCv(res.data.resume_title);
        setCvFile(res.data.resume);
      } else {
        setCv("");
        setCvFile("");
      }
    }
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

  const removeFile = (
    index: number,
    setFileState: React.Dispatch<React.SetStateAction<File[]>>
  ) => {
    setFileState((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const addEducation = () => {
    setEducation([
      ...education,
      { title: "", academy: "", year: "", description: "" },
    ]);
  };
  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    setSkills([...skills, ""]);
  };

  useEffect(() => {
    getResume();
  }, []);
  return (
    <section className="px-2 py-[8rem] max-w-[1100px] mx-auto">
      <h2 className=" text-[#2aa100] text-[38px] font-sans font-bold mb-8">
        My Resume
      </h2>

      {/* Profile upload section start here  */}

      <div className="bg-white rounded-2xl py-8 px-8">
        <h2 className="text-xl font-semibold mb-4 text-[#ee009d] text-[20px] tracking-[0.3px] font-sans">
          Resume Attachment
        </h2>
        <div className="py-[1rem]">
          <h2 className="text-xl font-semibold mb-4 text-[#2aa100] text-[16px] tracking-[0.3px] font-sans">
            CV Attachment*
          </h2>
          <div className="flex items-center  gap-[1rem]">
            <label className="cursor-pointer bg-green-100 text-green-600 font-medium py-2 px-4 rounded-[8px]">
              Upload CV
              <input
                type="file"
                accept=".pdf, .doc, .docx"
                onChange={(e) => handleFileChange(e, setCvFiles)}
                className="hidden "
              />
            </label>
            <p>Upload file .pdf, .doc, .docx</p>
          </div>

          {cvFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-green-100 p-4 mt-[2rem] rounded-[10px]"
            >
              <span>{file.name}</span>
              <UilTimes
                onClick={() => removeFile(index, setCvFiles)}
                className="cursor-pointer text-red-500"
              />
            </div>
          ))}

          {cvFiles.length > 0 && (
            <Button
              bg={"#ee009d"}
              mt={2}
              color={"white"}
              isLoading={loading}
              onClick={saveResume}
              py={2}
              px={8}
              fontSize={"large"}
              fontWeight={"600"}
              rounded={"lg"}
              className="bg-pink-600"
            >
              Save
            </Button>
          )}

          {cvFiles.length == 0 && (
            <>
              {cv !== "" && (
                <div className="flex items-center justify-between bg-green-100 p-4 mt-[2rem] rounded-[10px]">
                  <span>{cv}</span>
                  <UilTimes
                    onClick={() => removeFileReal()}
                    className="cursor-pointer text-red-500"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Salary and Job Title Section */}
      <div className="bg-white rounded-2xl py-8 px-8 mt-[2rem]">
        <h2 className="text-xl font-semibold text-[#ee009d]">
          Salary & Job Title
        </h2>
        <div className="mb-4">
          <label className="block text-green-600 font-semibold mb-2">
            Desired Salary*
          </label>
          <input
            type="text"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="Enter your desired salary"
            className="w-full border rounded-lg p-4 shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-green-600 font-semibold mb-2">
            Job Title*
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Enter your job title"
            className="w-full border rounded-lg p-4 shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-green-600 font-semibold mb-2">
            Years of Experience*
          </label>
          <input
            type="number"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Enter your years of experience"
            className="w-full border rounded-lg p-4 shadow-sm"
            min={0}
          />
        </div>
        <Button
          bg={"#ee009d"}
          color={"white"}
          isLoading={loading}
          onClick={saveSalaryAndJobTitle}
          py={2}
          px={8}
          fontSize={"large"}
          fontWeight={"600"}
          rounded={"lg"}
        >
          Save
        </Button>
      </div>

      {/* profile upload section ends here  */}

      {/* introduction video section start here  */}

      <section className="bg-white rounded-2xl p-8 mt-[2rem]">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-[20px] text-[#ee009d] tracking-[0.3px] font-sans">
            Intro & Overview
          </h2>
          <div className="mb-4">
            <label className="block font-semibold text-green-600 text-lg mb-2">
              Overview*
            </label>
            <textarea
              id="message"
              name="message"
              value={overview}
              onChange={(v) => setOverview(v.target.value)}
              placeholder="Write something interesting about you..."
              rows={10}
              autoComplete="off"
              className="w-full text-black mb-[2rem] border rounded-lg border-gray-300 bg-white p-4 shadow-sm focus:ring-0 focus:outline-none"
            ></textarea>
            <Button
              bg={"#ee009d"}
              color={"white"}
              isLoading={loading}
              onClick={saveOveriview}
              py={2}
              px={8}
              fontSize={"large"}
              fontWeight={"600"}
              rounded={"lg"}
              className="bg-pink-600"
            >
              Save
            </Button>
          </div>
        </div>
      </section>

      <div className="mt-[1rem]"></div>
      <section className="bg-white rounded-2xl p-8 mt-[2rem]">
        <h2 className="text-2xl font-semibold text-[20px] text-[#ee009d] tracking-[0.3px] font-sans">
          Intro video
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-8 p-4">
          <label className="relative text-center flex items-center justify-center p-[4rem] md:p-[8rem] w-full  md:w-[500px] h-[180px] md:h-[350px] rounded-[20px] cursor-pointer border-[1px] border-[#2aa100]">
            + Add Intro Video
            <input
              type="file"
              className="hidden"
              accept="video/*"
              onChange={handleVideoChange}
            />
          </label>
          {videoFile && (
            <div className="relative w-full md:w-[500px] h-[200px] md:h-[350px] flex flex-col items-start rounded-[20px] cursor-pointer">
              <div
                className="relative w-full h-full rounded-[20px] cursor-pointer"
                onClick={openModal}
              >
                <video
                  ref={videoRef}
                  className="w-full h-full rounded-[20px] object-cover"
                >
                  <source
                    src={URL.createObjectURL(videoFile)}
                    type={videoFile.type}
                  />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 flex items-center justify-center">
                  {!isPlaying && (
                    <UilPlay size="64" className="text-[#2aa100]" />
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <button onClick={removeVideo} className="text-[#ee009d]">
                  <UilTimes size="24" />
                </button>
              </div>
            </div>
          )}

          {!videoFile ? (
            <>
              {intro && (
                <div className="relative w-full md:w-[500px] h-[200px] md:h-[350px] flex flex-col items-start rounded-[20px] cursor-pointer">
                  <div className="relative w-full h-full rounded-[20px] cursor-pointer">
                    <video
                      controls
                      className="w-full h-full rounded-[20px] object-cover"
                    >
                      <source src={intro} />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={removeVideoReal}
                      className="text-[#ee009d]"
                    >
                      <UilTimes size="24" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
        {videoFile && (
          <div className="w-full text-right mt-2">
            <Button
              bg={"#ee009d"}
              color={"white"}
              isLoading={loading}
              onClick={saveIntro}
              py={2}
              px={8}
              fontSize={"large"}
              fontWeight={"600"}
              rounded={"lg"}
              className="bg-pink-600"
            >
              Save
            </Button>
          </div>
        )}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Video Modal"
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              height: "80%",
            },
          }}
        >
          <button onClick={closeModal} className="btn btn-secondary">
            Close
          </button>
          <div className="video-container" style={{ marginTop: "10px" }}>
            {videoFile && (
              <video
                ref={videoRef}
                controls
                style={{ width: "100%", height: "100%" }}
              >
                <source
                  src={URL.createObjectURL(videoFile)}
                  type={videoFile.type}
                />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </Modal>
      </section>

      {/* introduction video section ends here  */}

      {/* Eductional section start here */}

      <section className="bg-white rounded-2xl p-8 mt-[2rem]">
        <h2 className="text-2xl font-semibold text-[20px] text-[#ee009d] tracking-[0.3px] font-sans mb-4">
          Education
        </h2>
        {education.map((edu, index) => (
          <div key={index} className="mb-4">
            <label className="block font-semibold font-fairs text-[#2aa100] text-lg mb-2">
              Degree*
            </label>
            <input
              type="text"
              value={edu.title}
              onChange={(e) => {
                const newEducation = [...education];
                newEducation[index].title = e.target.value;
                setEducation(newEducation);
              }}
              placeholder="Product Designer (Google)"
              className="w-full border rounded-lg border-gray-300 bg-white p-2 shadow-sm focus:ring-0 focus:outline-none mb-2"
            />
            <label className="block font-semibold font-fairs text-[#2aa100] text-lg mb-2">
              School*
            </label>
            <input
              type="text"
              value={edu.academy}
              onChange={(e) => {
                const newEducation = [...education];
                newEducation[index].academy = e.target.value;
                setEducation(newEducation);
              }}
              placeholder="Google Arts College & University"
              className="w-full border rounded-lg border-gray-300 bg-white p-2 shadow-sm focus:ring-0 focus:outline-none mb-2"
            />
            <label className="block font-semibold font-fairs text-[#2aa100] text-lg mb-2">
              Graduation Year*
            </label>
            <input
              type="text"
              value={edu.year}
              onChange={(e) => {
                const newEducation = [...education];
                newEducation[index].year = e.target.value;
                setEducation(newEducation);
              }}
              placeholder="Year"
              className="w-full border rounded-lg border-gray-300 bg-white p-2 shadow-sm focus:ring-0 focus:outline-none mb-2"
            />
            <UilTimes
              onClick={() => removeEducation(index)}
              className="cursor-pointer text-red-500 mt-2"
            />
          </div>
        ))}

        <div className="w-full flex justify-between">
          <button className="text-pink-600 text-lg mb-4" onClick={addEducation}>
            Add more
          </button>
          <Button
            bg={"#ee009d"}
            color={"white"}
            isLoading={loading}
            onClick={saveEducation}
            py={2}
            px={8}
            fontSize={"large"}
            fontWeight={"600"}
            rounded={"lg"}
            className="bg-pink-600"
          >
            Save
          </Button>
        </div>
      </section>
      {/* Eductional section ends here  */}

      {/* Skill section start here  */}
      <section className="bg-white rounded-2xl p-8 mt-[2rem]">
        <h2 className="text-2xl font-semibold text-[20px] text-[#ee009d] tracking-[0.3px] font-sans mb-4">
          Skills & Experience
        </h2>
        <div className="mb-4">
          <label className="block font-semibold text-lg mb-2">Skills*</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 bg-[#f5f5f5] p-8 rounded-[10px]">
            {skills.map((skill, index) => (
              <div key={index} className="relative flex items-center">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => {
                    const newSkills = [...skills];
                    newSkills[index] = e.target.value;
                    setSkills(newSkills);
                  }}
                  placeholder="Skill"
                  className="w-full border-none rounded-[20px] text-[#2aa100] font-light font-merri text-[12px] bg-white p-2 shadow-sm focus:ring-0 focus:outline-none pr-10"
                />
                <button
                  className="absolute right-3 text-red-600"
                  onClick={() => {
                    const newSkills = skills.filter((_, i) => i !== index);
                    setSkills(newSkills);
                  }}
                >
                  <UilTimes size={20} color="#2aa100" />
                </button>
              </div>
            ))}
            <button className="text-pink-600  text-lg" onClick={addSkill}>
              <UilPlusCircle size={25} color="#2aa100" />
            </button>
          </div>
          <div className="w-full flex justify-between">
            <Button
              bg={"#ee009d"}
              color={"white"}
              isLoading={loading}
              onClick={saveSkills}
              py={2}
              px={8}
              fontSize={"large"}
              fontWeight={"600"}
              rounded={"lg"}
              className="bg-pink-600"
            >
              Save
            </Button>
          </div>
        </div>
      </section>
      {/* Skill section ends here  */}

      {/* Porfolio section start here  */}
      <section className="bg-white rounded-2xl p-8 mt-[2rem]">
        <h2 className="text-2xl font-semibold text-[20px] text-[#2aa100] tracking-[0.3px] font-sans mb-4">
          Portfolio
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {portfolioImages.map((img, index) => (
            <div key={img.id} className="relative">
              <div className="bg-gray-200 h-full rounded-[10px] flex items-center justify-center">
                <img
                  src={img.file_url}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full rounded-[10px] h-full object-cover"
                />
              </div>
              <button
                className="absolute top-2 right-2 text-red-600"
                onClick={() => removePortfolioImage(img.id)}
              >
                <UilTimesCircle size={35} color="#2aa100" />
              </button>
            </div>
          ))}
        </div>
        {/* Hidden file input for uploading images */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        {/* Button to trigger file input */}
        <button
          className="text-pink-600 text-lg mb-4"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Image
        </button>
      </section>
    </section>
  );
};

export default ProfileForm;

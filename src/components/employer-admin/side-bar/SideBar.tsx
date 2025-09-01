import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCircle, FaFileAlt } from "react-icons/fa";
import { UilCreateDashboard, UilSignout, UilWallet } from "@iconscout/react-unicons";
import { FaBarsStaggered, FaCertificate, FaRocket } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoBookmarkOutline, IoNotificationsOutline } from "react-icons/io5";
import Images from "../../constant/Images";
import ProgressBar from "../../reusable/ProgressBar";
import { AppContext } from "../../../global/state";
import { iProfileCompany } from "../../../models/profle";

interface iContext {
  user?: iProfileCompany;
}

const SideNav: React.FC = () => {
  const location = useLocation();
  const { user }: iContext = useContext(AppContext);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const targetProgress = 87;

  // Animate progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < targetProgress ? prev + 10 : prev));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const closeDropdown = () => setIsDropdownOpen(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      {/* Mobile menu toggle */}
      <div className="lg:hidden p-4 text-white absolute left-0 top-2 flex justify-between items-center w-full">
        <button onClick={toggleSidebar}>
          {isSidebarOpen ? (
            <span className="text-[#2aa100] text-2xl">✕</span>
          ) : (
            <FaBarsStaggered size={25} color="#2aa100" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`h-full w-64 bg-white flex flex-col fixed lg:static transition-transform transform 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 ml-2 z-50`}
      >
        {/* Close button inside sidebar (mobile only) */}
        <div className="flex justify-end p-4 lg:hidden">
          <button onClick={closeSidebar} className="text-[#2aa100] text-2xl">
            ✕
          </button>
        </div>

        {/* Profile section */}
        <div className="p-6 flex items-center flex-col">
          <Link to="/">
            <img src={Images.Logo} alt="logo" className="w-full max-w-[150px] mb-4" />
          </Link>
          <FaCircle className="relative w-[10px] h-[10px] top-6 left-6 text-[#40e6b9]" />
          <img
            className="sm:h-[50px] sm:w-[50px] w-[25px] h-[25px] rounded-full object-cover mb-4"
            src={user?.avatar || Images.ProfileImage}
            alt="Profile"
          />

          {/* Username + dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              className="flex items-center gap-1 text-md font-bold text-[#2AA100]"
              onClick={toggleDropdown}
            >
              {user?.name}
              <IoMdArrowDropdown size="20" color="#2AA100" />
            </button>

            {isDropdownOpen && (
              <div className="absolute bg-gray-700 text-white rounded shadow-md mt-2 w-48 z-10">
                <ul>
                  <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer">
                    <Link to="/employers-profile" onClick={closeDropdown}>
                      Profile
                    </Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer">
                    <Link to="/employers-account-settings" onClick={closeDropdown}>
                      Settings
                    </Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer">
                    <Link to="/employers-logout-account" onClick={closeDropdown}>
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex-1">
          <ul>
            <Link to="/employers-dashboard">
              <li
                className={`py-2 text-[16px] font-semibold flex items-center gap-[1rem] ${
                  isActive("/employers-dashboard")
                    ? "outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] mx-[1rem] text-[#2aa100]"
                    : "text-[#2AA100] hover:text-[#2aa100]"
                }`}
              >
                <UilCreateDashboard size={25} /> Dashboard
              </li>
            </Link>
            <Link to="/employers-messages">
              <li
                className={`py-2 mt-[1.5rem] flex items-center gap-[1rem] ${
                  isActive("/employers-messages")
                    ? "outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] text-[#2AA100]"
                    : "text-[#1E2A38] hover:text-[#2AA100]"
                }`}
              >
                <FaCertificate size={25} /> SkillStamp
              </li>
            </Link>
            <Link to="/employers-account-settings">
              <li
                className={`py-2 mt-[1.5rem] flex items-center gap-[1rem] ${
                  isActive("/employers-account-settings")
                    ? "outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] text-[#2AA100]"
                    : "text-[#1E2A38] hover:text-[#2AA100]"
                }`}
              >
                <FaRocket size={25} /> SmartStart
              </li>
            </Link>
            <Link to="/my-jobs">
              <li
                className={`py-2 mt-[1.5rem] flex items-center gap-[1rem] ${
                  isActive("/my-jobs")
                    ? "outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] text-[#2AA100]"
                    : "text-[#1E2A38] hover:text-[#2AA100]"
                }`}
              >
                <FaFileAlt size={25} /> My Jobs
              </li>
            </Link>
            <Link to="/submit-jobs">
              <li
                className={`py-2 mt-[1.5rem] flex items-center gap-[1rem] ${
                  isActive("/submit-jobs")
                    ? "outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] text-[#2AA100]"
                    : "text-[#1E2A38] hover:text-[#2AA100]"
                }`}
              >
                <IoNotificationsOutline size={25} /> Submit Job
              </li>
            </Link>
            <Link to="/saved-candidate">
              <li
                className={`py-2 mt-[1.5rem] flex items-center gap-[1rem] ${
                  isActive("/saved-candidate")
                    ? "outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] text-[#2AA100]"
                    : "text-[#1E2A38] hover:text-[#2AA100]"
                }`}
              >
                <IoBookmarkOutline size={25} /> Saved Candidate
              </li>
            </Link>
            <Link to="/employers-wallet-account">
              <li
                className={`py-2 mt-[1.5rem] flex items-center gap-[1rem] ${
                  isActive("/employers-wallet-account")
                    ? "outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] text-[#2AA100]"
                    : "text-[#1E2A38] hover:text-[#2AA100]"
                }`}
              >
                <UilWallet size={25} /> Wallet Account
              </li>
            </Link>
          </ul>

          {/* Progress bar */}
          <div className="px-[2rem] py-[2rem]">
            <p className="text-[#2aa100] py-[1rem] font-medium">87%</p>
            <ProgressBar progress={progress} />
            <p className="text-[12px] text-[#646A73]">Profile complete</p>

            <div className="mt-[4rem]">
              <Link to="/employers-logout-account">
                <button className="text-[#2aa100] text-[18px] flex items-center gap-2">
                  <UilSignout /> Logout
                </button>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default SideNav;

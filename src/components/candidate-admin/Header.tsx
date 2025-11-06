import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import {
  UilSearch,
  UilEnvelope,
  UilBriefcaseAlt,
} from "@iconscout/react-unicons";
import { AnimatePresence, motion } from "framer-motion";

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const MotionLink = motion(Link);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <header className="bg-[#FFF5F8] text-white px-6 py-4 flex justify-end items-center fixed top-0 left-0 w-full shadow-sm z-50 gap-4">
      {/* Right Section (Search + Icons + Button) */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <UilSearch className="absolute top-2 left-3 text-[#2AA100]" />
          <input
            type="text"
            placeholder="Search here..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 w-64 rounded-full bg-white text-[#646A73] placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2AA100] transition-all"
          />
        </div>

        {/* Message Icon */}
        <Link to="/messages" className="cursor-pointer">
          <UilEnvelope
            className="text-[#4ADE80] hover:text-[#2AA100] transition-colors"
            size={24}
          />
        </Link>

        {/* Notification Bell */}
        <div className="relative">
          <FaBell
            className="cursor-pointer text-[#4ADE80] hover:text-[#2AA100] transition-colors"
            size={20}
            onClick={toggleNotificationDropdown}
          />
          <AnimatePresence>
            {isNotificationOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-64 bg-white text-black rounded-lg shadow-lg z-10"
              >
                <div className="p-4 text-sm text-gray-700">
                  You have no new notifications.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Find Job Button */}
        <MotionLink
          to="/find-job"
          className="bg-[#ee009d] hover:bg-[#d1008a] text-white font-bold py-2 px-5 rounded-full flex items-center gap-2 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <UilBriefcaseAlt size={18} />
          Find Job
        </MotionLink>
      </div>
    </header>
  );
};

export default Header;

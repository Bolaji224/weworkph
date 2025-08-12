import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaPlus } from 'react-icons/fa';
import { UilSearch } from '@iconscout/react-unicons';
import { AnimatePresence, motion } from 'framer-motion';

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const MotionLink = motion(Link);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <header className="bg-[#FFF5F8] text-white px-[4rem] absolute py-4 flex sm:left-0 left-40 top-0 justify-between items-center lg:absolute w-full">
      {/* Search Input */}
      <div className="relative sm:block hidden md:left-[10rem] xl:left-[50rem] lg:left-[24rem]">
        <UilSearch className="absolute font-light cursor-pointer top-2 left-2 text-[#4ADE80]" />
        <input
          type="text"
          placeholder="Search here..."
          value={searchTerm}
          onChange={handleSearch}
          className="lg:px-[2.5rem] xl:px-[2.5rem] md:px-[2.5rem] py-[0.5rem] w-[300px] font-sans font-light pl-[2px] rounded-[50px] bg-[#FFFFFF] text-[#646A73] placeholder-gray-400"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <div className="relative">
          <FaBell
            className="cursor-pointer text-[#4ADE80]"
            size={20}
            onClick={toggleNotificationDropdown}
          />

          {/* AnimatePresence must always render; condition goes inside */}
          <AnimatePresence>
            {isNotificationOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-64 bg-white text-black rounded shadow-lg z-10"
              >
                <div className="p-4">You have no new notifications.</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Post Job Button */}
        <MotionLink
          to="/post-job"
          className="bg-[#ee009d] hover:bg-[#2AA100] text-white font-bold py-2 px-4 rounded-[50px] flex items-center gap-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaPlus />
          Post Job
        </MotionLink>
      </div>
    </header>
  );
};

export default Header;

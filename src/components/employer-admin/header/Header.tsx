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
    // Implement search functionality here
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <header className="bg-[#FFF5F8] text-white px-[4rem] fixed py-4 flex sm:left-0 left-40 top-0 justify-between items-center lg:absolute w-full">
      <div className="relative sm:block hidden md:left-[10rem] xl:left-[50rem] lg:left-[24rem]">
        <UilSearch className="absolute font-light cursor-pointer top-2 left-2 text-[#2AA100]" />
        <input
          type="text"
          placeholder="Search here..."
          value={searchTerm}
          onChange={handleSearch}
          className="lg:px-[2.5rem] xl:px-[2.5rem] md:px-[2.5rem] py-[0.5rem] w-[300px] font-sans font-light xl:px[8rem] lg:py-[0.5rem] pl-[2px] rounded-[50px] bg-[#FFFFFF] text-[#646A73] placeholder-gray-400"
        />
      </div>
      <div className="flex items-center gap-4">
      <div className="relative">
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
      </div>
    </header>
  );
};

export default Header;
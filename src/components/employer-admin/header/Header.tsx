import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { UilSearch, UilBriefcaseAlt } from '@iconscout/react-unicons';
import { AnimatePresence, motion } from 'framer-motion';
import { useNotifications } from '../NotificationContext';


const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const MotionLink = motion(Link);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <header className="bg-[#FFF5F8] text-white px-[4rem] fixed py-4 flex sm:left-0 left-40 top-0 justify-between items-center lg:absolute w-full z-50">
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

        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <div className="relative inline-block cursor-pointer" onClick={toggleNotificationDropdown}>
            <FaBell
              className="text-[#4ADE80] hover:text-[#2AA100] transition-colors"
              size={20}
            />
            {/* Unread badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-[3px] leading-none">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>

          <AnimatePresence>
            {isNotificationOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-3 w-80 bg-white text-black rounded-xl shadow-xl z-50 overflow-hidden border border-gray-100"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-[#2AA100] hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-sm">
                      <FaBell size={28} className="mx-auto mb-2 text-gray-200" />
                      No notifications yet
                    </div>
                  ) : (
                    notifications.slice(0, 20).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                          !n.read ? 'bg-green-50' : ''
                        }`}
                      >
                        {/* Avatar placeholder */}
                        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#4ADE80] flex items-center justify-center text-white font-bold text-sm uppercase">
                          {n.applicantName.charAt(0)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 leading-snug">
                            <span className="font-semibold">{n.applicantName}</span>
                            {' '}applied for{' '}
                            <span className="font-semibold text-[#2AA100]">{n.jobTitle}</span>
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{formatTime(n.timestamp)}</p>
                        </div>

                        {/* Unread dot */}
                        {!n.read && (
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#4ADE80] mt-1.5" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="border-t border-gray-100 px-4 py-2 text-center">
                    <Link
                      to="/all-applicant/:slug"
                      className="text-xs text-[#2AA100] hover:underline font-medium"
                      onClick={() => setIsNotificationOpen(false)}
                    >
                      View all applicants →
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Post Job Button */}
        <MotionLink
          to="/submit-jobs"
          className="bg-[#ee009d] hover:bg-[#2AA100] text-white font-bold py-2 px-4 rounded-[50px] flex items-center gap-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <UilBriefcaseAlt />
          Post Job
        </MotionLink>
      </div>
    </header>
  );
};

export default Header;
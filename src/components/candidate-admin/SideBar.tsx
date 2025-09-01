import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCircle, FaBars, FaFileAlt } from 'react-icons/fa';
import { UilCreateDashboard, UilSetting, UilSignout, UilTimes, UilTrash, UilWallet } from '@iconscout/react-unicons';
import Images from '../constant/Images';
import { FaBarsStaggered, FaCertificate, FaEnvelope, FaLightbulb, FaRegUser, FaRocket } from 'react-icons/fa6';
import { IoMdArrowDropdown } from 'react-icons/io';
import { IoBookmarkOutline, IoNotificationsOutline } from 'react-icons/io5';
import ProgressBar from '../reusable/ProgressBar';
import { AppContext } from '../../global/state';
import { iProfile } from '../../models/profle';
import { httpGetWithToken, httpPostWithToken } from '../../utils/http_utils';
import ls from "localstorage-slim";
import { useToast } from '@chakra-ui/react';
import SwitchAccountModal from './delete-account/switch_account';
import { Zap } from 'lucide-react';

interface iContext {
  user? : iProfile,
  updateUser ? : any
}

const SideNav: React.FC = () => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSkillStampDropdownOpen, setIsSkillStampDropdownOpen] = useState(false);
  const [isSmartStartDropdownOpen, setIsSmartStartDropdownOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const targetProgress = 87; // Set the target progress value here
  const { user, updateUser } : iContext = useContext(AppContext);
  const navigate = useNavigate();
  const toast = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress < targetProgress) {
          return prevProgress + 10;
        } else {
          clearInterval(interval);
          return prevProgress;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const isActive = (path: string) => location.pathname === path;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSkillStampDropdown = () => {
    setIsSkillStampDropdownOpen(!isSkillStampDropdownOpen);
  };

  const toggleSmartStartDropdown = () => {
    setIsSmartStartDropdownOpen(!isSmartStartDropdownOpen);
  };

  const handleDropdownItemClick = () => {
    setIsDropdownOpen(false);
  };

  const [isModalOpen, setModalOpen] = useState(false);
 
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const switchAccount = async (role : string) => {
    var resp = await httpPostWithToken("switch-account/"+role);
    if(resp.status == "success") {
      sessionStorage.setItem("wwph_usr", JSON.stringify(resp.data));
      ls.set("wwph_usr", resp.data, {encrypt : true});
      updateUser(resp.data)
      navigate("/employers-profile");
    }else {
      toast({
        status : "error",
        title : "Something went wrong!",
        description : "Unable to to switich account",
        isClosable : true,
        duration : 5000
      })
    }
  }

  return (
    <div>
       <SwitchAccountModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={()=> {
          switchAccount("candidate");
        }}
        role='Company'
      />
      <div className="lg:hidden p-4 text-white absolute left-0 top-2 flex justify-between items-center">
        <button onClick={toggleSidebar}>
          {isSidebarOpen ? <UilTimes color='#2aa100' className='text-[#2aa100]' size={24} /> : <FaBarsStaggered size={25} color='#2aa100' className='font-bold' />}
        </button>
      </div>
      <div className={`h-full w-64 bg-white z-100 text-white flex flex-col fixed lg:static transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 flex items-center flex-col" ref={dropdownRef}>
          <div onClick={toggleSidebar} className='lg:hidden block'>
            {isSidebarOpen ? <UilTimes size={35} color='#2aa100' className='absolute top-2 left-[12rem]' /> : <FaBars size={24} />}
          </div>
         <Link to="/">
         <img src={Images.Logo} alt="logo" className="w-full max-w-[150px] h-auto mb-4" />
         </Link>
          <FaCircle className="relative w-[10px] h-[10px] top-6 left-6 text-[#40e6b9]" size={20} />
          <img className="sm:h-[50px] sm:w-[50px] w-[25px] h-[25px] rounded-full object-cover mb-4" src={user?.avatar ? user.avatar : Images.ProfileImage} alt="Profile" />
          <div className='flex items-center gap-[0.3rem]'>
            <h1 className="text-md font-bold text-[#2AA100] cursor-pointer" onClick={toggleDropdown}>{user?.name}</h1>
            <button className="mt-2 text-gray-400 hover:text-white" onClick={toggleDropdown}>
              <IoMdArrowDropdown size="25" color='#EE009D' className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
          {isDropdownOpen && (
            <div className="absolute bg-gray-700 text-white rounded shadow-lg mt-[6rem] w-48 z-20 border border-gray-600">
              <ul>
                <Link to="/profile-list" onClick={handleDropdownItemClick}>
                <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer border-b border-gray-600 last:border-b-0">Profile</li>
                </Link>
               <Link to="/account-setting" onClick={handleDropdownItemClick}>
               <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer border-b border-gray-600 last:border-b-0">Settings</li>
               </Link>
               {/* <Link to="#?" onClick={()=> { handleOpenModal(); handleDropdownItemClick(); }}>
               <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer border-b border-gray-600 last:border-b-0">Switch to Employer</li>
               </Link> */}
              <Link to="/logout-account" onClick={handleDropdownItemClick}>
              <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer">Logout</li>
              </Link>
              </ul>
            </div>
          )}
        </div>
        <nav className="mt-4 flex-1">
          <ul>
            <Link to='/candidate-dashboard'>
              <li className={`py-2 hover:outline hover:outline-1 hover:outline-[#EE009D] hover:rounded-lg hover:px-[1rem] text-[16px] mx-[2rem] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/dashboard') ? 'outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] mx-[1rem] text-[#2aa100]' : 'text-[#2AA100] hover:text-[#2aa100]'}`}>
                <UilCreateDashboard size={25} color={isActive('/dashboard') ? '#EE009D' : '#EE009D'} /> Dashboard
              </li>
            </Link>
            
            {/* SkillStamp with dropdown */}
            <li className="relative">
              <div 
                className={`py-2 hover:text-[#2AA100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] cursor-pointer ${isActive('/employers-messages') ? 'outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] text-[#2AA100]' : 'text-[#1E2A38] hover:text-[#2AA100]'}`}
                onClick={toggleSkillStampDropdown}
              >
                <FaCertificate size={25} className='hover:text-[#EE009D]' /> 
                SkillStamp
                <IoMdArrowDropdown size="20" color='#EE009D' className={`ml-auto transition-transform ${isSkillStampDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              {isSkillStampDropdownOpen && (
                <div className="ml-[3rem] mt-2 bg-gray-50 rounded shadow-sm">
                  <ul>
                    <Link to="/courses">
                      <li className="px-4 py-2 text-[14px] text-[#1E2A38] hover:text-[#2AA100] hover:bg-gray-100 cursor-pointer">Courses</li>
                    </Link>
                    <Link to="/english-test">
                      <li className="px-4 py-2 text-[14px] text-[#1E2A38] hover:text-[#2AA100] hover:bg-gray-100 cursor-pointer">English Test</li>
                    </Link>
                  </ul>
                </div>
              )}
            </li>

            {/* SmartStart with dropdown */}
            <li className="relative">
              <div 
                className={`py-2 hover:text-[#2AA100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] cursor-pointer ${isActive('/employers-account-settings') ? 'outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] text-[#2AA100]' : 'text-[#1E2A38]'}`}
                onClick={toggleSmartStartDropdown}
              >
                <FaRocket size={25} className='hover:text-[#EE009D]' /> 
                SmartStart
                <IoMdArrowDropdown size="20" color='#EE009D' className={`ml-auto transition-transform ${isSmartStartDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              {isSmartStartDropdownOpen && (
                <div className="ml-[3rem] mt-2 bg-gray-50 rounded shadow-sm">
                  <ul>
                    <Link to="/smart-guide">
                      <li className="px-4 py-2 text-[14px] text-[#1E2A38] hover:text-[#2AA100] hover:bg-gray-100 cursor-pointer">SmartGuide</li>
                    </Link>
                    <Link to="/smarttv">
                      <li className="px-4 py-2 text-[14px] text-[#1E2A38] hover:text-[#2AA100] hover:bg-gray-100 cursor-pointer">SmartCV</li>
                    </Link>
                  </ul>
                </div>
              )}
            </li>

            <Link to='/resume-page'>
              <li className={`py-2 hover:text-[#2AA100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/resume-page') ? 'outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] text-[#2AA100]' : 'text-[#1E2A38] hover:text-[#2AA100]'}`}>
                <FaFileAlt size={25}  className='hover:text-[#EE009D]' /> Role Setup
              </li>
            </Link>
            <Link to='/applied-jobs'>
              <li className={`py-2 hover:text-[#2AA100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/applied-jobs') ? 'outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] text-[#2AA100]' : 'text-[#1E2A38] hover:text-[#2AA100]'}`}>
                <FaEnvelope size={25} /> Applied Jobs
              </li>
            </Link>
            <Link to='/job-alerts'>
              <li className={`py-2 hover:text-[#2AA100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/job-alerts') ? 'outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] text-[#2AA100]' : 'text-[#1E2A38] hover:text-[#2AA100]'}`}>
                <IoNotificationsOutline size={25} /> Job Alert
              </li>
            </Link>
            <Link to='/subscriptions'>
              <li className={`py-2 hover:text-[#2AA100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/subscriptions') ? 'outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] text-[#2AA100]' : 'text-[#1E2A38] hover:text-[#2AA100]'}`}>
                <IoBookmarkOutline size={25} /> Subscription 
              </li>
            </Link>
            <Link to='/candidate-wallet-account'>
              <li className={`py-2 hover:text-[#2AA100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/candidate-wallet-account') ? 'outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] text-[#2AA100]' : 'text-[#1E2A38] hover:text-[#2AA100]'}`}>
                <UilWallet size={25} /> Wallet
              </li>
            </Link>
            <Link to='/delete-account'>
              <li className={`py-2 hover:text-[#2AA100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/delete-account') ? 'outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] text-[#2AA100]' : 'text-[#1E2A38] hover:text-[#2aa100]'}`}>
                <UilTrash size={25}  /> Social Impact
              </li>
            </Link>
            <Link to='/freelance-career-tips'>
              <li className={`py-2 hover:text-[#2AA100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/freelance-career-tips') ? 'outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] text-[#2AA100]' : 'text-[#1E2A38] hover:text-[#2aa100]'}`}>
                <Zap size={25}  /> Career Tips
              </li>
            </Link>
          </ul>
          <div className='px-[2rem] py-[2rem]'>
            <p className='hover:text-[#2aa100] text-[#1E2A38] py-[1rem] font-sans text-[18px] font-medium'>87%</p>
            <ProgressBar progress={progress} />
            <p className='text-[12px] text-[#646A73] font-sans font-normal py-[0.2rem]'>Profile complete</p>
            <div className='mt-[4rem]'>
             <Link to="/logout-account">
             <button className='text-[#2aa100] hover:text-[#EE009D] text-[18px] font-sans font-medium flex items-center gap-2'><UilSignout />Logout</button>
             </Link>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default SideNav;
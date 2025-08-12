import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCircle, FaBars, FaFileAlt } from 'react-icons/fa';
import { UilCreateDashboard, UilSetting, UilSignout, UilTimes, UilTrash, UilWallet } from '@iconscout/react-unicons';
import { FaBarsStaggered, FaEnvelope, FaRegUser } from 'react-icons/fa6';
import { IoMdArrowDropdown } from 'react-icons/io';
import { IoBookmarkOutline, IoNotificationsOutline } from 'react-icons/io5';
import Images from '../../constant/Images';
import ProgressBar from '../../reusable/ProgressBar';
import { AppContext } from '../../../global/state';
import { iProfileCompany } from '../../../models/profle';
import { httpGetWithToken, httpPostWithToken } from '../../../utils/http_utils';
import { useToast } from '@chakra-ui/react';
import ls from "localstorage-slim";
import SwitchAccountModal from '../../candidate-admin/delete-account/switch_account';

interface iContext {
  user? : iProfileCompany,
  updateUser? : any
}
const SideNav: React.FC = () => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const targetProgress = 87; // Set the target progress value here
  const { user, updateUser } : iContext = useContext(AppContext);
  const toast = useToast();
  const navigate = useNavigate();

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

  const isActive = (path: string) => location.pathname === path;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const switchAccount =async (role : string) => {
    var resp = await httpPostWithToken("switch-account/"+role);
    if(resp.status == "success") {
      sessionStorage.setItem("wwph_usr", JSON.stringify(resp.data));
      ls.set("wwph_usr", resp.data, {encrypt : true});
      updateUser(resp.data)
      navigate("/resume-page");
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
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [isModalOpen, setModalOpen] = useState(false);
 
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  
  return (
    <div className=''>
      <SwitchAccountModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={()=> {
          switchAccount("candidate");
        }}
        role='Candidate'
      />
      <div className="lg:hidden p-4 text-white absolute left-0 top-2 flex justify-between items-center">
        <button onClick={toggleSidebar}>
          {isSidebarOpen ? <UilTimes color='#2aa100' className='text-[#2aa100]' size={24} /> : <FaBarsStaggered size={25} color='#2aa100' className='font-bold' />}
        </button>
      </div>
      <div className={`h-full w-60 bg-white text-white flex flex-col fixed lg:static transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 flex items-center flex-col">
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
              <IoMdArrowDropdown size="25" color='#2AA100' />
            </button>
          </div>
          {isDropdownOpen && (
            <div className="absolute bg-gray-700 text-white rounded shadow-md mt-[12rem] w-48 z-10">
              <ul>
              <Link to="/employers-profile">
                <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer">Profile</li>
                </Link>
               <Link to="/employers-account-settings">
               <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer">Settings</li>
               </Link>
               <Link to="#?" onClick={()=> {
                handleOpenModal();
               }}>
               <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer">Switch to Candidate</li>
               </Link>
              <Link to="/employers-logout-account">
              <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer">Logout</li>
              </Link>
              </ul>
            </div>
          )}
        </div>
        <nav className="mt-4 flex-1">
          <ul>
            <Link to='/employers-dashboard'>
              <li className={`py-2 hover:outline hover:outline-1 hover:outline-[#EE009D] hover:rounded-lg hover:px-[1rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/employers-dashboard') ? 'outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] mx-[1rem] text-[#2aa100]' : 'text-[#2AA100] hover:text-[#2aa100]'}`}>
                <UilCreateDashboard size={25} color={isActive('/dashboard') ? '#EE009D' : '#EE009D'} /> Dashboard
              </li>
            </Link>
            <Link to='/employers-profile'>
              <li className={`py-2 hover:text-[#2AA100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/employers-profile') ? 'outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] text-[#2AA100]' : 'text-[#1E2A38] hover:text-[#2AA100]'}`}>
                <FaRegUser size={25} className='hover:text-[#EE009D]' /> My Profile
              </li>
            </Link>
            <Link to='/my-jobs'>
              <li className={`py-2 hover:text-[#2AA100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/my-jobs') ? 'outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] text-[#2AA100]' : 'text-[#1E2A38] hover:text-[#2AA100]'}`}>
                <FaFileAlt size={25} className='hover:text-[#EE009D]' /> My Jobs
              </li>
            </Link>
            {/*  */}
            <Link to='/employers-messages'>
              <li className={`py-2 hover:text-[#2AA100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/employers-messages') ? 'outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] text-[#2AA100]' : 'text-[#1E2A38] hover:text-[#2AA100]'}`}>
                <FaEnvelope size={25} className='hover:text-[#EE009D]' /> Message
              </li>
            </Link>
            <Link to='/submit-jobs'>
              <li className={`py-2 hover:text-[#2AA100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/submit-jobs') ? 'outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] text-[#2AA100]' : 'text-[#1E2A38] hover:text-[#2AA100]'}`}>
                <IoNotificationsOutline size={25} className='hover:text-[#EE009D]' /> Submit Job
              </li>
            </Link>
            <Link to='/saved-candidate'>
              <li className={`py-2 hover:text-[#2AA100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/saved-candidate') ? 'outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] text-[#2AA100]' : 'text-[#1E2A38]'}`}>
                <IoBookmarkOutline size={25} className='hover:text-[#EE009D]' /> Saved Candidate
              </li>
            </Link>
            <Link to='/employers-wallet-account'>
              <li className={`py-2 hover:text-[#2AA100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/employers-wallet-account') ? 'outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] text-[#2AA100]' : 'text-[#1E2A38]'}`}>
                <UilWallet size={25} className='hover:text-[#EE009D]' /> Wallet Account
              </li>
            </Link>
            <Link to='/employers-account-settings'>
              <li className={`py-2 hover:text-[#2AA100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/employers-account-settings') ? 'outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] text-[#2AA100]' : 'text-[#1E2A38]'}`}>
                <UilSetting size={25} className='hover:text-[#EE009D]' /> Account Settings
              </li>
            </Link>
            <Link to='/employers-delete-account'>
              <li className={`py-2 hover:text-[#2AA100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/employers-delete-account') ? 'outline outline-1 outline-[#EE009D] rounded-lg px-[1rem] text-[#2AA100]' : 'text-[#1E2A38]'}`}>
                <UilTrash size={25} className='hover:text-[#EE009D]' /> Delete Account
              </li>
            </Link>
          </ul>
          <div className='px-[2rem] py-[2rem]'>
            <p className='text-[#2aa100] hover:text-[#EE009D] py-[1rem] font-sans text-[18px] font-medium'>87%</p>
            <ProgressBar progress={progress} />
            <p className='text-[12px] text-[#646A73] font-sans font-normal py-[0.2rem]'>Profile complete</p>
            <div className='mt-[4rem]'>
             <Link to="/employers-logout-account">
             <button className='text-[#2aa100] text-[18px] font-sans font-medium flex items-center gap-2'><UilSignout />Logout</button>
             </Link>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default SideNav;

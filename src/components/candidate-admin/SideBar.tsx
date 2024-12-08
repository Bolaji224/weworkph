import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCircle, FaBars, FaFileAlt } from 'react-icons/fa';
import { UilCreateDashboard, UilSetting, UilSignout, UilTimes, UilTrash, UilWallet } from '@iconscout/react-unicons';
import Images from '../constant/Images';
import { FaBarsStaggered, FaEnvelope, FaRegUser } from 'react-icons/fa6';
import { IoMdArrowDropdown } from 'react-icons/io';
import { IoBookmarkOutline, IoNotificationsOutline } from 'react-icons/io5';
import ProgressBar from '../reusable/ProgressBar';
import { AppContext } from '../../global/state';
import { iProfile } from '../../models/profle';
import { httpGetWithToken, httpPostWithToken } from '../../utils/http_utils';
import ls from "localstorage-slim";
import { useToast } from '@chakra-ui/react';
import SwitchAccountModal from './delete-account/switch_account';

interface iContext {
  user? : iProfile,
  updateUser ? : any
}
const SideNav: React.FC = () => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const targetProgress = 87; // Set the target progress value here
  const { user, updateUser } : iContext = useContext(AppContext);
  const navigate = useNavigate();
  const toast = useToast();
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [isModalOpen, setModalOpen] = useState(false);
 
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const switchAccount =async (role : string) => {
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
      <div className={`h-full w-60 bg-[#f5f5f5] text-white flex flex-col fixed lg:static transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
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
            <h1 className="text-md font-bold text-[#2aa100] cursor-pointer" onClick={toggleDropdown}>{user?.name}</h1>
            <button className="mt-2 text-gray-400 hover:text-white" onClick={toggleDropdown}>
              <IoMdArrowDropdown size="25" color='#2aa100' />
            </button>
          </div>
          {isDropdownOpen && (
            <div className="absolute bg-gray-700 text-white rounded shadow-md mt-[12rem] w-48 z-10">
              <ul>
                <Link to="/profile-list">
                <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer">Profile</li>
                </Link>
               <Link to="/account-setting">
               <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer">Settings</li>
               </Link>
               <Link to="#?" onClick={()=> handleOpenModal()}>
               <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer">Switch to Employer</li>
               </Link>
              <Link to="/logout-account">
              <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer">Logout</li>
              </Link>
              </ul>
            </div>
          )}
        </div>
        <nav className="mt-4 flex-1">
          <ul>
            <Link to='/candidate-dashboard'>
              <li className={`py-2 hover:bg-[#F5E2EF] hover:rounded-lg hover:px-[1rem] text-[16px] mx-[2rem] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/dashboard') ? 'bg-[#F5E2EF] rounded-lg px-[1rem] mx-[1rem] text-[#2aa100]' : 'text-[#ee009d] hover:text-[#2aa100]'}`}>
                <UilCreateDashboard size={25} color={isActive('/dashboard') ? '#2aa100' : '#2aa100'} /> Dashboard
              </li>
            </Link>
            <Link to='/profile-list'>
              <li className={`py-2 hover:text-[#2aa100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/profile-list') ? 'bg-[#F5E2EF] rounded-lg px-[1rem] text-[#2aa100]' : 'text-[#ee009d] hover:text-[#2aa100]'}`}>
                <FaRegUser size={25} /> My Profile
              </li>
            </Link>
            <Link to='/resume-page'>
              <li className={`py-2 hover:text-[#2aa100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/resume-page') ? 'bg-[#F5E2EF] rounded-lg px-[1rem] text-[#2aa100]' : 'text-[#ee009d] hover:text-[#2aa100]'}`}>
                <FaFileAlt size={25} /> Resume
              </li>
            </Link>
            <Link to='/messages'>
              <li className={`py-2 hover:text-[#2aa100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/messages') ? 'bg-[#F5E2EF] rounded-lg px-[1rem] text-[#2aa100]' : 'text-[#ee009d] hover:text-[#2aa100]'}`}>
                <FaEnvelope size={25} /> Message
              </li>
            </Link>
            <Link to='/applied-jobs'>
              <li className={`py-2 hover:text-[#2aa100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/applied-jobs') ? 'bg-[#F5E2EF] rounded-lg px-[1rem] text-[#2aa100]' : 'text-[#ee009d] hover:text-[#2aa100]'}`}>
                <FaEnvelope size={25} /> Applied Jobs
              </li>
            </Link>
            <Link to='/job-alerts'>
              <li className={`py-2 hover:text-[#2aa100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/job-alerts') ? 'bg-[#F5E2EF] rounded-lg px-[1rem] text-[#2aa100]' : 'text-[#ee009d] hover:text-[#2aa100]'}`}>
                <IoNotificationsOutline size={25} /> Job Alert
              </li>
            </Link>
            <Link to='/saved-jobs'>
              <li className={`py-2 hover:text-[#2aa100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/saved-jobs') ? 'bg-[#F5E2EF] rounded-lg px-[1rem] text-[#2aa100]' : 'text-[#ee009d] hover:text-[#2aa100]'}`}>
                <IoBookmarkOutline size={25} /> Saved Job
              </li>
            </Link>
            <Link to='/candidate-wallet-account'>
              <li className={`py-2 hover:text-[#2aa100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/candidate-wallet-account') ? 'bg-[#F5E2EF] rounded-lg px-[1rem] text-[#2aa100]' : 'text-[#ee009d] hover:text-[#2aa100]'}`}>
                <UilWallet size={25} /> Wallet
              </li>
            </Link>
            <Link to='/account-setting'>
              <li className={`py-2 hover:text-[#2aa100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/account-settings') ? 'bg-[#F5E2EF] rounded-lg px-[1rem] text-[#2aa100]' : 'text-[#ee009d] hover:text-[#2aa100]'}`}>
                <UilSetting size={25} /> Account Settings
              </li>
            </Link>
            <Link to='/delete-account'>
              <li className={`py-2 hover:text-[#2aa100] mt-[1.5rem] hover:rounded-lg mx-[2rem] text-[16px] font-sans font-semibold flex items-center gap-[1rem] ${isActive('/delete-account') ? 'bg-[#F5E2EF] rounded-lg px-[1rem] text-[#2aa100]' : 'text-[#ee009d] hover:text-[#2aa100]'}`}>
                <UilTrash size={25}  /> Delete Account
              </li>
            </Link>
          </ul>
          <div className='px-[2rem] py-[2rem]'>
            <p className='text-[#2aa100] py-[1rem] font-sans text-[18px] font-medium'>87%</p>
            <ProgressBar progress={progress} />
            <p className='text-[12px] text-[#646A73] font-sans font-normal py-[0.2rem]'>Profile complete</p>
            <div className='mt-[4rem]'>
             <Link to="/logout-account">
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

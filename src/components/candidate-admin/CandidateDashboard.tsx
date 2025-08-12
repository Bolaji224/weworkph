import { UilEdit } from '@iconscout/react-unicons';
import React from 'react';
import { FaRegUser } from 'react-icons/fa6';
import { IoBookmarkOutline } from 'react-icons/io5';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import ChartData from './barchart/ChartData';

const CandidateDashboard: React.FC = () => {
  return (
    <div className='mt-[8rem] bg-[#FFF5F8]'>
      <h2 className='px-[2rem] text-[#1E2A38] text-[38px] font-sans font-semibold'>Candidate Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 mt-[2rem] lg:grid-cols-4 gap-8 px-[2rem] ">
      <div className="bg-white outline outline-1 outline-[#E8EBEE] flex flex-col-reverse sm:flex-row items-center justify-center gap-4 sm:gap-8 px-4 py-6 sm:px-6 sm:py-6 rounded-[30px] shadow">
  <div className='space-y-4 text-center sm:text-left'>
    <h2 className="text-2xl text-[#1E2A38] text-[38px] font-sans font-semibold">0</h2>
    <p className="text-[16px] pl-1 font-light text-[#646A73] font-fair">Total Jobs</p>
  </div>
  <div className='bg-[#EE009D] rounded-[50px] p-6 flex justify-center items-center'>
    <FaRegUser size={25} color='#ffffff' /> 
  </div>
</div>
      <div className="bg-white outline outline-1 outline-[#E8EBEE] flex flex-col-reverse sm:flex-row items-center justify-center gap-4 sm:gap-8 p-4 sm:px-6 sm:py-4 rounded-[30px] shadow">
  <div className='space-y-4 text-center sm:text-left'>
    <h2 className="text-2xl text-[#1E2A38] text-[38px] font-sans font-semibold">0</h2>
    <p className="text-[16px] pl-1 font-light text-[#646A73] font-fair">Shortlisted</p>
  </div>
  <div className='bg-[#4ADE80] rounded-[50px] p-6 flex justify-center items-center'>
    <IoBookmarkOutline size={25} color='#ffffff' /> 
  </div>
</div>
      <div className="bg-white outline outline-1 outline-[#E8EBEE] flex flex-col-reverse sm:flex-row items-center justify-center gap-4 sm:gap-8 p-4 sm:px-6 sm:py-4 rounded-[30px] shadow">
  <div className='space-y-4 text-center sm:text-left'>
    <h2 className="text-2xl text-[#1E2A38] text-[38px] font-sans font-semibold">0</h2>
    <p className="text-[16px] pl-1 font-light text-[#646A73] font-fair">Views</p>
  </div>
  <div className='bg-[#60A5FA] rounded-[50px] p-6 flex justify-center items-center'>
    <MdOutlineRemoveRedEye size={25} color='#ffffff' /> 
  </div>
</div>
      <div className="bg-white outline outline-1 outline-[#E8EBEE] flex flex-col-reverse sm:flex-row items-center justify-center gap-4 sm:gap-8 p-4 sm:px-6 sm:py-4 rounded-[30px] shadow">
  <div className='space-y-4 text-center sm:text-left'>
    <h2 className="text-2xl text-[#1E2A38] text-[38px] font-sans font-semibold">0</h2>
    <p className="text-[16px] pl-1 font-light text-[#646A73] font-fair">Applied Jobs</p>
  </div>
  <div className='bg-[#FACC15] rounded-[50px] p-6 flex justify-center items-center'>
    <UilEdit size={25} color='#ffffff' /> 
  </div>
</div>

    </div>
      <ChartData />
    </div>
  );
}

export default CandidateDashboard;
import React, { useState } from 'react';
import CandidateRegisterForm from './CandidateRegisterForm';
import EmployersRegisterForm from './EmployersRegisterForm';

const TabForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState('candidate');

  return (
    <div className="max-w-[1300px] mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between mb-4">
        <button
          className={`w-1/2 p-2 ${activeTab === 'candidate' ? 'border-b-2 border-[#EE009D] text-[#EE009D] text-[24px] font-sans font-bold' : 'text-[#646A73] text-[20px] font-sans font-semibold'}`}
          onClick={() => setActiveTab('candidate')}
        >
          Candidates
        </button>
        <button
          className={`w-1/2 p-2 ${activeTab === 'employer' ? 'border-b-[3px] border-[#EE009D] text-[#EE009D] font-sans font-bold text-[24px]' : 'text-[#646A73] text-[20px] font-sans font-semibold'}`}
          onClick={() => setActiveTab('employer')}
        >
          Employers
        </button>
      </div>

      {activeTab === 'candidate' && (
        <CandidateRegisterForm />
      )}

      {activeTab === 'employer' && (
       <EmployersRegisterForm />
      )}
    </div>
  );
};

export default TabForm;

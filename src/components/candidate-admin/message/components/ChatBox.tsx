import React, { useState } from 'react';
import { ArrowRight, RotateCcw, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// =========================
// Component
// =========================
const SmartStartJobPosting: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: '',
    location: '',
    jobTitle: '',
    experience: '',
    availability: ''
  });

  const [showSummary, setShowSummary] = useState(false);

  const handleInput = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePublishJob = () => {
    localStorage.setItem("jobPost", JSON.stringify(formData));
    navigate('/employers-dashboard');
  };

  if (showSummary) {
    return (
      <div className="p-6 mt-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Job Post</h2>
            <p className="text-gray-600">Here’s the job listing you’ve created</p>
          </div>

          <div className="space-y-4 mb-8">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1 capitalize">{key}</h3>
                    <p className="text-[#2AA100] font-medium text-lg">{value}</p>
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 bg-[#2AA100] rounded-full ml-4">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePublishJob}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-[#2AA100] text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Publish Job
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowSummary(false)}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:bg-gray-50"
            >
              <RotateCcw className="w-5 h-5" />
              Edit Job Post
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mt-16">
      <div>
      <div className="max-w-3xl mx-auto mb-6">
            <div>
              <h1 className="text-3xl text-center font-bold text-purple-700 mb-2">
                SmartStart™ Application
              </h1>
              <p className="text-gray-600 text-center">A quick way to find top-rated editors and creatives worldwide. Fill in the details below to create your job post.</p>
            </div>
          </div>
      </div>
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-[#1E2A38] text-start pb-4">Post a Job Opening</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Company Name</label>
            <input
              type="text"
              value={formData.company}
              onChange={e => handleInput('company', e.target.value)}
              placeholder="e.g. Acme Inc."
              className="w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2AA100]"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={e => handleInput('location', e.target.value)}
              placeholder="e.g. New York, USA"
              className="w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2AA100]"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Job Title</label>
            <select
              value={formData.availability}
              onChange={e => handleInput('availability', e.target.value)}
              className="w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2AA100]"
            >
              <option value="remote">Virtual Assistant</option>
              <option value="hybrid">Graphic Designer</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Years of Experience</label>
            <input
              type="number"
              value={formData.experience}
              onChange={e => handleInput('experience', e.target.value)}
              placeholder="e.g. 2"
              className="w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2AA100]"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Availability</label>
            <select
              value={formData.availability}
              onChange={e => handleInput('availability', e.target.value)}
              className="w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2AA100]"
            >
              <option value="">Select availability</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="on-site">On-site</option>
            </select>
          </div>

          <button
            onClick={() => setShowSummary(true)}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#2AA100] text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Review Job Post
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartStartJobPosting;

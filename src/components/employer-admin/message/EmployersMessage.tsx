import React, { useState } from 'react';

export default function JobApplicationForm() {
  const [currentStep, setCurrentStep] = useState<'form' | 'plans'>('form');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    location: '',
    jobType: '',
    experience: '',
    availability: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    const isFormValid = Object.values(formData).every(value => value.trim() !== '');
    if (isFormValid) {
      setCurrentStep('plans');
    } else {
      alert('Please fill out all fields before continuing.');
    }
  };

  const handlePlanSelection = (plan: string) => {
    setSelectedPlan(plan);
  };

  const handleFinalSubmit = () => {
    console.log('Final submission:', { formData, selectedPlan });
    alert(`Application submitted with ${selectedPlan} plan!`);
  };

  const goBack = () => {
    setCurrentStep('form');
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 to-pink-100 py-12 px-4"
      style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #fce7f3 100%)' }}
    >
      <div className="max-w-4xl mx-auto">
        {currentStep === 'form' ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Application Form</h1>
              <p className="text-gray-600">Fill out your details to apply for a position</p>
            </div>

            <div className="space-y-6">
              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg transition duration-200"
                  style={{ '--tw-ring-color': '#2aa100' } as React.CSSProperties}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#2aa100')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
                  placeholder="Enter your company name"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg transition duration-200"
                  style={{ '--tw-ring-color': '#2aa100' } as React.CSSProperties}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#2aa100')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
                >
                  <option value="">Select location</option>
                  <option value="uk">UK</option>
                  <option value="lagos">Lagos</option>
                  <option value="us">US</option>
                  <option value="abuja">Abuja</option>
                </select>
              </div>

              {/* Job Applicant Type */}
              <div>
                <label htmlFor="jobType" className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Applicant
                </label>
                <select 
                  id="jobType"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg transition duration-200"
                  style={{ '--tw-ring-color': '#2aa100' } as React.CSSProperties}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#2aa100')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
                >
                  <option value="">Select job type</option>
                  <option value="virtual_assistant">Virtual Assistant</option>
                  <option value="editor">Editor</option>
                </select>
              </div>

              {/* Years of Experience */}
              <div>
                <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-2">
                  Years of Experience
                </label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg transition duration-200"
                  style={{ '--tw-ring-color': '#2aa100' } as React.CSSProperties}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#2aa100')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
                >
                  <option value="">Select experience level</option>
                  <option value="none_beginner">None / Beginner</option>
                  <option value="1_3_years">1–3 years</option>
                  <option value="3_plus_years">3+ years</option>
                </select>
              </div>

              {/* Availability */}
              <div>
                <label htmlFor="availability" className="block text-sm font-semibold text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg transition duration-200"
                  style={{ '--tw-ring-color': '#2aa100' } as React.CSSProperties}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#2aa100')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
                >
                  <option value="">Select availability</option>
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                  <option value="immediate">Immediate</option>
                  <option value="2_weeks">2 weeks notice</option>
                  <option value="1_month">1 month notice</option>
                </select>
              </div>

              {/* Continue Button */}
              <div className="pt-6">
                <button
                  style={{ backgroundColor: '#2aa100' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#22c55e')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2aa100')}
                  onClick={handleSubmit}
                  className="px-6 py-2 rounded-lg text-white font-semibold"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Plan Selection Page
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Your Plan</h1>
              <p className="text-gray-600">Choose the plan that best fits your needs</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Standard Plan */}
              <div
                className={`relative border-2 rounded-xl p-6 transition duration-300 cursor-pointer ${
                  selectedPlan === 'standard' ? 'shadow-lg transform scale-105' : 'border-gray-300 hover:shadow-md'
                }`}
                style={{
                  borderColor: selectedPlan === 'standard' ? '#2aa100' : undefined,
                  backgroundColor: selectedPlan === 'standard' ? 'rgba(42, 161, 0, 0.1)' : undefined
                }}
                onMouseEnter={(e) => {
                  if (selectedPlan !== 'standard') e.currentTarget.style.borderColor = '#2aa100';
                }}
                onMouseLeave={(e) => {
                  if (selectedPlan !== 'standard') e.currentTarget.style.borderColor = '#d1d5db';
                }}
                onClick={() => handlePlanSelection('standard')}
              >
                <h3 className="text-xl font-bold text-gray-900 text-center">STANDARD</h3>
                <div className="text-center mt-2">
                  <span className="text-2xl font-bold" style={{ color: '#2aa100' }}>
                    $49
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>
                {selectedPlan === 'standard' && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center bg-green-600">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Premium Plan */}
              <div
                className={`relative border-2 rounded-xl p-6 transition duration-300 cursor-pointer ${
                  selectedPlan === 'premium' ? 'shadow-lg transform scale-105' : 'border-gray-300 hover:shadow-md'
                }`}
                style={{
                  borderColor: selectedPlan === 'premium' ? '#EE009D' : undefined,
                  backgroundColor: selectedPlan === 'premium' ? 'rgba(238, 0, 157, 0.1)' : undefined
                }}
                onMouseEnter={(e) => {
                  if (selectedPlan !== 'premium') e.currentTarget.style.borderColor = '#EE009D';
                }}
                onMouseLeave={(e) => {
                  if (selectedPlan !== 'premium') e.currentTarget.style.borderColor = '#d1d5db';
                }}
                onClick={() => handlePlanSelection('premium')}
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="text-white px-4 py-1 rounded-full text-sm font-semibold bg-pink-600">
                    MOST POPULAR
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mt-4">PREMIUM</h3>
                <div className="text-center mt-2">
                  <span className="text-2xl font-bold text-pink-600">$99</span>
                  <span className="text-gray-500">/month</span>
                </div>
                {selectedPlan === 'premium' && (
                  <div className="absolute top-12 right-3 w-6 h-6 rounded-full flex items-center justify-center bg-pink-600">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={goBack}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
              >
                Back to Form
              </button>

              <button
                style={selectedPlan ? { backgroundColor: '#2aa100' } : {}}
                onMouseEnter={(e) => selectedPlan && (e.currentTarget.style.backgroundColor = '#22c55e')}
                onMouseLeave={(e) => selectedPlan && (e.currentTarget.style.backgroundColor = '#2aa100')}
                onClick={handleFinalSubmit}
                className="px-6 py-2 rounded-lg text-white font-semibold"
              >
                {selectedPlan ? `Submit Application (${selectedPlan.toUpperCase()})` : 'Select a Plan'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

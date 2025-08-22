import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Upload, Calendar, Check, X, ArrowLeft, ArrowRight, Sparkles, User, Briefcase, FileText, Package, Clock, Shield } from 'lucide-react';

interface FormData {
  // step 1 - Personal Details
  fullName: string;
  email: string;
  phone: string;
  location: string;
  // Step 2 - Role & Skills
  role: string;
  experience: string;
  skills: string[];
  // step 3 - portfolio
  workSamples: File[];
  portfolioLink: string;
  experienceDetails: string;
  education: string;
  toolsSkills: string;
  // Step 4 - Package
  package: string;
  // Step 5 - Availability & Preferences
  weeklyAvailability: string;
  clientTypes: string[];
  startDate: string;
  // step 6 - Consent & agreement
  agreeTerms: boolean;
  consentProfile: boolean;
}

const SubscriptionPlan = () => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [formData, setFormData] = useState<FormData>({
        // step 1 - Personal Details
        fullName: '',
        email: '',
        phone: '',
        location: '',

        // Step 2 - Role & Skills
        role: '',
        experience: '',
        skills: [],

        // step 3 - portfolio
        workSamples: [],
        portfolioLink: '',
        experienceDetails: '',
        education: '',
        toolsSkills: '',

        // Step 4 - Package
        package: '',

        // Step 5 - Availability & Preferences
        weeklyAvailability: '',
        clientTypes: [],
        startDate: '',

        // step 6 - Consent & agreement
        agreeTerms: false,
        consentProfile: false
    });

    const totalSteps = 6;

    const stepConfig = [
        {id:1, title: 'Personal Details', icon: User, color: 'from-blue-600 to-blue-600 '},
        {id:2, title: 'Role & Skills', icon: Briefcase, color: 'from-blue-600 to-blue-600'},
        {id:3, title: 'Portfolio', icon: FileText, color: 'from-pink-500 to-rose-600'},
        {id:4, title: 'Package & Payment', icon: Package, color: 'from-rose-500 to-orange-600'},
        {id:5, title: 'Availability', icon: Clock, color: 'from-orange-500 to-yellow-600'},
        {id:6, title: 'Consent & Agreement', icon: Shield, color: 'from-green-500 to-teal-600'},
    ];

    const locations = [
        'Lagos, Nigeria',
        'London, UK',
        'New York, USA',
        'Toronto, Canada',
        'Sydney, Australia',
        'Dubai, UAE'
    ];

    const roles = [
        'Virtual Assistant',
        'Editor'
    ];

    const experienceLevels  = [
        'None / Beginner',
        '1-3 years',
        '3+ years'
    ];

    const vaSkills = [
        'Data Entry',
        'Email Management',
        'Calender Management',
        'Customer Support',
        'Social Media Management',
        'Research & Analysis'
    ];

    const editorSkills = [
        'Vidio Editing',
        'Motion Graphics',
        'Animation',
        'Sound Design',
        'Color Correction',
        'Visual Effects'
    ];

    const availabilityOptions = [
        '<10 hrs',
        '10–20 hrs',
        '20–30 hrs',
        'Full-time'
    ];

    const clientTypes = [
        'Small Business',
        'Individual Entrepreneur',
        'NGO',
        'Corporate'
    ];

    const packages = [
        {
          name: 'Standard',
          price: '£15',
          gradient: 'from-blue-500 to-purple-600',
          features: ['SmartStart Launch Kits', 'SkillStamp Test/Badge', 'SmartGuide']
        },
        {
          name: 'Premium',
          price: '£25',
          gradient: 'from-purple-500 to-pink-600',
          features: ['Everything in Standard', 'SmartCV', 'AI Matching']
        }
      ];

      const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
      };

      const handleSkillToggle = (skill: string) => {
        setFormData(prev => ({
          ...prev,
          skills: prev.skills.includes(skill)
            ? prev.skills.filter(s => s !== skill)
            : [...prev.skills, skill]
        }));
      };

      const handleClientTypeToggle = (type: string) => {
        setFormData(prev => ({
            ...prev,
            clientTypes: prev.clientTypes.includes(type)
            ? prev.clientTypes.filter(t => t !== type)
            : [...prev.clientTypes, type]
        }));
      };

      const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
      };

      const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
      };

      const getStepStatus = (step: number) => {
        if (step < currentStep) return 'completed';
        if (step === currentStep) return 'current';
        return 'upcoming';
      };

      const isStepValid = (step: number) => {
        switch(step) {
            case 1:
        return formData.fullName && formData.email && formData.phone && formData.location;
      case 2:
        return formData.role && formData.experience && formData.skills.length > 0;
      case 3:
        return true; // Portfolio is optional
      case 4:
        return formData.package;
      case 5:
        return formData.weeklyAvailability && formData.clientTypes.length > 0 && formData.startDate;
      case 6:
        return formData.agreeTerms && formData.consentProfile;
      default:
        return false;
        }
      };

      const handleSubmit = () => {
        console.log('Form Submitted:', formData);
        // Handle form submission here
        alert('Application submitted successfully!');
      };

      const getCompletionPercentage = () => {
        const validSteps = stepConfig.filter((_, index) => isStepValid(index + 1)).length;
        return Math.round((validSteps / totalSteps) * 100);
      };

      const getCurrentStep = () => stepConfig.find(step => step.id === currentStep );

      const renderStepContent = () => {
        switch(currentStep) {
            case 1:
                return (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Details</h2>
                      <p className="text-gray-600">Tell us about yourself to get started</p>
                    </div>
        
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Full Name <span className="text-pink-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200"
                          placeholder="Enter your full name"
                        />
                      </div>
        
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Email Address <span className="text-pink-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200"
                          placeholder="Enter your email"
                        />
                      </div>
        
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Phone Number (WhatsApp preferred) <span className="text-pink-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200"
                          placeholder="Enter your phone number"
                        />
                      </div>
        
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Location (City, Country) <span className="text-pink-500">*</span>
                        </label>
                        <select
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200"
                        >
                          <option value="">Select your location</option>
                          {locations.map(location => (
                            <option key={location} value={location}>{location}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
        
              case 2:
                return (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
                        <Briefcase className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Role & Skills</h2>
                      <p className="text-gray-600">Define your expertise and experience level</p>
                    </div>
        
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Select Your Role <span className="text-pink-500">*</span>
                        </label>
                        <select
                          value={formData.role}
                          onChange={(e) => handleInputChange('role', e.target.value)}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all duration-200"
                        >
                          <option value="">Select a role</option>
                          {roles.map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </div>
        
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Years of Experience <span className="text-[#ee009d]">*</span>
                        </label>
                        <select
                          value={formData.experience}
                          onChange={(e) => handleInputChange('experience', e.target.value)}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200"
                        >
                          <option value="">Select experience level</option>
                          {experienceLevels.map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>
                    </div>
        
                    {formData.role && (
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700">
                          Skills Checklist <span className="text-[#ee009d]">*</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {(formData.role === 'Virtual Assistant' ? vaSkills : editorSkills).map(skill => (
                            <label key={skill} className="flex items-center space-x-3 cursor-pointer group">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={formData.skills.includes(skill)}
                                  onChange={() => handleSkillToggle(skill)}
                                  className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded-lg border-2 transition-all duration-200 ${
                                  formData.skills.includes(skill)
                                    ? 'bg-purple-700 border-purple-400'
                                    : 'border-gray-300 group-hover:border-purple-400'
                                }`}>
                                  {formData.skills.includes(skill) && (
                                    <Check className="w-3 h-3 text-white m-0.5" />
                                  )}
                                </div>
                              </div>
                              <span className="text-sm text-gray-700 group-hover:text-purple-700 transition-colors">
                                {skill}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
        
              case 3:
                return (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl mb-4">
                        <FileText className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Portfolio</h2>
                      <p className="text-gray-600">Showcase your work and experience</p>
                    </div>
        
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Experience</label>
                        <textarea
                          value={formData.experienceDetails}
                          onChange={(e) => handleInputChange('experienceDetails', e.target.value)}
                          rows={4}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-200"
                          placeholder="Describe your relevant work experience..."
                        />
                      </div>
        
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Education</label>
                        <textarea
                          value={formData.education}
                          onChange={(e) => handleInputChange('education', e.target.value)}
                          rows={3}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-200"
                          placeholder="Your educational background..."
                        />
                      </div>
        
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Skills/Tools</label>
                        <textarea
                          value={formData.toolsSkills}
                          onChange={(e) => handleInputChange('toolsSkills', e.target.value)}
                          rows={3}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-200"
                          placeholder="List the tools and software you're proficient with..."
                        />
                      </div>
        
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Upload 1–3 Work Samples (optional)
                        </label>
                        <div className="border-3 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-pink-400 hover:bg-pink-50 transition-all duration-300 cursor-pointer">
                          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-sm text-gray-600 mb-2 font-medium">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">PDF, DOC, PNG, JPG up to 10MB each</p>
                        </div>
                      </div>
        
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Link to Online Portfolio (optional)
                        </label>
                        <input
                          type="url"
                          value={formData.portfolioLink}
                          onChange={(e) => handleInputChange('portfolioLink', e.target.value)}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-200"
                          placeholder="https://your-portfolio.com"
                        />
                      </div>
                    </div>
                  </div>
                );
        
              case 4:
                return (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-rose-500 to-orange-600 rounded-2xl mb-4">
                        <Package className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Package & Payment</h2>
                      <p className="text-gray-600">Choose your SmartStart™ package</p>
                    </div>
        
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-6">
                        Choose SmartStart™ Package <span className="text-pink-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {packages.map(pkg => (
                          <div
                            key={pkg.name}
                            className={`relative border-3 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                              formData.package === pkg.name
                                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl'
                                : 'border-gray-200 hover:border-purple-300 hover:shadow-lg'
                            }`}
                            onClick={() => handleInputChange('package', pkg.name)}
                          >
                            {formData.package === pkg.name && (
                              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <Check className="w-5 h-5 text-white" />
                              </div>
                            )}
                            
                            <div className="flex items-start justify-between mb-4">
                              <h3 className={`text-xl font-bold bg-gradient-to-r ${pkg.gradient} bg-clip-text text-transparent`}>
                                {pkg.name}
                              </h3>
                              <span className={`text-3xl font-bold bg-gradient-to-r ${pkg.gradient} bg-clip-text text-transparent`}>
                                {pkg.price}
                              </span>
                            </div>
                            
                            <ul className="space-y-3">
                              {pkg.features.map((feature, index) => (
                                <li key={index} className="flex items-start space-x-3">
                                  <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${pkg.gradient} flex items-center justify-center mt-0.5 flex-shrink-0`}>
                                    <Check className="w-3 h-3 text-white" />
                                  </div>
                                  <span className="text-sm text-gray-700 font-medium">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
        
              case 5:
                return (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-2xl mb-4">
                        <Clock className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Availability & Preferences</h2>
                      <p className="text-gray-600">Set your schedule and client preferences</p>
                    </div>
        
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Weekly Availability <span className="text-pink-500">*</span>
                          </label>
                          <select
                            value={formData.weeklyAvailability}
                            onChange={(e) => handleInputChange('weeklyAvailability', e.target.value)}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200"
                          >
                            <option value="">Select availability</option>
                            {availabilityOptions.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
        
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Earliest Start Date <span className="text-pink-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200"
                          />
                        </div>
                      </div>
        
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700">
                          Preferred Client Type <span className="text-pink-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {clientTypes.map(type => (
                            <label key={type} className="flex items-center space-x-3 cursor-pointer group">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={formData.clientTypes.includes(type)}
                                  onChange={() => handleClientTypeToggle(type)}
                                  className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded-lg border-2 transition-all duration-200 ${
                                  formData.clientTypes.includes(type)
                                    ? 'bg-gradient-to-r from-orange-500 to-yellow-500 border-orange-500'
                                    : 'border-gray-300 group-hover:border-orange-400'
                                }`}>
                                  {formData.clientTypes.includes(type) && (
                                    <Check className="w-3 h-3 text-white m-0.5" />
                                  )}
                                </div>
                              </div>
                              <span className="text-sm text-gray-700 group-hover:text-orange-700 transition-colors">
                                {type}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
        
              case 6:
                return (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2AA100] hover:bg-teal-600 rounded-2xl mb-4">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Consent & Agreement</h2>
                      <p className="text-gray-600">Final agreements to complete your application</p>
                    </div>
        
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8 space-y-6">
                      <label className="flex items-start space-x-4 cursor-pointer group">
                        <div className="relative mt-1">
                          <input
                            type="checkbox"
                            checked={formData.agreeTerms}
                            onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 ${
                            formData.agreeTerms
                              ? 'bg-[#2AA100] hover:bg-teal-600 border-pink-100'
                              : 'border-gray-300 group-hover:border-green-400'
                          }`}>
                            {formData.agreeTerms && (
                              <Check className="w-4 h-4 text-white m-0.5" />
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-green-700 transition-colors">
                          I agree to the SmartStart™ Terms & Conditions <span className="text-[#ee009d] font-semibold">*</span>
                        </span>
                      </label>
        
                      <label className="flex items-start space-x-4 cursor-pointer group">
                        <div className="relative mt-1">
                          <input
                            type="checkbox"
                            checked={formData.consentProfile}
                            onChange={(e) => handleInputChange('consentProfile', e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 ${
                            formData.consentProfile
                              ? 'bg-[#2AA100] hover:bg-teal-600 border-pink-100'
                              : 'border-gray-300 group-hover:border-green-400'
                          }`}>
                            {formData.consentProfile && (
                              <Check className="w-4 h-4 text-white m-0.5" />
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-green-700 transition-colors">
                          I consent to my profile being listed for job matching <span className="text-[#ee009d] font-semibold">*</span>
                        </span>
                      </label>
                    </div>
                  </div>
                );
        
              default:
                return null;
            }
          };
    
  return (
    <div className="container mx-auto mt-[8rem] px-4 md:px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1E2A38] mb-2">
                SmartStart™ Application
              </h1>
              <p className="text-gray-600">Transform your freelance career with our comprehensive program</p>
            </div>
            {/* <button className="px-6 py-3 text-purple-600 border-2 border-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-200 font-medium">
              Save as draft
            </button> */}
          </div>

          {/* Enhanced Progress Bar */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-800">
                Step {currentStep} of {totalSteps}
              </span>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-700" />
                <span className="text-lg font-bold text-purple-700">
                  {Math.round((currentStep / totalSteps) * 100)}% Complete
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between relative">
              {stepConfig.map((step, index) => {
                const status = getStepStatus(step.id);
                const Icon = step.icon;
                return (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center relative z-10">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                          status === 'completed'
                            ? 'bg-[#2AA100] text-white shadow-lg'
                            : status === 'current'
                            ? `bg-gradient-to-r ${step.color} text-white shadow-lg scale-110`
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {status === 'completed' ? <Check size={20} /> : <Icon size={20} />}
                      </div>
                      <span className={`mt-2 text-xs font-medium text-center max-w-16 ${
                        status === 'current' ? 'text-purple-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < stepConfig.length - 1 && (
                      <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
                        step.id < currentStep ? 'bg-[#2AA100]' : 'bg-gray-200'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Current Step Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 border-t-2 border-gray-100">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
              currentStep > 1
                ? 'text-gray-700 hover:text-purple-700 hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-500'
                : 'text-gray-400 cursor-not-allowed border-2 border-gray-200'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSteps }, (_, i) => {
              const step = i + 1;
              const status = getStepStatus(step);
              return (
                <div
                  key={step}
                  className={`transition-all duration-300 rounded-full ${
                    status === 'current'
                      ? 'w-12 h-3 bg-blue-600'
                      : status === 'completed'
                      ? 'w-3 h-3 bg-[#2AA100]'
                      : 'w-3 h-3 bg-gray-300'
                  }`}
                />
              );
            })}
          </div>

          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
              className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                isStepValid(currentStep)
                  ? 'bg-[#ee009d] text-white hover:bg-purple-700- shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next Step
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStepValid(currentStep)}
              className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                isStepValid(currentStep)
                  ? 'bg-[#2AA100] text-white hover:bg-teal-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              Submit Application
            </button>
          )}
        </div>

        {/* Progress Summary */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white rounded-full shadow-md border border-gray-100">
            <div className="w-3 h-3 rounded-full bg-[#ee009d]"></div>
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps} • {getCurrentStep()?.title}
            </span>
          </div>
        </div>
      </div>
  );
};

export default SubscriptionPlan;
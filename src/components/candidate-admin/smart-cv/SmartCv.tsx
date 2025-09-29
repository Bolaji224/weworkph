import React, { useState } from 'react';
import { Upload } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  profession: string;
  phoneNumber: string;
  email: string;
  city: string;
  state: string;
  summary: string;
  skills: string[];
  tools: string[];
  experienceTitle: string;
  experienceCompany: string;
  experienceLocation: string;
  experienceStartDate: string;
  experienceEndDate: string;
  experienceDescription: string;
  educationDegree: string;
  educationInstitution: string;
  educationStartYear: string;
  educationEndYear: string;
}

const SmartCvForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    profession: '',
    phoneNumber: '',
    email: '',
    city: '',
    state: '',
    summary: '',
    skills: [],
    tools: [],
    experienceTitle: '',
    experienceCompany: '',
    experienceLocation: '',
    experienceStartDate: '',
    experienceEndDate: '',
    experienceDescription: '',
    educationDegree: '',
    educationInstitution: '',
    educationStartYear: '',
    educationEndYear: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (category: 'skills' | 'tools', value: string) => {
    setFormData(prev => {
      const currentArray = prev[category];
      const isChecked = currentArray.includes(value);
      
      return {
        ...prev,
        [category]: isChecked
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value]
      };
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    const form = new FormData();
  
    // Append all text fields
    Object.keys(formData).forEach((key) => {
      const value = (formData as any)[key];
      if (Array.isArray(value)) {
        value.forEach((v: string) => form.append(`${key}[]`, v));
      } else {
        form.append(key, value);
      }
    });
  
    // Append photo if uploaded
    if (uploadedFiles.length > 0) {
      form.append("photo", uploadedFiles[0]);
    }
  
    try {
      const response = await fetch("http://localhost:8000/api/v1/cv", {
        method: "POST",
        body: form,
      });
  
      if (!response.ok) throw new Error("Failed to generate CV");
  
      // Get blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cv.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };
  

  const skillOptions = [
    'Calendar Management',
    'Email Handling',
    'Customer Support',
    'Data Entry',
    'Administrative Support',
    'Scheduling',
    'Document Preparation',
    'Travel Arrangements'
  ];

  const toolOptions = [
    'Microsoft Office',
    'Trello',
    'Asana',
    'Slack',
    'Google Workspace',
    'Zoom',
    'Calendly',
    'Notion'
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white mt-18 rounded-lg shadow-sm mb-8 overflow-hidden">
          <div className="bg-yellow-400 text-white p-8 text-center relative">
            <div className="inline-block bg-yellow-500 px-8 py-4 rounded-lg transform -rotate-3 shadow-lg">
              <span className="text-xl font-bold">
                SmartCV<br />
                <span className="text-2xl">Fill the Form</span>
              </span>
            </div>
          </div>
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Smart CV</h1>
            <p className="text-gray-600">
              SmartCV is WeWorkPerHour's interactive, AI-ready freelancer résumé that helps talent stand out and clients make faster hiring decisions. It's more than a static CV — it's a profile plus portfolio in one, verified and formatted to highlight skills, experience, and achievements for maximum impact.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Profile Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Profile Photo <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">Upload a Photo</p>
              <p className="text-sm text-gray-500 mb-4">Drag and drop files here</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Choose File
              </label>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium text-gray-700 mb-2">Uploaded photo:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {uploadedFiles.map((file, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Name Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <label className="block text-xs text-gray-500 mt-1">First Name</label>
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <label className="block text-xs text-gray-500 mt-1">Last Name</label>
              </div>
            </div>
          </div>

          {/* Profession */}
          <div>
            <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-2">
              Profession/Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleInputChange}
              placeholder="e.g. Virtual Assistant, Video Editor"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="yourname@gmail.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+2349027413899"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Lagos"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                State/Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Nigeria"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
              Professional Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              placeholder="Brief description of your professional background and expertise..."
              required
            />
          </div>

          {/* Skills and Tools Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Skills <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-md">
                {skillOptions.map((skill) => (
                  <label key={skill} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill)}
                      onChange={() => handleCheckboxChange('skills', skill)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tools <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-md">
                {toolOptions.map((tool) => (
                  <label key={tool} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.tools.includes(tool)}
                      onChange={() => handleCheckboxChange('tools', tool)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{tool}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Experience</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="experienceTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="experienceTitle"
                  name="experienceTitle"
                  value={formData.experienceTitle}
                  onChange={handleInputChange}
                  placeholder="e.g. Virtual Assistant"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="experienceCompany" className="block text-sm font-medium text-gray-700 mb-2">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="experienceCompany"
                    name="experienceCompany"
                    value={formData.experienceCompany}
                    onChange={handleInputChange}
                    placeholder="e.g. ABC Solutions"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="experienceLocation" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    id="experienceLocation"
                    name="experienceLocation"
                    value={formData.experienceLocation}
                    onChange={handleInputChange}
                    placeholder="e.g. Lagos, Nigeria"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="experienceStartDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="month"
                    id="experienceStartDate"
                    name="experienceStartDate"
                    value={formData.experienceStartDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="experienceEndDate" className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="month"
                    id="experienceEndDate"
                    name="experienceEndDate"
                    value={formData.experienceEndDate}
                    onChange={handleInputChange}
                    placeholder="Leave empty if current"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty if this is your current position</p>
                </div>
              </div>

              <div>
                <label htmlFor="experienceDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="experienceDescription"
                  name="experienceDescription"
                  value={formData.experienceDescription}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                  placeholder="Describe your responsibilities and achievements..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Education</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="educationDegree" className="block text-sm font-medium text-gray-700 mb-2">
                  Degree <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="educationDegree"
                  name="educationDegree"
                  value={formData.educationDegree}
                  onChange={handleInputChange}
                  placeholder="e.g. Bachelor of Arts in Business Administration"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="educationInstitution" className="block text-sm font-medium text-gray-700 mb-2">
                  Institution <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="educationInstitution"
                  name="educationInstitution"
                  value={formData.educationInstitution}
                  onChange={handleInputChange}
                  placeholder="e.g. University of Lagos"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="educationStartYear" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="educationStartYear"
                    name="educationStartYear"
                    value={formData.educationStartYear}
                    onChange={handleInputChange}
                    placeholder="2018"
                    min="1950"
                    max="2030"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="educationEndYear" className="block text-sm font-medium text-gray-700 mb-2">
                    End Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="educationEndYear"
                    name="educationEndYear"
                    value={formData.educationEndYear}
                    onChange={handleInputChange}
                    placeholder="2022"
                    min="1950"
                    max="2030"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-gray-500 text-white px-8 py-3 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartCvForm;
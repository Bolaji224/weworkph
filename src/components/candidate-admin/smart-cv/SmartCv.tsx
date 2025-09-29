import React, { useState } from 'react';
import { Upload } from 'lucide-react';

interface FormData {
    firstName: string;
  lastName: string;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  phoneNumber: string;
  email: string;
  streetAddress: string;
  streetAddress2: string;
  city: string;
  state: string;
  postalCode: string;
  referralSource: string[];
  motivationLetter: string;
  trainingTitle: string;
  trainingDate: string;
}

const SmartCvForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
    lastName: '',
    birthMonth: '',
    birthDay: '',
    birthYear: '',
    phoneNumber: '',
    email: '',
    streetAddress: '',
    streetAddress2: '',
    city: '',
    state: '',
    postalCode: '',
    referralSource: [],
    motivationLetter: '',
    trainingTitle: '',
    trainingDate: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const HandleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            referralSource: checked
            ? [...prev.referralSource, value]
            : prev.referralSource.filter(item => item !== value)
        }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) {
            setUploadedFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        console.log('Files:', uploadedFiles);
    };

    const months = [
        'January', 'Febuary', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const days = Array.from({ length: 31}, (_, i) => i +1);
    const years = Array.from({ length: 80}, (_, i) => new Date().getFullYear())

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}

                <div className="bg-white mt-24 rounded-lg shadow-sm mb-8 overflow-hidden">
                    <div className="bg-yellow-400 text-white p-8 text-center relative">
                        <div className="inline-block bg-yellow-500 px-8 py-4 rounded-lg transform -rotate-3 shadow-lg">
                           <span className="text-xl font-bold">
                            SmartCv <br/>
                            <span className="text-2xl">Fill the Form</span>
                            </span> 
                        </div>
                    </div>
                    <div className="p-6">
                        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Smart CV</h1>
                        <p className="text-gray-600">SmartCV is WeWorkPerHour’s interactive, AI-ready freelancer résumé that
helps talent stand out and clients make faster hiring decisions. It’s more than a static CV —
it’s a profile plus portfolio in one, verified and formatted to highlight skills, experience, and
achievements for maximum impact.</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                    {/* Name Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={HandleInputChange}
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
                  onChange={HandleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <label className="block text-xs text-gray-500 mt-1">Last Name</label>
              </div>
            </div>
          </div>

          {/* Birth Date Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Birth Date</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <select
                  name="birthMonth"
                  value={formData.birthMonth}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Please select a month</option>
                  {months.map((month, index) => (
                    <option key={month} value={index + 1}>{month}</option>
                  ))}
                </select>
                <label className="block text-xs text-gray-500 mt-1">Month</label>
              </div>
              <div>
                <select
                  name="birthDay"
                  value={formData.birthDay}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Please select a day</option>
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <label className="block text-xs text-gray-500 mt-1">Day</label>
              </div>
              <div>
                <select
                  name="birthYear"
                  value={formData.birthYear}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Please select a year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <label className="block text-xs text-gray-500 mt-1">Year</label>
              </div>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={HandleInputChange}
              placeholder="(000) 000-0000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={HandleInputChange}
              placeholder="ex: myname@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">example@example.com</p>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Address <span className="text-red-500">*</span>
            </label>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={HandleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <label className="block text-xs text-gray-500 mt-1">Street Address</label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={HandleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <label className="block text-xs text-gray-500 mt-1">City</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={HandleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <label className="block text-xs text-gray-500 mt-1">State / Province</label>
                </div>
              </div>
            </div>
          </div>

          {/* How were you referred to us? */}
          <div className='flex flex-col md:flex-row gap-64'>
             
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Virtual Assistant <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
              {['Calender Management', 'Email Handling', 'Customer Support', 'Data Entry ', 'Transcription', 'Travel Planning & Bookings', 'Document Preparation (Word, PDF)'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    value={option}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Video Editor <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
              {['Video Editing', 'Color Work', 'Audio Post-Production', 'Visual Effects ', 'Motion Graphics & Titles', 'Subtitles & Captioning', 'Document Preparation'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    value={option}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
          </div>

          {/* Resume and Files Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Resume and Files</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">Upload a Photo</p>
              <p className="text-sm text-gray-500 mb-4">Drag and drop files here</p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Choose Files
              </label>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium text-gray-700 mb-2">Uploaded files:</p>
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

          {/* Motivation Letter */}
          <div>
            <label htmlFor="motivationLetter" className="block text-sm font-medium text-gray-700 mb-2">
              Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              id="motivationLetter"
              name="motivationLetter"
              value={formData.motivationLetter}
              onChange={HandleInputChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              placeholder="Please tell us why you're interested in this position and what makes you a good fit..."
              required
            />
          </div>

          {/* Training and Certifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Training and Certifications</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="trainingTitle"
                  value={formData.trainingTitle}
                  onChange={HandleInputChange}
                  placeholder="Title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <input
                  type="date"
                  name="trainingDate"
                  value={formData.trainingDate}
                  onChange={HandleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
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
    )
}

export default SmartCvForm;
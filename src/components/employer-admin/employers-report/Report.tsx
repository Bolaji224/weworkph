import React, { useState } from "react";
import axios from "axios";
import {
  AlertCircle,
  CheckCircle,
  Upload,
  X,
  FileText,
  User,
  Briefcase,
} from "lucide-react";

type FormDataType = {
  fullName: string;
  email: string;
  phone: string;
  disputeCategory: string;
  subject: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  attachments: File[];
};

const DisputeResolutions: React.FC = () => {
  const [userType, setUserType] = useState<"candidate" | "employer">("candidate");
  const [formData, setFormData] = useState<FormDataType>({
    fullName: "",
    email: "",
    phone: "",
    disputeCategory: "",
    subject: "",
    description: "",
    priority: "medium",
    attachments: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const disputeCategories: Record<"candidate" | "employer", string[]> = {
    candidate: [
      "Payment Issues",
      "Contract Violation",
      "Workplace Harassment",
      "Unfair Termination",
      "Benefits Dispute",
      "Other",
    ],
    employer: [
      "Contract Breach",
      "Performance Issues",
      "Misconduct",
      "Attendance Problems",
      "Background Check Discrepancy",
      "Other",
    ],
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, attachments: [...prev.attachments, ...files] }));
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.disputeCategory) newErrors.disputeCategory = "Please select a category";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    else if (formData.description.trim().length < 50)
      newErrors.description = "Please provide at least 50 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("user_type", userType);
      payload.append("full_name", formData.fullName);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append("dispute_category", formData.disputeCategory);
      payload.append("subject", formData.subject);
      payload.append("description", formData.description);
      payload.append("priority", formData.priority);
      formData.attachments.forEach((file) => payload.append("attachments[]", file));

    

   const response = await axios.post(
  `${process.env.REACT_APP_API_URL}/v1/dispute/submit`,
  payload,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);


      console.log("Dispute submitted:", response.data);
      setSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        disputeCategory: "",
        subject: "",
        description: "",
        priority: "medium",
        attachments: [],
      });
    } catch (err: any) {
      console.error("Submission error:", err.response?.data || err.message);
      alert(err.response?.data?.message || err.message || "Failed to submit dispute");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="bg-white border shadow-lg rounded-2xl p-12 text-center">
          <CheckCircle size={48} className="mx-auto text-green-600 mb-4" />
          <h2 className="text-2xl font-bold">Dispute Submitted Successfully</h2>
          <p className="text-gray-600 mt-2">
            Our team will contact you within 24–48 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
      <div className="p-8 min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-12 animate-fade-in">
            <div className="w-16 h-1 bg-green-600 mx-auto rounded mb-4"></div>
            <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-2">Dispute Resolution Center</h1>
            <p className="text-gray-500 text-lg">Professional mediation for workplace conflicts and contractual disputes</p>
          </header>
  
          {/* User Type Selector */}
          <div className="flex gap-4 mb-8 flex-wrap">
            <button
              className={`flex-1 flex items-center justify-center gap-2 p-5 border rounded-xl text-gray-600 font-semibold transition ${
                userType === "candidate" ? "bg-green-600 text-white shadow-lg border-green-600" : "bg-white border-gray-200 hover:border-green-600 hover:shadow-md"
              }`}
              onClick={() => { setUserType("candidate"); setFormData(prev => ({ ...prev, disputeCategory: "" })); }}
            >
              <User size={20} /> I'm a Candidate
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 p-5 border rounded-xl text-gray-600 font-semibold transition ${
                userType === "employer" ? "bg-green-600 text-white shadow-lg border-green-600" : "bg-white border-gray-200 hover:border-green-600 hover:shadow-md"
              }`}
              onClick={() => { setUserType("employer"); setFormData(prev => ({ ...prev, disputeCategory: "" })); }}
            >
              <Briefcase size={20} /> I'm an Employer
            </button>
          </div>
  
          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="border-b border-gray-100 pb-6 mb-6">
              <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-1">Submit Your Dispute</h2>
              <p className="text-gray-500 text-sm">All information is confidential and will be reviewed by our admin team</p>
            </div>
  
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange}
                    className={`w-full border rounded-lg p-3 ${errors.fullName ? "border-red-500" : "border-gray-300"}`} placeholder="Enter your full name" />
                  {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName}</span>}
                </div>
  
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                    className={`w-full border rounded-lg p-3 ${errors.email ? "border-red-500" : "border-gray-300"}`} placeholder="your.email@example.com" />
                  {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                </div>
  
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Phone *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                    className={`w-full border rounded-lg p-3 ${errors.phone ? "border-red-500" : "border-gray-300"}`} placeholder="+1 (555) 000-0000" />
                  {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
                </div>
  
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Dispute Category *</label>
                  <select name="disputeCategory" value={formData.disputeCategory} onChange={handleInputChange}
                    className={`w-full border rounded-lg p-3 ${errors.disputeCategory ? "border-red-500" : "border-gray-300"}`}>
                    <option value="">Select a category</option>
                    {disputeCategories[userType].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  {errors.disputeCategory && <span className="text-red-500 text-sm">{errors.disputeCategory}</span>}
                </div>
              </div>
  
              {/* Priority */}
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Priority Level</label>
                <div className="flex gap-3 flex-wrap">
                  {["low","medium","high","urgent"].map(level => (
                    <label key={level} className="flex-1 cursor-pointer">
                      <input type="radio" name="priority" value={level} checked={formData.priority === level} onChange={handleInputChange} className="hidden" />
                      <span className={`block text-center py-2 rounded-lg border font-semibold ${formData.priority === level ? `bg-${level==="low"?"green":"medium"===level?"blue":"high"===level?"yellow":"red"}-500 text-white border-transparent` : "border-gray-300"}`}>
                        {level.charAt(0).toUpperCase()+level.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
  
              {/* Subject */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Subject *</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleInputChange}
                  className={`w-full border rounded-lg p-3 ${errors.subject ? "border-red-500" : "border-gray-300"}`} placeholder="Brief summary of your dispute" />
                {errors.subject && <span className="text-red-500 text-sm">{errors.subject}</span>}
              </div>
  
              {/* Description */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Detailed Description *</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={5}
                  className={`w-full border rounded-lg p-3 ${errors.description ? "border-red-500" : "border-gray-300"}`} placeholder="Provide detailed description (50+ chars)" />
                <div className="text-right text-gray-400 text-sm">{formData.description.length} characters</div>
                {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
              </div>
  
              {/* File Upload */}
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Supporting Documents</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 hover:bg-green-50 transition cursor-pointer">
                  <input type="file" multiple onChange={handleFileUpload} className="hidden" id="fileUpload" />
                  <label htmlFor="fileUpload" className="inline-flex items-center gap-2 cursor-pointer text-green-600 font-semibold">
                    <Upload size={20} /> Upload Files
                  </label>
                  <p className="text-gray-400 text-sm mt-1">PDF, DOC, DOCX, JPG, PNG</p>
                </div>
                {formData.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.attachments.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-100 rounded p-2 text-sm">
                        <span className="flex items-center gap-1"><FileText size={16} /> {file.name}</span>
                        <button type="button" onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700"><X size={16} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
  
              {/* Info Box */}
              <div className="flex gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-800 text-sm">
                <AlertCircle size={18} /> By submitting this dispute, you confirm all info is accurate. False reports may result in account suspension.
              </div>
  
              {/* Submit */}
               <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold"
          >
            {isSubmitting ? "Submitting..." : "Submit Dispute"}
          </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

export default DisputeResolutions;

import React, { useState } from "react";
import { 
  Users, 
  Crown, 
  Star, 
  Briefcase, 
  CheckCircle, 
  Zap, 
  Target, 
  Award,
  Heart,
  ArrowRight,
  UserCheck,
  Building
} from "lucide-react";

const OurUsersSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'freelancers' | 'clients'>('freelancers');

  const freelancerTypes = [
    {
      id: 1,
      title: "Ordinary Users",
      subtitle: "Start Your Journey",
      description: "Anyone can join as an ordinary freelancer. Create a profile, get a Smart CV, and showcase skills. Eligible for jobs posted on the platform and can apply for SkillStamp verification to boost credibility.",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      features: [
        "Create professional profile",
        "Access to Smart CV builder",
        "Apply for platform jobs",
        "SkillStamp verification eligible"
      ],
      badge: "Free to Join"
    },
    {
      id: 2,
      title: "SmartStart Users",
      subtitle: "Verified & Supported",
      description: "Freelancers verified through our SmartStart onboarding. Gain access to curated job opportunities, higher visibility to clients, and comprehensive support with guides, toolkits, and mentorship.",
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      features: [
        "Verified through SmartStart",
        "Curated job opportunities",
        "Higher client visibility",
        "Guides & mentorship support"
      ],
      badge: "Verified"
    },
    {
      id: 3,
      title: "Pro Talent Pool",
      subtitle: "Elite Freelancers",
      description: "Carefully selected freelancers representing our in-house brand standard. Direct AI matching with clients, priority access to premium projects, and top-tier opportunities through SmartStart service.",
      icon: Crown,
      color: "from-purple-500 to-purple-600",
      features: [
        "In-house brand standard",
        "AI-powered direct matching",
        "Premium project priority",
        "Elite talent recognition"
      ],
      badge: "Pro Level"
    }
  ];

  const clientTypes = [
    {
      id: 1,
      title: "Ordinary Clients",
      subtitle: "Post & Hire",
      description: "Post jobs on the platform and select from freelancers in the open marketplace. Option to upgrade job posts to Featured Listings for increased visibility and faster responses.",
      icon: Briefcase,
      color: "from-blue-500 to-blue-600",
      features: [
        "Post jobs publicly",
        "Access open marketplace",
        "Featured listing upgrades",
        "Direct freelancer selection"
      ],
      badge: "Basic Plan"
    },
    {
      id: 2,
      title: "SmartStart Clients",
      subtitle: "Curated Matching",
      description: "Businesses seeking verified freelancers only. Fill out a SmartStart™ request form and receive a curated shortlist of pre-vetted freelancers. Saves time, reduces hiring risks, and ensures project quality.",
      icon: Target,
      color: "from-green-500 to-green-600",
      features: [
        "Verified freelancers only",
        "Curated shortlist service",
        "Reduced hiring risks",
        "Quality guarantee"
      ],
      badge: "Premium"
    },
    {
      id: 3,
      title: "Impact Clients",
      subtitle: "Social Impact",
      description: "Clients who sponsor freelancers under our Sponsor-a-Freelancer model. Gain social recognition while accessing motivated, trained freelancers committed to delivering exceptional results.",
      icon: Heart,
      color: "from-pink-500 to-pink-600",
      features: [
        "Sponsor-a-Freelancer model",
        "Social impact recognition",
        "Motivated freelancers",
        "Community contribution"
      ],
      badge: "Impact"
    }
  ];

  const currentData = activeTab === 'freelancers' ? freelancerTypes : clientTypes;

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-50 py-12 lg:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
              Our Users
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 font-medium max-w-4xl mx-auto">
            WeWorkPerHour is built for two main groups of users — Freelancers (supply side) and Clients (demand side).
          </p>

          {/* Tab Switcher */}
          <div className="inline-flex bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
            <button
              onClick={() => setActiveTab('freelancers')}
              className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                activeTab === 'freelancers'
                  ? 'bg-[#ee009d] text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <UserCheck size={20} />
              For Freelancers
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                activeTab === 'clients'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Building size={20} />
              For Clients
            </button>
          </div>
        </div>

        {/* User Types Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {currentData.map((userType, index) => {
            const IconComponent = userType.icon;
            
            return (
              <div
                key={userType.id}
                className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-3 relative overflow-hidden group"
              >
                {/* Decorative Elements */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${userType.color} opacity-10 rounded-full group-hover:scale-110 transition-transform duration-500`}></div>
                <div className={`absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-tr ${userType.color} opacity-5 rounded-full group-hover:scale-110 transition-transform duration-500`}></div>

                {/* Badge */}
                <div className={`inline-block bg-gradient-to-r ${userType.color} text-white text-xs font-bold px-4 py-2 rounded-full mb-6`}>
                  {userType.badge}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${userType.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent size={28} />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {userType.title}
                </h3>
                <p className="text-lg font-medium text-gray-600 mb-4">
                  {userType.subtitle}
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {userType.description}
                </p>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  {userType.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-5 h-5 bg-gradient-to-r ${userType.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <CheckCircle size={12} className="text-white" />
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className={`w-full bg-gradient-to-r ${userType.color} text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2`}>
                  Get Started
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Platform Benefits */}
        <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-100 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-4 mx-auto">
                <Zap size={24} />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Fast Matching</h4>
              <p className="text-gray-600 text-sm">AI-powered matching connects you with the right talent in 48 hours or less.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white mb-4 mx-auto">
                <Award size={24} />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Quality Assured</h4>
              <p className="text-gray-600 text-sm">All freelancers go through our verification process and skill assessment.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-4 mx-auto">
                <Heart size={24} />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Community Focused</h4>
              <p className="text-gray-600 text-sm">More than a platform - we're building a supportive freelancing ecosystem.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurUsersSection;
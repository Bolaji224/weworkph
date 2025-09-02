import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Shield, 
  Rocket, 
  MapPin, 
  Zap, 
  CreditCard, 
  Globe, 
  Heart,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const InnovationSuite = () => {
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateCards(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const innovations = [
    {
      icon: FileText,
      title: 'SmartCV',
      description: 'A next-generation portfolio and CV builder for freelancers to stand out.',
      gradient: 'from-green-400 to-green-600',
      delay: '0ms'
    },
    {
      icon: Shield,
      title: 'SkillStamp',
      description: 'A trusted verification badge validating freelancer expertise.',
      gradient: 'from-pink-400 to-pink-600',
      delay: '100ms'
    },
    {
      icon: Rocket,
      title: 'SmartStart',
      description: 'Guided onboarding for clients and freelancers.',
      gradient: 'from-green-400 to-pink-500',
      delay: '200ms'
    },
    {
      icon: MapPin,
      title: 'SmartGuide',
      description: 'Personalized career and business guidance, offering freelancers and clients actionable insights to grow faster.',
      gradient: 'from-pink-400 to-green-500',
      delay: '300ms'
    },
    {
      icon: Zap,
      title: 'AI Matching',
      description: 'Intelligent pairing of talent with the right jobs.',
      gradient: 'from-green-500 to-pink-400',
      delay: '400ms'
    },
    {
      icon: CreditCard,
      title: 'ProofToPay',
      description: 'Escrow-backed payments ensuring fairness and security.',
      gradient: 'from-pink-500 to-green-400',
      delay: '500ms'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-lg mb-6">
            <Sparkles className="w-5 h-5" style={{color: '#2AA100'}} />
            <span className="text-sm font-medium text-gray-600">Innovation Suite</span>
            <Sparkles className="w-5 h-5" style={{color: '#ee009d'}} />
          </div>
          
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 to-pink-600 bg-clip-text text-transparent">
              Our Innovation Suite
            </span>
          </h1>
          
          <div className="w-24 h-1 mx-auto mb-8 rounded-full bg-gradient-to-r" 
               style={{background: `linear-gradient(to right, #2AA100, #ee009d)`}}>
          </div>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Empowering the future of work with cutting-edge tools and intelligent solutions
          </p>
        </div>

        {/* Innovation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {innovations.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.title}
                className={`group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform transition-all duration-700 hover:-translate-y-2 hover:scale-105 ${
                  animateCards ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{
                  transitionDelay: animateCards ? item.delay : '0ms',
                  animationDelay: item.delay
                }}
              >
                {/* Gradient Background Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Icon Container */}
                <div className="relative mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 shadow-lg`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Floating particles effect */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                       style={{backgroundColor: '#2AA100'}}></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" 
                       style={{backgroundColor: '#ee009d'}}></div>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-500">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {item.description}
                </p>

                {/* Hover Arrow */}
                <div className="flex items-center mt-4 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                  <span className="text-sm font-medium bg-gradient-to-r from-green-600 to-pink-600 bg-clip-text text-transparent">
                    Learn more
                  </span>
                  <ArrowRight className="w-4 h-4 ml-2 text-pink-500" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Impact Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
            <Globe className="w-full h-full" style={{color: '#2AA100'}} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-8 h-8" style={{color: '#2AA100'}} />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-pink-600 bg-clip-text text-transparent">
                Global Impact & Inclusivity
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  <strong>Anchored in the UK but global in scope</strong>, WeWorkPerHour champions inclusivity—supporting UK-based professionals, showcasing Africa's rising talent, and enabling international collaboration.
                </p>
                
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-pink-50 rounded-xl">
                  <Heart className="w-6 h-6" style={{color: '#ee009d'}} />
                  <p className="text-gray-700">
                    Through our <strong>Sponsor-a-Freelancer initiative</strong>, we drive social impact by helping emerging professionals upskill and access global opportunities.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-green-100 to-pink-100 rounded-2xl p-8 text-center">
                  <div className="flex justify-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: '#2AA100'}}>
                      <span className="text-white font-bold">UK</span>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: '#ee009d'}}>
                      <span className="text-white font-bold">AF</span>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-pink-500 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-600">Connecting talent worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InnovationSuite;
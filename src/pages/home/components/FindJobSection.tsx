import React from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Rocket,
  GraduationCap,
  Bot,
  ShieldCheck,
  Globe2
} from 'lucide-react';

export default function FindJobSection() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
  };

  const stagger = {
    show: {
      transition: {
        staggerChildren: 0.25
      }
    }
  };

  const features = [
    {
      title: 'SkillStamp™',
      desc: 'Get premium-skills certification bonus for in-house team',
      icon: <Star size={28} color="white" />
    },
    {
      title: 'SmartStart',
      desc: 'Program guiding hands-on progress for early freelancers',
      icon: <Rocket size={28} color="white" />
    },
    {
      title: 'SmartGuide',
      desc: 'Graduate guide to support upward career movement',
      icon: <GraduationCap size={28} color="white" />
    },
    {
      title: 'AI Matching',
      desc: 'AI-powered project matching and user retention tools',
      icon: <Bot size={28} color="white" />
    },
    {
      title: 'Escrow & Bidding',
      desc: 'Built-in escrow and competitive bidding for secure deals',
      icon: <ShieldCheck size={28} color="white" />
    },
    {
      title: 'Social Impact Angle',
      desc: 'Inclusive design empowering underrepresented regions',
      icon: <Globe2 size={28} color="white" />
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.3 }}
          variants={fadeUp}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Why Choose WeWorkPerHour
          </h2>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.3 }}
          variants={stagger}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="bg-[#E8EBEE] rounded-2xl p-6 lg:p-10 shadow-md transition-all duration-500 ease-out
                         hover:shadow-2xl hover:scale-[1.06] hover:-translate-y-1 hover:bg-[#f3f5f8]"
            >
              <div className="bg-[#1E2A3B] p-4 rounded-full inline-block text-white mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-3 text-gray-600 text-sm lg:text-base">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-24"
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.3 }}
          variants={fadeUp}
        >
          <div className="bg-[#1E2A3B] rounded-3xl p-8 lg:p-12 text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-lg lg:text-xl mb-6 opacity-90 max-w-2xl mx-auto">
              Join thousands of professionals who trust WeWorkPerHour for their freelancing success.
            </p>
            <motion.button
              whileHover={{ scale: 1.08 }}
              className="bg-white text-[#1E2A3B] px-8 py-3 rounded-full font-semibold text-base lg:text-lg transition duration-300"
            >
              Start Your Journey
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

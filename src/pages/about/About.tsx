import React from 'react'
import AboutHeroSection from './components/AboutHeroSection'
import RecruitPionerSection from './components/RecruitPionerSection'
import WhatTheySayingSection from '../company/components/WhatTheySayingSection'
import FooterSection from '../../components/reusable/FooterSection'
import InnovationSuite from './components/Innovations'

const About: React.FC = () => {
  return (
    <>
    <AboutHeroSection />
    <RecruitPionerSection />
    <WhatTheySayingSection />
    <InnovationSuite/>
    <FooterSection />
    </>
  )
}

export default About
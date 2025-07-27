import React, { FC, useState, useEffect } from 'react';
import Images from '../../../components/constant/Images';
import { Link } from 'react-router-dom';

interface SlideData {
  image: string;
  title: string;
  content: string;
  buttonText: string;
}

const slidesData: SlideData[] = [
  {
    image: Images.SliderOneImage,
    title: "Unlock Opportunities in Freelance Work",
    content: "Hire Virtual Assistants and Editors by the Hour",
    buttonText: "Get Started"
  },
  {
    image: Images.SliderOneImage,
    title: "Explore Exciting Opportunities!",
    content: "Welcome to our job employment platform! Discover a world of career possibilities tailored to your skills and ambitions. Let's find your dream job together.",
    buttonText: "Get Started"
  },
  {
    image: Images.SliderTwoImage,
    title: "Discover Your Ideal Career Match",
    content: "We believe that every individual has a unique set of talents and aspirations. Our platform matches you with the perfect job opportunity that aligns with your skills, interests, and career goals.",
    buttonText: "Search Jobs Now"
  },
  {
    image: Images.SliderThreeImage,
    title: "Join Our Thriving Community",
    content: "Join a vibrant community of job seekers, industry professionals, and career experts. Share insights, network with peers, and stay inspired on your journey towards professional growth and success.",
    buttonText: "Join Now"
  },
  {
    image: Images.SliderFourImage,
    title: "Your Journey Begins Here",
    content: "Take the first step towards a rewarding career. Whether you're a recent graduate, a seasoned professional, or exploring new opportunities, our platform has everything you need to embark on your next adventure.",
    buttonText: "Get Started Now"
  },
  {
    image: Images.SliderFiveImage,
    title: "Stay Ahead in Your Career Journey",
    content: "Access a wealth of career resources, including resume tips, interview guidance, and professional development advice. Stay informed and empowered as you navigate through your career path.",
    buttonText: "Explore Resources"
  },
];

const HeroSlider: FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const currentContent = slidesData[currentSlide].content;
    let currentIndex = 0;
    
    setDisplayedContent('');
    setIsTyping(true);
    setShowButton(false);

    const typingInterval = setInterval(() => {
      if (currentIndex < currentContent.length) {
        setDisplayedContent(currentContent.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        setShowButton(true);
        
        // Wait 3 seconds after typing completes, then move to next slide
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % slidesData.length);
        }, 3000);
      }
    }, 50); // Typing speed: 50ms per character

    return () => clearInterval(typingInterval);
  }, [currentSlide]);

  return (
    <div className='bg-white w-full py-4 mt-32 lg:mt-24 overflow-hidden'>
      <section className='flex items-center justify-center mt-[2rem] px-4 lg:px-8'>
        <div className='relative lg:max-h-[900px] flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-24 lg:gap-20 xl:gap-16 w-full mx-auto lg:mx-24'>
          
          {/* Text Content */}
          <div className="text-white slide-item lg:relative w-full lg:w-[50%] order-2 lg:order-1">
            {/* Static Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-[#1E2A38] mb-4 lg:mb-6 leading-tight text-center lg:text-left">
              {slidesData[currentSlide].title}
            </h1>
            
            {/* Animated Content */}
            <div className="min-h-[120px] sm:min-h-[100px] lg:min-h-[140px]">
              <p className='text-sm sm:text-base lg:text-lg text-gray-600 mb-6 lg:mb-8 leading-relaxed text-center lg:text-left max-w-lg mx-auto lg:mx-0'>
                {displayedContent}
                {isTyping && (
                  <span className="inline-block w-[3px] h-[1.2em] bg-gray-600 ml-1 animate-pulse"></span>
                )}
              </p>
            </div>
            
            {/* Button with fade-in animation */}
            <div className={`py-[1rem] text-center lg:text-left transition-opacity duration-500 ${showButton ? 'opacity-100' : 'opacity-0'}`}>
              <Link to="/register">
                <button className="font-sans text-center text-[14px] sm:text-[16px] font-medium text-[#FFFFFF] bg-[#EE009D] hover:bg-[#2AA100] transition-colors duration-300 py-[6px] px-[10px] sm:py-[8px] sm:px-[12px] rounded-[5px] transform hover:scale-105">
                  {slidesData[currentSlide].buttonText}
                </button>
              </Link>
            </div>

            {/* Slide indicators */}
            <div className="flex justify-center lg:justify-start space-x-2 mt-4">
              {slidesData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-[#EE009D] scale-110' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Image */}
          <div className='w-full sm:w-[80%] lg:w-[50%] order-1 lg:order-2 flex justify-center lg:justify-end'>
            <img 
              src={Images.HeroImg} 
              alt={`slide-${currentSlide}`} 
              className='w-[70%] h-[100%] sm:h-[300px] lg:h-[100%] rounded-[5px] object-cover transition-opacity duration-500' 
            />
          </div>
          
        </div>
      </section>
    </div>
  );
};

export default HeroSlider;
import React, { FC } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
  // Add more slides as needed
];

const HeroSlider: FC = () => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000, // Adjust the autoplay speed
    speed: 2000, // Adjust the transition speed
    fade: true, // Use fade effect
    cssEase: 'linear', // Use linear easing for fade effect
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className='bg-[#ffffff] w-full mx-auto py-[1rem] mt-[4rem]'>
      <Slider {...settings}>
        {slidesData.map((slide, index) => (
          <section key={index} className='flex items-center justify-center mt-[2rem] px-[4.5rem]'>
            <div className='relative lg:max-h-[900px] flex items-center justify-center gap-[8rem] ' >
              <div className="text-white slide-item lg:relative absolute w-[50%]">
                <h1 className="font-sans lg:text-[48px] md:text-[38px] text-[20px] text-[#2AA100] font-bold">{slide.title}</h1>
                <p className='text-md text-[#646A73] tracking-[0.5px] font-sans font-normal'>{slide.content}</p>
               <div className='py-[1rem]'>
               <Link to="/register">
                  <button className="font-sans text-center text-[16px] font-medium text-[#FFFFFF] bg-[#EE009D] hover:bg-[#2AA100] py-[6px] px-[10px] rounded-[5px]">{slide.buttonText}</button>
                </Link>
               </div>
              </div>
              <div className='w-[50%]'>
              <img src={slide.image} alt={`slide-${index}`} className='w-[100%] h-[100%] rounded-[5px]' />
              </div>
            </div>
          </section>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSlider;

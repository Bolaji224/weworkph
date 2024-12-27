import React from 'react';
import { IoStatsChartSharp } from "react-icons/io5";
import { FaArrowRightLong } from "react-icons/fa6";
import Images from '../../../components/constant/Images';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const SimpleProcessSection: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.4,
  });

  return (
    <section className='py-[4rem] bg-[#f5f5f5] w-full'>
      <div className='text-center' ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : -50 }}
          transition={{ duration: 1 }}
        >
          <div className='flex items-center justify-center'>
            <p className='text-[#2AA100] flex justify-center text-center items-center gap-2 py-[0.5rem] px-[0.5rem] w-[100px] rounded-[5px] bg-[#D1FFBD]'>
              <IoStatsChartSharp />Started
            </p>
          </div>
          <h1 className='lg:text-[38px] md:text-[28px] text-[20px] mt-[0.5rem] font-sans font-semibold tracking-[1px]'>
            The fast and <span className='text-[#EE009D]'>simple process.</span>
          </h1>
          <p className='lg:text-[14px] md:text-[16px] text-[10px] text-[#646A73] font-sans font-normal mt-[0.5rem]'>
            Weworkperhour carries the theme of technology in <br /> helping you find a Job with an easy and fast process.
          </p>
        </motion.div>
      </div>
      <section className='py-8 sm:py-[8rem] px-[4rem]'>
        <div className='grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 sm:gap-[4rem] gap-[4rem] md:gap-[4rem]'>
          {[
            { img: Images.RegisterImage, title: 'Registration', desc: 'Build your reputation by creating a professional resume' },
            { img: Images.ApplyImage, title: 'Apply for Job', desc: 'Find your dream job and send a resume according to your field.' },
            { img: Images.InterviewImage, title: 'Interview', desc: 'Point out your skills and strengths at the interview.' },
            { img: Images.CongratulationImage, title: 'Congratulations', desc: 'You have completed step by step; it is time for an employment contract.' }
          ].map((item, index) => (
            <motion.div
              key={index}
              className='text-center'
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : -50 }}
              transition={{ duration: 1.5, delay: index * 0.1 }}
            >
              <div className='mx-auto max-w-[150px]'>
                <img src={item.img} alt={item.title.toLowerCase()} className='w-full h-auto object-cover' />
              </div>
              <div className='w-full'>
                <h1 className='text-lg md:text-xl lg:text-2xl mt-2 font-semibold tracking-wide'>{item.title}</h1>
                <p className='text-sm md:text-base text-gray-600 mt-1'>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className='pt-[4rem] text-center flex items-center justify-center'>
          <Link to="/register">
            <motion.button
              className="text-sm sm:text-base font-medium text-white bg-[#ee009d] flex items-center gap-4 justify-center hover:bg-green-600 py-2 px-4 sm:py-3 sm:px-6 rounded-lg"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : -50 }}
              transition={{ duration: 1 }}
            >
              Get Started <FaArrowRightLong />
            </motion.button>
            </Link>
        </div>
      </section>
    </section>
  );
};

export default SimpleProcessSection;
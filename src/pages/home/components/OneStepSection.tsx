import React from "react";
import { FaArrowRightLong, FaUsersViewfinder } from "react-icons/fa6";
import Images from "../../../components/constant/Images";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const OneStepSection: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: false, // Animation triggers every time the element is in view
    threshold: 0.1, // Trigger animation when 10% of the element is in view
  });

  return (
    <section className="py-[4rem]">
      <section className="lg:flex items-center justify-center gap-[4rem] lg:px-[4rem] px-[2rem]" ref={ref}>
        <motion.div
          className="lg:w-[50%]"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : -50 }}
          transition={{ duration: 1}}
        >
          <img src={Images.OneStepImage} alt="onestep" className="rounded-[5px]"/>
        </motion.div>
        <motion.div
          className="lg:w-[50%] py-[rem]"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : -50 }}
          transition={{ duration: 1}}
        >
          <p className="bg-[#D1FFBD] flex items-center font-sans font-medium text-[#2aa100] gap-2 w-[110px] text-center px-[0.5rem] py-[0.5rem] rounded-[5px] ">
            <FaUsersViewfinder />Find Jobs
          </p>
          <h1 className="lg:text-[38px] md:text-[28px] text-[20px] mt-[1rem] font-sans font-semibold tracking-[1px]">
            One easy step to <br />
            change <span className="text-[#ee009d]">your future.</span>
          </h1>
          <p className="lg:text-[14px] md:text-[14px] lg:w-[85%] text-[10px] text-[#646A73] font-sans tracking-[0.5px] font-normal mt-[1rem]">
            Take the first step towards a rewarding career. Whether you're a
            recent graduate, a seasoned professional, or exploring new
            opportunities, our platform has everything you need to embark on your
            next adventure.
          </p>
          <div className="py-[1rem]">
            <Link to="/career-tips">
              <button className="font-sans text-[14px] font-medium text-[#FFFFFF] bg-[#EE009D] hover:bg-[#2AA100] py-[8px] px-[10px] rounded-[5px] flex items-center justify-center gap-[0.5rem]">
                Learn more <FaArrowRightLong />
              </button>
            </Link>
          </div>
        </motion.div>
        </section>
        </section>
  );
};

export default OneStepSection;

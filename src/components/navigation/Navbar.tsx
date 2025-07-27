import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { LiaTimesSolid } from "react-icons/lia";
import { HiOutlineBars3BottomRight } from "react-icons/hi2";
import { IoMdArrowDropdown } from "react-icons/io"; // Import dropdown icon
import "./Navbar.css";
import Images from "../constant/Images";
import ls from "localstorage-slim";

interface NavLink {
  label: string;
  path: string;
  subMenu?: { label: string; path: string }[];
}

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState ("")
  const [role, setRole] = useState ("")
  const activeToken = sessionStorage.getItem("wwph_token")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    let u: any = ls.get("wwph_usr", { decrypt: true });
    if (u) setRole(u.role);

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigationLinks: NavLink[] = useMemo(
    () => [
      { label: "Home", path: "/" },
      { label: "About Us", path: "about" },
      { label: "SkillStamp", path: "company" },
      { label: "SmartGuide", path: "find-job" },
      { label: "SmrtStart", path: "career-tips" },
      {
        label: "Courses",
        path: "#", // No direct path for the main dropdown label
        subMenu: [
          { label: "Free Courses", path: "free-courses" },
          { label: "Paid Courses", path: "paid-courses" },
        ],
      },
      { label: "Log in", path: "login" },
    ],
    []
  );

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleClick = (path: string) => {
    setActiveLink(path);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false); // Close the dropdown when an item is clicked
  };

  return (
    <div className={isScrolled ? "navbar-wrapper shadow-lg" : "navbar-wrapper"}>
      <div className="navbar-container">
        <Link to="/" className="logo">
          <img src={Images.Logo} alt="logo" className="w-[150px] h-[40px]" />
        </Link>
        <div className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? (
            <LiaTimesSolid size={34} color=" #008000" className="icon" />
          ) : (
            <HiOutlineBars3BottomRight size={34} color="#FF00FF" className="icon" />
          )}
        </div>
        <nav className={`navbar-menu ${isMenuOpen ? "open" : ""} font-sans text-[14px] font-medium`}>
          {navigationLinks.map((link) => {
            if (link.path === "login" && activeToken) {
              return null;
            }

            if (link.subMenu) {
              return (
                <div
                  key={link.label}
                  className="dropdown"
                  onMouseEnter={toggleDropdown}
                  onMouseLeave={toggleDropdown}
                >
                  <button className="menu-link flex items-center" onClick={toggleDropdown}>
                    {link.label}
                    {/* Add rotation class based on the dropdown state */}
                    <IoMdArrowDropdown color="#2AA100" className={`ml-1 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : "rotate-0"}`} />
                  </button>
                  {isDropdownOpen && (
                    <div className="dropdown-menu column-layout">
                      {link.subMenu.map((subLink) => (
                        <Link
                          key={subLink.path}
                          to={subLink.path}
                          className="dropdown-link"
                          onClick={() => {
                            closeDropdown(); // Close the dropdown after click
                            toggleMenu(); // Close the whole menu if needed
                            handleClick(subLink.path);
                          }}
                        >
                          {subLink.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`menu-link ${activeLink === link.path ? "active" : ""}`}
                onClick={() => {
                  toggleMenu();
                  handleClick(link.path);
                }}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 p-[6px]">
            {activeToken ? (

              // <Link to={role === "Company" ? "/employers-dashboard" : "/candidate-dashboard"}>

              <Link to={role === "Company" ? "/employers-dashboard" : ( role === "admin" ? "/admin/admin-jobs" : "/candidate-dashboard")}>

                <button className="font-sans mr-2 text-[14px] font-medium text-[#000000] border-2 border-[#2AA100] hover:text-[#EE009D] py-[4px] px-[10px] rounded-[5px] ease-in duration-300">
                  My Account
                </button>
              </Link>
            ) : (
              <Link to="register" onClick={toggleMenu}>
                <button className="font-sans mr-2 text-[14px] font-medium text-[#000000] border-2 border-[#2AA100] hover:text-[#EE009D] py-[4px] px-[10px] rounded-[5px] ease-in duration-300">
                  Sign Up
                </button>
              </Link>
            )
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;

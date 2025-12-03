import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Import Components
import Navbar from "./components/navigation/Navbar";
import ScrollToTop from "./components/constant/ScrollToTop";
import Loader from "./components/reusable/loader/loader";


// Pages
import { Home } from "./pages/home/Home";
import Company from "./pages/company/Company";
import FindJob from "./pages/findJob/SmartStartPage";
import CareerTips from "./pages/careerTips/CareerTips";
import LearnMoreSection from "./pages/careerTips/components/LearnMoreSection";
import About from "./pages/about/About";
import LoginForm from "./components/registration/LoginForm";
import RegisterForm from "./components/registration/RegisterForm";
import JobDataPage from "./pages/findJob/job-details/JobDataPage";
import ForgotPassword from "./components/registration/ForgetPass";
import AccountVerification from "./components/registration/Verification";
import PasswordVerificationCode from "./components/registration/PasswordVerificationCode";

// Candidate/Admin Components
import AdminLayout from "./components/candidate-admin/AdminLayout";
import CandidateDashboard from "./components/candidate-admin/CandidateDashboard";
import ProfileDetails from "./components/candidate-admin/ProfileDetails";
import ResumeSection from "./components/candidate-admin/smartstart/ResumeSection";
import Message from "./components/candidate-admin/message/Message";
import JobAlert from "./components/candidate-admin/job-alert/JobAlert";
import SavedJobs from "./components/candidate-admin/saved-job/SavedJobs";
import AccountSettings from "./components/candidate-admin/account-settings/AccountSettings";
import DeletePage from "./components/candidate-admin/delete-account/DeletePage";
import QuizPage from "./components/candidate-admin/quizpage/Quizpage"; 
import AppliedJobs from "./components/candidate-admin/applied-job/AppliedJobs";
import SubscriptionPlan from "./components/candidate-admin/subscription-plan/SubscriptionPlan";
import CandidateWallet from "./components/candidate-admin/candidate-payment-account/CandidteWallet";
import LogoutPage from "./components/candidate-admin/logout/LogoutPage";

// Employers/Admin Components
import EmployersLayout from "./components/employer-admin/EmployersLayout";
import EmployersDashboard from "./components/employer-admin/dashboard/EmployersDashboard";
import EmployerProfile from "./components/employer-admin/profile/EmployerProfile";
import MyJobs from "./components/employer-admin/my-jobs/MyJobs";
import EmployersMessage from "./components/employer-admin/message/EmployersMessage";
import SubmitJobs from "./components/employer-admin/submit-job/SubmitJobs";
import SavedCandidate from "./components/employer-admin/saved-candidate/SavedCandidate";
import EmployersAccountSettings from "./components/employer-admin/account-settings/EmplyersAccountSetting";
import EmployersDeleteAccount from "./components/employer-admin/delete-account/EmployersDeleteAccount";
import EmployersWallet from "./components/employer-admin/employers-payment-account/EmployersWallet";
import EmployersLogoutPage from "./components/employer-admin/employers-logout/EmployersLogoutPage";
import AllApplicates from "./components/employer-admin/all-applicates/AllApplicates";
import JobDetailsPage from "./components/employer-admin/my-jobs/ApplicateJob/ApplicateJobsPage";

// Reusable Components
import PrivacyPolicy from "./components/reusable/privacy/PrivacyPolicy";
import ForCompany from "./components/reusable/for-company/ForCompany";
import Faq from "./components/reusable/faq/Faq";
import TestimonialsPage from "./components/reusable/testimonial/TestimonialPage";
import Courses from "./components/reusable/training/Courses";
import CandidatesHireTalent from "./components/hire-talent/HireTalent";
import CandidateProfile from "./components/hire-talent/candidate-profile/CandidateProfile";
// Master Admin
import AdminLogin from "./components/master-admin/components/AdminLogin";
import AdminJobList from "./components/master-admin/components/JobList";
import AdminJobDetails from "./components/master-admin/components/JobDetails";

// SmartGuide
import SmartGuidePage from "./components/candidate-admin/smartstart/SmartGuidePage";
import { seedGuidesIfEmpty } from "./utils/localStorage";
import FreelanceCareerTips from "./components/candidate-admin/freelance-career-tips/FreelanceCareerTips";
import CourseOverview from "./components/candidate-admin/course-overview/CourseOverview";
import SmartCvForm from "./components/candidate-admin/smart-cv/SmartCv";
import SmartStartPage from "./pages/findJob/SmartStartPage";
import ClientCareerTips from "./components/employer-admin/client-career-tips/ClientCareerTips";
import EmployerChatBox from "./components/employer-admin/message/components/EmployerChatBox";
import ApprovedCandidatesPage from "./components/employer-admin/approved-candidates/ApprovedCandidates";
import BrowseCandidates from "./components/employer-admin/browse-candidates/BrowseCandidates";
import ContactUs from './components/reusable/contact/Contact';
import CookieBanner from "./components/CookieBanner";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => setIsLoggedIn(true);

  //  Seed guides in localStorage once
  useEffect(() => {
    seedGuidesIfEmpty();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Loader />
      <Main isLoggedIn={isLoggedIn} handleLoginSuccess={handleLoginSuccess} />
      <CookieBanner/>
    </Router>
    
  );
}

function Main({
  isLoggedIn,
  handleLoginSuccess,
}: {
  isLoggedIn: boolean;
  handleLoginSuccess: () => void;
}) {
  const location = useLocation();

  //  Hide Navbar on dashboard-like routes
  const hideNavbarPaths = [
    "/login",
    "/register",
    "/dashboard",
    "/profile-list",
    "/resume-page",
    "/messages",
    "/job-alerts",
    "/candidate-profile/:id",
    "/saved-jobs",
    "/my-jobs",
    "/employers-messages",
    "/employers-account-settings",
    "/account-setting",
    "/delete-account",
    "/employers-dashboard",
    "/employers-profile",
    "/browse-candidates",
    "/submit-jobs",
    "/saved-candidate",
    "/approved-candidate",
    "/applied-jobs",
    "/all-applicant/:slug",
    "/employers-wallet-account",
    "/candidate-dashboard",
    "/candidate-wallet-account",
    "/logout-account",
    "/verify-account",
    "/verification-code",
    "/forget-password",
    "/subscriptions",
    "/freelance-career-tips",
    "/client-career-tips",
    "/smart-guide",
    "/paid-course",
    "/smart-cv",
    "/contact",
    "/paid-course/quiz",
    "/smart-guide/va-advanced",
  ];

  const shouldHideNavbar = hideNavbarPaths.some((path) => {
    if (path.includes(":")) {
      const regex = new RegExp("^" + path.replace(/:\w+/g, "[^/]+") + "$");
      return regex.test(location.pathname);
    }
    return path === location.pathname;
  });
  

  return (
    <div>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="company" element={<Company />} />
        <Route path="smart-start" element={<SmartStartPage />} />
        <Route path="career-tips" element={<CareerTips />} />
        <Route path="learn-more" element={<LearnMoreSection />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegisterForm />} />
        <Route path="hire-talent" element={<CandidatesHireTalent />} />

        {/* <Route path="job-details/:slug" element={<JobDataPage />} /> */}
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="for-company-footer" element={<ForCompany />} />
        <Route path="faq" element={<Faq />} />
        <Route path="testimonial" element={<TestimonialsPage />} />
        <Route path="free-courses" element={<Courses />} />
        <Route path="forget-password" element={<ForgotPassword />} />
        <Route path="verify-account" element={<AccountVerification />} />
        <Route
          path="verification-code"
          element={
            <PasswordVerificationCode
              length={6}
              onSubmit={(code: string) => console.log("Code submitted:", code)}
            />
          }
        />

        {/* Candidate/Admin Routes */}
        <Route
          path="candidate-dashboard"
          element={<AdminLayout element={<CandidateDashboard />} />}
        />
        <Route
          path="profile-list"
          element={<AdminLayout element={<ProfileDetails />} />}
        />
        <Route
          path="resume-page"
          element={<AdminLayout element={<ResumeSection />} />}
        />
        <Route
          path="messages"
          element={<AdminLayout element={<Message />} />}
        />
        <Route
          path="job-alerts"
          element={<AdminLayout element={<JobAlert />} />}
        />
        <Route
          path="saved-jobs"
          element={<AdminLayout element={<SavedJobs />} />}
        />
        <Route path="paid-course" element={<AdminLayout element={<CourseOverview />} />} /> {/* course overview */}
        <Route path="paid-course/quiz" element={<AdminLayout element={<QuizPage />} />} />
        <Route
          path="smart-cv"
          element={<AdminLayout element={<SmartCvForm />} />}
        />
        <Route
          path="subscriptions"
          element={<AdminLayout element={<SubscriptionPlan />} />}
        /> 
        <Route
          path="applied-jobs"
          element={<AdminLayout element={<AppliedJobs />} />}
        />
        <Route
          path="account-setting"
          element={<AdminLayout element={<AccountSettings />} />}
        />
        <Route
          path="delete-account"
          element={<AdminLayout element={<DeletePage />} />}
        />
        <Route
          path="candidate-wallet-account"
          element={<AdminLayout element={<CandidateWallet />} />}
        />
        <Route
          path="freelance-career-tips"
          element={<AdminLayout element={<FreelanceCareerTips />} />}
        />
        <Route
          path="logout-account"
          element={<AdminLayout element={<LogoutPage />} />}
        />
        {/* SmartGuide Route */}
        <Route
          path="smart-guide/:guideId"
          element={<AdminLayout element={<SmartGuidePage />} />}
        />

        {/* Employers/Admin Routes */}
        <Route
          path="employers-dashboard"
          element={<EmployersLayout element={<EmployersDashboard />} />}
        />
        <Route
          path="employers-profile"
          element={<EmployersLayout element={<EmployerProfile />} />}
        />
        <Route
          path="my-jobs"
          element={<EmployersLayout element={<MyJobs />} />}
        />
        {/* the applicant route*/}
        <Route
          path="all-applicant/:slug"
          element={<EmployersLayout element={<AllApplicates />} />}
        />
        <Route path="jobs/:jobId/details" element={<JobDetailsPage />} />
        <Route
          path="employers-messages"
          element={<EmployersLayout element={<EmployerChatBox />} />}
        />
        <Route
          path="submit-jobs"
          element={<EmployersLayout element={<SubmitJobs />} />}
        />
        <Route
          path="client-career-tips"
          element={<EmployersLayout element={<ClientCareerTips />} />}
        />
        <Route
          path="saved-candidate"
          element={<EmployersLayout element={<SavedCandidate />} />}
        />
        <Route
          path="browse-candidates"
          element={<EmployersLayout element={<BrowseCandidates />} />}
        />
        <Route
          path="approved-candidate"
          element={<EmployersLayout element={<ApprovedCandidatesPage />} />}
        />
        <Route
          path="employers-account-settings"
          element={<EmployersLayout element={<EmployersAccountSettings />} />}
        />
        
        <Route
          path="employers-delete-account"
          element={<EmployersLayout element={<EmployersDeleteAccount />} />}
        />
        <Route
          path="employers-wallet-account"
          element={<EmployersLayout element={<EmployersWallet />} />}
        />
        <Route
          path="employers-logout-account"
          element={<EmployersLayout element={<EmployersLogoutPage />} />}
        />

        <Route
          path="candidate-profile/:id"
          element={<EmployersLayout element={<CandidateProfile />} />}
        />

        {/* Master Admin Routes */}
        <Route path="/admin">
          <Route path="" element={<AdminLogin />} />
          <Route path="admin-jobs" element={<AdminJobList />} />
          <Route path="job-details/:id" element={<AdminJobDetails />} />
        </Route>
      </Routes>
       <CookieBanner />
    </div>
  );
}

export default App;

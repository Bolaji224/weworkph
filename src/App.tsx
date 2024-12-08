import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/navigation/Navbar";
import { Home } from "./pages/home/Home";
import Company from "./pages/company/Company";
import FindJob from "./pages/findJob/FindJob";
import CareerTips from "./pages/careerTips/CareerTips";
import LearnMoreSection from "./pages/careerTips/components/LearnMoreSection";
import About from "./pages/about/About";
import LoginForm from "./components/registration/LoginForm";
import RegisterForm from "./components/registration/RegisterForm";
import ScrollToTop from "./components/constant/ScrollToTop";
import JobDataPage from "./pages/findJob/job-details/JobDataPage";
import AdminLayout from "./components/candidate-admin/AdminLayout";
import ProfileDetails from "./components/candidate-admin/ProfileDetails";
import ResumeSection from "./components/candidate-admin/ResumeSection";
import Message from "./components/candidate-admin/message/Message";
import JobAlert from "./components/candidate-admin/job-alert/JobAlert";
import SavedJobs from "./components/candidate-admin/saved-job/SavedJobs";
import AccountSettings from "./components/candidate-admin/account-settings/AccountSettings";
import DeletePage from "./components/candidate-admin/delete-account/DeletePage";
import EmployersLayout from "./components/employer-admin/EmployersLayout";
import CandidateDashboard from "./components/candidate-admin/CandidateDashboard";
import EmployersDashboard from "./components/employer-admin/dashboard/EmployersDashboard";
import EmployerProfile from "./components/employer-admin/profile/EmployerProfile";
import MyJobs from "./components/employer-admin/my-jobs/MyJobs";
import EmployersMessage from "./components/employer-admin/message/EmployersMessage";
import SubmitJobs from "./components/employer-admin/submit-job/SubmitJobs";
import SavedCandidate from "./components/employer-admin/saved-candidate/SavedCandidate";
import EmployersAccountSettings from "./components/employer-admin/account-settings/EmplyersAccountSetting";
import EmployersDeleteAccount from "./components/employer-admin/delete-account/EmployersDeleteAccount";
import CandidatesHireTalent from "./components/hire-talent/HireTalent";
import CandidateProfile from "./components/hire-talent/candidate-profile/CandidateProfile";
import CandidateWallet from "./components/candidate-admin/candidate-payment-account/CandidteWallet";
import EmployersWallet from "./components/employer-admin/employers-payment-account/EmployersWallet";
import PrivacyPolicy from "./components/reusable/privacy/PrivacyPolicy";
import ForCompany from "./components/reusable/for-company/ForCompany";
import Faq from "./components/reusable/faq/Faq";
import TestimonialsPage from "./components/reusable/testimonial/TestimonialPage";
import LogoutPage from "./components/candidate-admin/logout/LogoutPage";
import EmployersLogoutPage from "./components/employer-admin/employers-logout/EmployersLogoutPage";
import Loader from "./components/reusable/loader/loader";
import Courses from "./components/reusable/training/Courses";
import ForgotPassword from "./components/registration/ForgetPass";
import AccountVerification from "./components/registration/Verification";
import PasswordVerificationCode from "./components/registration/PasswordVerificationCode";
import AdminLogin from "./components/master-admin/components/AdminLogin";
import AdminJobList from "./components/master-admin/components/JobList";
import AdminJobDetails from "./components/master-admin/components/JobDetails";
import AppliedJobs from "./components/candidate-admin/applied-job/AppliedJobs";
import AllApplicates from "./components/employer-admin/all-applicates/AllApplicates";
import JobDetailsPage from "./components/employer-admin/my-jobs/ApplicateJob/ApplicateJobsPage";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };
  return (
    <Router>
      <ScrollToTop />
      <Loader />
      <Main isLoggedIn={isLoggedIn} handleLoginSuccess={handleLoginSuccess} />
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
  const hideNavbarPaths = [
    "/login",
    "/register",
    "/dashboard",
    "/profile-list",
    "/resume-page",
    "/messages",
    "/job-alerts",
    "/saved-jobs",
    "/my-jobs",
    "/employers-messages",
    "/employers-account-settings",
    "/account-setting",
    "/delete-account",
    "/employers-dashboard",
    "/employers-profile",
    "/submit-jobs",
    "/saved-candidate",
    "/applied-jobs",
    "/employers-wallet-account",
    "/candidate-dashboard",
    "/candidate-wallet-account",
    "/logout-account",
    "/verify-account",
    "/verification-code",
    "/forget-password",
    "/all-applicant/:slug"
  ];
  return (
    <div>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="company" element={<Company />} />
        <Route path="find-job" element={<FindJob />} />
        <Route path="career-tips" element={<CareerTips />} />
        <Route path="learn-more" element={<LearnMoreSection />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegisterForm />} />
        <Route path="hire-talent" element={<CandidatesHireTalent />} />
        <Route path="candidate-profile/:candidateId" element={<CandidateProfile />} />
        {/* <Route path="job-details" element={<JobDataPage />} /> */}
        <Route path="job-details/:slug" element={<JobDataPage />} />
        <Route path="application-details" element={<JobDataPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="for-company-footer" element={<ForCompany />} />
        <Route path="faq" element={<Faq />} />
        <Route path="testimonial" element={<TestimonialsPage />} />
        <Route path="free-courses" element={<Courses />} />
        <Route path="forget-password" element={<ForgotPassword />} />
        <Route path="verify-account" element={<AccountVerification />} />
       <Route path="verification-code" element={<PasswordVerificationCode length={6}  onSubmit={(code: string) => {
              console.log("Code submitted:", code);
            }}  />} />

       
       {/* Master Admin Routing Section */}

       <Route path={"/admin"} >
          <Route path="" element={<AdminLogin />} />
          <Route path="admin-jobs" element={<AdminJobList />} />
          <Route path="job-details/:id" element={<AdminJobDetails />} />
        </Route>
       {/* {!isLoggedIn ? (
          <Route path="admin-login" element={<AdminLogin onLoginSuccess={handleLoginSuccess} />} />
        ) : (
          <Route path="master-admin-dashboard" element={<MsAdminDashboard />} />
        )} */}
        {/* <Route path="admin-login" element={<AdminLogin onLoginSuccess={handleLoginSuccess} />} />
        <Route path="master-admin-dashboard" element={<MsAdminDashboard />} />
        <Route path="admin-jobs" element={<JobList />} />
        <Route path="job-details/:id" element={<JobDetails />} />
        <Route path="*" element={<Navigate to="admin-jobs" />} /> */}

          {/* <Route path={"/master-admin-dashboard"} >
          <Route path="admin-jobs" element={<JobList />} />
          <Route path="job-details/:id" element={<AdminJobDetails  />} />
        </Route>
        <Route path="admin-login" element={<AdminLogin onLoginSuccess={handleLoginSuccess} />} /> */}

  
        {/* Candidates Admin routing section */}
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
          path="logout-account"
          element={<AdminLayout element={<LogoutPage />} />}
        />

        {/* Employers Admin routing section */}
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
         {/* <Route
          path="all-applicant"
          element={<EmployersLayout element={<AllApplicates />} />}
        /> */}
         <Route
          path="all-applicant/:slug"
          element={<EmployersLayout element={<AllApplicates />} />}
        />
         <Route path="/jobs/:jobId/details" element={<JobDetailsPage />} />
        <Route
          path="employers-messages"
          element={<EmployersLayout element={<EmployersMessage />} />}
        />
        <Route
          path="submit-jobs"
          element={<EmployersLayout element={<SubmitJobs />} />}
        />
        <Route
          path="saved-candidate"
          element={<EmployersLayout element={<SavedCandidate />} />}
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
          element={<EmployersLayout element={<EmployersLogoutPage  />} />}
        />
      </Routes>
      
    </div>
  );
}

export default App;

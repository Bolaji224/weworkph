import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Images from "../constant/Images";
import { httpPostWithoutToken, validateEmail } from "../../utils/http_utils";
import { useToast } from "@chakra-ui/react";

const AccountVerification: React.FC = () => {
  const [code, setCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState <string>('')
  const location = useLocation();
  const search = location.search;
  const navigate = useNavigate();
  const toast = useToast();
  
  useEffect(() => {
    let e = (search).substring(search.indexOf("&u="))
    e = e.replace("&u=", '');
    if(!validateEmail(e)){
        return navigate('/login')
    }else{
      setEmail(e.toString())
    }
}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await httpPostWithoutToken("verify-account", {
          email: email, // Example email or retrieved from the form
          token: code, // Code from user input
      });
      console.log(response)
      if (response.status === "success") {
        toast({
          status : "success",
          title : "Account verified successful!",
          isClosable : true,
        })
        navigate("/login")  
        setSubmitted(true);
      } else {
        toast({
          status : "error",
          title : response.message,
          isClosable : true,
        })
      }
    } catch (error) {
      console.error("Error verifying account:", error);
    }
  };

  const resendToken = async () => {
    const resp = await httpPostWithoutToken("resend-verification", {
         email : email
    })
    if(resp.status === "success") {
      toast({
        status : "success",
        title : `Email verification code sent ${email}`,
        isClosable : true,
      })
    }else {
      toast({
        status : "error",
        title : resp.message,
        isClosable : true,
      })
    }
    }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md xl:max-w-[1300px] lg:max-w-[900px] mx-auto gap-8 flex flex-col lg:flex-row items-center">
        <div className="w-full lg:w-1/2 p-8">
          {submitted ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Account Verified</h2>
              <p>Your account has been successfully verified!</p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-center mb-6">
                Verify Your Account
              </h2>
              <p className="text-center mb-6 text-gray-700">
                Please enter the verification code sent to your email.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="code"
                  >
                    Verification Code
                  </label>
                  <input
                    id="code"
                    type="text"
                    className="w-full px-4 py-2 border-[1px] rounded-[2px] text-gray-700 focus:outline-none focus:border-[#2aa100]"
                    placeholder="Enter verification code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
               className="w-full bg-[#ee009d] text-white font-bold py-2 px-4 rounded hover:bg-[#2aa100] transition-transform ease-in-out duration-300 hover:scale-110"
                >
                  Verify Account
                </button>
              </form>
              <p className="text-center mt-4 text-gray-600">
                Didn't receive a code?{" "}
                <Link onClick={()=>resendToken()} to="#?" className="text-[#2aa100] hover:underline">
                  Resend
                </Link>
              </p>
            </>
          )}
        </div>
        <div className="w-full lg:w-1/2">
          <img src={Images.LoginImage} alt="login" className="w-full" />
        </div>
      </div>
    </section>
  );
};

export default AccountVerification;


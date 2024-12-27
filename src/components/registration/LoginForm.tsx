import React, { useContext, useReducer, useState } from 'react';
import Images from '../constant/Images';
import { FaGoogle, FaApple, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { httpPostWithoutToken } from '../../utils/http_utils';
import { useToast } from '@chakra-ui/react';
import ls from "localstorage-slim";
import { AppContext } from '../../global/state';

// Define the State interface
interface State {
  email: string;
  password: string;
  showPassword: boolean;
  error: string | null;
}

// Define the Action types
type Action =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'TOGGLE_SHOW_PASSWORD' }
  | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: State = {
  email: '',
  password: '',
  showPassword: false,
  error: null,
};

// Reducer function
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'TOGGLE_SHOW_PASSWORD':
      return { ...state, showPassword: !state.showPassword };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

const LoginForm: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const {updateUser}:any = useContext(AppContext)
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    let d = {
      email: state.email,
      password: state.password,
    }
    setIsSubmitting(true)
    const response = await httpPostWithoutToken("login", d)
    setIsSubmitting(false)

    if(response.status === "success") {
      toast({ 
        status : "success",
        title : "Login successful!",
        isClosable : true,
      })
      sessionStorage.setItem("wwph_token", response.access_token);
      sessionStorage.setItem("wwph_usr", JSON.stringify(response.user));
      ls.set("wwph_token", response.access_token, {encrypt : true});
      ls.set("wwph_usr", response.user, {encrypt : true});
      updateUser(response.user)
      setTimeout(() => {
      if(response.user.role === "Company") {
        if(response.user.about_company === "" || !response.user.about_company) {
          navigate("/employers-profile")
        }else {
          navigate("/employers-dashboard")
        }
      }else {
          navigate("/resume-page")
      }
      }, 1000);
    }else{
      dispatch({ type: 'SET_ERROR', payload: response.message });
      console.log('Account created:', response.data);
    }

  };

  const handleGoogleLogin = () => {
    // Add logic for Google login
  };

  const handleAppleLogin = () => {
    // Add logic for Apple ID login
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md xl:max-w-[1300px] lg:max-w-[900px] mx-auto p-8 flex flex-col lg:flex-row items-center">
        <div className="w-full lg:w-1/2">
          <div>
          <h2 className="text-2xl font-sans font-bold text-center mb-6">
              Welcome to  <Link to='/'><span className="text-[#ee009d]">WeWorkPerHour</span>
              </Link>
            </h2>
          </div>
          <h1 className="text-xl font-semibold text-center mb-6">Sign in to your Account</h1>
          {state.error && <p className="text-red-500 text-center mb-4">{state.error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="w-full px-6 py-2 mt-2 border-b-[1px] focus:outline-none focus:ring-[1px] focus:ring-[#2aa100]"
                value={state.email}
                onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e.target.value })}
                required
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type={state.showPassword ? 'text' : 'password'}
                id="password"
                className="w-full px-6 py-2 mt- border-b-[1px] focus:outline-none focus:ring-[1px] focus:ring-[#2aa100]"
                value={state.password}
                onChange={(e) => dispatch({ type: 'SET_PASSWORD', payload: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => dispatch({ type: 'TOGGLE_SHOW_PASSWORD' })}
                className="absolute right-2 top-10 transform -translate-y-1/2"
              >
                {state.showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="flex justify-between items-center">
             <Link to="/forget-password">
             <button className="text-sm text-blue-600 hover:underline">Forgot Password?</button>
             </Link>
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-6 py-3 text-white bg-[#ee009d] rounded-md hover:bg-[#2AA100] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Sign In"}
              </button>
            </div>
          </form>
          <div className="mt-6 flex justify-center space-x-8">
            <button
              onClick={handleGoogleLogin}
              className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700"
            >
              <FaGoogle />
            </button>
            <button
              onClick={handleAppleLogin}
              className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800"
            >
              <FaApple />
            </button>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Create an account</Link></p>
          </div>
        </div>
        <div className="w-full lg:w-1/2 mt-8 lg:mt-0 lg:ml-8">
          <img src={Images.LoginImage} alt="login" className="w-full rounded-[10px]" />
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
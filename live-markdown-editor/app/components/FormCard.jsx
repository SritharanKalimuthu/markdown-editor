"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUser, registerUser, loginUser, otpVerification } from "../api/auth.service";
import { toast } from 'react-hot-toast';

import EmailStep from "./FormSteps/EmailStep";
import LoginStep from "./FormSteps/LoginStep";
import UsernameStep from "./FormSteps/UsernameStep";
import PasswordStep from "./FormSteps/PasswordStep";
import OTPStep from "./FormSteps/OtpStep";

export default function AnimatedCardForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState("forward");
  const [isExistingUser, setIsExistingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    otp: "",
  });
  
  // Add a key state to force re-render with animation
  const [animationKey, setAnimationKey] = useState(0);

  // Validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordMinLength = 6;

    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          if( step === 1 ) {
            handleEmailSubmit();
          } else if (step === 2 && isExistingUser === true) {
            handleLoginSubmit();
          } else if (step === 2 && isExistingUser === false) {
            handleUsernameSubmit();
          }else if (step === 3) {
            handlePasswordSubmit();
          }else if (step === 4) {
            handleOtpSubmit();
          }
        };
      }
  
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleEmailSubmit = async () => {
    // Validate email
    if (!formData.email || !emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await getUser(formData.email);
      const data = res.data;
      
      if (res.status == 200 ) {
        setFormData((prev) => ({ ...prev, name: data.user.name }));
        setIsExistingUser(true);
        nextStep();
      } else if (res.status == 400) {
        setIsExistingUser(false);
        nextStep();
      } else {
        setError("Internal Server Error, Please try again.");
      }
    } catch (err) {
      setIsExistingUser(false);
      nextStep();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit = async () => {
    // Validate password
    if (!formData.password) {
      setError("Password is required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      const data = res.data;

      if (res.status == 201) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setDirection("forward");
        goToStep(4); // Proceed to OTP step
        toast.success(data.message);
      } else if( res.status == 400) {
        setError("Invalid Credentials, Please try again.");
      } else {
        setError("Internal Server Error, Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUsernameSubmit = () => {
    // Validate username
    if (!formData.name || formData.name.trim() === "") {
      setError("Username is required");
      return;
    }

    nextStep();
  };

  const handlePasswordSubmit = async () => {
    // Validate password for new user
    if (!formData.password) {
      setError("Password is required");
      return;
    }

    if (formData.password.length < passwordMinLength) {
      setError(`Password must be at least ${passwordMinLength} characters`);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await registerUser({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      const data = res.data;

      if (res.status == 201) {
        nextStep(); // Proceed to OTP step
        toast.success(data.message);
      } else if (res.status == 400 ){
        setError("User already exists, please try again.");
      } else {
        setError("Registration failed, please try again.");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (formData.otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await otpVerification({
        identifier: formData.email,
        otp: formData.otp,
      });

      const data = res.data;

      console.log(res);

      if (res.status == 200) {
        // Redirect to editor on successful verification
        if(isExistingUser){
          router.push("/pages/dashboard");
        }else{
          router.push("/pages/welcome?name=" + data.user.name);
        }
        toast.success(data.message);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else if (res.status == 404) {
        setError("OTP verification failed, Check your OTP");
      } else if ( res.status == 400 ){
        setError("OTP Expired, please resend the OTP");
      } else {
        setError("Internal Server Error, Please try again.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("OTP verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Updated navigation functions
  const nextStep = () => {
    setDirection("forward");
    setAnimationKey(prev => prev + 1); 
    setStep(prevStep => prevStep + 1);
  };

  const prevStep = () => {
    setDirection("backward");
    setAnimationKey(prev => prev + 1); 
    
    if (step > 1) {
      if (isExistingUser && step === 4) {
        setStep(2);
      } else {
        setStep(prevStep => prevStep - 1);
      }
    }
  };

  // New function to handle jumps to specific steps
  const goToStep = (newStep) => {
    setDirection("forward");
    setAnimationKey(prev => prev + 1); // Force re-render
    setStep(newStep);
  };

  const setOtp = (val) => {
    setFormData({ ...formData, otp: val });
    setError(""); // Clear error when user types OTP
  };

  // Animation classes
  const getAnimationClass = () => {
    if (direction === "forward") {
      return "animate-slide-in-right";
    } else {
      return "animate-slide-in-left";
    }
  };

  useEffect(()=>{
    if(error.length > 0){
       toast.error(error);
    }
  },[error]);

  useEffect(() => {
    console.log("IsExistingUser:", isExistingUser);
  },[isExistingUser]);

  return (
    <div
      className="max-w-md mx-auto bg-white shadow-md overflow-hidden transition-shadow duration-300 ease-in-out dynamic-corners p-10 md:py-16 md:px-16"
      style={{ borderRadius: "2rem 1rem 2rem 1rem / 1rem 2rem 1rem 2rem" }}
    >
      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.3s ease-out forwards;
        }
      `}</style>

      <div 
        key={animationKey}
        className={`flex flex-col items-center ${getAnimationClass()}`}
      >
        {step === 1 && (
          <EmailStep
            formData={formData}
            handleChange={handleChange}
            error={error}
            onSubmit={handleEmailSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {step === 2 && isExistingUser && (
          <LoginStep
            formData={formData}
            handleChange={handleChange}
            error={error}
            onSubmit={handleLoginSubmit}
            onPrevious={prevStep}
            isSubmitting={isSubmitting}
          />
        )}

        {step === 2 && isExistingUser === false && (
          <UsernameStep
            formData={formData}
            handleChange={handleChange}
            error={error}
            onSubmit={handleUsernameSubmit}
            onPrevious={prevStep}
            isSubmitting={isSubmitting}
          />
        )}

        {step === 3 && (
          <PasswordStep
            formData={formData}
            handleChange={handleChange}
            error={error}
            onSubmit={handlePasswordSubmit}
            onPrevious={prevStep}
            isSubmitting={isSubmitting}
          />
        )}

        {step === 4 && (
          <OTPStep
            formData={formData}
            setOtp={setOtp}
            error={error}
            onSubmit={handleOtpSubmit}
            onPrevious={prevStep}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
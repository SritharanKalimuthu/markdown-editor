import React from "react";
import OTPInput from "../otpInputField";
import PrevButton from "../Buttons/PrevButton";
import NextButton from "../Buttons/NextButton";

const OTPStep = ({ formData, setOtp, error, onSubmit, onPrevious, isSubmitting }) => {
  return (
    <>
      <h2 className="text-md sm:text-lg font-bold mb-3 text-violet-800 text-center">
        Enter the OTP received on your Email
      </h2>
      <OTPInput 
        length={6} 
        onChange={setOtp} 
        disabled={isSubmitting}
      />
      {/* {error && <span className="text-[11px] text-red-500 px-5 mb-2">{error}</span>} */}
      <div className="flex flex-row items-center justify-between gap-6 mt-4">
        <button className="ui-btn" onClick={onPrevious} disabled={isSubmitting}>
          <PrevButton />
        </button>
        <button className="ui-btn" onClick={onSubmit} disabled={isSubmitting || formData.otp.length !== 6}>
          <NextButton isLoading={isSubmitting} />
        </button>
      </div>
    </>
)};

export default OTPStep;
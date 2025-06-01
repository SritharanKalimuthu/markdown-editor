import React from "react";
import PrevButton from "../Buttons/PrevButton";
import NextButton from "../Buttons/NextButton";

const PasswordStep = ({ formData, handleChange, error, onSubmit, onPrevious, isSubmitting }) => {
  return (
    <>
      <h2 className="text-md sm:text-lg font-bold mb-1 text-violet-800 text-center">Create Your Password</h2>
      <span className="text-xs text-gray-700 px-1 mb-3">
        Choose a strong password
      </span>
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        className="border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none w-full max-w-xs mb-2"
        placeholder="Enter the Password"
        disabled={isSubmitting}
      />
      <input
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        className="border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none w-full max-w-xs mb-2"
        placeholder="Confirm Password" 
        disabled={isSubmitting}
      />
      {/* {error && <span className="text-[11px] text-red-500 px-5 mb-2">{error}</span>} */}
      <div className="flex flex-row items-center justify-between gap-6">
        <button className="ui-btn" onClick={onPrevious} disabled={isSubmitting}>
          <PrevButton />
        </button>
        <button className="ui-btn" onClick={onSubmit} disabled={isSubmitting}>
          <NextButton isLoading={isSubmitting} />
        </button>
      </div>
    </>
)};

export default PasswordStep;
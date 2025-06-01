import React from "react";
import PrevButton from "../Buttons/PrevButton";
import NextButton from "../Buttons/NextButton";

const EmailStep = ({ formData, handleChange, error, onSubmit, isSubmitting }) => {
  return (
    <>
      <h2 className="text-md sm:text-lg font-bold mb-1 text-violet-800 text-center">Welcome to MDEditor</h2>
      <span className="text-xs text-gray-700 px-1 mb-3">
        Enter Your Email to Proceed
      </span>
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        className="border-2 border-gray-300 bg-white h-10 mb-2 px-5 rounded-lg text-sm focus:outline-none w-full max-w-xs"
        placeholder="Eg: user@example.com"
        disabled={isSubmitting}
      />
      {/* {error && <span className="text-[11px] text-red-500 px-5 mb-2">{error}</span>} */}
      <span className="text-[10px] text-gray-500 px-2 mb-2">
        <i>By proceeding, you acknowledge and agree to our Terms & Conditions.</i>
      </span>
      <div className="flex flex-row items-center justify-between gap-6">
        <div className="invisible">
          <PrevButton />
        </div>
        <button className="ui-btn" onClick={onSubmit} disabled={isSubmitting}>
          <NextButton isLoading={isSubmitting} />
        </button>
      </div>
    </>
)};

export default EmailStep;
import React, { useState, useRef } from "react";

export default function OTPInput({ length = 6, onChange }) {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  // Regex to allow only alphanumeric characters (both lowercase and uppercase)
  const validCharRegex = /^[a-zA-Z0-9]$/;

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (value.length > 1) {
      // Ignore manual multi-char input here (paste handled separately)
      return;
    }

    if (validCharRegex.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== "" && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
      onChange?.(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        onChange?.(newOtp.join(""));
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const pasteChars = pasteData.split("").filter((c) => validCharRegex.test(c));

    if (pasteChars.length === 0) return;

    const newOtp = [...otp];
    let startIndex = inputRefs.current.findIndex((input) => input === document.activeElement);
    if (startIndex === -1) startIndex = 0;

    for (let i = 0; i < pasteChars.length; i++) {
      if (startIndex + i < length) {
        newOtp[startIndex + i] = pasteChars[i];
      }
    }

    setOtp(newOtp);
    onChange?.(newOtp.join(""));

    const nextFocusIndex = Math.min(startIndex + pasteChars.length, length - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  return (
    <div className="flex justify-center gap-2 mb-4">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-10 h-10 text-center border-2 border-gray-300 rounded-lg text-l tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}
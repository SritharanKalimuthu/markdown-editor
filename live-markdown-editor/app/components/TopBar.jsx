"use client";
import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { getUsername } from "../utils/getUsername";

export default function TopBar() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const username= getUsername();
    if (username) {
      setUsername(username);
    }else{
      setUsername("Guest");
    }
  }, []);

  return (
    <header className="fixed sm:relative top-0 w-full flex justify-between items-center px-6 py-6 bg-gradient-to-r from-gray-50 to-violet-50 shadow z-[2]">
      <h1 className="text-md md:text-xl xl:text-2xl font-semibold text-shadow-xl text-shadow-black ">
      </h1>
      <h1 className="sm:hidden pl-10 text-md font-bold text-gray-800 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 "
        >
          <path fillRule="evenodd" d="M17.834 6.166a8.25 8.25 0 1 0 0 11.668.75.75 0 0 1 1.06 1.06c-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788 3.807-3.808 9.98-3.808 13.788 0A9.722 9.722 0 0 1 21.75 12c0 .975-.296 1.887-.809 2.571-.514.685-1.28 1.179-2.191 1.179-.904 0-1.666-.487-2.18-1.164a5.25 5.25 0 1 1-.82-6.26V8.25a.75.75 0 0 1 1.5 0V12c0 .682.208 1.27.509 1.671.3.401.659.579.991.579.332 0 .69-.178.991-.579.3-.4.509-.99.509-1.671a8.222 8.222 0 0 0-2.416-5.834ZM15.75 12a3.75 3.75 0 1 0-7.5 0 3.75 3.75 0 0 0 7.5 0Z" clipRule="evenodd" />
        </svg>
        MDEditor
      </h1>
      <div className="flex items-center gap-2 text-gray-800">
        <span className="hidden sm:inline">Bonjour!,{username}</span>
        <span className="sm:hidden xs:inline text-xs">{username}</span>
        <User className="sm:w-6 sm:h-6 w-4 h-4"/>
      </div>
    </header>
  );
}

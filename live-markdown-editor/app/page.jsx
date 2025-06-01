"use client"
import { useState } from "react";
import Image from "next/image";
import './globals.css';
import { Github } from "lucide-react";
import AnimatedCardForm from "./components/FormCard";
import usePageLoaded from "./hooks/usePageLoaded";
import Loader from "./components/Loader/Loader";

export default function Home() {

  const isLoaded = usePageLoaded();

  if(!isLoaded) {
    return ( 
    <div className="h-screen">
        <Loader/>
    </div>
    );
  }

  return (
    <div className="relative w-full h-full md:h-screen md:overflow-hidden p-6">
      <div className="fixed top-0 left-0 bg-river w-full h-full z-[0]"></div>
      <div className="w-full px-6 pb-2 flex flex-row align-center justify-between z-[-1]">
        <h1 className="text-md md:text-xl xl:text-2xl font-semibold text-shadow-xl text-shadow-black ">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M17.834 6.166a8.25 8.25 0 1 0 0 11.668.75.75 0 0 1 1.06 1.06c-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788 3.807-3.808 9.98-3.808 13.788 0A9.722 9.722 0 0 1 21.75 12c0 .975-.296 1.887-.809 2.571-.514.685-1.28 1.179-2.191 1.179-.904 0-1.666-.487-2.18-1.164a5.25 5.25 0 1 1-.82-6.26V8.25a.75.75 0 0 1 1.5 0V12c0 .682.208 1.27.509 1.671.3.401.659.579.991.579.332 0 .69-.178.991-.579.3-.4.509-.99.509-1.671a8.222 8.222 0 0 0-2.416-5.834ZM15.75 12a3.75 3.75 0 1 0-7.5 0 3.75 3.75 0 0 0 7.5 0Z" clipRule="evenodd" />
          </svg>
            MDEditor
        </h1>
        <button>
          <a
            href="https://github.com/SritharanKalimuthu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm xl:text-md inline-flex items-center gap-2 px-4 py-2 font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Github size={18} />
            Repo
          </a>
        </button>
      </div>
      <div className="flex flex-col align-center justify-center px-8 pt-6 pb-4">
        <h2 className="text-lg sm:text-2xl xl:text-4xl font-extrabold text-violet-600 mb-3">What is the Live Markdown Editor - @MDEditor & <br></br> why should you use it?</h2>
        <p className="text-sm sm:text-md xl:text-[16px] leading-6 font-semibold text-gray-600">This Live Markdown Text Editor is a real-time tool that lets you write Markdown and instantly preview the formatted output. It’s ideal for developers, writers, and anyone who works with Markdown. You should use it because it improves writing efficiency, reduces context switching, and produces clean, structured content — plus, the output is easily sharable with others.</p>
      </div>
        <AnimatedCardForm />
      <div className="xs:relative lg:absolute bottom-5 right-5">
        <span className="text-gray-400 text-xs">
          Authored by&nbsp;
          <a 
            href="https://github.com/SritharanKalimuthu"
            className="text-gray-500 text-xs font-medium">
            Levyathan
          </a>
        </span>
      </div>
    </div>
  );
}

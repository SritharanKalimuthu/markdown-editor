"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getUsername } from '@/app/utils/getUsername';

const Typewriter = ({ text, speed = 50, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      onComplete && onComplete();
    }
  }, [index, text, speed, onComplete]);

  return <span>{displayedText}</span>;
};

export default function WelcomeMessage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [name, setName] = useState('');
  const [showParagraph, setShowParagraph] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const username = searchParams.get('name');

  useEffect(() => {
    const storedName = getUsername();
    if (!username && storedName) {
      setName(storedName);
    }
  }, [username]);

  const finalName = username ?? name ?? 'Guest';

  const heading = `# Welcome to MDEditor, ${finalName}!`;
  const paragraph = `### Thank you for choosing us. We are excited to have you here. This live markdown editor will help you write better, faster, and smarter. At last, enjoy and have fun!`;

  const handleRedirect = () => {
    router.push('/pages/editor');
  };

  const handleAutoRedirect = () => {
    toast.loading("Will be redirected to editor in 3 seconds");
    
    setTimeout(() => {
      router.push('/pages/dashboard');
    }, 3000);
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col justify-center items-center text-center">
      <div className="absolute top-0 left-0 bg-river w-full h-full z-[0]"></div>
      <div className="relative max-w-3xl xl:max-w-4xl px-6 space-y-6 z-[1]">
        <h1 className="text-xl md:text-4xl xl:text-5xl font-extrabold text-violet-600">
          <Typewriter text={heading} speed={50} onComplete={() => setShowParagraph(true)} />
        </h1>

        {showParagraph && (
          <p className="mt-4 text-sm md:text-md xl:text-lg font-semibold text-gray-600">
            <Typewriter text={paragraph} speed={35} onComplete={() => {
              setShowButton(true);
              handleAutoRedirect();
            }} />
          </p>
        )}

        {showButton && (
          <button
            onClick={handleRedirect}
            className="ui-btn mt-8 px-6 py-3 bg-gradient-to-r from-violet-400 to-violet-700 text-md font-semibold text-white rounded-full shadow hover:from-violet-500 hover:to-violet-900 transition"
          >
            <span>Go to Editor</span>
          </button>
        )}
      </div>
    </div>
  );
}

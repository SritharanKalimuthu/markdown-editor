import React from 'react'
import './loader.css'

const Loader = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-violet-100 to-violet-300">
      {/* Typewriter body */}
      <div className="w-[100px] h-5 rounded bg-gradient-to-b from-[#5C86FF] to-[#275EFE] ml-[14px] translate-x-[14px] relative top-[52px] animate-slide-typewriter">
        <span className="absolute left-[104px] top-[3px] w-[6px] h-[14px] rounded bg-[#FBC56C]" />
        <span className="absolute left-full top-[6px] w-[2px] h-[8px] bg-[#FBC56C]" />
        <i className="absolute right-full top-[6px] w-[6px] h-[4px] bg-[#FBC56C]">
          <span className="absolute right-full top-[-2px] w-[4px] h-[14px] rounded bg-[#FBC56C]" />
        </i>
      </div>

      {/* Paper */}
      <div className="relative left-0 top-[0px] w-16 h-[46px] rounded bg-[#EEF0FD] translate-y-[46px] animate-paper-typewriter">
        <span className="absolute left-[6px] right-[6px] top-[8px] h-[3px] rounded bg-[#D3D4EC] scale-y-[0.8] shadow-[0_12px_0_#D3D4EC,0_24px_0_#D3D4EC,0_36px_0_#D3D4EC]" />
      </div>

      {/* Keyboard */}
      <div className="relative -mt-2 w-[120px] h-[56px] z-[1]">
        <span className="absolute inset-0 rounded-[7px] bg-gradient-to-br from-[#5C86FF] to-[#275EFE] perspective-[10px] rotate-x-[2deg] origin-bottom" />
        <span className="absolute left-[8px] top-[25px] w-[11px] h-[4px] rounded-[2px] bg-white animate-keys-typewriter" />
      </div>

      {/* Loading Text */}
      <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#5C86FF] to-[#275EFE] animate-pulse mt-2">
        Loading...
      </p>
    </div>
  )
}

export default Loader

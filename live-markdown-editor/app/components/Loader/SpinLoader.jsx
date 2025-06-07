import React from "react";

const SpinLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-12 h-12">
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="absolute block w-2 h-2 bg-violet-600 rounded-full"
            style={{
              top: `${50 - 40 * Math.cos((i * 2 * Math.PI) / 8)}%`,
              left: `${50 + 40 * Math.sin((i * 2 * Math.PI) / 8)}%`,
              animation: `spin-dot 1s linear infinite`,
              animationDelay: `${i * 0.125}s`,
            }}
          ></span>
        ))}
      </div>

      <style jsx>{`
        @keyframes spin-dot {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.4;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default SpinLoader;
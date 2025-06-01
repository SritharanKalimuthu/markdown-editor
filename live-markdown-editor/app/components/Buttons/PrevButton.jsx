import React from 'react'

function PrevButton({ isLoading, text = "Back"}) {
 return (
    <span className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-700 to-stone-700 text-white text-sm font-medium rounded-lg shadow-md hover:from-gray-600 hover:to-stone-600 transition">
      {isLoading ? 
        (
          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ):(
          <>
            {text}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path 
                  fillRule="evenodd" 
                  d="M7.28 7.72a.75.75 0 0 1 0 1.06l-2.47 2.47H21a.75.75 0 0 1 0 1.5H4.81l2.47 2.47a.75.75 0 1 1-1.06 1.06l-3.75-3.75a.75.75 0 0 1 0-1.06l3.75-3.75a.75.75 0 0 1 1.06 0Z" 
                  clipRule="evenodd" 
              />
            </svg>
          </>
        )}
    </span>
  )
}

export default PrevButton

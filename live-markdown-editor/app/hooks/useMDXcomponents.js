import { useState, useEffect, useRef } from 'react';
import { Copy, Check, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import useIsMobile from '@/app/hooks/useIsMobile';

const useMDXcomponents = () => {
    const isActuallyMobile = useIsMobile();

    return {
    
        h1: ({ node, children, ...props }) => {
            const id = typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-') : '';
            return (
            <h1 
                id={id}
                className={`group relative font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent
                animate-in slide-in-from-left-5 duration-700 scroll-m-20 tracking-tight
                ${isActuallyMobile ? 
                    'text-2xl md:text-5xl mt-8 mb-6 md:mt-12 md:mb-8' : 
                    'text-4xl mt-12 mb-8'
                }
                hover:scale-[1.02] transition-transform duration-300 cursor-pointer`}
                onClick={() => window.location.hash = id}
                {...props}
            >
                {children}
                <div className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 
                group-hover:w-full transition-all duration-500 ease-out" />
            </h1>
            );
        },

        h2: ({ node, children, ...props }) => {
            const id = typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-') : '';
            return (
            <h2 
                id={id}
                className={`group relative font-bold text-gray-800 animate-in slide-in-from-left-4 
                duration-600 scroll-m-16 tracking-tight border-l-4 border-blue-500 pl-4
                ${isActuallyMobile ? 
                    'text-xl md:text-4xl mt-6 mb-4 md:mt-10 md:mb-6' : 
                    'text-3xl mt-10 mb-6'
                }
                hover:border-l-8 hover:pl-6 transition-all duration-300 cursor-pointer`}
                onClick={() => window.location.hash = id}
                {...props}
            >
                {children}
            </h2>
            );
        },

        h3: ({ node, children, ...props }) => {
            const id = typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-') : '';
            return (
            <h3 
                id={id}
                className={`group relative font-bold text-gray-800 animate-in slide-in-from-left-3 
                duration-500 scroll-m-12 tracking-tight
                ${isActuallyMobile ? 
                    'text-lg md:text-3xl mt-5 mb-3 md:mt-8 md:mb-5' : 
                    'text-2xl mt-8 mb-5'
                }
                hover:text-blue-700 transition-colors duration-300 cursor-pointer`}
                onClick={() => window.location.hash = id}
                {...props}
            >
                {children}
            </h3>
            );
        },

        h4: ({ node, ...props }) => (
            <h4 className={`font-semibold text-gray-800 animate-in fade-in duration-400
            ${isActuallyMobile ? 
                'text-md md:text-2xl mt-4 mb-2 md:mt-6 md:mb-4' : 
                'text-xl mt-6 mb-4'
            }
            hover:text-blue-600 transition-colors duration-200`} 
            {...props} 
            />
        ),

        h5: ({ node, ...props }) => (
            <h5 className={`font-semibold text-gray-700 animate-in fade-in duration-300
            ${isActuallyMobile ? 
                'text-base md:text-xl mt-4 mb-2 md:mt-5 md:mb-3' : 
                'text-lg mt-5 mb-3'
            }`} 
            {...props} 
            />
        ),

        h6: ({ node, ...props }) => (
            <h6 className={`font-semibold uppercase tracking-widest text-gray-600 animate-in fade-in duration-200
            ${isActuallyMobile ? 
                'text-sm md:text-lg mt-3 mb-2 md:mt-4' : 
                'text-md mt-4 mb-2'
            }`} 
            {...props} 
            />
        ),

        // Enhanced Paragraph with Better Typography
        p: ({ node, ...props }) => (
            <p className={`leading-loose text-gray-700 animate-in fade-in duration-500
            ${isActuallyMobile ? 
                'my-4 text-sm md:my-6 md:text-lg md:leading-8' : 
                'my-6 text-base leading-8'
            }
            selection:bg-blue-100 selection:text-blue-900`} 
            {...props} 
            />
        ),

        // Interactive Lists with Hover Effects
        ul: ({ node, ...props }) => (
            <ul className={`space-y-3 animate-in slide-in-from-left-2 duration-400
            ${isActuallyMobile ? 
                'my-4 ml-6 md:my-6 md:ml-8 md:space-y-4' : 
                'my-6 ml-8 space-y-4'
            }`} 
            {...props} 
            />
        ),

        ol: ({ node, ...props }) => (
            <ol className={`space-y-3 animate-in slide-in-from-left-2 duration-400
            ${isActuallyMobile ? 
                'my-4 ml-6 md:my-6 md:ml-8 md:space-y-4' : 
                'my-6 ml-8 space-y-4'
            }`} 
            {...props} 
            />
        ),

        li: ({ node, ...props }) => (
            <li className="leading-loose text-gray-700 hover:text-gray-900 transition-colors duration-200
            marker:text-blue-500 hover:marker:text-blue-700 relative group
            before:absolute before:-left-2 before:top-0 before:w-0 before:h-full 
            before:bg-blue-50 before:transition-all before:duration-300
            hover:before:w-full hover:before:-left-4 before:rounded-r-md before:-z-10" 
            {...props} 
            />
        ),

        // Modern Blockquote with Gradient and Animation
        blockquote: ({ node, ...props }) => (
            <blockquote className={`relative overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 
            border-l-4 border-gradient-to-b from-blue-500 to-purple-500 rounded-r-lg
            animate-in slide-in-from-left-4 duration-600
            ${isActuallyMobile ? 
                'pl-6 pr-4 py-4 my-6 md:pl-8 md:pr-6 md:py-6 md:my-8' : 
                'pl-8 pr-6 py-6 my-8'
            }
            before:absolute before:top-0 before:left-0 before:w-1 before:h-full 
            before:bg-gradient-to-b before:from-blue-500 before:to-purple-500
            hover:shadow-lg hover:shadow-blue-100 transition-all duration-300`} 
            {...props} 
            />
        ),

        // Advanced Code Block with Copy Functionality
        code: ({ node, inline, className, children, ...props }) => {
            if (inline) {
            return (
                <code className={`bg-gradient-to-r from-gray-100 to-gray-200 rounded-md font-mono 
                text-purple-700 font-medium border border-gray-300 shadow-sm
                hover:shadow-md hover:from-gray-200 hover:to-gray-300 transition-all duration-200
                ${isActuallyMobile ? 
                    'px-2 py-1 text-sm' : 
                    'px-2.5 py-1.5 text-sm'
                }`} 
                {...props}
                >
                {children}
                </code>
            );
            }

            return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
        },

        a: ({ node, href, children, ...props }) => (
            <a 
            href={href}
            className="relative inline-flex items-center gap-1 text-blue-600 font-medium
                hover:text-blue-800 transition-all duration-300 group
                after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-0.5 
                after:bg-gradient-to-r after:from-blue-600 after:to-purple-600
                after:transition-all after:duration-300 hover:after:w-full
                hover:scale-105 transform-gpu"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            {...props}
            >
            {children}
            {href?.startsWith('http') && (
                <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
            )}
            </a>
        ),

        // Responsive Images with Zoom Effect
        img: ({ node, src, alt, ...props }) => (
            <div className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl 
            transition-all duration-500 animate-in zoom-in-90 
            ${isActuallyMobile ? 'my-6 md:my-8' : 'my-8'}`}
            >
            <img 
                src={src}
                alt={alt}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700
                cursor-pointer" 
                onClick={() => {
                // Optional: Add lightbox functionality
                const modal = document.createElement('div');
                modal.innerHTML = `
                    <div class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4" 
                        onclick="this.remove()">
                    <img src="${src}" alt="${alt}" class="max-w-full max-h-full object-contain rounded-lg">
                    </div>
                `;
                document.body.appendChild(modal);
                }}
                {...props} 
            />
            {alt && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent 
                p-4 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {alt}
                </div>
            )}
            </div>
        ),

        // Animated Horizontal Rule
        hr: ({ node, ...props }) => (
            <div className={`relative flex items-center justify-center
            ${isActuallyMobile ? 'my-8 md:my-12' : 'my-12'}`}
            {...props}
            >
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>
            <div className="relative flex justify-center px-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full 
                animate-pulse shadow-lg"></div>
            </div>
            </div>
        ),

        // Advanced Table with Modern Styling
        table: ({ node, ...props }) => (
            <div className={`overflow-hidden rounded-xl border border-gray-200 shadow-lg
            animate-in slide-in-from-bottom-4 duration-600 hover:shadow-xl transition-shadow
            ${isActuallyMobile ? 'my-6 md:my-8' : 'my-8'}`}
            >
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 bg-white" {...props} />
            </div>
            </div>
        ),

        thead: ({ node, ...props }) => (
            <thead className="bg-gradient-to-r from-gray-50 to-blue-50" {...props} />
        ),

        tbody: ({ node, ...props }) => (
            <tbody className="divide-y divide-gray-200 bg-white" {...props} />
        ),

        tr: ({ node, ...props }) => (
            <tr className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 
            transition-all duration-300 group" {...props} />
        ),

        th: ({ node, ...props }) => (
            <th className={`text-left text-xs font-bold text-gray-900 uppercase tracking-wider 
            bg-gradient-to-r from-gray-50 to-blue-50 relative
            ${isActuallyMobile ? 
                'px-4 py-3 md:px-6 md:py-4' : 
                'px-6 py-4'
            }
            after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 
            after:bg-gradient-to-r after:from-blue-500 after:to-purple-500`} 
            {...props} 
            />
        ),

        td: ({ node, ...props }) => (
            <td className={`text-gray-800 border-r border-gray-100 last:border-r-0
            group-hover:text-gray-900 transition-colors duration-200
            ${isActuallyMobile ? 
                'px-4 py-3 text-sm md:px-6 md:py-4 md:text-base' : 
                'px-6 py-4 text-base'
            }`} 
            {...props} 
            />
        ),

        strong: ({ node, ...props }) => (
            <strong className="font-bold text-gray-900 bg-gradient-to-r from-yellow-200 to-yellow-100 
            px-1 rounded-sm hover:from-yellow-300 hover:to-yellow-200 transition-colors duration-200" 
            {...props} 
            />
        ),

        em: ({ node, ...props }) => (
            <em className="italic text-blue-700 font-medium" {...props} />
        ),

        button: ({ node, ...props }) => (
            <button className="relative inline-flex items-center justify-center px-6 py-3 
            bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg
            hover:from-blue-600 hover:to-purple-700 active:scale-95
            transform transition-all duration-200 shadow-lg hover:shadow-xl
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r 
            before:from-white/20 before:to-transparent before:opacity-0 
            hover:before:opacity-100 before:transition-opacity before:duration-300" 
            {...props} 
            />
        ),
    };
}
const CodeBlock = ({ className, children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const codeRef = useRef(null);
  const [isLongCode, setIsLongCode] = useState(false);
  const isActuallyMobile = useIsMobile();

  useEffect(() => {
    if (codeRef.current) {
      const lineCount = codeRef.current.textContent.split('\n').length;
      setIsLongCode(lineCount > 15);
    }
  }, [children]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const language = className?.match(/language-(\w+)/)?.[1] || 'text';

  return (
    <div className={`relative group rounded-xl overflow-hidden bg-gradient-to-br 
      from-gray-900 via-gray-800 to-gray-900 border border-gray-700 shadow-2xl
      hover:shadow-blue-900/20 transition-all duration-500 animate-in zoom-in-95
      ${isActuallyMobile ? 'my-6 md:my-8' : 'my-8'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r 
        from-gray-800 to-gray-700 border-b border-gray-600">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-gray-400 text-sm font-mono ml-2">{language}</span>
        </div>
        <div className="flex items-center gap-2">
          {isLongCode && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 
                hover:text-white transition-colors rounded"
            >
              {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
          )}
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 
              hover:text-white transition-colors rounded hover:bg-gray-700"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className={`relative overflow-auto transition-all duration-300 ${
        isLongCode && !isExpanded ? 'max-h-80' : 'max-h-none'
      }`}>
        <pre className={`text-gray-100 font-mono leading-relaxed
          ${isActuallyMobile ? 'p-4 text-sm md:p-6 md:text-base' : 'p-6 text-base'}`}>
          <code ref={codeRef} className={className} {...props}>
            {children}
          </code>
        </pre>
        
        {/* Fade overlay for collapsed long code */}
        {isLongCode && !isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t 
            from-gray-900 to-transparent pointer-events-none"></div>
        )}
      </div>
    </div>
  );
};

export default useMDXcomponents;
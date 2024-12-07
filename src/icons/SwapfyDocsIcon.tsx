const SwapfyDocsIcon = ({ width = 16, height = 16 }: { width?: string | number; height?: string | number }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24"
      width={width}
      height={height}
      fill="none"
    >
      <defs>
        <linearGradient id="docsGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9945FF"/>
          <stop offset="100%" stopColor="#14F195"/>
        </linearGradient>
      </defs>
      
      {/* Main page with gradient stroke */}
      <path 
        d="M6 4 L14 4 L18 8 L18 20 L6 20 Z" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinejoin="round"
        className="text-white"
      />
      
      {/* Folded corner */}
      <path 
        d="M14 4 L14 8 L18 8" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinejoin="round"
        className="text-white"
      />
      
      {/* Gradient overlay */}
      <path 
        d="M6 4 L14 4 L18 8 L18 20 L6 20 Z M14 4 L14 8 L18 8" 
        stroke="url(#docsGradient)" 
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.8"
      />
    </svg>
  );
};

export default SwapfyDocsIcon;
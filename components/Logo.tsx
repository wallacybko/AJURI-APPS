
import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        className={className} 
        aria-label="LitiScan Logo"
    >
        <g fill="none" strokeWidth="1.5">
            {/* Magnifying Glass */}
            <circle cx="11.5" cy="11.5" r="8" stroke="#f97316" /> {/* Orange Circle */}
            <path stroke="#0f172a" strokeLinecap="round" strokeLinejoin="round" d="M11.5 11.5 L17.5 17.5" transform="translate(2, 2) scale(0.8)" /> {/* Inner Handle Part - Dark Blue */}
            <path stroke="#f97316" strokeLinecap="round" strokeLinejoin="round" d="M18.5 18.5 L22 22" /> {/* Orange Handle */}

            {/* Chart Icon inside Magnifying Glass */}
            <g stroke="#0f172a" strokeLinecap="round" strokeLinejoin="round"> {/* Dark Blue Chart */}
                {/* Bar Chart */}
                <path d="M9 14 V10" />
                <path d="M11.5 14 V8" />
                <path d="M14 14 V12" />
                {/* Arrow Up */}
                <path d="M10 9 L11.5 7.5 L13 9" />
                {/* Arrow Down */}
                <path d="M13 13 L14.5 14.5 L16 13" stroke="#f97316" /> {/* Orange Arrow Down */}
            </g>
        </g>
    </svg>
);

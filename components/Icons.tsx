
import React from 'react';

interface IconProps {
  className?: string;
}

export const EiffelIcon: React.FC<IconProps> = ({ className = "w-8 h-8 mr-2 text-[#89CFF0]" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2v20M7 22l5-20 5 20M9 15h6M10 11h4M11 6h2" />
  </svg>
);

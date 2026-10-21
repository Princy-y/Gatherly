import React from 'react';

export const KawaiiBow: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 28,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
  >
    {/* Left Loop */}
    <path
      d="M32 30C25 18 10 22 14 34C18 44 28 36 32 32Z"
      fill="#FFD9E8"
      stroke="#554564"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Right Loop */}
    <path
      d="M32 30C39 18 54 22 50 34C46 44 36 36 32 32Z"
      fill="#FFD9E8"
      stroke="#554564"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Ribbons */}
    <path
      d="M28 34Q20 48 16 52Q24 48 30 38"
      fill="#FFD9E8"
      stroke="#554564"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M36 34Q44 48 48 52Q40 48 34 38"
      fill="#FFD9E8"
      stroke="#554564"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Knot */}
    <circle cx="32" cy="32" r="6" fill="#FFF0B8" stroke="#554564" strokeWidth="2.5" />
    <path d="M30 31Q32 29 34 31" stroke="#554564" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const KawaiiSparkle: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 22,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
    aria-hidden="true"
  >
    <path
      d="M16 2Q17 13 28 16Q17 19 16 30Q15 19 4 16Q15 13 16 2Z"
      fill="#FFF0B8"
      stroke="#554564"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <circle cx="25" cy="7" r="1.5" fill="#FFD9E8" />
  </svg>
);

export const KawaiiFlower: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
    aria-hidden="true"
  >
    <circle cx="16" cy="8" r="4.5" fill="#DCCEFF" stroke="#554564" strokeWidth="1.5" />
    <circle cx="24" cy="16" r="4.5" fill="#DCCEFF" stroke="#554564" strokeWidth="1.5" />
    <circle cx="16" cy="24" r="4.5" fill="#DCCEFF" stroke="#554564" strokeWidth="1.5" />
    <circle cx="8" cy="16" r="4.5" fill="#DCCEFF" stroke="#554564" strokeWidth="1.5" />
    <circle cx="16" cy="16" r="4.5" fill="#FFF0B8" stroke="#554564" strokeWidth="1.8" />
  </svg>
);

export const KawaiiBunnyMascot: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 48,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
    aria-label="Gatherly Bunny Mascot"
    role="img"
  >
    {/* Left Ear */}
    <ellipse cx="23" cy="18" rx="6" ry="14" fill="#FFFFFF" stroke="#554564" strokeWidth="2.5" />
    <ellipse cx="23" cy="19" rx="3" ry="9" fill="#FFD9E8" />
    {/* Right Ear */}
    <ellipse cx="41" cy="18" rx="6" ry="14" fill="#FFFFFF" stroke="#554564" strokeWidth="2.5" />
    <ellipse cx="41" cy="19" rx="3" ry="9" fill="#FFD9E8" />
    {/* Head */}
    <ellipse cx="32" cy="40" rx="20" ry="16" fill="#FFFFFF" stroke="#554564" strokeWidth="2.5" />
    {/* Cheeks */}
    <ellipse cx="20" cy="42" rx="3.5" ry="2" fill="#FFD9E8" />
    <ellipse cx="44" cy="42" rx="3.5" ry="2" fill="#FFD9E8" />
    {/* Eyes */}
    <circle cx="26" cy="38" r="2.2" fill="#554564" />
    <circle cx="38" cy="38" r="2.2" fill="#554564" />
    <circle cx="25" cy="37" r="0.7" fill="#FFFFFF" />
    <circle cx="37" cy="37" r="0.7" fill="#FFFFFF" />
    {/* Nose & Mouth */}
    <polygon points="30,41 34,41 32,43" fill="#FFD9E8" stroke="#554564" strokeWidth="1" />
    <path d="M30 44Q32 46 34 44" stroke="#554564" strokeWidth="1.8" strokeLinecap="round" />
    {/* Tiny Flower on Ear */}
    <circle cx="18" cy="28" r="3" fill="#FFF0B8" stroke="#554564" strokeWidth="1.2" />
  </svg>
);

// frontend/src/Logo.jsx
import React from "react";

export default function Logo({ size = 48 }) {
  // simple ghat/boat + wave symbol, scalable
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0" stopColor="#60a5fa" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      {/* circle background */}
      <circle cx="32" cy="32" r="30" fill="#071a2a" stroke="url(#g1)" strokeWidth="2" />

      {/* small temple/pillar */}
      <rect x="27" y="14" width="10" height="12" rx="1" fill="#e6eef8" opacity="0.95" />
      <rect x="24" y="24" width="16" height="3" rx="1" fill="#e6eef8" opacity="0.9" />

      {/* stylized boat */}
      <path
        d="M12 44 C20 36, 44 36, 52 44 L48 48 C40 42, 24 42,16 48 Z"
        fill="#fff"
        opacity="0.95"
        transform="translate(0, -2)"
      />

      {/* waves */}
      <path d="M8 50 C14 46, 20 50, 26 50 C32 50, 38 46, 44 50 C50 54, 56 50, 60 50" stroke="#60a5fa" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.95"/>
    </svg>
  );
}

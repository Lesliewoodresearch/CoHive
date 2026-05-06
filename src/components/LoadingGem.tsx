interface LoadingGemProps {
  message?: string;
}

export function LoadingGem({ message = 'Communicating with Databricks...' }: LoadingGemProps) {
  return (
    <div className="fixed inset-y-0 left-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" style={{ right: 'var(--modal-r)' }}>
      <div className="flex flex-col items-center gap-6">
        <SpinHex className="w-32 h-32" />
        <p className="text-white text-xl font-semibold tracking-wide">{message}</p>
      </div>
    </div>
  );
}

/**
 * SpinHex — small inline rotating hex spinner.
 * Drop-in replacement for Loader2, Loader, Cpu, or gemIcon animate-spin.
 * Size is controlled via className (e.g. "w-4 h-4", "w-6 h-6", "w-10 h-10").
 */
export function SpinHex({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 165"
      className={className}
      style={{ animation: 'spinHex 2s linear infinite', flexShrink: 0 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="spinHexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#7C3AED" />
          <stop offset="35%"  stopColor="#DC2626" />
          <stop offset="65%"  stopColor="#C026D3" />
          <stop offset="100%" stopColor="#9333EA" />
        </linearGradient>
        <radialGradient id="spinHexGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FEF08A" stopOpacity="1.0" />
          <stop offset="45%"  stopColor="#FACC15" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#EAB308" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      {/* Outer hex */}
      <path d="M 50 0 L 150 0 L 200 82.5 L 150 165 L 50 165 L 0 82.5 Z"
            fill="url(#spinHexGrad)" />
      {/* Red facet top-right */}
      <path d="M 100 0 L 200 82.5 L 100 82.5 Z"
            fill="#B91C1C" opacity="0.35" />
      {/* Purple facet bottom-left */}
      <path d="M 0 82.5 L 100 82.5 L 50 165 Z"
            fill="#9333EA" opacity="0.35" />
      {/* Yellow inner glow */}
      <path d="M 70 25 L 130 25 L 165 82.5 L 130 140 L 70 140 L 35 82.5 Z"
            fill="url(#spinHexGlow)" opacity="0.6" />
      <style>{`
        @keyframes spinHex {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </svg>
  );
}

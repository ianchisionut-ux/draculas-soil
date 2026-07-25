export function WaxSeal({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="waxGrad" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#c81f30" />
          <stop offset="55%" stopColor="#8a1220" />
          <stop offset="100%" stopColor="#4a0a10" />
        </radialGradient>
      </defs>
      <path
        d="M50 4c4 8-4 10 2 16 6 4 14-4 18 4 4 8-6 10-2 18 4 8 14 4 14 12 0 8-10 6-12 14-2 8 8 12 2 18-6 6-12-4-18 0-6 4-2 14-10 14-8 0-6-10-14-12-8-2-10 8-18 2-6-6 4-12 0-18-4-6-14-2-14-10 0-8 10-6 12-14 2-8-8-12-2-18 6-6 12 4 18 0 6-4 2-14 10-14 4 0 6 3 8 6z"
        fill="url(#waxGrad)"
      />
      <text
        x="50"
        y="57"
        textAnchor="middle"
        fontSize="26"
        fontFamily="Cinzel, serif"
        fill="#e9c98a"
      >
        DS
      </text>
    </svg>
  );
}

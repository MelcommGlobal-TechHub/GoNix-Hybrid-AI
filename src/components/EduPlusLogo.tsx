export default function EduPlusLogo() {
  return (
    <svg
      className="edu-logo"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1600 420"
      role="img"
      aria-labelledby="nexora-logo-title"
    >
      <title id="nexora-logo-title">NEXORA — The Next Era Starts Here</title>

      <defs>
        <linearGradient id="nexora-logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--blue)" />
          <stop offset="0.55" stopColor="var(--violet)" />
          <stop offset="1" stopColor="var(--blue)" />
        </linearGradient>
      </defs>

      <g transform="translate(20 35)">
        <path
          d="M35 240 C85 325 185 335 260 255 L345 165"
          fill="none"
          stroke="url(#nexora-logo-gradient)"
          strokeWidth="42"
          strokeLinecap="round"
        />
        <path
          d="M65 95 C120 25 210 35 275 95 L365 185"
          fill="none"
          stroke="url(#nexora-logo-gradient)"
          strokeWidth="42"
          strokeLinecap="round"
        />
        <path
          d="M80 270 L305 65"
          fill="none"
          stroke="url(#nexora-logo-gradient)"
          strokeWidth="34"
          strokeLinecap="round"
        />
        <path
          d="M365 25 l9 25 25 9 -25 9 -9 25 -9 -25 -25 -9 25 -9z"
          fill="url(#nexora-logo-gradient)"
        />
      </g>

      <text
        x="460"
        y="215"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="142"
        fontWeight="850"
        letterSpacing="3"
        fill="var(--text)"
      >
        NEXORA
      </text>

      <text
        x="470"
        y="300"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="31"
        fontWeight="600"
        letterSpacing="8"
        fill="var(--muted)"
      >
        THE NEXT ERA STARTS HERE.
      </text>
    </svg>
  )
}

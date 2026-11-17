export default function EduPlusLogo() {
  return (
    <svg
      className="edu-logo"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1600 420"
      role="img"
      aria-labelledby="edu-logo-title"
    >
      <title id="edu-logo-title">GoNix EduPlus — Learn More. Become More.</title>

      <defs>
        <linearGradient id="edu-logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--blue)" />
          <stop offset="1" stopColor="var(--violet)" />
        </linearGradient>
      </defs>

      <g transform="translate(35 28)">
        <path
          d="M260 38 A155 155 0 1 0 282 290"
          fill="none"
          stroke="url(#edu-logo-gradient)"
          strokeWidth="25"
          strokeLinecap="round"
        />
        <path
          d="M48 270 C100 355 260 365 340 235"
          fill="none"
          stroke="url(#edu-logo-gradient)"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d="M105 185 H240 L205 220 H150"
          fill="none"
          stroke="var(--text)"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M300 35 l10 28 28 10 -28 10 -10 28 -10 -28 -28 -10 28 -10z"
          fill="url(#edu-logo-gradient)"
        />
      </g>

      <text
        x="430"
        y="205"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="120"
        fontWeight="750"
        fill="var(--text)"
      >
        GoNix
      </text>

      <text
        x="790"
        y="205"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="120"
        fontWeight="750"
        fill="url(#edu-logo-gradient)"
      >
        EduPlus
      </text>

      <path
        d="M795 230 Q1110 260 1390 225"
        fill="none"
        stroke="url(#edu-logo-gradient)"
        strokeWidth="8"
      />

      <text
        x="435"
        y="305"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="34"
        letterSpacing="10"
        fill="var(--muted)"
      >
        LEARN MORE. BECOME MORE.
      </text>
    </svg>
  )
}

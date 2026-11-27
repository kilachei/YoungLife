// Simple club badge: a shield with the club initials.
// Props: size (px) and text (initials shown inside).
export default function Logo({ size = 38, text = 'YLC' }) {
  const label = String(text).slice(0, 3).toUpperCase()
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label={`${label} club badge`}
      className="flex-shrink-0"
    >
      <path
        d="M24 3 L42 9 V23 C42 33 34 41 24 45 C14 41 6 33 6 23 V9 Z"
        fill="#1e293b"
        stroke="#38bdf8"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Barlow Condensed', Impact, 'Arial Narrow', sans-serif"
        fontWeight="800"
        fontSize={label.length > 2 ? 15 : 18}
        letterSpacing="0.5"
        fill="#e0f2fe"
      >
        {label}
      </text>
    </svg>
  )
}
interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  isBeta?: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 90) return "#22c55e"; // success
  if (score >= 80) return "#4a63f7"; // brand
  if (score >= 70) return "#f59e0b"; // warning
  if (score >= 60) return "#f97316"; // orange
  return "#ef4444"; // error
}

export function ScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  isBeta = false,
}: ScoreRingProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, score));
  const offset = circumference - (pct / 100) * circumference;
  const color = getScoreColor(score);
  const center = size / 2;
  const fontSize = size * 0.22;
  const betaFontSize = size * 0.11;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="transform -rotate-90"
    >
      {/* Track */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#1a1d24"
        strokeWidth={strokeWidth}
      />
      {/* Progress */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      {/* Score text — rotate back to normal */}
      <g transform={`rotate(90 ${center} ${center})`}>
        <text
          x={center}
          y={center + fontSize * 0.35}
          textAnchor="middle"
          fill={color}
          fontSize={fontSize}
          fontWeight="700"
          fontFamily="-apple-system, sans-serif"
        >
          {score}
        </text>
        {isBeta && (
          <text
            x={center}
            y={center + fontSize * 0.35 + betaFontSize * 1.3}
            textAnchor="middle"
            fill="#6b7280"
            fontSize={betaFontSize}
            fontFamily="-apple-system, sans-serif"
          >
            BETA
          </text>
        )}
      </g>
    </svg>
  );
}

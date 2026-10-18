export function ResearchMark({ type }: { type: string }) {
  return (
    <svg
      className={`research-mark mark-${type}`}
      viewBox="0 0 120 80"
      fill="none"
      aria-hidden="true"
    >
      {type === "autonomous" ? (
        <>
          <path
            d="M24 40 60 14 96 40 60 66ZM24 40h72M60 14v52"
            stroke="currentColor"
          />
          <path
            d="m24 40 36 10 36-10M60 14v36"
            stroke="currentColor"
            opacity=".4"
          />
          {[
            [24, 40],
            [60, 14],
            [96, 40],
            [60, 66],
            [60, 50],
          ].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="4" fill="currentColor" />
          ))}
        </>
      ) : type === "efficient" ? (
        <>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <path
                d={`M${20 + i * 19} ${12 + i * 5}v${56 - i * 10}`}
                stroke="currentColor"
                opacity={0.25 + i * 0.15}
              />
              <circle
                cx={20 + i * 19}
                cy={22 + i * 8}
                r="4"
                fill="currentColor"
              />
            </g>
          ))}
          <path d="m20 22 19 8 19 8 19 8 19 8" stroke="currentColor" />
        </>
      ) : (
        <>
          {[14, 26, 38].map((r) => (
            <ellipse
              key={r}
              cx="60"
              cy="40"
              rx={r}
              ry={r * 0.7}
              stroke="currentColor"
              opacity={1 - r / 60}
            />
          ))}
          <path
            d="M12 40h96M60 6v68"
            stroke="currentColor"
            strokeDasharray="2 4"
            opacity=".4"
          />
          <circle cx="60" cy="40" r="4" fill="currentColor" />
          <path d="m77 23 6 6m-6 0 6-6" stroke="currentColor" />
        </>
      )}
    </svg>
  );
}

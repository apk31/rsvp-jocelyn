import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown"

const EVENT_TIME = new Date("2026-05-01T18:00:00+07:00")

export default function EventCountdown() {
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")

  return (
    <div className="flex justify-center">
      <FlipClockCountdown
  to={EVENT_TIME.getTime()}
  digitBlockStyle={{
    width: 55,
    height: 70,
    fontSize: 24,
    background: isDark ? "#1e293b" : "#ffffff",
    color: isDark ? "#f43f5e" : "#1f2937",
    borderRadius: 10,
    boxShadow: isDark
      ? "0 4px 12px rgba(0,0,0,0.3)"
      : "0 4px 12px rgba(0,0,0,0.08)",
  }}
  labelStyle={{
    fontSize: 12,
    fontWeight: 600,
    color: isDark ? "#94a3b8" : "#475569",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    marginTop: 8,
  }}
    />
    </div>
  )
}
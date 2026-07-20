import { useMemo } from "react";

export function FloatingBubbles() {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        size: Math.random() * 28 + 12,
        left: Math.random() * 100,
        duration: Math.random() * 8 + 12,
        delay: Math.random() * 10,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {bubbles.map((bubble) => (
        <span
          key={bubble.id}
          className="absolute bottom-0 rounded-full bubble"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

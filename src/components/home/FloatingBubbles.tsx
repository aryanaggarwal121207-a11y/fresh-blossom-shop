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
        <div
          key={bubble.id}
          className="absolute rounded-full bg-red-500"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            bottom: "0px",
          }}
        />
      ))}
    </div>
  );
}

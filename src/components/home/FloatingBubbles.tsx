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
  <div className="absolute inset-0 z-50 bg-red-500/20">
    TEST
  </div>
);
}

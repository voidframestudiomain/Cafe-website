/**
 * Wavy section divider. Fills below the curve with `currentColor` —
 * set the color via a text-* class and flip it to point the other way.
 */
export default function Wave({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      aria-hidden
      className={`block h-10 w-full sm:h-16 ${flip ? "rotate-180" : ""} ${className}`}
    >
      <path
        fill="currentColor"
        d="M0,48 C240,88 480,10 720,34 C960,58 1200,92 1440,42 L1440,90 L0,90 Z"
      />
    </svg>
  );
}

/** Infinite horizontal ticker (pure CSS animation, pauses on hover). */
export default function Marquee({ items }: { items: string[] }) {
  const row = (ariaHidden: boolean) => (
    <div className="marquee-track" aria-hidden={ariaHidden}>
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className="font-display whitespace-nowrap text-3xl text-[#d4d1c9] sm:text-5xl"
        >
          {item}
          <span className="mx-8 inline-block align-middle text-base">·</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee border-y hairline py-6">
      {row(false)}
      {row(true)}
    </div>
  );
}

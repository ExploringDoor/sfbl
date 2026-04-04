/* eslint-disable @next/next/no-img-element */
interface Props {
  abbr: string;
  color: string;
  size?: number;
  logo?: string;
}

export default function TeamLogo({ abbr, color, size = 34, logo }: Props) {
  if (logo) {
    return (
      <img
        src={logo}
        alt={abbr}
        className="gb-logo"
        style={{
          width: size,
          height: size,
          minWidth: size,
        }}
      />
    );
  }

  return (
    <div
      className="gb-logo"
      style={{
        width: size,
        height: size,
        minWidth: size,
        background: color,
        borderColor: color,
        color: '#fff',
        fontSize: Math.max(7, size * 0.24),
        border: '1.5px solid',
      }}
    >
      {abbr}
    </div>
  );
}

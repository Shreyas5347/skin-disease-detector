export function DermalensMark(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 52 52"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {/* Soft rounded tile background */}
      <rect x="4" y="6" width="42" height="42" rx="14" fill="#356E62" />

      {/* Heart with Pulse / ECG Line */}
      <g stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Heart Outline */}
        <path d="M25 39s-10-6.5-13.5-12.2C8.6 22 10.2 16.5 15.5 15.2c3.5-.8 7 1 9.5 4.3 2.5-3.3 6-5.1 9.5-4.3 5.3 1.3 6.9 6.8 4 11.6C35 32.5 25 39 25 39z" />

        {/* Pulse / ECG Line across the center */}
        <path d="M12.5 27.5h7.2l2.3-4.5 3 8 2.8-5.5 1.7 2h7.8" />
      </g>

      {/* Coral accent dot at top-right */}
      <circle cx="43.5" cy="8.5" r="4.5" fill="#E28D6B" />
    </svg>
  );
}

export default DermalensMark;

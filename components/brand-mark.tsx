export function BrandMark({hero = false}: {hero?: boolean}) {
  return <span className={`brand-mark${hero ? ' hero-brand-mark' : ''}`} aria-hidden="true">
    <svg viewBox="0 0 64 64" fill="none" focusable="false">
      <path d="M14 12h36a6 6 0 0 1 6 6v25a6 6 0 0 1-6 6H35L22 57v-8h-8a6 6 0 0 1-6-6V18a6 6 0 0 1 6-6Z" fill="currentColor"/>
      <path d="M16 20h32" stroke="#171A1F" strokeWidth="3" strokeLinecap="round"/>
      <g fill="#171A1F"><circle cx="20" cy="34" r="4"/><circle cx="32" cy="34" r="4"/><circle cx="44" cy="34" r="4"/></g>
    </svg>
  </span>;
}

/** Inline film-reel mark: no external image or font dependency. */
export function BrandMark({hero=false}:{hero?:boolean}) {
  return <span className={`reel-brand${hero?' reel-brand-hero':''}`} aria-hidden="true">
    <svg className="reel-brand-symbol" width={hero?72:40} height={hero?72:40} viewBox="0 0 64 64" fill="none" focusable="false">
      <rect x="2" y="2" width="60" height="60" rx="16" fill="var(--brand-accent, #b72e36)"/>
      <path d="M32 11a21 21 0 1 0 0 42h18" stroke="#fff8e8" strokeWidth="3.5" strokeLinecap="round"/>
      <ellipse cx="32" cy="20" rx="5" ry="5" fill="#fff8e8"/>
      <ellipse cx="21.6" cy="38" rx="5" ry="5" fill="#fff8e8"/>
      <ellipse cx="42.4" cy="38" rx="5" ry="5" fill="#fff8e8"/>
      <path d="m29 28 8 4-8 4Z" fill="#fff8e8"/>
    </svg>
    <span className="reel-brand-words"><span>THREE</span><span>CLUES</span></span>
  </span>;
}

/** Scalable, code-native Missing Frame logo. */
export function BrandMark({hero=false}:{hero?:boolean}) {
  return <span className={`reel-brand${hero?' reel-brand-hero':''}`} aria-hidden="true">
    <svg className="reel-brand-symbol" viewBox="0 0 64 64" fill="none" focusable="false">
      <path d="M22 7H7v50h15M42 7h15v50H42" stroke="var(--brand-accent, #4169ff)" strokeWidth="5" strokeLinejoin="round"/>
      <rect x="15" y="15" width="34" height="34" rx="6" fill="var(--brand-accent, #4169ff)"/>
      <path d="M27 27a5 5 0 1 1 8 4c-2 1.5-3 2-3 5" stroke="#F6F7FB" strokeWidth="3.5" strokeLinecap="round"/>
      <circle cx="32" cy="42" r="2" fill="#F6F7FB"/>
    </svg>
    <span className="reel-brand-words"><span>THREE</span><span>CLUES</span></span>
  </span>;
}

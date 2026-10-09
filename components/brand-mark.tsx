/** Scalable, code-native Missing Frame logo. */
export function BrandMark({hero=false}:{hero?:boolean}) {
  return <span className={`reel-brand${hero?' reel-brand-hero':''}`} aria-hidden="true">
    <svg className="reel-brand-symbol" viewBox="0 0 64 64" fill="none" focusable="false">
      <path d="M12 12H6v40h6M52 12h6v40h-6" stroke="currentColor" strokeWidth="4" strokeLinecap="square"/>
      <rect x="17" y="6" width="30" height="52" rx="7" fill="var(--brand-accent, #4169ff)"/>
      <path d="M26 23a6 6 0 1 1 10 4.5c-3 2-4 3-4 7" stroke="white" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="32" cy="43" r="2.5" fill="white"/>
    </svg>
    <span className="reel-brand-words"><span>THREE</span><span>CLUES</span></span>
  </span>;
}

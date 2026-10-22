/** Inline mystery-frame logo, crisp at every screen size. */
export function BrandMark({hero=false}:{hero?:boolean}) {
 return <span className={`reel-brand${hero?' reel-brand-hero':''}`} aria-hidden="true">
  <svg className="reel-brand-symbol" width={hero?76:42} height={hero?76:42} viewBox="0 0 64 64" fill="none" focusable="false">
   <rect x="2" y="2" width="60" height="60" rx="15" fill="var(--brand-accent, #4169ff)"/>
   <path d="M13 24V13h11M40 13h11v11M51 40v11H40M24 51H13V40" stroke="#f6f7fb" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
   <path d="M25.5 26.5c.5-5 3.7-8 8.4-8 5 0 8.6 3.2 8.6 7.8 0 3.8-2.3 5.8-5 7.5-2.6 1.7-3.8 3-3.8 6" stroke="#f6f7fb" strokeWidth="4" strokeLinecap="round"/>
   <circle cx="33.7" cy="47" r="2.6" fill="#f6f7fb"/>
  </svg>
  <span className="reel-brand-words"><span>THREE</span><span>CLUES</span></span>
 </span>;
}

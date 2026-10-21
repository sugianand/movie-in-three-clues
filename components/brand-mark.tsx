/** Inline film-reel logo, crisp at every screen size. */
export function BrandMark({hero=false}:{hero?:boolean}) {
 return <span className={`reel-brand${hero?' reel-brand-hero':''}`} aria-hidden="true">
  <svg className="reel-brand-symbol" width={hero?76:42} height={hero?76:42} viewBox="0 0 64 64" fill="none" focusable="false">
   <rect x="2" y="2" width="60" height="60" rx="17" fill="var(--brand-accent, #e74752)"/>
   <path d="M32 11a21 21 0 1 0 0 42h18" stroke="#fff8ee" strokeWidth="3.5" strokeLinecap="round"/>
   <ellipse cx="32" cy="20" rx="5" ry="5" fill="#fff8ee"/>
   <ellipse cx="21.6" cy="38" rx="5" ry="5" fill="#fff8ee"/>
   <ellipse cx="42.4" cy="38" rx="5" ry="5" fill="#fff8ee"/>
   <path d="m29 28 8 4-8 4Z" fill="#fff8ee"/>
  </svg>
  <span className="reel-brand-words"><span>THREE</span><span>CLUES</span></span>
 </span>;
}

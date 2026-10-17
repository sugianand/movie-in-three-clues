/** The same three-frame monogram is used in public/favicon.svg. */
export function BrandMark({hero=false}:{hero?:boolean}) {
  return <span className={`movie-brand${hero?' movie-brand-hero':''}`} aria-hidden="true">
    <svg className="movie-brand-symbol" viewBox="0 0 64 64" fill="none" focusable="false">
      <rect x="3" y="3" width="58" height="58" rx="13" fill="var(--brand-accent)"/>
      <path d="M24 20h9a7 7 0 0 1 0 14h-5m5 0a7 7 0 0 1 0 14h-9" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 15v5m0 10v5m0 10v5m42-35v5m0 10v5m0 10v5" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    </svg>
    <span className="movie-brand-wordmark"><span>3</span>movies</span>
    <svg className="arena-motifs" viewBox="0 0 100 24" fill="none" focusable="false"><circle cx="12" cy="12" r="9"/><path d="m50 3 10 18H40Z"/><path d="M79 3h18v18H79Z"/></svg>
  </span>;
}

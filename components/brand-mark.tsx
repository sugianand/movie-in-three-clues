/**
 * Three Clues logo: a question mark inside a camera viewfinder frame, on the theme's accent color.
 * The wordmark stacks THREE over CLUES, as in the original design.
 */
export function LogoSymbol({size = 40}: {size?: number}) {
  return <svg className="tc-logo-symbol" width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false">
    <rect width="64" height="64" rx="16" fill="var(--brand-accent, #4169ff)"/>
    <g stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 24v-5a5 5 0 0 1 5-5h5"/>
      <path d="M40 14h5a5 5 0 0 1 5 5v5"/>
      <path d="M50 40v5a5 5 0 0 1-5 5h-5"/>
      <path d="M24 50h-5a5 5 0 0 1-5-5v-5"/>
      <path d="M25.6 26.4a6.6 6.6 0 1 1 9.9 5.7c-2.2 1.3-3.5 2.6-3.5 5v.6" strokeWidth="4.6"/>
    </g>
    <circle cx="32" cy="44.2" r="2.9" fill="#fff"/>
  </svg>;
}

export function BrandMark() {
  return <span className="tc-logo">
    <LogoSymbol size={42}/>
    <span className="tc-logo-word"><span>THREE</span><span>CLUES</span></span>
  </span>;
}

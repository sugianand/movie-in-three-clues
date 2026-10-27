/**
 * Three Clues logo: three fanned clue cards, the front one carrying a play mark.
 * Colors come from the active theme (--brand-accent), so every theme gets its own version.
 */
export function LogoSymbol({size = 40}: {size?: number}) {
  return <svg className="tc-logo-symbol" width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false">
    <rect width="64" height="64" rx="16" fill="var(--brand-accent, #b72e36)"/>
    <g transform="translate(-1.5 1)"><rect x="11" y="13" width="24" height="33" rx="4.5" transform="rotate(-20 23 29.5)" fill="#fff6e8" fillOpacity=".38"/><rect x="18" y="12" width="24" height="33" rx="4.5" transform="rotate(-4 30 28.5)" fill="#fff6e8" fillOpacity=".68"/><g transform="rotate(12 37 31.5)"><rect x="25" y="15" width="24" height="33" rx="4.5" fill="#fff6e8"/><path d="M33.5 25.5 43.5 31.5 33.5 37.5Z" fill="var(--brand-accent, #b72e36)"/></g></g>
  </svg>;
}

export function BrandMark({hero = false}: {hero?: boolean}) {
  return <span className={`tc-logo${hero ? ' tc-logo-hero' : ''}`}>
    <LogoSymbol size={hero ? 72 : 38}/>
    <span className="tc-logo-word">Three Clues</span>
  </span>;
}

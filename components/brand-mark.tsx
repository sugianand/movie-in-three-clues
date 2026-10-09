export function BrandMark({hero = false}: {hero?: boolean}) {
  return <span className={`brand-mark${hero ? ' hero-brand-mark' : ''}`} aria-hidden="true">
    <b>3</b><span className="brand-mark-pips"><i/><i/><i/></span>
  </span>;
}

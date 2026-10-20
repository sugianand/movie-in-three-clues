function Vines(){
 return <div className="upside-vines">
  {['left','right'].map(side=><svg key={side} className={`vine-edge vine-edge-${side}`} viewBox="0 0 240 900" preserveAspectRatio="none" focusable="false">
   <g className="vine-trunks" fill="none" strokeLinecap="round">
    <path d="M-25 940 C180 770 -80 650 100 505 S-70 300 65 150 S15 20 100 -60"/>
    <path d="M0 920 C95 795 30 710 75 630 S10 440 45 350 S-5 165 25 -30"/>
    <path d="M-40 720 C160 650 5 525 55 435 S125 235 -30 150"/>
   </g>
   <g className="vine-tendrils" fill="none" strokeLinecap="round">
    <path d="M50 675 C175 645 115 570 205 590 M80 510 C175 480 110 405 190 380 M35 340 C165 335 95 220 180 245 M40 180 C125 150 90 75 165 65"/>
    <path d="M75 630 C135 690 175 700 180 760 M50 435 C120 410 165 450 215 425 M60 105 C125 115 170 175 215 145"/>
   </g>
   <g className="vine-veins" fill="none"><path d="M0 910 C100 760 0 680 80 520 S-20 300 55 160 S10 40 85 -30"/></g>
  </svg>)}
 </div>;
}
function Guard({side}:{side:'left'|'right'}){
 return <div className={`arena-guard arena-guard-${side}`}>
  <svg viewBox="0 0 220 390" focusable="false">
   <path d="M14 390 25 280 Q35 247 70 235 L65 201 Q35 180 42 126 Q40 48 108 23 Q182 39 186 123 Q196 177 160 207 L155 236 Q195 252 205 288 L220 390Z" fill="#b51c5d" stroke="#f25497" strokeWidth="3"/>
   <path d="M43 143 Q43 68 108 37 Q174 60 177 143 L156 210 Q109 246 64 208Z" fill="#ee397c"/>
   <path d="M60 122 Q65 75 108 65 Q155 78 162 122 L150 191 Q111 222 73 191Z" fill="#080d16" stroke="#661334" strokeWidth="5"/>
   <path d="M72 124 148 124 M69 140 153 140 M73 156 150 156 M79 172 144 172" stroke="#28303e" strokeWidth="1.5"/>
   {side==='left'?<circle cx="111" cy="139" r="27" fill="none" stroke="#f2f4ee" strokeWidth="6"/>:<path d="M111 111 140 161H82Z" fill="none" stroke="#f2f4ee" strokeWidth="6" strokeLinejoin="round"/>}
   <path d="M109 239V390" stroke="#4f1434" strokeWidth="7"/>
   <path d="M72 235 103 268 151 236 M36 285 65 312 M183 280 165 313" fill="none" stroke="#ff77a8" strokeWidth="3"/>
   <path d="M30 322 60 333 54 390H15 M193 321 164 333 171 390H216" fill="#84143f"/>
   <rect x="120" y="280" width="28" height="35" rx="3" fill="#84143f" stroke="#ee5d95"/>
  </svg>
  <span className="guard-hand"><i/><i/><i/></span>
 </div>;
}
export function CinemaBackdrop({subdued}: {subdued: boolean}) {
 return <div className={`cinema-backdrop${subdued ? ' cinema-backdrop-subdued' : ''}`} aria-hidden="true">
  <div className="cinema-backdrop-reel"/>
  <div className="theme-environment">
   <div className="theme-orbit"/><div className="theme-horizon"/>
   <div className="theme-geometry"><i/><i/><i/></div>
   <div className="theme-particles">{Array.from({length:12},(_,i)=><i key={i}/>)}</div>
  </div>
  <div className="cinema-backdrop-shade"/>
  <Vines/><div className="arena-lookouts"><Guard side="left"/><Guard side="right"/></div>
 </div>;
}

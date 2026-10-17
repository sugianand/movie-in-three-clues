import type {dailyPerformance} from '@/lib/daily-performance';

export function DailyPerformance({performance}:{performance:ReturnType<typeof dailyPerformance>}){
 const {counts,played,average}=performance;
 return <section className="daily-stats" aria-label="Daily solve breakdown"><span className="eyebrow">YOUR SOLVE BREAKDOWN</span><p>{played?<><strong>{average} / 300</strong> average points across {played} completed {played===1?'premiere':'premieres'}.</>:'Finish your first premiere to start your solve breakdown.'}</p><div className="daily-stat-grid">{['Clue 1 · 300 pts','Clue 2 · 200 pts','Clue 3 · 100 pts','Unsolved · 0 pts'].map((label,index)=><div key={label}><b>{counts[index]}</b><span>{label}</span></div>)}</div><p className="quiet">All completed premieres on this browser, including skipped reveals. Unfinished days don’t count.</p></section>;
}

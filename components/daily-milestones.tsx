import {Award,LockKeyhole} from 'lucide-react';
import {dailyMilestones} from '@/lib/daily-milestones';
import type {DailyView} from '@/lib/daily-types';

export function DailyMilestones({stats,counts}:{stats:DailyView['stats'];counts:number[]}){
 const milestones=dailyMilestones({...stats,counts}),earned=milestones.filter(item=>item.earned).length;
 return <section className="daily-stats daily-milestones" aria-label="Daily Premiere Passport"><div className="daily-milestones-heading"><div><span className="eyebrow">PREMIERE PASSPORT</span><h2>Your daily milestones</h2></div><strong>{earned} / {milestones.length}</strong></div><div className="daily-milestone-grid">{milestones.map(item=><div className={item.earned?'is-earned':''} key={item.id}>{item.earned?<Award aria-hidden="true"/>:<LockKeyhole aria-hidden="true"/>}<span><b>{item.name}</b><small>{item.description}</small></span><strong>{item.earned?'Earned':item.progress}</strong></div>)}</div><p className="quiet">Milestones use only your browser-linked Daily Premiere record. No movie answers are stored here.</p></section>;
}

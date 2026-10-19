import type {DailyResult} from '@/lib/daily-types';
import {dailyWeek} from '@/lib/daily-week';
import './daily-week.css';

export function DailyWeek({today,history}:{today:string;history:DailyResult[]}){
 const days=dailyWeek(today,history),wins=days.filter(day=>day.status==='won').length;
 return <section className="daily-history" aria-label="Last seven Daily Premieres"><span className="eyebrow">YOUR LAST SEVEN DAYS</span><p><strong>{wins} / 7</strong> premieres solved. One new movie every day.</p><ol className="daily-week-grid">{days.map(day=>{
  const label=new Date(day.date+'T12:00:00Z').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',timeZone:'UTC'});
  const status=day.status==='won'?`Solved · ${day.score} points`:day.status==='revealed'?'Revealed · 0 points':day.today?'Today · not finished':'No completed result';
  return <li key={day.date} data-status={day.status} aria-current={day.today?'date':undefined} aria-label={`${label}: ${status}`} title={`${label}: ${status}`}><span aria-hidden="true">{day.date.slice(8)}</span><strong aria-hidden="true">{day.status==='won'?'✓':day.status==='revealed'?'×':day.today?'○':'—'}</strong><small aria-hidden="true">{day.today?'Today':new Date(day.date+'T12:00:00Z').toLocaleDateString('en-US',{weekday:'short',timeZone:'UTC'})}</small></li>;
 })}</ol><p className="quiet">✓ Solved · × Revealed · — No result<br/>Today’s open circle stays available until midnight UTC. Results belong to this browser.</p></section>;
}

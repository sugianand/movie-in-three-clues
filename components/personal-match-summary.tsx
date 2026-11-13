import {personalMatchSummary,type PersonalMatchResult} from '@/lib/personal-match-summary';
import {encoreMission} from '@/lib/encore-mission';

export function PersonalMatchSummary({result}:{result:PersonalMatchResult}){
 const summary=personalMatchSummary(result);if(!summary)return null;
 const mission=encoreMission(summary,result.totalRounds);
 return <section className="personal-match-summary" aria-labelledby="personal-match-title">
  <div className="personal-match-heading"><span>YOUR CUT</span><h3 id="personal-match-title">{summary.headline}</h3></div>
  <div className="personal-match-stats">
   <div><strong>{summary.score}</strong><span>Match points</span></div>
   <div><strong>{summary.solves}/{result.totalRounds}</strong><span>Movies solved</span></div>
   <div><strong>{summary.firstClues}</strong><span>First-clue hits</span></div>
   <div><strong>{summary.averageClue===null?'—':summary.averageClue.toFixed(1)}</strong><span>Average clue</span></div>
  </div>
  {summary.fastestMs!==null&&<p>Fastest personal solve · {(summary.fastestMs/1000).toFixed(1)}s</p>}
  <div className="encore-mission" aria-label="Personal next-match goal">
   <div><span>NEXT-MATCH ENCORE</span><strong>{mission.title}</strong></div>
   <p><b>{mission.target}</b><span>{mission.detail}</span></p>
  </div>
 </section>;
}

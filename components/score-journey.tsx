import {scoreJourney,type ScoreJourneyRound} from '@/lib/score-journey';

export function ScoreJourney({recap,label='Player'}:{recap:ScoreJourneyRound[];label?:string}){
 const journey=scoreJourney(recap);
 if(!journey.rows.length)return null;
 return <section className="score-journey" aria-labelledby="score-journey-title">
  <div className="score-journey-heading"><span>SCORE JOURNEY</span><h3 id="score-journey-title">How the lead moved.</h3></div>
  <div className="score-journey-scroll"><table>
   <caption className="sr-only">Cumulative scores after every round</caption>
   <thead><tr><th scope="col">{label}</th>{journey.rounds.map(round=><th scope="col" key={round}>R{round+1}</th>)}</tr></thead>
   <tbody>{journey.rows.map(row=><tr key={row.name}><th scope="row">{row.name}</th>{row.scores.map((score,index)=><td key={journey.rounds[index]} className={row.leaders[index]?'is-leader':undefined}>{score===null?'—':score}{row.leaders[index]&&<span className="sr-only">, leader</span>}</td>)}</tr>)}</tbody>
  </table></div>
  <p>Cumulative points after each round. Highlighted scores led or tied for the lead.</p>
 </section>;
}

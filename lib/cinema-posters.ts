import posters from '../data/cinema-posters.json';

// Keep each film in exactly one row; duplicate only the complete row for its seam.
export const posterRows = Array.from({length:3},(_,row)=>posters.filter((_,index)=>index%3===row));

import {env} from 'cloudflare:workers';
export function roomDb(){if(!env.DB)throw Error('The game database is unavailable. Please try again.');return env.DB.withSession('first-primary');}

'use client';
import {useState,type RefObject} from 'react';
import catalog from '@/data/movie-titles.json';
import {findTitles} from '@/lib/title-search';

export function MovieTitleInput({id,value,onChange,disabled,inputRef,placeholder}:{id:string;value:string;onChange:(value:string)=>void;disabled:boolean;inputRef:RefObject<HTMLInputElement|null>;placeholder:string}){
 const [open,setOpen]=useState(false),[active,setActive]=useState(-1);
 const matches=findTitles(catalog,value),shown=open&&!disabled&&matches.length>0;
 const choose=(index:number)=>{const movie=matches[index];if(!movie)return;onChange(movie.title);setOpen(false);setActive(-1);inputRef.current?.focus();};
 return <div className="title-autocomplete">
  <input ref={inputRef} id={id} role="combobox" aria-autocomplete="list" aria-expanded={shown} aria-controls={`${id}-options`} aria-activedescendant={shown&&active>=0?`${id}-option-${active}`:undefined} aria-describedby={`${id}-help`} value={value} maxLength={150} autoComplete="off" spellCheck={false} placeholder={placeholder} disabled={disabled}
   onFocus={()=>setOpen(true)} onBlur={()=>{setOpen(false);setActive(-1);}}
   onChange={event=>{onChange(event.target.value);setActive(-1);setOpen(true);}}
   onKeyDown={event=>{
    if(event.nativeEvent.isComposing){if(event.key==='Enter')event.preventDefault();return;}
    if(event.key==='Escape'){event.preventDefault();setOpen(false);setActive(-1);}
    if(matches.length&&(event.key==='ArrowDown'||event.key==='ArrowUp')){event.preventDefault();setOpen(true);setActive(index=>event.key==='ArrowDown'?(index+1)%matches.length:(index<=0?matches.length-1:index-1));}
    if(event.key==='Enter'&&shown&&active>=0){event.preventDefault();choose(active);}
   }}/>
  {shown&&<ul id={`${id}-options`} role="listbox" aria-label="Movie titles">{matches.map((movie,index)=><li id={`${id}-option-${index}`} key={`${movie.title}-${movie.year}`} role="option" aria-selected={active===index} onPointerDown={event=>event.preventDefault()} onClick={()=>choose(index)}><span>{movie.title}</span><small>{movie.year}</small></li>)}</ul>}
  <span id={`${id}-help`} className="sr-only">Type two or more characters for suggestions. Use arrow keys and Enter to select. Selecting a title only fills the field; press Guess to submit.</span>
 </div>;
}

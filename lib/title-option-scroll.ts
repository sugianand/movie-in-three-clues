// Scroll only the suggestion list, never the page or the focused input.
export function revealTitleOption(list:HTMLUListElement|null,index:number){
 if(!list||index<0||index>=list.children.length)return;
 const option=list.children[index];
 const bounds=list.getBoundingClientRect(),row=option.getBoundingClientRect();
 const top=bounds.top+list.clientTop,bottom=top+list.clientHeight;
 if(row.top<top)list.scrollTop+=row.top-top;
 else if(row.bottom>bottom)list.scrollTop+=row.bottom-bottom;
}

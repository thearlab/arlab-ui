import {useLayoutEffect,useRef,type RefObject} from 'react';
/** Reuse the same FLIP settling motion for flat and grouped record lists. */
export function useReorderMotion(root:RefObject<HTMLElement>,order:string) {
 const previous=useRef(new Map<string,DOMRect>());
 const capture=()=>{
  previous.current=new Map(Array.from(root.current?.querySelectorAll<HTMLElement>('[data-item-id]')??[]).map(row=>[row.dataset.itemId!,row.getBoundingClientRect()]));
 };
 useLayoutEffect(()=>{
  if(typeof window==='undefined')return;
  const animations:Animation[]=[];
  const rows=Array.from(root.current?.querySelectorAll<HTMLElement>('[data-item-id]')??[]);
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
   for(const row of rows){
    const before=previous.current.get(row.dataset.itemId!),after=row.getBoundingClientRect();
    if(!before||typeof row.animate!=='function')continue;
    const x=before.left-after.left,y=before.top-after.top;
    if(Math.abs(x)<1&&Math.abs(y)<1)continue;
    animations.push(row.animate([{transform:`translate(${x}px,${y}px)`},{transform:'translate(0,0)'}],{duration:220,easing:'cubic-bezier(.2,.8,.2,1)'}));
   }
  }
  capture();
  return()=>animations.forEach(animation=>animation.cancel());
 },[order]);
 return capture;
}

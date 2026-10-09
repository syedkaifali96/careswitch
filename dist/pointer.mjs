import {clamp,median} from './core.mjs';

export class SteadyPointer {
 constructor({deadbandPixels=8,maxSpeedPixels=480}={}){
  this.deadbandPixels=deadbandPixels;this.maxSpeedPixels=maxSpeedPixels;this.reset();
 }
 reset(){this.history=[];this.target=null;this.position=null;this.lastTime=null;}
 push(point,{width,height}){
  if(!point||!Number.isFinite(point.x)||!Number.isFinite(point.y))return false;
  this.history.push({x:clamp(point.x,0,1),y:clamp(point.y,0,1)});
  if(this.history.length>3)this.history.shift();
  const next={x:median(this.history.map(p=>p.x)),y:median(this.history.map(p=>p.y))};
  if(!this.target){this.target=next;this.position={...next};return true;}
  const dx=(next.x-this.target.x)*width,dy=(next.y-this.target.y)*height,distance=Math.hypot(dx,dy);
  if(distance<=this.deadbandPixels)return true;
  // Subtract the deadband instead of jumping when the threshold is crossed.
  const amount=(distance-this.deadbandPixels)/distance;
  this.target={x:this.target.x+(next.x-this.target.x)*amount,y:this.target.y+(next.y-this.target.y)*amount};
  return true;
 }
 step(now,{width,height,alpha=.12}){
  if(!this.position||!this.target)return null;
  if(this.lastTime===null){this.lastTime=now;return{...this.position};}
  const elapsed=clamp(now-this.lastTime,0,50);this.lastTime=now;
  const dx=this.target.x-this.position.x,dy=this.target.y-this.position.y,distance=Math.hypot(dx*width,dy*height);
  if(distance<.5){this.position={...this.target};return{...this.position};}
  // Match smoothing across display refresh rates and cap travel in pixels/sec.
  const smooth=1-Math.pow(1-clamp(alpha,.01,.95),elapsed/85);
  const amount=Math.min(smooth,this.maxSpeedPixels*elapsed/1000/distance);
  this.position={x:this.position.x+dx*amount,y:this.position.y+dy*amount};
  return{...this.position};
 }
}

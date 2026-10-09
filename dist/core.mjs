export const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
export function median(values){if(!values.length)return NaN;const a=[...values].sort((x,y)=>x-y),m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2;}
export function makeCalibration(samples){
 const points={};for(const name of ['center','left','right','up','down']){const a=samples[name]||[];if(a.length<8)throw new Error('Not enough stable face samples. Try setup again in better light.');points[name]={x:median(a.map(p=>p.x)),y:median(a.map(p=>p.y))};}
 const xLow=Math.min(points.left.x,points.right.x),xHigh=Math.max(points.left.x,points.right.x),yLow=Math.min(points.up.y,points.down.y),yHigh=Math.max(points.up.y,points.down.y);
 if(xHigh-xLow<0.025||yHigh-yLow<0.018)throw new Error('The movement range was too small to distinguish reliably. Try comfortable movements again, or use practice mode.');
 if(points.center.x<=xLow||points.center.x>=xHigh||points.center.y<=yLow||points.center.y>=yHigh)throw new Error('The center position was outside the movement range. Keep the camera still and repeat setup.');
 return{center:points.center,xLow,xHigh,yLow,yHigh,xSign:points.right.x>points.left.x?1:-1,ySign:points.down.y>points.up.y?1:-1};
}
export function mapPointer(nose,calibration,sensitivity=1,reverseX=false){
 if(!nose||!Number.isFinite(nose.x)||!Number.isFinite(nose.y))return null;
 const c=calibration.center,dx=nose.x-c.x,dy=nose.y-c.y;
 const sx=dx>=0?calibration.xHigh-c.x:c.x-calibration.xLow,sy=dy>=0?calibration.yHigh-c.y:c.y-calibration.yLow;
 // Soften small movements while preserving the full comfortable calibrated range.
 const curve=(delta,span)=>Math.sign(delta)*Math.pow(Math.abs(delta)/Math.max(.005,span),1/clamp(sensitivity,.3,2));
 return{x:clamp(.5+curve(dx,sx)*.5*calibration.xSign*(reverseX?-1:1),0,1),y:clamp(.5+curve(dy,sy)*.5*calibration.ySign,0,1)};
}
export class DwellGate{
 constructor(duration=1500){this.duration=duration;this.reset();}
 reset(){this.target=null;this.started=0;this.blocked=null;this.lastTime=0;}
 update(target,now,enabled=true){
  if(!enabled){this.reset();return{progress:0,fire:null};}
  if(!target){this.target=null;this.blocked=null;this.started=now;this.lastTime=now;return{progress:0,fire:null};}
  if(now-this.lastTime>350||target!==this.target){this.target=target;this.started=now;}
  this.lastTime=now;
  if(this.blocked===target)return{progress:0,fire:null};
  const progress=clamp((now-this.started)/this.duration,0,1);
  if(progress>=1){this.blocked=target;return{progress:1,fire:target};}
  return{progress,fire:null};
 }
}

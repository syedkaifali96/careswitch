import assert from 'node:assert/strict';
import {SteadyPointer} from '../dist/pointer.mjs';
import {makeCalibration,mapPointer} from '../dist/core.mjs';
const area={width:1000,height:500,alpha:.12};
const pixels=(a,b)=>Math.hypot((a.x-b.x)*area.width,(a.y-b.y)*area.height);
const filter=new SteadyPointer();
for(let i=0;i<3;i++)filter.push({x:.5,y:.5},area);
filter.step(0,area);
for(let t=16;t<2000;t+=16){if(t%80===0)filter.push({x:.5+(t%160===0?.004:-.004),y:.5+.004},area);assert.deepEqual(filter.step(t,area),{x:.5,y:.5},'small stationary noise must not move the pointer');}
filter.push({x:1,y:0},area);assert.deepEqual(filter.step(2016,area),{x:.5,y:.5},'one landmark spike must not jump the pointer');
filter.push({x:.5,y:.5},area);filter.push({x:.5,y:.5},area);
let previous=filter.step(2032,area);
for(let t=2048;t<7048;t+=16){if(t%80===0)filter.push({x:.9,y:.9},area);const next=filter.step(t,area);assert.ok(pixels(next,previous)<=480*.016+.001,'each animation step must respect speed limit');previous=next;}
assert.ok(previous.x>.87&&previous.y>.87,'deliberate movement must remain reachable');
const beforeGap=previous;const afterGap=filter.step(20000,area);assert.ok(pixels(afterGap,beforeGap)<=480*.05+.001,'long frame gaps must not teleport the pointer');
filter.reset();assert.equal(filter.step(21000,area),null,'tracking reset must discard old movement');
assert.equal(filter.push({x:NaN,y:1},area),false);
function response(frameMs){const f=new SteadyPointer();f.push({x:.5,y:.5},area);f.step(0,area);for(let i=0;i<3;i++)f.push({x:.85,y:.8},area);let output;for(let t=frameMs;t<=2000;t+=frameMs)output=f.step(t,area);return output;}
assert.ok(pixels(response(1000/30),response(1000/60))<5,'smoothing must be consistent across refresh rates');
const samples=Object.fromEntries(Object.entries({center:[.5,.5],left:[.6,.5],right:[.4,.5],up:[.5,.4],down:[.5,.6]}).map(([key,[x,y]])=>[key,Array.from({length:20},()=>({x,y}))]));
const calibration=makeCalibration(samples);
assert.ok(mapPointer({x:.42,y:.5},calibration,.8).x<mapPointer({x:.42,y:.5},calibration,1).x,'lower sensitivity must reduce displacement');
for(const [nose,side] of [[{x:.6,y:.5},'left'],[{x:.4,y:.5},'right']]){const p=mapPointer(nose,calibration,.8);assert.ok(side==='left'?p.x<.15:p.x>.85,'default sensitivity must still reach outer message columns');}
assert.equal(mapPointer({x:.6,y:.5},calibration,.6).x,0,'even low sensitivity must preserve calibrated left edge');
assert.equal(mapPointer({x:.4,y:.5},calibration,.6).x,1,'even low sensitivity must preserve calibrated right edge');
assert.equal(mapPointer({x:.5,y:.4},calibration,.6).y,0,'pause at the top must remain reachable');
assert.equal(mapPointer({x:.5,y:.6},calibration,.6).y,1,'bottom controls must remain reachable');
console.log('PASS: small jitter held, spike rejected, speed bounded, deliberate travel, stale reset, 30/60 Hz consistency, and lower sensitivity.');

import assert from 'node:assert/strict';
import {waitForCameraFrames} from '../dist/camera.mjs';
const ready={readyState:4,paused:false,videoWidth:640,videoHeight:480,play:()=>new Promise(()=>{})};
await waitForCameraFrames(ready,{timeoutMs:100,pollMs:5});
const delayed={...ready,readyState:0};setTimeout(()=>{delayed.readyState=4;},20);await waitForCameraFrames(delayed,{timeoutMs:100,pollMs:5});
await assert.rejects(waitForCameraFrames({...ready,readyState:0},{timeoutMs:20,pollMs:5}),/no video frames/);
await assert.rejects(waitForCameraFrames({...ready,readyState:0},{isCurrent:()=>false}),/canceled/);
await assert.rejects(waitForCameraFrames({...ready,readyState:0,play:()=>Promise.reject(new Error('blocked'))},{timeoutMs:100,pollMs:5}),/playback was blocked/);
console.log('PASS: pending play promise with real frames, delayed frames, timeout, cancellation, and playback rejection.');

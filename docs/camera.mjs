// A playing camera can deliver frames even while its play() promise is pending.
// Wait for usable frames with a cancellation check and a bounded timeout.
export async function waitForCameraFrames(video,{isCurrent=()=>true,timeoutMs=10000,pollMs=50}={}){
 let playbackError=null;
 try{video.play()?.catch(()=>{playbackError=new Error('Camera connected, but video playback was blocked. Try opening the demo in Chrome or Edge.');});}
 catch{throw new Error('This browser could not start the camera video. Try Chrome or Edge.');}
 const started=performance.now();
 await new Promise((resolve,reject)=>{
  function check(){
   if(!isCurrent())return reject(new Error('Camera startup canceled.'));
   if(playbackError)return reject(playbackError);
   if(video.readyState>=2&&!video.paused&&video.videoWidth>0&&video.videoHeight>0)return resolve();
   if(performance.now()-started>=timeoutMs)return reject(new Error('Camera connected, but no video frames arrived. Turn it off and try again, or open the demo in Chrome or Edge.'));
   setTimeout(check,pollMs);
  }
  check();
 });
}

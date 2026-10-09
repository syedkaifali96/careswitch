export const speechLanguages={en:'English',ur:'Urdu',ar:'Arabic',hi:'Hindi',es:'Spanish',fr:'French',de:'German',zh:'Chinese (Mandarin)'};
export class SpeechPlayer{
 constructor({onStatus=()=>{},synthesis=globalThis.speechSynthesis,Utterance=globalThis.SpeechSynthesisUtterance,
  contextFactory=()=>new (globalThis.AudioContext||globalThis.webkitAudioContext)(),
  workerFactory=()=>new Worker(new URL('./speech-worker.mjs',import.meta.url),{type:'module'}),timeoutMs=60000}={}){
  Object.assign(this,{onStatus,synthesis,Utterance,contextFactory,workerFactory,timeoutMs});this.mode='auto';this.epoch=0;this.serial=0;this.pending=new Map();this.cache=new Map();
 }
 nativeVoice(lang){return this.synthesis?.getVoices().find(v=>v.localService&&v.lang.toLowerCase().split(/[-_]/)[0]===lang)||null;}
 info(lang){return this.mode==='auto'&&this.nativeVoice(lang)?'device':'basic';}
 prepare(){
  try{this.context??=this.contextFactory();if(this.context.state!=='suspended')return Promise.resolve();return new Promise(resolve=>{const timer=setTimeout(resolve,1500);this.context.resume().catch(()=>{}).finally(()=>{clearTimeout(timer);resolve();});});}catch{return Promise.resolve();}
 }
 cancel(){
  this.epoch++;this.synthesis?.cancel();if(this.source){this.source.onended=null;try{this.source.stop();}catch{}this.source.disconnect();this.source=null;}
 }
 request(message){
  if(!this.worker){this.worker=this.workerFactory();this.worker.onmessage=({data})=>{const p=this.pending.get(data.id);if(!p)return;clearTimeout(p.timer);this.pending.delete(data.id);data.kind==='error'?p.reject(new Error(data.message)):p.resolve(data);};
   this.worker.onerror=()=>this.resetWorker();}
  return new Promise((resolve,reject)=>{const id=++this.serial;const timer=setTimeout(()=>this.resetWorker(),this.timeoutMs);this.pending.set(id,{resolve,reject,timer});this.worker.postMessage({...message,id});});
 }
 resetWorker(){this.worker?.terminate();this.worker=null;for(const p of this.pending.values()){clearTimeout(p.timer);p.reject(new Error('Speech loading failed or timed out. Try Read again.'));}this.pending.clear();}
 async basic(message,epoch){
  if(!speechLanguages[message.lang])throw new Error('This message language has no built-in voice.');
  await this.prepare();if(epoch!==this.epoch)return;
  if(!this.context)throw new Error('Audio is unavailable in this browser.');
  const key=message.lang+'\0'+message.text;let buffer=this.cache.get(key);
  if(!buffer){this.onStatus('Loading the free '+speechLanguages[message.lang]+' voice on this device…');const result=await this.request({kind:'speak',lang:message.lang,text:message.text});if(epoch!==this.epoch)return;
   buffer=await this.context.decodeAudioData(result.wav);if(epoch!==this.epoch)return;if(this.cache.size>=8)this.cache.delete(this.cache.keys().next().value);this.cache.set(key,buffer);}
  if(epoch!==this.epoch)return;await this.prepare();if(epoch!==this.epoch)return;
  if(this.context.state!=='running')throw new Error('Tap Read again to allow audio playback.');
  const source=this.context.createBufferSource();source.buffer=buffer;source.connect(this.context.destination);this.source=source;
  source.onended=()=>{source.disconnect();if(epoch!==this.epoch)return;this.source=null;this.onStatus('Message read with the free built-in voice.');};
  this.onStatus('Reading with the free '+speechLanguages[message.lang]+' voice · on this device.');source.start();
 }
 speak(message){
  if(!message)return;this.cancel();const epoch=this.epoch;void this.prepare();
  const fail=error=>{if(epoch===this.epoch)this.onStatus('Message displayed. '+(error?.message||'Voice unavailable. Try Read again.'));};
  const voice=this.mode==='auto'?this.nativeVoice(message.lang):null;
  if(voice&&this.Utterance){try{
   const utterance=new this.Utterance(message.text);utterance.voice=voice;utterance.lang=voice.lang;
   utterance.onstart=()=>{if(epoch===this.epoch)this.onStatus('Reading with your device’s local voice.');};
   utterance.onend=()=>{if(epoch===this.epoch)this.onStatus('Message confirmed. Read again if needed.');};
   utterance.onerror=()=>{if(epoch===this.epoch)this.basic(message,epoch).catch(fail);};
   this.onStatus('Message confirmed. Preparing the local voice…');this.synthesis.speak(utterance);return;
  }catch{/* A failed device voice can use the built-in voice. */}}
  this.basic(message,epoch).catch(fail);
 }
}

import {clamp,makeCalibration,mapPointer,DwellGate} from './core.mjs';
import {waitForCameraFrames} from './camera.mjs';
import {SteadyPointer} from './pointer.mjs';
import {SpeechPlayer,speechLanguages} from './speech.mjs';
const $=id=>document.getElementById(id);
const ids=['yes','no','again','write','break','caregiver'];
const packs={
 en:['Yes.','No.','Please explain that again.','Please write it down.','I need a break.','Please call my caregiver.'],
 ur:['جی ہاں۔','نہیں۔','براہ کرم دوبارہ سمجھائیں۔','براہ کرم لکھ دیں۔','مجھے وقفہ چاہیے۔','براہ کرم میرے دیکھ بھال کرنے والے کو بلائیں۔'],
 ar:['نَعَمْ.','لَا.','يُرْجَى الشَّرْحُ مَرَّةً أُخْرَى.','يُرْجَى كِتَابَةُ ذَلِكَ.','أَحْتَاجُ إِلَى اِسْتِرَاحَةٍ.','يُرْجَى اِسْتِدْعَاءُ مَنْ يَعْتَنِي بِي.'],
 hi:['हाँ।','नहीं।','कृपया फिर से समझाएँ।','कृपया इसे लिख दें।','मुझे थोड़ा विराम चाहिए।','कृपया मेरी देखभाल करने वाले को बुलाएँ।'],
 es:['Sí.','No.','Por favor, explíquelo otra vez.','Por favor, escríbalo.','Necesito un descanso.','Por favor, llame a mi cuidador.'],
 fr:['Oui.','Non.','Veuillez expliquer à nouveau.','Veuillez l’écrire.','J’ai besoin d’une pause.','Veuillez appeler mon aidant.'],
 de:['Ja.','Nein.','Bitte erklären Sie das noch einmal.','Bitte schreiben Sie es auf.','Ich brauche eine Pause.','Bitte rufen Sie meine Betreuungsperson.'],
 zh:['是的。','不是。','请再解释一遍。','请写下来。','我需要休息一下。','请叫我的照护者。']
};
const originalPacks=structuredClone(packs);
const symbols=['<path d="m5 12 4 4L19 6"/>','<path d="m6 6 12 12M18 6 6 18"/>','<path d="M4 10a8 8 0 1 1 2 8M4 4v6h6"/>','<path d="m15 4 5 5L9 20H4v-5L15 4ZM13 6l5 5"/>','<path d="M8 5v14M16 5v14"/>','<circle cx="12" cy="7" r="3"/><path d="M5 21v-3a7 7 0 0 1 14 0v3M8 21v-4M16 21v-4"/>'];
const hints=['YES','NO','EXPLAIN AGAIN','WRITE IT DOWN','TAKE A BREAK','CALL MY CAREGIVER'];
let lang='en',draft=null,confirmed=null,mode='click',paused=false,stream=null,worker=null,workerReady=false,inflight=false;
let cameraEpoch=0,lastTracking=0,frameStarted=0,faceCount=0,nose=null,calibration=null,calState=null,point=null,mousePoint=null;
let sensitivity=.8,alpha=.12,reverseX=false,releaseRequired=false,cooldown=0,frameTimer=null;
const steadyPointer=new SteadyPointer();
const speech=new SpeechPlayer({onStatus:message=>{$('output-status').textContent=message;}});
const gate=new DwellGate(1500),pointer=$('pointer'),ring=$('pointer-ring');
const dialogs=[$('settings-dialog'),$('calibration-dialog'),$('phrases-dialog')];
const dialogOpen=()=>dialogs.some(d=>d.open);
function status(message){if($('tracking-status').textContent!==message)$('tracking-status').textContent=message;}
function resetDwell(requireRelease=false){gate.reset();ring.style.strokeDashoffset='113.1';document.querySelectorAll('.hover-target').forEach(el=>el.classList.remove('hover-target'));releaseRequired=requireRelease;}
function render(){
 const grid=$('message-grid');grid.replaceChildren();grid.dir=['ur','ar'].includes(lang)?'rtl':'ltr';grid.lang=lang;
 ids.forEach((id,i)=>{const b=document.createElement('button');b.className='message-card';b.dataset.target=id;b.dataset.messageId=id;b.disabled=!!draft;
  const icon=document.createElement('span');icon.className='message-icon';icon.innerHTML='<svg viewBox="0 0 24 24">'+symbols[i]+'</svg>';icon.setAttribute('aria-hidden','true');
  const text=document.createElement('strong');text.className='message-text';text.textContent=packs[lang][i];const hint=document.createElement('span');hint.className='card-hint';hint.textContent=packs[lang][i]===originalPacks[lang][i]?hints[i]:'YOUR MESSAGE';
  b.append(icon,text,hint);b.addEventListener('click',()=>activate(id));grid.append(b);
 });
}
function voiceInfo(){const device=speech.info(lang)==='device';$('voice-settings').textContent=device?'A local device voice is available. It will be used first.':'Free built-in '+speechLanguages[lang]+' voice. It works on this device and sounds synthetic.';if(lang==='ar')$('voice-settings').textContent+=' Arabic pronunciation works best with vowel marks.';if(draft)$('voice-note').textContent=device?'Confirm to display and read this message aloud.':'Confirm to display and read with the free built-in voice. Pronunciation may vary.';}
function stage(id){
 if(!ids.includes(id))throw new Error('Unknown message ID.');
 if(dialogOpen())throw new Error('Close the open dialog before selecting a message.');
 if(paused)throw new Error('Resume control before selecting a message.');
 if(draft)throw new Error('Confirm or cancel the current message first.');
 draft={id,text:packs[lang][ids.indexOf(id)],lang};$('confirmation').hidden=false;$('selected-message').textContent=draft.text;$('selected-message').lang=lang;$('selected-message').dir=['ur','ar'].includes(lang)?'rtl':'ltr';
 $('surface').classList.add('draft-open');$('selection-status').textContent='Message selected. Confirm or cancel it.';render();voiceInfo();cooldown=performance.now()+600;resetDwell(true);
 if(mode!=='camera')requestAnimationFrame(()=>{if(!draft)return;$('confirmation').scrollIntoView({block:'nearest'});if(mode==='click')$('confirm').focus({preventScroll:true});});
}
function dismiss(){const previous=draft?.id;draft=null;$('confirmation').hidden=true;$('surface').classList.remove('draft-open');$('selection-status').textContent='No message selected.';render();cooldown=performance.now()+600;resetDwell(true);if(previous&&mode==='click')document.querySelector('[data-message-id="'+previous+'"]').focus({preventScroll:true});}
function speak(message){speech.speak(message);}
function confirm(){if(!draft)return;confirmed={...draft};$('output').classList.remove('empty');$('output').textContent=confirmed.text;$('output').lang=confirmed.lang;$('output').dir=['ur','ar'].includes(confirmed.lang)?'rtl':'ltr';$('repeat').disabled=false;$('clear').disabled=false;dismiss();speak(confirmed);}
function clear(){speech.cancel();confirmed=null;$('output').classList.add('empty');$('output').textContent='Your message will appear here.';$('output').lang='en';$('output').dir='ltr';$('output-status').textContent='Nothing is spoken until you confirm.';$('repeat').disabled=true;$('clear').disabled=true;resetDwell(true);}
function pauseLabel(){const button=$('pause');button.setAttribute('aria-label',paused?'Resume head control':'Pause head control');button.querySelector('.wide-label').textContent=paused?'Resume head control':'Pause head control';button.querySelector('.compact-label').textContent=paused?'Resume':'Pause';}
function togglePause(){paused=!paused;document.body.classList.toggle('paused',paused);pauseLabel();$('mode-label').textContent=paused?'Selection paused. Move to Resume to continue.':mode==='camera'?'Head control active.':'Practice mode · tap, click, or hold with a mouse.';resetDwell(true);}
function activate(target){try{if(ids.includes(target))stage(target);else if(target==='confirm')confirm();else if(target==='cancel')dismiss();else if(target==='pause')togglePause();else if(target==='repeat')speak(confirmed);else if(target==='clear')clear();}catch(error){$('selection-status').textContent=error.message;}}
function pointerArea(){const rect=document.querySelector('.communication').getBoundingClientRect();const top=Math.max(0,rect.top),bottom=Math.min(innerHeight,rect.bottom);return{left:rect.left+24,top:top+24,width:Math.max(1,rect.width-48),height:Math.max(1,bottom-top-48)};}
function setPoint(normalized){const area=pointerArea();point={x:area.left+normalized.x*area.width,y:area.top+normalized.y*area.height};pointer.style.left=point.x+'px';pointer.style.top=point.y+'px';pointer.hidden=false;}
function renderPointer(now){
 const valid=mode==='practice'?!!mousePoint:mode==='camera'&&!!calibration&&faceCount===1&&now-lastTracking<350;
 if(!valid||dialogOpen()||document.hidden){pointer.hidden=true;resetDwell();if(mode==='camera'&&!valid)steadyPointer.reset();return;}
 if(mode==='practice'){point=mousePoint;pointer.style.left=point.x+'px';pointer.style.top=point.y+'px';pointer.hidden=false;}
 else{const smoothed=steadyPointer.step(now,{...pointerArea(),alpha});if(smoothed)setPoint(smoothed);}
 if(!point){pointer.hidden=true;return;}
 let targetElement=document.elementFromPoint(point.x,point.y)?.closest('[data-target]');
 let target=targetElement&&!targetElement.disabled?targetElement.dataset.target:null;
 if(paused&&target!=='pause')target=null;
 if(draft&&ids.includes(target))target=null;
 if(releaseRequired){if(!target)releaseRequired=false;resetDwell(releaseRequired);return;}
 if(now<cooldown){resetDwell();return;}
 const result=gate.update(target,now,true);
 document.querySelectorAll('.hover-target').forEach(el=>el.classList.remove('hover-target'));if(target)targetElement.classList.add('hover-target');ring.style.strokeDashoffset=String(113.1*(1-result.progress));
 if(result.fire)activate(result.fire);
}
function animate(now){renderPointer(now);requestAnimationFrame(animate);}
function showDialog(id){resetDwell();$(id).showModal();}
function applyTracking(data){
 inflight=false;const now=performance.now();lastTracking=data.timestamp;faceCount=now-data.timestamp<350?data.count:0;nose=faceCount===1?data.nose:null;
 if(faceCount!==1){point=null;steadyPointer.reset();resetDwell();const delayed=now-data.timestamp>=350;const message=faceCount>1?'Keep only one face in the camera view.':delayed?'Tracking is delayed. Close other busy apps or try Chrome / Edge.':'Face not found. Face the camera in good light.';status(message+' Selection is stopped.');if(calState){calState.since=null;calState.samples[steps[calState.index].key]=[];$('calibration-step').textContent=`Step ${calState.index+1} of 5 · ${message}`;$('cal-progress').style.width='0%';}return;}
 if(calState){collectCalibration(lastTracking);return;}
 if(!calibration){status('Face found. Set your movement range to enable head control.');return;}
 status(paused?'Face found. Selection is paused.':'Face tracked · head control ready.');
 const mapped=mapPointer(nose,calibration,sensitivity,reverseX);if(!mapped)return;
 steadyPointer.push(mapped,pointerArea());
}
async function sendFrame(epoch){
 if(epoch!==cameraEpoch||mode!=='camera'||!workerReady)return;
 if(inflight&&performance.now()-frameStarted>8000){stopCamera('The face tracker stopped responding. Try again, or open the demo in Chrome or Edge.');return;}
 if(!inflight&&$('video').readyState>=2){
  inflight=true;frameStarted=performance.now();try{const bitmap=await createImageBitmap($('video'));if(epoch!==cameraEpoch||!worker){bitmap.close();inflight=false;return;}worker.postMessage({kind:'frame',bitmap,timestamp:performance.now()},[bitmap]);}catch{inflight=false;status('Camera frame unavailable. Selection is stopped.');faceCount=0;}
 }
 frameTimer=setTimeout(()=>sendFrame(epoch),85);
}
function stopCamera(message='Camera is off. Click a card, or try practice mode.'){
 cameraEpoch++;steadyPointer.reset();clearTimeout(frameTimer);frameTimer=null;stream?.getTracks().forEach(track=>track.stop());stream=null;worker?.terminate();worker=null;workerReady=false;inflight=false;$('video').srcObject=null;document.body.classList.remove('control-active');
 if(calState)cancelCalibration();faceCount=0;lastTracking=0;nose=null;calibration=null;point=null;mode='click';paused=false;document.body.classList.remove('paused');pointer.hidden=true;$('camera-placeholder').hidden=false;$('start-camera').disabled=false;$('start-camera').textContent='Enable camera';$('calibrate').disabled=true;$('stop-camera').disabled=true;$('pause').disabled=true;pauseLabel();$('camera-state').textContent='Camera off';$('mode-label').textContent='Tap or click a message to begin.';resetDwell();status(message);
}
async function startCamera(){
 void speech.prepare();
 stopCamera();const epoch=cameraEpoch;mode='camera';mousePoint=null;$('start-camera').disabled=true;$('stop-camera').disabled=false;$('start-camera').textContent='Starting…';status('Loading the face model on your device…');
 try{
  if(!window.isSecureContext)throw new Error('Camera needs HTTPS or localhost. Open the hosted demo.');
  if(!navigator.mediaDevices?.getUserMedia||!window.createImageBitmap)throw new Error('This browser does not support the camera features. Try a recent Chrome or Edge browser.');
  worker=new Worker('./vision-worker.js');
  await new Promise((resolve,reject)=>{
   const timeout=setTimeout(()=>reject(new Error('Model loading timed out. Check your connection and try again.')),90000);
   worker.onerror=()=>{clearTimeout(timeout);reject(new Error('The local face model could not load. Practice mode is still available.'));};
   worker.onmessage=({data})=>{if(epoch!==cameraEpoch)return;if(data.kind==='ready'){clearTimeout(timeout);workerReady=true;resolve();}else if(data.kind==='error'){clearTimeout(timeout);reject(new Error(data.message));}};
   worker.postMessage({kind:'init'});
  });
  if(epoch!==cameraEpoch)return;status('Allow camera access in your browser to continue.');
  const acquired=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640},height:{ideal:480},facingMode:'user'},audio:false});
  if(epoch!==cameraEpoch){acquired.getTracks().forEach(t=>t.stop());return;}stream=acquired;$('video').srcObject=stream;$('camera-placeholder').hidden=true;$('camera-state').textContent='Camera connected · waiting for frames';status('Camera connected. Waiting for video frames…');
  await waitForCameraFrames($('video'),{isCurrent:()=>epoch===cameraEpoch});if(epoch!==cameraEpoch)return;
  $('camera-placeholder').hidden=true;$('start-camera').textContent='Camera enabled';$('stop-camera').disabled=false;$('calibrate').disabled=false;$('camera-state').textContent='Local camera · no upload';
  worker.onmessage=({data})=>{if(epoch!==cameraEpoch)return;if(data.kind==='tracking')applyTracking(data);else if(data.kind==='error')stopCamera('Tracking stopped: '+data.message);};
  worker.onerror=()=>stopCamera('Tracking stopped. Try again or use practice mode.');
  stream.getVideoTracks()[0].addEventListener('ended',()=>{if(epoch===cameraEpoch)stopCamera('Camera access ended. Selection is stopped.');});
  beginCalibration();sendFrame(epoch);
 }catch(error){if(epoch!==cameraEpoch)return;const message=error.name==='NotAllowedError'?'Camera permission was declined. Practice mode still works.':error.message;stopCamera(message);}
}
const steps=[{key:'center',title:'Look straight ahead.',text:'Keep your head centered and relaxed.',x:50,y:50},{key:'left',title:'Move gently to your left.',text:'Move or turn your head left only as far as comfortable. Hold there.',x:15,y:50},{key:'right',title:'Move gently to your right.',text:'Move or turn your head right only as far as comfortable. Hold there.',x:85,y:50},{key:'up',title:'Move gently upward.',text:'Raise or tilt your head slightly, only as far as comfortable. Hold there.',x:50,y:15},{key:'down',title:'Move gently downward.',text:'Lower or tilt your head slightly, only as far as comfortable. Hold there.',x:50,y:85}];
function beginCalibration(){if(!stream)return;dismiss();calibration=null;point=null;steadyPointer.reset();$('pause').disabled=true;calState={index:0,since:null,samples:{}};showDialog('calibration-dialog');showStep();}
function showStep(){const step=steps[calState.index];calState.samples[step.key]=[];calState.since=null;$('calibration-title').textContent=step.title;$('calibration-text').textContent=step.text;$('calibration-step').textContent=`Step ${calState.index+1} of 5 · wait for one visible face`;$('cal-dot').style.left=step.x+'%';$('cal-dot').style.top=step.y+'%';$('cal-progress').style.width='0%';}
function collectCalibration(now){
 if(!calState)return;if(calState.since===null)calState.since=now;
 const elapsed=now-calState.since,step=steps[calState.index];$('calibration-step').textContent=`Step ${calState.index+1} of 5 · ${elapsed<1000?'get comfortable…':'hold this position…'}`;$('cal-progress').style.width=clamp(elapsed/3000*100,0,100)+'%';
 if(elapsed>=1000)calState.samples[step.key].push({...nose});
 if(elapsed>=3000){
  if(++calState.index<steps.length){showStep();return;}
  try{calibration=makeCalibration(calState.samples);calState=null;$('calibration-dialog').close();paused=false;document.body.classList.add('control-active');window.scrollTo(0,0);$('pause').disabled=false;$('mode-label').textContent='Head control active.';status('Movement range set. Move your head to guide the pointer.');resetDwell(true);}
  catch(error){calState=null;$('calibration-dialog').close();status(error.message);calibration=null;}
 }
}
function cancelCalibration(){calState=null;if($('calibration-dialog').open)$('calibration-dialog').close();status('Setup canceled. Set your movement range when you’re ready.');resetDwell();}
$('start-camera').addEventListener('click',startCamera);$('stop-camera').addEventListener('click',()=>stopCamera());$('calibrate').addEventListener('click',beginCalibration);$('cancel-calibration').addEventListener('click',cancelCalibration);$('calibration-dialog').addEventListener('cancel',()=>{calState=null;status('Setup canceled. Set your movement range when you’re ready.');});
$('practice').addEventListener('click',()=>{void speech.prepare();stopCamera('Practice mode: tap or click a message, hold with a mouse, or use Tab and Enter.');mode='practice';document.body.classList.add('control-active');window.scrollTo(0,0);$('mode-label').textContent='Practice mode · tap, click, or hold with a mouse.';$('pause').disabled=false;resetDwell();});
document.querySelector('.communication').addEventListener('pointermove',event=>{if(mode==='practice'&&event.pointerType!=='touch')mousePoint={x:event.clientX,y:event.clientY};});
document.querySelector('.communication').addEventListener('pointerleave',()=>{if(mode==='practice'){mousePoint=null;pointer.hidden=true;resetDwell();}});
$('pause').addEventListener('click',togglePause);$('confirm').addEventListener('click',confirm);$('cancel').addEventListener('click',dismiss);$('repeat').addEventListener('click',()=>speak(confirmed));$('clear').addEventListener('click',clear);
$('repeat').dataset.target='repeat';$('clear').dataset.target='clear';
$('language').addEventListener('change',()=>{dismiss();lang=$('language').value;speech.cancel();render();voiceInfo();});
$('settings-button').addEventListener('click',()=>{voiceInfo();showDialog('settings-dialog');});$('settings-done').addEventListener('click',()=>$('settings-dialog').close());
$('voice-mode').addEventListener('change',event=>{speech.cancel();speech.mode=event.target.value;voiceInfo();});
$('dwell').addEventListener('input',event=>{gate.duration=Number(event.target.value)*1000;$('dwell-output').textContent=event.target.value+' seconds';$('hold-label').textContent='Hold to select · '+event.target.value+' seconds';resetDwell();});
$('sensitivity').addEventListener('input',event=>{sensitivity=Number(event.target.value);$('sensitivity-output').textContent=sensitivity.toFixed(1)+'×';steadyPointer.reset();point=null;resetDwell(true);});
$('smoothing').addEventListener('change',event=>{alpha=Number(event.target.value);$('smoothing-output').textContent=event.target.selectedOptions[0].textContent;resetDwell(true);});$('reverse-x').addEventListener('change',event=>{reverseX=event.target.checked;steadyPointer.reset();point=null;resetDwell(true);});
$('edit-phrases').addEventListener('click',()=>{const fields=$('phrase-fields');fields.replaceChildren();packs[lang].forEach((text,i)=>{const label=document.createElement('label');label.className='phrase-field';label.textContent=hints[i];const input=document.createElement('input');input.value=text;input.maxLength=160;input.lang=lang;input.dir=['ur','ar'].includes(lang)?'rtl':'ltr';label.append(input);fields.append(label);});$('phrase-error').textContent='';showDialog('phrases-dialog');});
$('save-phrases').addEventListener('click',()=>{const values=[...$('phrase-fields').querySelectorAll('input')].map(input=>input.value.trim());if(values.some(v=>!v)){ $('phrase-error').textContent='Please give every card a message.';return;}packs[lang]=values;dismiss();$('phrases-dialog').close();render();});
dialogs.forEach(dialog=>dialog.addEventListener('close',()=>resetDwell(true)));
window.addEventListener('resize',()=>{steadyPointer.reset();point=null;mousePoint=null;resetDwell(true);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!dialogOpen()&&draft)dismiss();if(event.code==='Space'&&!dialogOpen()&&!event.target.closest('button,input,select,textarea')&&mode!=='click'){event.preventDefault();togglePause();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){speech.cancel();if(mode==='camera')stopCamera('Camera stopped because this tab was hidden. Enable it again when ready.');else{mousePoint=null;resetDwell();}}});window.addEventListener('pagehide',()=>stopCamera());
window.speechSynthesis?.addEventListener('voiceschanged',voiceInfo);
const toolContext=document.modelContext||navigator.modelContext;
if(toolContext?.registerTool){const lifecycle=new AbortController();try{Promise.resolve(toolContext.registerTool({name:'stage_careswitch_message',title:'Select a communication message',description:'Select a CareSwitch communication card for review. The user must confirm separately. Does not speak, start a camera, or contact anyone.',annotations:{readOnlyHint:false,untrustedContentHint:true},inputSchema:{type:'object',properties:{messageId:{type:'string',enum:ids}},required:['messageId'],additionalProperties:false},execute:async input=>{if(!input||!ids.includes(input.messageId)||Object.keys(input).some(k=>k!=='messageId'))throw new Error('Provide one valid messageId.');stage(input.messageId);return{selectedMessage:draft.text,messageId:draft.id,confirmed:false};}},{signal:lifecycle.signal})).catch(()=>{});}catch{}window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}
render();voiceInfo();requestAnimationFrame(animate);

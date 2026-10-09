// Local synthesis only. eSpeak NG and its voice data are served by this Site.
const voices={en:'en',ur:'ur',ar:'ar',hi:'hi',es:'es',fr:'fr',de:'de',zh:'cmn'};
let loading;
async function engine(){
 if(!loading)loading=(async()=>{
  const [{default:factory},response]=await Promise.all([import('./assets/speech/espeak-ng.js'),fetch(new URL('./assets/speech/espeak-ng.wasm',import.meta.url))]);
  if(!response.ok)throw new Error('Speech files could not load.');
  return{factory,compiled:await WebAssembly.compile(await response.arrayBuffer())};
 })().catch(error=>{loading=null;throw error;});
 return loading;
}
let queue=Promise.resolve();
self.onmessage=({data})=>{
 queue=queue.then(async()=>{
  try{
   if(data.kind==='init'){await engine();self.postMessage({id:data.id,kind:'ready'});return;}
   if(data.kind!=='speak'||!voices[data.lang]||typeof data.text!=='string'||!data.text.trim()||data.text.length>160)throw new Error('Unsupported speech request.');
   const {factory,compiled}=await engine();
   const instance=await factory({arguments:['-v',voices[data.lang],'-s','155','-f','input.txt','-w','message.wav'],
    instantiateWasm(imports,ready){WebAssembly.instantiate(compiled,imports).then(value=>ready(value,compiled));return{};},
    preRun:[module=>module.FS.writeFile('input.txt',data.text)],print:()=>{},printErr:()=>{}});
   const wav=instance.FS.readFile('message.wav').slice();if(wav.length<=44)throw new Error('No speech audio was generated.');
   self.postMessage({id:data.id,kind:'audio',voice:voices[data.lang],wav:wav.buffer},[wav.buffer]);
  }catch{self.postMessage({id:data.id,kind:'error',message:'The free voice could not load or generate audio. Try Read again.'});}
 }).catch(()=>{});
};

/* Classic worker: MediaPipe loads its WASM loader with importScripts. */
importScripts('./assets/mediapipe/vision_bundle.js');
let model;
self.onmessage=async ({data})=>{
 try{
  if(data.kind==='init'){
   const wasm=await Vision.FilesetResolver.forVisionTasks(new URL('./assets/mediapipe/wasm',self.location.href).href);
   model=await Vision.FaceLandmarker.createFromOptions(wasm,{baseOptions:{modelAssetPath:new URL('./assets/face_landmarker.task',self.location.href).href,delegate:'CPU'},runningMode:'VIDEO',numFaces:2,minFaceDetectionConfidence:.6,minFacePresenceConfidence:.6,minTrackingConfidence:.6,outputFaceBlendshapes:false,outputFacialTransformationMatrixes:false});
   self.postMessage({kind:'ready'});
  }else if(data.kind==='frame'){
   try{
    if(!model)throw new Error('The face model is not ready.');
    const result=model.detectForVideo(data.bitmap,data.timestamp);
    const faces=result.faceLandmarks||[],nose=faces.length===1?faces[0][1]:null;
    self.postMessage({kind:'tracking',count:faces.length,nose:nose?{x:nose.x,y:nose.y}:null,timestamp:data.timestamp,landmarkCount:faces[0]?.length||0});
   }finally{data.bitmap?.close();}
  }
 }catch(error){self.postMessage({kind:'error',message:error.message||'Face tracking could not start.'});}
};

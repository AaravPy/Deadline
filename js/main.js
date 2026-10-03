import * as THREE from 'three';
import {Game} from './game.js?shop=6';

const canvas=document.querySelector('#arena');
try{
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance',alpha:false});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.18;
  const game=new Game(renderer);
  requestAnimationFrame(time=>game.frame(time));
}catch(error){
  console.error('3D scene could not start:',error);
  const errorMessage=document.querySelector('#boot-error');
  if(errorMessage){errorMessage.hidden=false;errorMessage.textContent='This browser could not start the 3D scene. Try a browser with WebGL enabled.';}
  document.querySelector('[data-action="start"]')?.setAttribute('disabled','');
}

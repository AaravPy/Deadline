import * as THREE from 'three';
import {moveCircle} from './arena.js?collision=2';

export class Player {
  constructor(camera,bounds,obstacles=[]){this.camera=camera;this.bounds=bounds;this.obstacles=obstacles;this.radius=.34;this.position=new THREE.Vector3(0,1.65,0);this.yaw=0;this.pitch=0;this.health=100;this.damageFlash=0;this.bob=0;this.recoil=0;this.reset();}
  reset(){this.position.set(0,1.65,0);this.yaw=0;this.pitch=0;this.health=100;this.damageFlash=0;this.bob=0;this.recoil=0;this.syncCamera();}
  look(dx,dy){this.yaw-=dx*.0021;this.pitch=Math.max(-1.25,Math.min(1.25,this.pitch-dy*.00185));this.syncCamera();}
  syncCamera(){this.camera.position.copy(this.position);this.camera.rotation.order='YXZ';this.camera.rotation.y=this.yaw;this.camera.rotation.x=this.pitch-this.recoil;}
  update(dt,input){const len=Math.hypot(input.x,input.y);if(len){const f=input.y/len,r=input.x/len,speed=input.sprint?8.6:5.3,dx=(-Math.sin(this.yaw)*f+Math.cos(this.yaw)*r)*speed*dt,dz=(-Math.cos(this.yaw)*f-Math.sin(this.yaw)*r)*speed*dt,p=moveCircle(this.position.x,this.position.z,dx,dz,this.radius,this.obstacles,this.bounds);this.position.x=p.x;this.position.z=p.z;this.bob+=dt*(input.sprint?15:10);}else this.bob=Math.max(0,this.bob-dt*5);this.recoil=Math.max(0,this.recoil-dt*3.2);this.damageFlash=Math.max(0,this.damageFlash-dt);this.syncCamera();this.camera.position.y+=Math.sin(this.bob)*.018;}
  damage(amount){this.health=Math.max(0,this.health-amount);this.damageFlash=.32;return this.health<=0;}
}

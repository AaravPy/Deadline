import * as THREE from 'three';
import {moveCircle} from './arena.js?collision=2';

export class Zombie {
  constructor(scene,x,z,elapsed){
    this.scene=scene;this.group=new THREE.Group();this.group.position.set(x,0,z);this.health=2;this.dead=false;this.attackWait=0;this.age=Math.random()*8;this.speed=1.12+Math.min(1.4,elapsed*.025);this.meshes=[];
    const skinTone=[0x898d7d,0x7b8477,0x969383,0x737d70][Math.floor(Math.random()*4)];
    this.materials={skin:new THREE.MeshStandardMaterial({color:skinTone,roughness:.93}),coat:new THREE.MeshStandardMaterial({color:[0x3c4539,0x41413a,0x373b3b][Math.floor(Math.random()*3)],roughness:.98}),pants:new THREE.MeshStandardMaterial({color:0x292c29,roughness:1}),boot:new THREE.MeshStandardMaterial({color:0x171918,roughness:.95}),hair:new THREE.MeshStandardMaterial({color:0x302d27,roughness:1}),shadow:new THREE.MeshStandardMaterial({color:0x292a25,roughness:1}),eye:new THREE.MeshStandardMaterial({color:0xff624d,emissive:0x87271b,emissiveIntensity:1.3}),stitch:new THREE.MeshStandardMaterial({color:0x9b7945,roughness:1}),teeth:new THREE.MeshStandardMaterial({color:0xc4bd9d,roughness:.85})};
    this.part=(parent,geo,mat,px,py,pz,scale=null)=>{const m=new THREE.Mesh(geo,mat);m.position.set(px,py,pz);if(scale)m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;m.userData.zombie=this;parent.add(m);this.meshes.push(m);return m;};
    const {skin,coat,pants,boot,hair,shadow,eye,stitch,teeth}=this.materials;
    // A hunched, clothed body with a narrow waist and uneven shoulders.
    this.part(this.group,new THREE.CylinderGeometry(.25,.36,.78,10,1),coat,0,1.19,0);
    this.part(this.group,new THREE.SphereGeometry(.31,10,8),coat,0,1.51,0,[1,.56,.92]);
    this.part(this.group,new THREE.CylinderGeometry(.15,.17,.2,9),skin,0,1.64,0);
    this.head=new THREE.Group();this.head.position.set(0,1.87,-.035);this.group.add(this.head);
    this.part(this.head,new THREE.SphereGeometry(.245,12,10),skin,0,0,0,[.9,1.06,.9]);
    // Uneven hairline, ears and brow make the face legible at arena distance.
    this.part(this.head,new THREE.SphereGeometry(.205,10,7,0,Math.PI*2,0,Math.PI*.47),hair,0,.1,-.006,[1.05,.72,1]);
    this.part(this.head,new THREE.SphereGeometry(.055,7,6),skin,-.225,-.015,0);
    this.part(this.head,new THREE.SphereGeometry(.055,7,6),skin,.225,-.015,0);
    this.part(this.head,new THREE.BoxGeometry(.095,.035,.045),hair,-.088,.035,-.207).rotation.z=.12;
    this.part(this.head,new THREE.BoxGeometry(.095,.035,.045),hair,.088,.035,-.207).rotation.z=-.12;
    this.part(this.head,new THREE.SphereGeometry(.027,7,6),eye,-.085,.005,-.221);
    this.part(this.head,new THREE.SphereGeometry(.027,7,6),eye,.085,.005,-.221);
    const nose=this.part(this.head,new THREE.ConeGeometry(.055,.14,7),skin,0,-.045,-.215);nose.rotation.x=Math.PI/2;
    this.part(this.head,new THREE.BoxGeometry(.15,.055,.025),shadow,0,-.13,-.204);
    for(let i=0;i<4;i++)this.part(this.head,new THREE.BoxGeometry(.018,.027,.012),teeth,-.052+i*.035,-.132,-.222);
    // Jacket seams, a worn patch and belt add surface detail without gore.
    this.part(this.group,new THREE.BoxGeometry(.13,.21,.026),stitch,.1,1.25,-.19).rotation.z=-.16;
    this.part(this.group,new THREE.BoxGeometry(.14,.055,.025),shadow,0,.86,-.19);
    this.part(this.group,new THREE.BoxGeometry(.045,.07,.03),stitch,0,.86,-.21);
    for(const side of [-1,1])for(let i=0;i<3;i++)this.part(this.group,new THREE.SphereGeometry(.018,5,4),stitch,side*.075,1.39-i*.13,-.214);
    // Long reaching arms are separate pivots so their gait reads as a person walking.
    this.leftArm=this.makeArm(-1,skin,coat);this.rightArm=this.makeArm(1,skin,coat);
    this.leftLeg=this.makeLeg(-1,pants,boot);this.rightLeg=this.makeLeg(1,pants,boot);
    scene.add(this.group);
  }
  makeArm(side,skin,coat){const pivot=new THREE.Group();pivot.position.set(side*.36,1.48,-.015);this.group.add(pivot);const upper=this.part(pivot,new THREE.CylinderGeometry(.095,.12,.43,8),coat,0,-.2,0);upper.rotation.x=.52;const elbow=new THREE.Group();elbow.position.set(0,-.39,-.22);pivot.add(elbow);const forearm=this.part(elbow,new THREE.CylinderGeometry(.075,.095,.39,8),skin,0,-.18,-.08);forearm.rotation.x=.25;this.part(elbow,new THREE.SphereGeometry(.09,8,6),skin,0,-.39,-.13);this.part(pivot,new THREE.SphereGeometry(.11,8,6),coat,0,-.39,-.21);return pivot;}
  makeLeg(side,pants,boot){const pivot=new THREE.Group();pivot.position.set(side*.16,.63,0);this.group.add(pivot);this.part(pivot,new THREE.CylinderGeometry(.13,.105,.48,8),pants,0,-.21,0);this.part(pivot,new THREE.BoxGeometry(.2,.14,.34),boot,0,-.47,-.08);return pivot;}
  update(dt,target,others,bounds,obstacles=[]){if(this.dead)return null;this.age+=dt;this.attackWait=Math.max(0,this.attackWait-dt);const dx=target.x-this.group.position.x,dz=target.z-this.group.position.z;let d=Math.hypot(dx,dz)||1,sx=0,sz=0;for(const other of others){if(other===this||other.dead)continue;const ox=this.group.position.x-other.group.position.x,oz=this.group.position.z-other.group.position.z,od=Math.hypot(ox,oz);if(od>0&&od<1.15){sx+=ox/od*(1.15-od);sz+=oz/od*(1.15-od);}}let vx=dx/d+sx*.8,vz=dz/d+sz*.8;const v=Math.hypot(vx,vz)||1;vx/=v;vz/=v;const moved=moveCircle(this.group.position.x,this.group.position.z,vx*this.speed*dt,vz*this.speed*dt,.39,obstacles,bounds-1);this.group.position.x=moved.x;this.group.position.z=moved.z;this.group.rotation.y=Math.atan2(-vx,-vz);const swing=Math.sin(this.age*5.6);this.leftArm.rotation.x=.46+Math.max(0,swing)*.28;this.rightArm.rotation.x=.46+Math.max(0,-swing)*.28;this.leftArm.rotation.z=-.08+Math.sin(this.age*2.8)*.08;this.rightArm.rotation.z=.08+Math.sin(this.age*2.8+1)*.08;this.leftLeg.rotation.x=swing*.27;this.rightLeg.rotation.x=-swing*.27;this.head.rotation.z=Math.sin(this.age*2.1)*.035;this.group.position.y=Math.abs(swing)*.018;d=Math.hypot(target.x-this.group.position.x,target.z-this.group.position.z);if(d<1.12&&this.attackWait<=0){this.attackWait=.78;return 9;}return null;}
  hit(damage=1){this.health-=damage;if(this.health<=0){this.dead=true;this.scene.remove(this.group);return true;}for(const m of this.meshes){if(m.material.emissive){m.userData.baseEmissive??=m.material.emissive.clone();m.material.emissive.set(0x737943);setTimeout(()=>{if(m.material?.emissive&&m.userData.baseEmissive)m.material.emissive.copy(m.userData.baseEmissive);},85);}}return false;}
  dispose(){this.scene.remove(this.group);for(const m of this.meshes){m.geometry.dispose();m.material.dispose();}}
}

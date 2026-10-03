import * as THREE from 'three';

export const GUNS=[
  {id:'sidearm',name:'YARD SIDEARM',short:'SIDEARM',cost:0,description:'Balanced and dependable.',magSize:12,reserve:48,fireRate:.18,reloadTime:1.12,damage:1,pellets:1,spread:0},
  {id:'smg',name:'COMPACT SMG',short:'SMG',cost:4,description:'Fast fire. More rounds per magazine.',magSize:30,reserve:90,fireRate:.085,reloadTime:1.28,damage:1,pellets:1,spread:.025},
  {id:'shotgun',name:'PUMP SHOTGUN',short:'SHOTGUN',cost:7,description:'A close range spread with heavy impact.',magSize:6,reserve:30,fireRate:.62,reloadTime:1.55,damage:2.4,pellets:7,spread:.075},
  {id:'carbine',name:'YARD CARBINE',short:'CARBINE',cost:12,description:'Accurate, hard hitting, and quick to cycle.',magSize:24,reserve:72,fireRate:.14,reloadTime:1.34,damage:2,pellets:1,spread:.006}
];

export class Weapon {
  constructor(camera){this.camera=camera;this.ammoStates={};this.group=null;this.fireWait=0;this.reloadLeft=0;this.reloading=false;this.kick=0;this.flashTime=0;this.equip('sidearm',true);}
  reset(){this.ammoStates={};this.id=null;this.config=null;this.equip('sidearm',true);}
  saveAmmo(){if(this.config)this.ammoStates[this.id]={mag:this.mag,reserve:this.reserve};}
  equip(id,refill=false){
    const config=GUNS.find(g=>g.id===id);if(!config)return false;
    if(this.config)this.saveAmmo();
    if(this.id!==id||!this.group){this.group?.parent?.remove(this.group);this.group?.traverse(o=>{o.geometry?.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material?.dispose();});this.id=id;this.config=config;this.magSize=config.magSize;this.reserveMax=config.reserve;const ammo=refill?null:this.ammoStates[id];this.mag=ammo?.mag??config.magSize;this.reserve=ammo?.reserve??config.reserve;this.group=new THREE.Group();this.build();}
    else if(refill){this.mag=config.magSize;this.reserve=config.reserve;}
    this.reloading=false;this.reloadLeft=0;this.fireWait=0;this.kick=0;this.flashTime=0;this.saveAmmo();return true;
  }
  build(){
    const slide=new THREE.MeshStandardMaterial({color:0x41433c,metalness:.78,roughness:.32}),frame=new THREE.MeshStandardMaterial({color:0x252824,metalness:.52,roughness:.48}),edge=new THREE.MeshStandardMaterial({color:0x77796f,metalness:.82,roughness:.28}),grip=new THREE.MeshStandardMaterial({color:0x24231f,roughness:.9}),mark=new THREE.MeshStandardMaterial({color:0xc3b33c,metalness:.48,roughness:.55}),dark=new THREE.MeshStandardMaterial({color:0x101211,metalness:.25,roughness:.6}),handMat=new THREE.MeshStandardMaterial({color:0xc09170,emissive:0x382115,emissiveIntensity:.35,roughness:.9});
    const box=(w,h,d,mat,x,y,z,parent=this.group)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;};
    const cylinder=(radius,length,mat,x,y,z)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,length,12),mat);m.rotation.x=Math.PI/2;m.position.set(x,y,z);m.castShadow=true;this.group.add(m);return m;};
    const extended=this.id!=='sidearm',barrelLength=this.id==='carbine'?.52:this.id==='shotgun'?.44:extended?.36:.19,barrelZ=-.32-(barrelLength-.19)/2,muzzleZ=-.415-(barrelLength-.19);
    this.slidePart=box(.2,.125,.43,slide,0,.025,-.025);box(.17,.055,.16,dark,0,.048,-.105);box(.07,.025,.11,edge,0,.08,-.105);
    box(.205,.024,.25,edge,0,.093,-.005);box(.16,.018,.035,dark,0,.11,-.12);box(.12,.03,.035,edge,0,.105,-.205);
    cylinder(this.id==='shotgun'?.047:.04,barrelLength,edge,0,.015,barrelZ);cylinder(.052,.055,dark,0,.015,muzzleZ);cylinder(.034,.018,mark,0,.015,muzzleZ-.035);
    box(.19,.1,.31,frame,0,-.055,.075);box(.035,.03,.12,edge,.115,-.02,.06);
    const guard=new THREE.Mesh(new THREE.TorusGeometry(.074,.012,6,16,Math.PI),edge);guard.rotation.z=Math.PI;guard.position.set(0,-.105,.015);this.group.add(guard);
    box(.018,.065,.025,edge,0,-.105,-.04);box(.03,.025,.08,mark,.115,-.035,-.055);
    for(let i=0;i<5;i++){const serration=box(.214,.012,.014,dark,0,.064,.125+i*.024);serration.rotation.x=-.09;}
    const handle=box(.13,.265,.15,grip,0,-.205,.145);handle.rotation.x=-.2;handle.rotation.z=-.12;
    for(let i=0;i<5;i++)box(.134,.012,.012,edge,0,-.12-i*.035,.218);
    this.magazine=new THREE.Group();this.magazine.position.set(0,-.35,.13);this.group.add(this.magazine);this.magBody=box(.12,.18,.13,dark,0,-.025,0,this.magazine);box(.145,.025,.15,edge,0,-.125,0,this.magazine);this.magazineBaseY=-.35;
    box(.055,.012,.02,mark,0,.102,.035);box(.028,.009,.018,dark,0,.11,.035);
    for(let i=0;i<3;i++)box(.13,.012,.014,edge,0,.092,.07+i*.025);
    if(this.id==='smg'){
      box(.14,.24,.14,dark,0,-.235,.13);box(.22,.075,.16,grip,0,-.015,-.22);box(.09,.045,.055,mark,0,.15,.02);
    }else if(this.id==='shotgun'){
      this.pumpGrip=box(.23,.11,.2,grip,0,-.015,-.31);cylinder(.024,.38,dark,0,-.07,barrelZ);box(.12,.19,.24,dark,0,-.04,.31);box(.15,.05,.08,edge,0,.13,.31);this.magazine.visible=false;
    }else if(this.id==='carbine'){
      box(.15,.17,.29,dark,0,-.09,.31);box(.19,.055,.19,grip,0,-.19,.25);box(.16,.08,.2,frame,0,-.005,-.27);box(.11,.06,.12,dark,0,.16,-.03);box(.08,.025,.1,mark,0,.2,-.03);
    }
    const sleeve=box(.23,.18,.25,new THREE.MeshStandardMaterial({color:0x292d29,roughness:1}),-.025,-.255,.29);sleeve.rotation.x=-.22;
    const palm=new THREE.Mesh(new THREE.BoxGeometry(.16,.09,.2),handMat);palm.position.set(.025,-.14,.07);palm.rotation.x=-.1;this.group.add(palm);
    for(let i=0;i<3;i++){const finger=box(.038,.045,.12,handMat,-.04+i*.045,-.112,-.005);finger.rotation.x=.25;}
    this.reloadRig=new THREE.Group();this.reloadRig.position.set(-.61,-.31,.26);this.group.add(this.reloadRig);const reloadSleeveMat=new THREE.MeshStandardMaterial({color:0x454a43,roughness:.98});box(.14,.13,.24,reloadSleeveMat,-.06,-.015,-.015,this.reloadRig);box(.15,.085,.15,handMat,.01,0,-.08,this.reloadRig);for(let i=0;i<4;i++){const finger=box(.032,.036,.105,handMat,-.05+i*.034,-.032,-.18,this.reloadRig);finger.rotation.x=.12;}const thumb=box(.04,.042,.1,handMat,-.09,.018,-.11,this.reloadRig);thumb.rotation.y=-.35;this.reloadRig.visible=false;
    const shellMat=new THREE.MeshStandardMaterial({color:0x873d2d,metalness:.22,roughness:.55});this.reloadShell=new THREE.Mesh(new THREE.CylinderGeometry(.022,.022,.095,10),shellMat);this.reloadShell.rotation.x=Math.PI/2;this.reloadShell.position.set(.02,.035,-.2);this.reloadRig.add(this.reloadShell);this.reloadShell.visible=false;
    const flashMat=new THREE.MeshBasicMaterial({color:0xffe87a,transparent:true,opacity:.95});this.flash=new THREE.Mesh(new THREE.ConeGeometry(.13,.34,8),flashMat);this.flash.rotation.x=-Math.PI/2;this.flash.position.set(0,.015,muzzleZ-.09);this.flash.visible=false;this.group.add(this.flash);
    this.light=new THREE.PointLight(0xffa34b,0,3);this.light.position.set(0,.05,muzzleZ-.06);this.group.add(this.light);this.group.position.set(.31,-.29,-.54);this.camera.add(this.group);
  }
  animateReload(){const p=THREE.MathUtils.clamp(1-this.reloadLeft/this.config.reloadTime,0,1),dip=Math.sin(p*Math.PI),reach=THREE.MathUtils.smoothstep(p,.06,.27),withdraw=THREE.MathUtils.smoothstep(p,.78,.98),hand=reach*(1-withdraw);this.group.position.set(.31,-.29-this.kick*.045-dip*.12,-.54+dip*.075);this.group.rotation.set(dip*.12,0,-dip*.14);this.reloadRig.visible=p>.035&&p<.97;this.reloadRig.position.set(-.61+.43*hand,-.08+.28*hand,.26-.20*hand);this.reloadRig.rotation.z=-.2+.18*hand;this.reloadShell.visible=this.id==='shotgun'&&p>.22&&p<.72;const eject=THREE.MathUtils.smoothstep(p,.16,.34)*(1-THREE.MathUtils.smoothstep(p,.42,.62));this.magazine.position.y=this.magazineBaseY-.17*eject;this.slidePart.position.z=-.025+.055*THREE.MathUtils.smoothstep(p,.72,.82)*(1-THREE.MathUtils.smoothstep(p,.87,.97));if(this.pumpGrip)this.pumpGrip.position.z=-.31+.12*THREE.MathUtils.smoothstep(p,.68,.79)*(1-THREE.MathUtils.smoothstep(p,.84,.95));}
  resetReloadPose(){this.group.position.set(.31,-.29-this.kick*.045,-.54);this.group.rotation.set(0,0,0);this.reloadRig.visible=false;this.reloadShell.visible=false;this.magazine.position.y=this.magazineBaseY;this.slidePart.position.z=-.025;if(this.pumpGrip)this.pumpGrip.position.z=-.31;}
  update(dt,firing,shoot){this.fireWait=Math.max(0,this.fireWait-dt);this.kick=Math.max(0,this.kick-dt*5);this.flashTime=Math.max(0,this.flashTime-dt);this.flash.visible=this.flashTime>0;this.light.intensity=this.flash.visible?2.5:0;if(this.reloading){this.reloadLeft-=dt;if(this.reloadLeft<=0){const load=Math.min(this.magSize-this.mag,this.reserve);this.mag+=load;this.reserve-=load;this.reloading=false;this.resetReloadPose();this.saveAmmo();return 'reloaded';}this.animateReload();}else this.resetReloadPose();if(firing&&!this.reloading&&this.fireWait<=0){if(this.mag<=0){this.fireWait=.24;return 'empty';}this.mag--;this.saveAmmo();this.fireWait=this.config.fireRate;this.kick=.2;this.flashTime=.075;this.flash.visible=true;this.light.intensity=2.5;return shoot();}return null;}
  reload(){if(this.reloading||this.mag===this.magSize||this.reserve<=0)return false;this.reloading=true;this.reloadLeft=this.config.reloadTime;this.reloadRig.visible=true;return true;}
  dispose(){this.group?.parent?.remove(this.group);this.group?.traverse(o=>{o.geometry?.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material?.dispose();});}
}

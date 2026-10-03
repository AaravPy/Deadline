import * as THREE from 'three';

export function buildArena(scene) {
  scene.background = new THREE.Color(0x090d0c);
  scene.fog = new THREE.FogExp2(0x090d0c, 0.027);
  scene.add(new THREE.HemisphereLight(0x9aaea5, 0x1c211d, 1.25));
  const moon = new THREE.DirectionalLight(0xc3d4c7, 1.45);
  moon.position.set(-8, 15, 7); scene.add(moon);
  const warm = new THREE.PointLight(0xe5b75b, 42, 25, 2);
  warm.position.set(-10, 5, -7); scene.add(warm);
  const red = new THREE.PointLight(0xd34432, 24, 19, 2);
  red.position.set(11, 4, 8); scene.add(red);

  const concrete = new THREE.MeshStandardMaterial({color:0x30352e,roughness:.94});
  const floorMat = new THREE.MeshStandardMaterial({color:0x20241f,roughness:1});
  const yellow = new THREE.MeshStandardMaterial({color:0xcbbb32,roughness:.75});
  const dark = new THREE.MeshStandardMaterial({color:0x131714,roughness:.9});
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(42,42),floorMat);
  floor.rotation.x=-Math.PI/2;floor.position.y=-.035;scene.add(floor);
  const grid = new THREE.GridHelper(42,42,0x41483c,0x30372f);
  grid.position.y=.005;grid.material.transparent=true;grid.material.opacity=.45;scene.add(grid);

  const wallGeo = new THREE.BoxGeometry(40,3,0.55);
  for(const [x,z,ry] of [[0,-19,0],[0,19,0],[-19,0,Math.PI/2],[19,0,Math.PI/2]]){
    const wall=new THREE.Mesh(wallGeo,concrete);wall.position.set(x,1.5,z);wall.rotation.y=ry;scene.add(wall);
    const stripe=new THREE.Mesh(new THREE.BoxGeometry(40,.07,.58),yellow);stripe.position.set(x,.42,z);stripe.rotation.y=ry;scene.add(stripe);
  }
  const box=(x,y,z,sx,sy,sz,mat=concrete)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),mat);m.position.set(x,y,z);scene.add(m);return m;};
  // Solid footprints are also used by player and zombie movement.
  const obstacles=[];
  const addObstacle=(x,z,width,depth,rotation=0)=>obstacles.push({x,z,hx:width/2,hz:depth/2,rotation});
  // A few big silhouettes make the yard readable without turning it into a maze.
  for(const [x,z,sx,sz] of [[-13,-12,5,3],[13,-12,4,5],[-13,12,5,4],[13,12,5,3]]){
    box(x,1.5,z,sx,3,sz,dark);box(x,3.05,z,sx+.12,.12,sz+.12,concrete);
    addObstacle(x,z,sx+.12,sz+.12);
    for(let i=-1;i<=1;i++)box(x+i*sx*.28,.52,z+sz/2+.02,.12,.8,.08,yellow);
  }
  // Broken concrete dividers, low enough to keep sightlines across the middle.
  for(const [x,z,rot] of [[-6,-6,-.2],[7,6,.24],[-8,5,.18]]){
    const b=box(x,.6,z,3.2,1.2,.42,concrete);b.rotation.y=rot;
    addObstacle(x,z,3.2,.46,rot);
    for(let i=0;i<3;i++){const mark=box(x-1+i,1.22,z,.36,.08,.46,yellow);mark.rotation.y=rot;}
  }
  // Industrial lamps: emissive heads and small point lights, no image assets.
  for(const [x,z,color] of [[-15,-15,0xeac060],[15,-15,0x9dac84],[-15,15,0xc48a54],[15,15,0xe45440]]){
    const pole=new THREE.Mesh(new THREE.CylinderGeometry(.09,.14,5,8),dark);pole.position.set(x,2.5,z);scene.add(pole);
    const head=new THREE.Mesh(new THREE.BoxGeometry(.7,.18,.45),new THREE.MeshStandardMaterial({color:0x282b24,emissive:color,emissiveIntensity:1.2}));head.position.set(x,5,z);scene.add(head);
    const lamp=new THREE.PointLight(color,16,14,2);lamp.position.set(x,4.8,z);scene.add(lamp);
  }
  // Drain lines and warning paint add a little texture to the otherwise open yard.
  for(let i=-2;i<=2;i++){
    const line=new THREE.Mesh(new THREE.BoxGeometry(.035,.012,34),new THREE.MeshBasicMaterial({color:0x4b4b37,transparent:true,opacity:.48}));line.position.set(i*1.35,.012,0);scene.add(line);
  }
  return {bounds:17.1,obstacles};
}

function collides(x,z,r,obstacles){
  for(const box of obstacles){
    const c=Math.cos(box.rotation),s=Math.sin(box.rotation),dx=x-box.x,dz=z-box.z;
    const lx=dx*c-dz*s,lz=dx*s+dz*c;
    const qx=THREE.MathUtils.clamp(lx,-box.hx,box.hx),qz=THREE.MathUtils.clamp(lz,-box.hz,box.hz);
    const ox=lx-qx,oz=lz-qz;
    if(ox*ox+oz*oz<r*r)return true;
  }
  return false;
}

export function moveCircle(x,z,dx,dz,r,obstacles,bounds){
  const min=-bounds+r,max=bounds-r;
  let px=x,pz=z;
  const steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dz))/.08)),stepX=dx/steps,stepZ=dz/steps;
  for(let i=0;i<steps;i++){
    const nextX=THREE.MathUtils.clamp(px+stepX,min,max);
    if(!collides(nextX,pz,r,obstacles))px=nextX;
    const nextZ=THREE.MathUtils.clamp(pz+stepZ,min,max);
    if(!collides(px,nextZ,r,obstacles))pz=nextZ;
  }
  return {x:px,z:pz};
}

export class Input {
  constructor(canvas,callbacks){this.canvas=canvas;this.callbacks=callbacks;this.keys=new Set();this.fireHeld=false;this.locked=false;this.lastPointer=null;
    window.addEventListener('keydown',e=>{if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(e.repeat)return;this.keys.add(e.code);if(e.code==='Escape')callbacks.pause();if(e.code==='KeyR')callbacks.reload();if(e.code==='KeyB')callbacks.shop();});
    window.addEventListener('keyup',e=>this.keys.delete(e.code));window.addEventListener('blur',()=>{this.keys.clear();this.fireHeld=false;this.lastPointer=null;});
    document.addEventListener('pointerlockchange',()=>{this.locked=document.pointerLockElement===canvas;this.lastPointer=null;callbacks.lockChange(this.locked);});
    document.addEventListener('pointerlockerror',()=>{this.locked=false;callbacks.lockChange(false);});
    canvas.addEventListener('mousedown',e=>{if(e.button!==0)return;this.fireHeld=true;if(!this.locked&&callbacks.isPlaying())this.lock();});window.addEventListener('mouseup',e=>{if(e.button===0)this.fireHeld=false;});
    // Pointer lock keeps the native pointer confined in capable browsers. Some
    // embedded hosts omit that API, so keep the system cursor hidden and continue
    // applying movement deltas while the pointer crosses the page.
    document.addEventListener('mousemove',e=>{if(this.locked){callbacks.look(e.movementX,e.movementY);return;}if(!callbacks.isPlaying()){this.lastPointer=null;return;}if(this.lastPointer)callbacks.look(e.clientX-this.lastPointer.x,e.clientY-this.lastPointer.y);this.lastPointer={x:e.clientX,y:e.clientY};});
  }
  lock(){try{const result=this.canvas.requestPointerLock();result?.catch?.(()=>{});}catch{}}
  unlock(){if(document.pointerLockElement===this.canvas)document.exitPointerLock();this.fireHeld=false;this.lastPointer=null;}
  movement(){return{x:(this.keys.has('KeyD')||this.keys.has('ArrowRight')?1:0)-(this.keys.has('KeyA')||this.keys.has('ArrowLeft')?1:0),y:(this.keys.has('KeyW')||this.keys.has('ArrowUp')?1:0)-(this.keys.has('KeyS')||this.keys.has('ArrowDown')?1:0),sprint:this.keys.has('ShiftLeft')||this.keys.has('ShiftRight')};}
}

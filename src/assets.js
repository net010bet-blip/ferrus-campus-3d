// Licensed assets plus reliable mesh fallback. Models are loaded over HTTPS when possible.
// CesiumMan: © Cesium, CC-BY 4.0. Khronos glTF sample models.
const GLBS=[
'./models/CesiumMan.glb',
'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb',
'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF-Binary/CesiumMan.glb'
];
export class HumanWorkers{
 constructor(pc,app){this.pc=pc;this.app=app;this.units=[];this.mode='carregando';}
 async load(zones){let pc=this.pc,app=this.app,model=null;
  for(const url of GLBS){try{const asset=new pc.Asset('CesiumMan · CC-BY 4.0','container',{url});app.assets.add(asset);await new Promise((resolve,reject)=>{let timeout=setTimeout(()=>reject(new Error('timeout')),5200);asset.once('load',()=>{clearTimeout(timeout);resolve()});asset.once('error',e=>{clearTimeout(timeout);reject(e)});app.assets.load(asset)});if(asset.resource?.instantiateRenderEntity){model=asset.resource;break}}catch(e){console.warn('Modelo GLB indisponível:',url,e.message||e)}}
  const stations=['cnc1','cnc2','metro','final','assembly','maintenance','reception','purchase','hr','engineering','distribution','gate','commercial','meeting'];
  for(let i=0;i<stations.length;i++){let zone=zones.find(z=>z.id===stations[i]);if(!zone)continue;let x=zone.x+((i%3)-1)*1.9,z=zone.z+(i%2?2:-2);let worker;
   if(model){worker=model.instantiateRenderEntity();worker.setLocalScale(.93,.93,.93);} else worker=this.makeWorker(i);
   worker.name='Profissional '+(i+1);worker.setLocalPosition(x,0,z);worker.setLocalEulerAngles(0,i*48,0);app.root.addChild(worker);this.units.push({worker,x,z,phase:i*2.3,pause:i%3===0});}
  this.mode=model?'modelos GLB CC-BY carregados':'personagens procedurais de emergência';return `${this.units.length} funcionários · ${this.mode}`;
 }
 makeWorker(i){const pc=this.pc,base=new pc.Entity('Funcionário de segurança industrial');let skin=pcMat(pc,i%2?'#b88a6d':'#d2a285'),vest=pcMat(pc,i%3===0?'#e9992d':'#b7cf46'),pants=pcMat(pc,'#263441'),boots=pcMat(pc,'#151e28'),helmet=pcMat(pc,'#e9e9da'),fabric=pcMat(pc,'#314b60');let add=(type,x,y,z,sx,sy,sz,mat,parent=base)=>{let e=new pc.Entity('anatomia');e.addComponent('render',{type,material:mat});e.setLocalPosition(x,y,z);e.setLocalScale(sx,sy,sz);parent.addChild(e);return e};
 // Meshes are smooth ellipsoids/capsules rather than cubes; industrial PPE visible from all angles.
 add('sphere',0,1.26,0,.62,.86,.34,fabric);add('sphere',0,1.35,-.20,.68,.75,.17,vest);add('sphere',0,1.70,0,.28,.19,.25,skin);add('sphere',0,1.96,-.01,.38,.44,.34,skin);add('sphere',0,2.20,-.01,.40,.15,.40,helmet);add('cylinder',0,2.11,-.04,.52,.065,.50,helmet);
 for(const s of [-1,1]){add('capsule',s*.19,.61,0,.23,1.04,.25,pants);add('sphere',s*.19,.16,-.08,.32,.22,.50,boots);let a=add('capsule',s*.41,1.24,0,.22,.83,.22,fabric);a.setLocalEulerAngles(0,0,s*15);add('sphere',s*.46,.88,-.02,.21,.24,.21,skin)}
 add('box',0,1.42,-.38,.07,.65,.055,pcMat(pc,'#ecf4cc'));return base;}
 tick(t){for(const u of this.units){let stride=u.pause?.04:.38;u.worker.setLocalPosition(u.x+Math.sin(t*.43+u.phase)*stride,0,u.z+Math.cos(t*.41+u.phase)*stride);u.worker.setLocalEulerAngles(0,u.phase*20+Math.sin(t*.17+u.phase)*32,0)}}
}
function pcMat(pc,hex){const c=new pc.Color();c.fromString(hex);const m=new pc.StandardMaterial();m.diffuse=c;m.gloss=.27;m.useMetalness=true;m.metalness=.03;m.update();return m;}

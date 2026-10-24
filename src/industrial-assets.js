// Licenced CC0 3D industrial assets, source 3dassets.dev Machine Shop and Factory Hall.
// Published with WebP PBR textures and KHR_mesh_quantization.
// On GitHub Pages the action mirrors files locally to remove CDN dependency.
const industrialModels=[
 {id:'cnc',label:'Centros CNC detalhados',urls:['./models/cnc.glb','https://cdn.3dassets.dev/assets/27732/v1/model.glb']},
 {id:'lathe',label:'Torno mecânico detalhado',urls:['./models/lathe.glb','https://cdn.3dassets.dev/assets/27724/v1/model.glb']},
 {id:'hall',label:'Galpão industrial de alta geometria',urls:['./models/hall.glb','https://cdn.3dassets.dev/assets/27790/v1/model.glb']}
];
export class IndustrialVisualAssets{
 constructor(pc,app,world,ui){this.pc=pc;this.app=app;this.world=world;this.ui=ui;this.loaded=[];this.failures=[];}
 async fetch(item){for(const url of item.urls){try{const pc=this.pc,asset=new pc.Asset(item.id,'container',{url});this.app.assets.add(asset);await new Promise((resolve,reject)=>{let timeout=setTimeout(()=>reject(Error('Tempo excedido')),13000);asset.once('load',()=>{clearTimeout(timeout);resolve()});asset.once('error',e=>{clearTimeout(timeout);reject(e)});this.app.assets.load(asset)});if(asset.resource?.instantiateRenderEntity)return asset.resource;throw Error('GLB vazio');}catch(e){console.warn(item.id,url,e.message||e)}}throw Error(item.label+' indisponível');}
 async load(){
  // Load the lower-bandwidth CNC model first so that the factory visibly upgrades even if the 7.5-MB hall takes longer.
  for(const item of industrialModels){try{let resource=await this.fetch(item),pc=this.pc;
   if(item.id==='cnc'){
    for(const m of this.world.machines){let e=resource.instantiateRenderEntity();e.name='Centro CNC industrial texturizado · '+m.idx;e.setPosition(m.x,0,m.z);e.setLocalScale(1.55,1.55,1.55);e.setEulerAngles(0,180,0);this.app.root.addChild(e);m.root.enabled=false;}
   }else if(item.id==='lathe'){
    for(const [x,z] of [[-33,-8],[25,-8]]){let e=resource.instantiateRenderEntity();e.setPosition(x,0,z);e.setEulerAngles(0,180,0);e.setLocalScale(1.1,1.1,1.1);this.app.root.addChild(e)}
   }else if(item.id==='hall'){
    // One full professional environment in the primary production hall, integrated with simulator sectors.
    let e=resource.instantiateRenderEntity();e.name='Galpão industrial detalhado CC0';e.setPosition(2,0,4);e.setLocalScale(1.0,1.0,1.0);e.setEulerAngles(0,0,0);this.app.root.addChild(e);
   }
   this.loaded.push(item.label);this.ui.toast('3D: '+item.label+' carregado.');window.FERRO_ASSETS_LOADED=this.loaded.slice();
  }catch(e){this.failures.push(e.message);console.warn(e)}}
  document.getElementById('graphicsNote').textContent=this.loaded.length?`Modelos industriais GLB em cena: ${this.loaded.join(', ')}. ${this.failures.length?'Alguns arquivos não carregaram.':''}`:'Modelos GLB industriais não puderam carregar. Visual técnico de emergência ativo.';
  return this.loaded;
 }
}

import {ZONES} from './config.js';
import {IndustrialSimulation} from './simulation.js';
import {FERROUI} from './ui.js';
import {PlayerController} from './controls.js';
import {SoftwareIndustrialWorld} from './fallback.js';
import {CampusWorld} from './world.js';
import {HumanWorkers} from './assets.js';
import {IndustrialVisualAssets} from './industrial-assets.js';

const canvas=document.querySelector('#application'),sim=new IndustrialSimulation(),ui=new FERROUI(sim);
const DEBUG={sim,world:null,graphics:null,player:null,humans:null,renderer:'inicializando'};window.FERRO_DEBUG=DEBUG;
const report=(t)=>{document.getElementById('loadMessage').textContent=t;ui.setGraphics(t)};
function finish(){document.getElementById('loadScreen').classList.add('hidden');ui.update();ui.toast('FERRO INICIADO · livre circulação por 30 setores · M mapa · T tablet · E trabalhar');}
function cpuFallback(reason){console.warn('FERRO · motor alternativo ativado: '+reason);let drawable=document.querySelector('#application');
 // If the GPU already took the canvas, replace it before acquiring Canvas2D.
 if(!drawable.getContext('2d')){let replacement=drawable.cloneNode(false);drawable.parentNode.replaceChild(replacement,drawable);drawable=replacement;}
 const player=new PlayerController(drawable,ui);ui.player=player;DEBUG.player=player;
 const world=new SoftwareIndustrialWorld(drawable,player,sim,ui);DEBUG.world=world;DEBUG.renderer='projeção 3D sem dependência externa';DEBUG.graphics='Canvas2D';
 ui.setGraphics('MODO COMPATIBILIDADE · sem WebGL ou CDN');
 document.getElementById('graphicsNote').textContent='Visual de compatibilidade ativo. A operação e as decisões continuam funcionando. Publique em HTTPS para testar o renderizador PlayCanvas.';
 finish();return world;
}
function timeoutPromise(ms){return new Promise((_,reject)=>setTimeout(()=>reject(new Error('tempo excedido')),ms));}
async function loadEngine(){let errors=[];for(let url of [
 new URL('./vendor/playcanvas.mjs', document.baseURI).href,
 'https://cdn.jsdelivr.net/npm/playcanvas@2.23.0/build/playcanvas.mjs',
 'https://unpkg.com/playcanvas@2.23.0/build/playcanvas.mjs',
 'https://esm.sh/playcanvas@2.23.0'
 ]){try{report('Obtendo motor gráfico pelo servidor '+new URL(url).hostname+'...');const lib=await Promise.race([import(/* @vite-ignore */url),timeoutPromise(5700)]);if(lib.createGraphicsDevice&&lib.AppBase)return lib;throw Error('exportações PlayCanvas inválidas')}catch(e){errors.push(new URL(url).hostname+': '+(e.message||e))}}throw Error('Bibliotecas indisponíveis ('+errors.join('; ')+')')}
async function run(){
 try{
  // Do not request the CDN if WebGL is unavailable; avoid 12-second loading-screen deadlocks.
  const probe=document.createElement('canvas');const webgl2=!!probe.getContext('webgl2');
  if(!webgl2){cpuFallback('WebGL 2.0 indisponível neste dispositivo ou visualizador');return}
  let pc=await loadEngine();report('Montando instalações, máquinas, corredores e departamentos...');
  const gd=await pc.createGraphicsDevice(canvas,{deviceTypes:[pc.DEVICETYPE_WEBGPU,pc.DEVICETYPE_WEBGL2],antialias:true,depth:true,stencil:true,powerPreference:'high-performance'});
  const opts=new pc.AppOptions();opts.graphicsDevice=gd;opts.componentSystems=[pc.RenderComponentSystem,pc.CameraComponentSystem,pc.LightComponentSystem];opts.resourceHandlers=[pc.TextureHandler,pc.ContainerHandler];
  const app=new pc.AppBase(canvas);app.init(opts);app.setCanvasResolution(pc.RESOLUTION_AUTO);app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);app.graphicsDevice.maxPixelRatio=Math.min(window.devicePixelRatio||1,1.4);
  app.scene.ambientLight=new pc.Color(.38,.44,.49);app.scene.exposure=1;app.scene.gammaCorrection=pc.GAMMA_SRGB;app.scene.toneMapping=pc.TONEMAP_ACES;
  const cam=new pc.Entity('Primeira pessoa');cam.addComponent('camera',{clearColor:new pc.Color(.54,.69,.79),fov:73,nearClip:.065,farClip:320});app.root.addChild(cam);
  const sun=new pc.Entity('Luz solar');sun.addComponent('light',{type:'directional',color:new pc.Color(1,.95,.85),intensity:2.6,castShadows:true,shadowResolution:1024,shadowDistance:68,normalOffsetBias:.03});sun.setLocalEulerAngles(51,24,0);app.root.addChild(sun);
  const bounce=new pc.Entity('Céu');bounce.addComponent('light',{type:'directional',color:new pc.Color(.68,.82,1),intensity:.68});bounce.setLocalEulerAngles(32,203,0);app.root.addChild(bounce);
  const world=new CampusWorld(pc,app),humans=new HumanWorkers(pc,app),player=new PlayerController(canvas,ui);
  ui.player=player;DEBUG.world=world;DEBUG.player=player;DEBUG.humans=humans;DEBUG.graphics=gd;DEBUG.app=app;DEBUG.renderer=gd.isWebGPU?'WebGPU':'WebGL2';app.start();
  let ts=0,sec=0;app.on('update',dt=>{dt=Math.min(.1,dt);ts+=dt;player.tick(dt,cam,pc);world.tick(ts);humans.tick(ts);sim.step(dt);sec+=dt;if(sec>.32){sec=0;ui.update()}});
  window.addEventListener('resize',()=>app.resizeCanvas());
  ui.setGraphics('PLAYCANVAS · '+DEBUG.renderer+' · MATERIAIS PBR');
  document.getElementById('graphicsNote').textContent='Motor PlayCanvas ativo. Personagens GLB licenciados podem carregar a seguir; se falharem, personagens de emergência permanecem disponíveis.';
  humans.load(ZONES).then(msg=>ui.toast(msg));
  const detailed=new IndustrialVisualAssets(pc,app,world,ui);DEBUG.detailed=detailed;detailed.load();
  finish();
 }catch(e){console.error('Falha de renderização 3D, usando modo compatibilidade:',e);cpuFallback(e.message||String(e))}
}
run();

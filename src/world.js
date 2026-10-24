import {ZONES} from './config.js';
export class CampusWorld {
 constructor(pc,app){this.pc=pc;this.app=app;this.entities=[];this.machines=[];this.forklifts=[];this.robots=[];this.materials=this.makeMaterials();this.build();this.highDetail()}
 color(hex){const c=new this.pc.Color();c.fromString(hex);return c}
 makeMaterials(){const defs={road:['#424b50',.96,.02],concrete:['#91999b',.96,.02],concreteDark:['#3e4a50',.94,.05],roof:['#5d707c',.68,.47],metal:['#c5d2d8',.27,.83],darkmetal:['#263742',.48,.72],panel:['#dde6e8',.56,.45],blue:['#244f63',.49,.46],yellow:['#f5ba30',.52,.17],orange:['#e9893a',.50,.16],white:['#e4edf1',.67,.16],floor:['#65787b',.85,.15],warehouse:['#b5bbc0',.80,.16],glass:['#6996aa',.11,.29],glassDark:['#194c5f',.20,.38],granite:['#343d45',.26,.06],wood:['#89674c',.58,.02],rubber:['#15191f',.91,.02],foliage:['#4e7655',.86,.03],grass:['#546b52',.93,.02],red:['#bd484e',.61,.2],green:['#4c9970',.54,.09],screen:['#0e3d4e',.28,.04],stripe:['#ead379',.66,.08]};let out={};for(const [n,[c,rough,metal]] of Object.entries(defs)){const m=new this.pc.StandardMaterial();m.diffuse=this.color(c);m.useMetalness=true;m.metalness=metal;m.gloss=1-rough; if(n==='glass'||n==='glassDark'){m.opacity=.47;m.blendType=this.pc.BLEND_NORMAL;m.depthWrite=false;m.cull=this.pc.CULLFACE_NONE} if(n==='screen'){m.emissive=this.color('#347f9f');m.emissiveIntensity=.7}m.update();out[n]=m}return out}
 item(type,x,y,z,w,h,d,material,parent=null){const e=new this.pc.Entity('MESH_'+type);e.addComponent('render',{type,material:typeof material==='string'?this.materials[material]:material});e.setLocalPosition(x,y,z);e.setLocalScale(w,h,d);(parent||this.app.root).addChild(e);this.entities.push(e);return e}
 beam(x,y,z,w,h,d,material){return this.item('box',x,y,z,w,h,d,material)}
 cyl(x,y,z,r,height,material){return this.item('cylinder',x,y,z,r*2,height,r*2,material)}
 sphere(x,y,z,r,material){return this.item('sphere',x,y,z,r*2,r*2,r*2,material)}
 label(text,x,y,z,width=7,face=0){try{const can=document.createElement('canvas');can.width=1024;can.height=144;const c=can.getContext('2d');c.fillStyle='#0b2835';c.fillRect(0,0,1024,144);c.fillStyle='#5ce3e3';c.fillRect(0,0,16,144);c.fillStyle='#e6f2f3';c.font='bold 47px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText(text.toUpperCase(),512,74,946);const tex=new this.pc.Texture(this.app.graphicsDevice,{mipmaps:true});tex.setSource(can);const m=new this.pc.StandardMaterial();m.diffuse=this.color('#ffffff');m.diffuseMap=tex;m.emissive=this.color('#ffffff');m.emissiveMap=tex;m.emissiveIntensity=.9;m.cull=this.pc.CULLFACE_NONE;m.update();const e=this.item('plane',x,y,z,width,1,width*.14,m);e.setLocalEulerAngles(90,face,0);return e}catch(e){console.warn('Placa sem textura:',e)}}
 framing(x,z,w,d,h,type){ // Open-sided structures, navigable hall with pillars and metal trusses.
  this.beam(x, -.14,z,w,.25,d,type==='admin'?'concrete':'floor');
  const steel=type==='admin'?'white':'darkmetal';
  for(const xx of [x-w/2+1.3,x+w/2-1.3])for(let zz=z-d/2+1.3;zz<=z+d/2-1.3;zz+=Math.max(9,Math.floor(d/4))){this.beam(xx,h/2,zz,.25,h,.33,steel);this.beam(xx,h-.35,zz,1.8,.20,.35,steel)}
  for(const zz of [z-d/2+1,z+d/2-1])for(let xx=x-w/2+1;xx<=x+w/2-1;xx+=11){this.beam(xx,h/2,zz,.24,h,.24,steel)}
  for(let xx=x-w/2+2;xx<x+w/2-1;xx+=5.5)this.beam(xx,h,z,.17,.23,d-.7,'roof');
  for(let zz=z-d/2+2;zz<z+d/2-1;zz+=8){this.beam(x,h-.55,zz,w-.8,.12,.35,'metal')}
  if(type==='admin'){this.beam(x,1.6,z-d/2,.1,3.1,w,'glassDark')}
 }
 cnc(x,z,idx){const p=this.pc;const root=new p.Entity('CNC-'+idx);root.setPosition(x,0,z);this.app.root.addChild(root);let b=(xx,yy,zz,w,h,d,m)=>this.item('box',xx,yy,zz,w,h,d,m,root);
 b(0,1.55,0,5.4,3.1,3.25,'panel');b(0,3.12,0,5.75,.34,3.52,'darkmetal');b(-.64,1.7,-1.65,3.05,2.36,.15,'darkmetal');b(-.64,1.7,-1.755,2.7,1.93,.12,'glassDark');b(-.64,1.74,-1.85,.09,2.2,.17,'metal');b(1.88,1.78,-1.69,.97,2.8,.29,'darkmetal');b(1.88,2.26,-1.88,.69,.76,.07,'screen');b(1.88,1.60,-1.89,.74,.35,.1,'metal');for(let i=0;i<12;i++)this.item('sphere',1.56+(i%4)*.20,1.67-Math.floor(i/4)*.16,-1.974,.084,.08,.03,i%4?'rubber':'orange',root);b(-.67,.88,-1.91,2.42,.16,.12,'metal');for(let i=0;i<5;i++)b(-2.5,.38+i*.31,0,.22,.11,2,'blue');b(2.0,3.47,-.4,.24,.5,.24,'yellow');this.machines.push({root,x,z,idx});return root}
 conveyor(x,z,length){this.beam(x,.60,z,length,.17,1.38,'darkmetal');for(let xx=x-length/2+.30;xx<x+length/2-.2;xx+=.54){let r=this.cyl(xx,.75,z,.105,1.18,'metal');r.setEulerAngles(90,0,0)}for(let xx=x-length/2+.6;xx<x+length/2;xx+=2.8){for(let zz of [-.55,.55])this.beam(xx,.33,z+zz,.14,.68,.16,'darkmetal')}}
 pallet(x,z,count=5){this.beam(x,.22,z,3.0,.30,1.54,'wood');for(let j=0;j<count;j++){const xx=x-1.14+(j%3)*.93, zz=z-.36+Math.floor(j/3)*.72;this.cyl(xx,.65,zz,.33,.55,'metal');this.cyl(xx,.99,zz,.15,.14,'darkmetal');for(let i=0;i<4;i++)this.cyl(xx+Math.cos(i*Math.PI/2)*.22,.95,zz+Math.sin(i*Math.PI/2)*.22,.038,.07,'darkmetal')}}
 adminDesk(x,z){this.beam(x,.87,z,2.18,.12,1.03,'wood');for(const dx of [-.87,.87])for(const dz of [-.4,.4])this.beam(x+dx,.41,z+dz,.08,.82,.06,'darkmetal');this.beam(x,.95,z-.20,.73,.05,.28,'rubber');this.beam(x,1.40,z-.28,1.1,.66,.09,'darkmetal');this.beam(x,1.40,z-.34,.90,.49,.04,'screen');this.beam(x,.36,z+1.35,.67,.12,.68,'blue');this.beam(x,.91,z+1.55,.63,.89,.13,'blue');this.cyl(x,.38,z+.90,.10,.68,'darkmetal')}
 robot(x,z){const r=new this.pc.Entity('RoboIndustrial');r.setLocalPosition(x,0,z);this.app.root.addChild(r);let b=(xx,yy,zz,w,h,d,m,parent=r)=>this.item('box',xx,yy,zz,w,h,d,m,parent);b(0,.40,0,1.35,.85,1.10,'blue');const base=new this.pc.Entity('base');base.setLocalPosition(0,.9,0);r.addChild(base);b(0,.65,0,.50,1.45,.46,'yellow',base);const elbow=new this.pc.Entity('cotovelo');elbow.setLocalPosition(0,1.3,0);base.addChild(elbow);b(.40,.35,0,.95,.42,.36,'orange',elbow);b(.91,.49,0,.20,.60,.22,'darkmetal',elbow);this.robots.push({base,elbow,offset:this.robots.length*2.8})}
 forklift(x,z){const r=new this.pc.Entity('Empilhadeira');r.setPosition(x,0,z);this.app.root.addChild(r);const b=(xx,yy,zz,w,h,d,m)=>this.item('box',xx,yy,zz,w,h,d,m,r);b(0,.71,0,2.6,1.15,1.24,'yellow');b(-.57,1.51,0,1.23,.50,1.16,'glassDark');for(const zz of [-.56,.56])for(const xx of [-.86,.86]){const wh=this.item('cylinder',xx,.43,zz,.58,.23,.58,'rubber',r);wh.setLocalEulerAngles(90,0,0)}b(1.3,1.50,0,.16,2.4,.17,'darkmetal');for(const zz of [-.4,.4])b(2.08,.21,zz,2.0,.14,.17,'metal');this.forklifts.push({r,x,z})}
 officeBlock(x,z,w,d,label){this.beam(x,0,z,w,.15,d,'concrete');this.beam(x,2.9,z+d/2,w,5.8,.20,'warehouse');this.beam(x-w/2,2.9,z,.15,5.8,d,'warehouse');this.beam(x+w/2,2.9,z,.15,5.8,d,'warehouse');this.beam(x,5.65,z,w,.30,d,'roof');this.label(label,x,4.3,z-d/2+.10,Math.min(18,w*.7));for(let i=0;i<3;i++){this.adminDesk(x-w/3+i*w/3,z+.4)} }
 build(){const b=this.beam.bind(this);b(0,-.30,80,310,.5,280,'road');b(0,-.035,0,94,.08,74,'floor');b(0,-.03,94,81,.09,48,'concrete');b(-65,-.03,98,57,.08,39,'concrete');b(76,-.03,96,66,.08,42,'concrete');b(0,-.03,156,125,.10,51,'concreteDark');b(0,-.038,50,17,.04,29,'road');for(let z=42;z<62;z+=5)b(0,.005,z,.16,.02,1.5,'stripe');
 this.framing(0,0,94,72,10,'factory');this.framing(0,96,80,47,7.1,'admin');this.framing(-66,98,56,39,6,'tech');this.framing(76,95,65,43,8.8,'warehouse');
 for(const x of [-42,-30,-18,-6,6,18,30,42]){b(x,8.91,0,.26,.30,71,'metal');for(const z of [-24,-8,8,24]){const l=b(x,8.63,z,2.0,.08,.55,'white');l.render.castShadows=false}}
 for(let z=-32;z<=33;z+=8)for(let x=-40;x<=42;x+=12)b(x,.013,z,1.2,.018,.085,'stripe');
 [-33,-16,3,23].forEach((x,i)=>this.cnc(x,-22,i));this.cnc(-33,-8,4);this.cnc(22,-8,5);this.conveyor(-2,-3,30);this.conveyor(26,10,20);this.conveyor(-29,9,22);
 for(let i=0;i<6;i++)this.pallet(-38+(i%3)*4,16+Math.floor(i/3)*4,5+i%3);for(let i=0;i<5;i++)this.pallet(5+(i%3)*3.8,18+Math.floor(i/3)*3.3,4);this.robot(13,-5);this.robot(32,5);this.forklift(-14,40);
 for(const z of [-36,36])for(let x=-44;x<46;x+=5){b(x,1.4,z,.12,2.8,.12,'yellow');b(x,2.86,z,4.85,.08,.11,'yellow')}
 for(let x=-43;x<=45;x+=18){this.pallet(x,-31,3);b(x,2.3,-34,9,.13,.95,'darkmetal')}
 this.label('LINHA DE USINAGEM CNC',0,5.4,-33.5,22);this.label('CQ · INSPEÇÃO FINAL',19,4.6,32.5,13);
 for(let i=0;i<4;i++)this.adminDesk(-27+i*18,85);for(let i=0;i<4;i++)this.adminDesk(-27+i*18,104);this.adminDesk(0,112);this.adminDesk(-26,111);
 for(let x=-34;x<=33;x+=11)for(const z of [72.4,117.2]){b(x,3,z,.14,6,.12,'metal');b(x,4.55,z,10,.05,.14,'metal')}
 for(const z of [96,107])for(let x=-38;x<=39;x+=17){if(x>-9&&x<9)continue;b(x,2.15,z,.12,4.15,7,'glassDark')}
 this.label('FERRO · CENTRO ADMINISTRATIVO',0,5.6,72.4,27);this.label('QUALIDADE · RH · COMPRAS · DIRETORIA',0,3.4,117.1,24);
 this.officeBlock(-76,92,19,17,'ENGENHARIA');this.officeBlock(-56,106,19,16,'TREINAMENTO');this.officeBlock(-75,110,18,15,'AUDITORIA');
 for(let i=0;i<5;i++){b(62+i*5,1.2,81,3.4,2.4,2.9,'blue');b(62+i*5,2.67,81,3.5,.12,3,'metal')}for(let i=0;i<3;i++)this.pallet(61+i*5,94);
 this.label('CD · EXPEDIÇÃO',76,6.7,74.8,18);this.label('ARMAZÉM · RECEBIMENTO',-21,5.2,-35.6,18);
 for(let i=0;i<5;i++){let x=38+i*12,z=145+(i%2)*5;const car=b(x,0.73,z,3.0,1.13,1.49,i%2?'metal':'blue');b(x+.1,1.5,z,1.7,.64,1.3,'glassDark');for(const dx of [-1.12,1.12])for(const dz of [-.66,.66])this.cyl(x+dx,.35,z+dz,.34,.18,'rubber')}
 for(let i=0;i<5;i++)this.cyl(-59+i*3,.95,147,1.2,1.5,'blue');for(let i=0;i<5;i++)this.cyl(-59+i*3,1.82,147,.40,.35,'metal');
 for(const x of [-99,-90,94,107])for(const z of [58,77,116,154]){this.cyl(x,.41,z,.62,.82,'concreteDark');this.cyl(x,2,z,.16,2.55,'wood');this.sphere(x,3.4,z,1.40,'foliage');this.sphere(x+1,3.7,z+.3,.9,'grass')}
 this.officeBlock(-4,140,26,15,'REFEITÓRIO');b(0,1,170,17,2,5,'white');this.label('PORTARIA FERRO',0,3.3,167.3,13);
 // Situated labels: every sector is functional and tied to simulation state.
 for(const s of ZONES){if(['cnc1','cnc2','office','metro','final','meeting','hr','purchase','reception','engineering','distribution'].includes(s.id)){this.label(s.code,s.x,3.6,s.z-3.8,Math.min(12,Math.max(5,s.code.length*.48)))}}
 }
 highDetail(){
  const b=this.beam.bind(this),c=this.cyl.bind(this);
  // Industrial hall: suspended service conduits, safety cage, trusses, station lighting and pipe supports.
  for(let z=-28;z<=30;z+=11){b(0,8.15,z,91,.13,.14,'darkmetal');for(let x=-40;x<43;x+=5.5){b(x,8.03,z,.09,.21,.40,'metal')}}
  for(const z of [-30,2,29]){for(let x=-40;x<43;x+=6.5){b(x,7.2,z,.22,.14,.10,'yellow');b(x,7.3,z+.27,.15,.13,.13,'red')}}
  for(let x=-41;x<=42;x+=14){b(x,6.6,0,.22,1.2,69,'blue');b(x,7.25,0,.26,.22,69,'metal')}
  // Realistic CNC machine exterior: ventilation grilles, cable sleeves, safety stripes, hatch details, machine labels.
  for(const m of this.machines){let x=m.x,z=m.z;for(let j=0;j<7;j++)b(x+2.7,1.12+j*.19,z+.9,.035,.05,1.30,'darkmetal');for(let j=0;j<3;j++){b(x-2.85,2.55,z-1.30+j*.8,.055,.39,.055,'yellow')}for(let j=0;j<4;j++)b(x-2.62,.70,z-1.85+j*.19,.05,.06,.08,'rubber');b(x-1.45,1.02,z-1.83,.27,.18,.07,'metal');c(x+2.35,2.67,z-1.94,.074,.05,'yellow');this.label('FERRO · CNC '+(m.idx+1),x,3.12,z-1.93,2.4)}
  // Metrology benches with metal parts and measurement instruments; yellow floor segregation marks.
  for(let i=0;i<5;i++){let x=-7+i*3.2,z=23;b(x,.91,z,2.4,.15,1.36,'granite');for(const dx of [-1,1])for(const dz of [-.5,.5])b(x+dx,.44,z+dz,.075,.86,.07,'darkmetal');c(x,1.2,z,.35,.33,'metal');c(x,1.40,z,.15,.1,'darkmetal');b(x+.6,1.0,z-.3,.62,.03,.07,'yellow');b(x-.7,1.6,z-.52,.84,.78,.09,'darkmetal');b(x-.7,1.62,z-.60,.67,.57,.06,'screen')}
  for(let x=3;x<=24;x+=4){b(x,.07,29,.15,.025,6,'yellow');b(x,.075,26,3.8,.028,.12,'yellow')}
  // Administrative furnishing: columns, glazing, document cabinets, reception and meeting table.
  for(let z of [77,96,117]){for(let x=-36;x<=36;x+=9){b(x,3.0,z,.22,5.9,.20,'white');b(x,3.75,z,.05,.14,6.5,'metal');b(x,1.60,z-.03,.055,2.8,6.3,'glassDark')}}
  for(let x of [-34,-16,2,20,35])for(let z of [93,109]){b(x,1.22,z+3.15,1.5,2.3,.44,'blue');for(let j=0;j<3;j++)b(x,1.0+j*.6,z+2.83,1.33,.06,.06,'metal')}
  b(-14,.8,111,4.1,.15,2.2,'wood');for(let dx of [-1.6,1.6])b(-14+dx,.40,111,.14,.8,.16,'darkmetal');this.label('SALA DE REUNIÕES',-14,4.2,104,8);
  // Pipe works, utility tanks and plant outside.
  for(let x=-60;x<=-49;x+=2.6){c(x,1.05,146,.91,2.0,'blue');c(x,2.16,146,.71,.20,'metal');b(x,2.4,146,.22,.33,.25,'metal')}
  for(let i=0;i<5;i++){let x=60+i*9,z=116;b(x,1.9,z,6.7,3.4,.35,'panel');b(x,3.77,z,7,.27,.50,'darkmetal');b(x,1.5,z-1,4,.16,.12,'yellow')}
  this.label('SEGURANÇA EM PRIMEIRO LUGAR',-28,5.0,32,17);this.label('ADMINISTRAÇÃO · ENGENHARIA · LOGÍSTICA',0,6,72.3,26);
 }
 tick(t){for(const r of this.robots){r.base.setLocalEulerAngles(0,Math.sin(t*.7+r.offset)*44,0);r.elbow.setLocalEulerAngles(0,0,Math.sin(t+.8+r.offset)*25)}for(const f of this.forklifts){f.r.setPosition(f.x+Math.sin(t*.11)*10,0,f.z);f.r.setEulerAngles(0,(Math.cos(t*.11)>=0)?90:-90,0)}}
}

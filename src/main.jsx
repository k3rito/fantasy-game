import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import './style.css';

const ASSETS={
  enemy:'https://cdn.3dassets.dev/assets/32794/v1/model.glb',
  tree:'https://cdn.3dassets.dev/assets/32932/v1/model.glb',
  shrine:'https://cdn.3dassets.dev/assets/32939/v1/model.glb',
  watch:'https://cdn.3dassets.dev/assets/32937/v1/model.glb',
};
const QUESTS=[
 {name:'The Broken Beacon',desc:'Reach the ruined watch lodge and restore its signal.',reward:120,target:'beacon'},
 {name:'Ashbound Trail',desc:'Defeat four ember-bound skeletons and recover their shards.',reward:180,target:'wraith'},
 {name:'The Silent Grove',desc:'Reach the ancient sanctuary and awaken its guardian.',reward:250,target:'shrine'}
];
const SKILLS=['Shadow Step','Iron Will','Ember Blade','Hunter Sense','Void Pulse','Warden Guard'];
const read=(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch{return d}};

function Game(){
 const mount=useRef();
 const [level,setLevel]=useState(()=>Number(localStorage.getItem('af_level')||1));
 const [xp,setXp]=useState(()=>Number(localStorage.getItem('af_xp')||0));
 const [gold,setGold]=useState(()=>Number(localStorage.getItem('af_gold')||40));
 const [quest,setQuest]=useState(()=>Number(localStorage.getItem('af_quest')||0));
 const [questKills,setQuestKills]=useState(()=>Number(localStorage.getItem('af_qkills')||0));
 const [skills,setSkills]=useState(()=>read('af_skills',[]));
 const [skillPts,setSkillPts]=useState(()=>Number(localStorage.getItem('af_skillpts')||2));
 const [hp,setHp]=useState(()=>Number(localStorage.getItem('af_hp')||100));
 const [inventory,setInventory]=useState(()=>read('af_inventory',['Ember Shard × 0']));
 const [menu,setMenu]=useState(''),[notice,setNotice]=useState('');
 const state=useRef({});
 const skillsRef=useRef(skills);
 useEffect(()=>{skillsRef.current=skills},[skills]);

 useEffect(()=>{
  const el=mount.current,scene=new THREE.Scene();
  scene.background=new THREE.Color(0x05070b);scene.fog=new THREE.Fog(0x05070b,28,100);
  const camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.1,220);camera.position.set(0,7,14);
  const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;el.appendChild(renderer.domElement);
  const clock=new THREE.Clock(),loader=new GLTFLoader(),mixers=[];
  scene.add(new THREE.HemisphereLight(0x91a8c6,0x24160f,1.8));
  const sun=new THREE.DirectionalLight(0xffd69a,2.7);sun.position.set(18,30,12);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);scene.add(sun);
  const moon=new THREE.PointLight(0x6655cc,10,32);moon.position.set(18,8,20);scene.add(moon);
  const mat=(c,r=.82)=>new THREE.MeshStandardMaterial({color:c,roughness:r});
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(120,120),mat(0x1a211c,1));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
  const grid=new THREE.GridHelper(120,30,0x28342d,0x151b18);grid.position.y=.01;scene.add(grid);

  const addTreeFallback=(x,z,s=1)=>{const g=new THREE.Group();const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.18*s,.3*s,1.7*s,6),mat(0x493827));trunk.position.y=.85*s;const crown=new THREE.Mesh(new THREE.ConeGeometry(1.2*s,3*s,7),mat(0x26382b));crown.position.y=2.8*s;g.add(trunk,crown);g.position.set(x,0,z);scene.add(g);return g};
  const addAsset=(url,pos,scale=1,rot=0)=>new Promise(resolve=>loader.load(url,gltf=>{const o=gltf.scene;o.position.set(...pos);o.rotation.y=rot;o.scale.setScalar(scale);o.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});scene.add(o);if(gltf.animations?.length){const m=new THREE.AnimationMixer(o);m.clipAction(gltf.animations[0]).play();mixers.push(m)}resolve(o)},undefined,()=>resolve(null)));

  for(let i=0;i<42;i++){const x=(Math.random()-.5)*105,z=(Math.random()-.5)*105;if(Math.hypot(x,z)>10)addTreeFallback(x,z,.7+Math.random()*.55)}
  for(const p of [[-38,-35],[35,-32],[-35,30],[38,5]]) addTreeFallback(p[0],p[1],1.1);

  const landmark=(x,z,color)=>{const g=new THREE.Group();const base=new THREE.Mesh(new THREE.CylinderGeometry(2,2.4,.7,8),mat(0x343a35));base.position.y=.35;const ob=new THREE.Mesh(new THREE.CylinderGeometry(.5,.8,4,6),mat(color));ob.position.y=2.6;g.add(base,ob);g.position.set(x,0,z);scene.add(g);return g};
  const beacon=landmark(0,-28,0xb77b32),grove=landmark(-25,-10,0x6c8d4f),shrineMarker=landmark(26,25,0x7b5ac6);
  addAsset(ASSETS.watch,[0,0,-28],1.1).then(o=>{if(o)beacon.visible=false});
  addAsset(ASSETS.shrine,[26,0,25],1.0).then(o=>{if(o)shrineMarker.visible=false});
  addAsset(ASSETS.tree,[-25,0,-10],1.15);

  const hero=new THREE.Group();hero.position.set(0,0,8);const body=new THREE.Mesh(new THREE.CapsuleGeometry(.55,1.25,5,10),mat(0x151922));body.position.y=1.25;body.castShadow=true;hero.add(body);const cape=new THREE.Mesh(new THREE.ConeGeometry(1.05,2.5,4,1,true),new THREE.MeshStandardMaterial({color:0x090b10,side:THREE.DoubleSide,roughness:.9}));cape.position.set(0,1.2,-.35);cape.rotation.x=Math.PI/2;hero.add(cape);scene.add(hero);
  const aura=new THREE.PointLight(0xb46b2d,1.8,5);aura.position.set(0,1.4,.3);hero.add(aura);

  const enemies=[];const spawnEnemy=(x,z)=>{const fallback=new THREE.Group();fallback.position.set(x,0,z);const b=new THREE.Mesh(new THREE.CapsuleGeometry(.5,.8,4,8),mat(0x6b2631));b.position.y=1;fallback.add(b);scene.add(fallback);const e={g:fallback,hp:2,dead:false,asset:null};enemies.push(e);addAsset(ASSETS.enemy,[x,0,z],.9,Math.PI).then(o=>{if(!o)return;e.asset=o;scene.remove(fallback);e.g=o});return e};
  for(let i=0;i<8;i++)spawnEnemy(-20+Math.random()*40,-3-Math.random()*28);

  const pickups=[];const addShard=(x,z)=>{const m=new THREE.Mesh(new THREE.OctahedronGeometry(.42),mat(0xd58b3c));m.position.set(x,.65,z);scene.add(m);pickups.push(m)};for(let i=0;i<6;i++)addShard(-18+i*7,-17-Math.random()*12);

  const keys={};let attackCooldown=0,deadTimer=0;
  const attack=()=>{if(attackCooldown>0||deadTimer>0)return;attackCooldown=skillsRef.current.includes('Shadow Step')?.3:.45;const range=skillsRef.current.includes('Hunter Sense')?5.5:4;let nearest=null,dist=range;for(const e of enemies){if(e.dead)continue;const d=hero.position.distanceTo(e.g.position);if(d<dist){nearest=e;dist=d}}if(nearest){const dmg=skillsRef.current.includes('Ember Blade')?2:1;nearest.hp-=dmg;nearest.g.scale.multiplyScalar(.94);if(nearest.hp<=0){nearest.dead=true;scene.remove(nearest.g);setGold(g=>g+15);setXp(v=>v+35);setQuestKills(k=>k+1);setNotice('Enemy defeated · +35 XP · +15 Gold')}}if(skillsRef.current.includes('Void Pulse')){for(const e of enemies){if(e.dead||e===nearest)continue;if(hero.position.distanceTo(e.g.position)<3){e.hp-=1;if(e.hp<=0){e.dead=true;scene.remove(e.g);setGold(g=>g+15);setXp(v=>v+35);setQuestKills(k=>k+1)}}}}};
  const kd=e=>{keys[e.key.toLowerCase()]=true;if(e.code==='Space'){e.preventDefault();attack()}};const ku=e=>keys[e.key.toLowerCase()]=false;addEventListener('keydown',kd);addEventListener('keyup',ku);

  state.current={hero,enemies,keys,attack,getPos:()=>hero.position.clone(),reset:()=>{hero.position.set(0,0,8);setHp(100);deadTimer=0;setNotice('Respawned at Ashen Frontier')}};
  const tick=()=>{const dt=Math.min(.033,clock.getDelta());for(const m of mixers)m.update(dt);const speed=(skillsRef.current.includes('Shadow Step')?7.4:6)*dt;let dx=(keys.d?1:0)-(keys.a?1:0),dz=(keys.s?1:0)-(keys.w?1:0);const l=Math.hypot(dx,dz)||1;if(dx||dz){dx/=l;dz/=l;hero.position.x+=dx*speed;hero.position.z+=dz*speed;hero.rotation.y=Math.atan2(dx,dz)}hero.position.x=THREE.MathUtils.clamp(hero.position.x,-54,54);hero.position.z=THREE.MathUtils.clamp(hero.position.z,-54,54);
    if(deadTimer>0){deadTimer-=dt;if(deadTimer<=0)state.current.reset()}
    for(const e of enemies){if(e.dead||deadTimer>0)continue;const d=e.g.position.distanceTo(hero.position);if(d<13){const v=e.g.position.clone().sub(hero.position).normalize();e.g.position.addScaledVector(v,-speed*.42);e.g.lookAt(hero.position.x,e.g.position.y,hero.position.z);if(d<1.55){const reduction=skillsRef.current.includes('Warden Guard')?.55:1;setHp(h=>{const n=Math.max(0,h-dt*9*reduction);if(n<=0&&deadTimer<=0){deadTimer=2.2;setNotice('You fell in battle · respawning...')}return n})}}}
    for(let i=pickups.length-1;i>=0;i--){pickups[i].rotation.y+=dt*1.8;if(pickups[i].position.distanceTo(hero.position)<1.8){scene.remove(pickups[i]);pickups.splice(i,1);setXp(v=>v+25);setInventory(a=>{const n=[...a];n[0]=`Ember Shard × ${Number((n[0]?.match(/× (\d+)/)||['',0])[1])+1}`;return n});setNotice('Ember shard recovered · +25 XP')}}
    attackCooldown=Math.max(0,attackCooldown-dt);camera.position.x+=(hero.position.x-camera.position.x)*.08;camera.position.z+=(hero.position.z+12-camera.position.z)*.08;camera.position.y+=(hero.position.y+7-camera.position.y)*.08;camera.lookAt(hero.position.x,1,hero.position.z);renderer.render(scene,camera);requestAnimationFrame(tick)};requestAnimationFrame(tick);
  const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)};addEventListener('resize',resize);
  return()=>{removeEventListener('keydown',kd);removeEventListener('keyup',ku);removeEventListener('resize',resize);renderer.dispose();el.removeChild(renderer.domElement)};
 },[]);

 useEffect(()=>{let n=xp,lv=level,pts=skillPts;while(n>=100){n-=100;lv++;pts++}if(lv!==level)setLevel(lv);if(pts!==skillPts)setSkillPts(pts);if(n!==xp)setXp(n);localStorage.setItem('af_level',lv);localStorage.setItem('af_xp',n);localStorage.setItem('af_gold',gold);localStorage.setItem('af_quest',quest);localStorage.setItem('af_qkills',questKills);localStorage.setItem('af_skills',JSON.stringify(skills));localStorage.setItem('af_skillpts',pts);localStorage.setItem('af_hp',hp);localStorage.setItem('af_inventory',JSON.stringify(inventory))},[xp,level,gold,quest,questKills,skills,skillPts,hp,inventory]);
 useEffect(()=>{if(!notice)return;const t=setTimeout(()=>setNotice(''),2400);return()=>clearTimeout(t)},[notice]);
 const q=QUESTS[quest];
 const complete=()=>{const p=state.current.getPos?.();if(q.target==='beacon'&&p?.distanceTo(new THREE.Vector3(0,0,-28))>6){setNotice('Reach the Broken Beacon first');return}if(q.target==='wraith'&&questKills<4){setNotice(`Defeat ${4-questKills} more enemies`);return}if(q.target==='shrine'&&p?.distanceTo(new THREE.Vector3(26,0,25))>7){setNotice('Reach the Silent Shrine first');return}setXp(v=>v+q.reward);setGold(v=>v+60);setQuestKills(0);setQuest((quest+1)%QUESTS.length);setNotice(`Quest complete · +${q.reward} XP · +60 Gold`)};
 const unlock=name=>{if(skills.includes(name)||skillPts<1)return;setSkills([...skills,name]);setSkillPts(skillPts-1);setNotice(`${name} unlocked`)};
 const reset=()=>{localStorage.clear();location.reload()};
 const touch=(key,down)=>{state.current.keys[key]=down};
 return <div className="game"><div ref={mount} className="canvas"/><header><div><b>ASHEN FRONTIER</b><small>OPEN WORLD · ADVENTURE RPG</small></div><div className="topstats">LV {level} · {xp}/100 XP · {gold} G</div></header><div className="vitals"><span>HP</span><div><i style={{width:`${Math.max(0,hp)}%`}}/></div></div><aside className="quest"><span>ACTIVE QUEST</span><h2>{q.name}</h2><p>{q.desc}</p><small>Progress: {q.target==='wraith'?`${Math.min(questKills,4)}/4 enemies`:'Reach the objective zone'}</small><button onClick={complete}>TURN IN · +{q.reward} XP</button></aside><div className="controls"><span>WASD MOVE</span><span>SPACE ATTACK</span></div><div className="touch"><button onPointerDown={()=>touch('w',true)} onPointerUp={()=>touch('w',false)} onPointerLeave={()=>touch('w',false)}>▲</button><div><button onPointerDown={()=>touch('a',true)} onPointerUp={()=>touch('a',false)} onPointerLeave={()=>touch('a',false)}>◀</button><button onPointerDown={()=>touch('s',true)} onPointerUp={()=>touch('s',false)} onPointerLeave={()=>touch('s',false)}>▼</button><button onPointerDown={()=>touch('d',true)} onPointerUp={()=>touch('d',false)} onPointerLeave={()=>touch('d',false)}>▶</button></div></div><button className="attack" onPointerDown={()=>state.current.attack?.()}>ATTACK</button><nav><button onClick={()=>setMenu('skills')}>✦ Skills <i>{skillPts}</i></button><button onClick={()=>setMenu('inventory')}>◈ Inventory</button><button onClick={()=>setMenu('map')}>⌖ Map</button></nav>{notice&&<div className="notice">{notice}</div>}{menu&&<div className="modal"><button className="close" onClick={()=>setMenu('')}>×</button>{menu==='skills'?<><h1>SKILL TREE</h1><p>Passive abilities alter the actual combat and traversal systems.</p><div className="skillgrid">{SKILLS.map((x,i)=><button key={x} className={skills.includes(x)?'unlocked':''} disabled={skills.includes(x)||skillPts<1} onClick={()=>unlock(x)}><strong>{x}</strong><small>{skills.includes(x)?'UNLOCKED':`Tier ${i+1} · Cost 1`}</small></button>)}</div></>:menu==='inventory'?<><h1>INVENTORY</h1><p>Recovered resources and field equipment.</p><div className="inventory"><div><b>EMBER SHARDS</b><strong>{inventory[0]?.split('×')[1]?.trim()||0}</strong><small>Quest material · grants 25 XP on pickup</small></div><div><b>GOLD</b><strong>{gold}</strong><small>Currency · earned from enemies and quests</small></div></div></>:<><h1>WORLD MAP</h1><div className="map"><span>ASHEN FRONTIER</span><b className="m1">◆ Broken Beacon</b><b className="m2">● Ember Grove</b><b className="m3">▲ Silent Shrine</b></div><button className="reset" onClick={reset}>RESET SAVE</button></>}</div>}</div>}
createRoot(document.getElementById('root')).render(<Game/>);

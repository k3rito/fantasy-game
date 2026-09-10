import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import * as THREE from 'three';
import './style.css';

const QUESTS=[
 {name:'The Broken Beacon',desc:'Reach the ruined watchtower and relight its signal.',reward:120,target:'beacon'},
 {name:'Ashbound Trail',desc:'Defeat the ember wraiths and recover their shards.',reward:180,target:'wraith'},
 {name:'The Silent Grove',desc:'Reach the ancient shrine and awaken its guardian.',reward:250,target:'shrine'}
];
const SKILLS=['Shadow Step','Iron Will','Ember Blade','Hunter Sense','Void Pulse','Warden Guard'];

function Game(){
 const mount=useRef();
 const [level,setLevel]=useState(()=>Number(localStorage.getItem('af_level')||1));
 const [xp,setXp]=useState(()=>Number(localStorage.getItem('af_xp')||0));
 const [gold,setGold]=useState(()=>Number(localStorage.getItem('af_gold')||40));
 const [quest,setQuest]=useState(()=>Number(localStorage.getItem('af_quest')||0));
 const [skills,setSkills]=useState(()=>JSON.parse(localStorage.getItem('af_skills')||'[]'));
 const [skillPts,setSkillPts]=useState(()=>Number(localStorage.getItem('af_skillpts')||2));
 const [kills,setKills]=useState(0),[hp,setHp]=useState(100),[menu,setMenu]=useState(''),[notice,setNotice]=useState('');
 const state=useRef({});
 useEffect(()=>{
  const el=mount.current,scene=new THREE.Scene(); scene.background=new THREE.Color(0x05070b);scene.fog=new THREE.Fog(0x05070b,24,85);
  const camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.1,220);camera.position.set(0,7,13);
  const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;el.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0x9bb7d8,0x24150c,2));const sun=new THREE.DirectionalLight(0xffd58a,2.6);sun.position.set(20,28,10);sun.castShadow=true;scene.add(sun);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(120,120),new THREE.MeshStandardMaterial({color:0x1d241f,roughness:1}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
  const grid=new THREE.GridHelper(120,30,0x28342d,0x1a211d);grid.position.y=.01;scene.add(grid);
  const mat=(c)=>new THREE.MeshStandardMaterial({color:c,roughness:.8});
  const addTree=(x,z,s=1)=>{const g=new THREE.Group();const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.18*s,.3*s,1.7*s,6),mat(0x493827));trunk.position.y=.85*s;const crown=new THREE.Mesh(new THREE.ConeGeometry(1.2*s,3*s,7),mat(0x26382b));crown.position.y=2.8*s;g.add(trunk,crown);g.position.set(x,0,z);scene.add(g)};
  for(let i=0;i<55;i++){const x=(Math.random()-.5)*95,z=(Math.random()-.5)*95;if(Math.hypot(x,z)>9)addTree(x,z,.65+Math.random()*.7)}
  const landmark=(x,z,color)=>{const g=new THREE.Group();const base=new THREE.Mesh(new THREE.CylinderGeometry(2,2.4,.7,8),mat(0x343a35));base.position.y=.35;const ob=new THREE.Mesh(new THREE.CylinderGeometry(.5,.8,4,6),mat(color));ob.position.y=2.6;g.add(base,ob);g.position.set(x,0,z);scene.add(g);return g};
  landmark(0,-28,0xb77b32);landmark(-25,-10,0x7c8e4e);landmark(26,25,0x7b5ac6);
  const hero=new THREE.Group();hero.position.set(0,0,8);const body=new THREE.Mesh(new THREE.CapsuleGeometry(.55,1.25,5,10),mat(0x151922));body.position.y=1.25;body.castShadow=true;hero.add(body);const cape=new THREE.Mesh(new THREE.ConeGeometry(1.05,2.5,4,1,true),new THREE.MeshStandardMaterial({color:0x090b10,side:THREE.DoubleSide}));cape.position.set(0,1.2,-.35);cape.rotation.x=Math.PI/2;hero.add(cape);scene.add(hero);
  const enemies=[];const spawnEnemy=(x,z)=>{const g=new THREE.Group();g.position.set(x,0,z);const b=new THREE.Mesh(new THREE.CapsuleGeometry(.5,.8,4,8),mat(0x6b2631));b.position.y=1;g.add(b);const eye=new THREE.Mesh(new THREE.SphereGeometry(.09,8,8),mat(0xff8a48));eye.position.set(0,1.25,.48);g.add(eye);scene.add(g);enemies.push({g,hp:2,dead:false})};
  for(let i=0;i<7;i++)spawnEnemy(-18+Math.random()*36,-4-Math.random()*24);
  const pickups=[];const addShard=(x,z)=>{const m=new THREE.Mesh(new THREE.OctahedronGeometry(.45),mat(0xd58b3c));m.position.set(x,.65,z);scene.add(m);pickups.push(m)};for(let i=0;i<3;i++)addShard(-12+i*8,-15-Math.random()*8);
  const keys={};let last=performance.now(),attackCooldown=0;state.current={hero,enemies,pickups,keys,attack:()=>{if(attackCooldown>0)return;attackCooldown=.45;let nearest=null,dist=4;for(const e of enemies){if(e.dead)continue;const d=hero.position.distanceTo(e.g.position);if(d<dist){nearest=e;dist=d}}if(nearest){nearest.hp--;if(nearest.hp<=0){nearest.dead=true;scene.remove(nearest.g);setKills(k=>k+1);setGold(g=>g+15);setXp(v=>v+35);setNotice('Wraith defeated +35 XP / +15 Gold')}}}};
  const kd=e=>{keys[e.key.toLowerCase()]=true;if(e.code==='Space')state.current.attack()};const ku=e=>keys[e.key.toLowerCase()]=false;addEventListener('keydown',kd);addEventListener('keyup',ku);
  const tick=(now)=>{const dt=Math.min(.033,(now-last)/1000);last=now;const speed=6*dt;let dx=(keys.d?1:0)-(keys.a?1:0),dz=(keys.s?1:0)-(keys.w?1:0);const l=Math.hypot(dx,dz)||1;if(dx||dz){dx/=l;dz/=l;hero.position.x+=dx*speed;hero.position.z+=dz*speed;hero.rotation.y=Math.atan2(dx,dz)}hero.position.x=THREE.MathUtils.clamp(hero.position.x,-54,54);hero.position.z=THREE.MathUtils.clamp(hero.position.z,-54,54);
   for(const e of enemies){if(e.dead)continue;const d=e.g.position.distanceTo(hero.position);if(d<11){const v=e.g.position.clone().sub(hero.position).normalize();e.g.position.addScaledVector(v,-speed*.55);if(d<1.5)setHp(h=>Math.max(0,h-dt*9))}}
   for(let i=pickups.length-1;i>=0;i--){if(pickups[i].position.distanceTo(hero.position)<1.8){scene.remove(pickups[i]);pickups.splice(i,1);setXp(v=>v+25);setNotice('Ember shard recovered +25 XP')}}
   attackCooldown=Math.max(0,attackCooldown-dt);camera.position.x+=(hero.position.x-camera.position.x)*.08;camera.position.z+=(hero.position.z+12-camera.position.z)*.08;camera.lookAt(hero.position.x,1,hero.position.z);renderer.render(scene,camera);requestAnimationFrame(tick)};requestAnimationFrame(tick);
  const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)};addEventListener('resize',resize);
  return()=>{removeEventListener('keydown',kd);removeEventListener('keyup',ku);removeEventListener('resize',resize);renderer.dispose();el.removeChild(renderer.domElement)};
 },[]);
 useEffect(()=>{let n=xp,lv=level,pts=skillPts;while(n>=100){n-=100;lv++;pts++;}if(lv!==level){setLevel(lv);setSkillPts(pts)}if(n!==xp)setXp(n);localStorage.setItem('af_level',lv);localStorage.setItem('af_xp',n);localStorage.setItem('af_gold',gold);localStorage.setItem('af_quest',quest);localStorage.setItem('af_skills',JSON.stringify(skills));localStorage.setItem('af_skillpts',pts)},[xp,level,gold,quest,skills,skillPts]);
 useEffect(()=>{if(!notice)return;const t=setTimeout(()=>setNotice(''),2200);return()=>clearTimeout(t)},[notice]);
 const q=QUESTS[quest];
 const complete=()=>{const s=state.current;if(q.target==='beacon'&&s.hero?.position.distanceTo(new THREE.Vector3(0,0,-28))>5){setNotice('Reach the Broken Beacon first');return}if(q.target==='wraith'&&kills<4){setNotice(`Defeat ${4-kills} more wraiths`);return}if(q.target==='shrine'&&s.hero?.position.distanceTo(new THREE.Vector3(26,0,25))>5){setNotice('Reach the Silent Shrine first');return}setXp(v=>v+q.reward);setGold(v=>v+60);setQuest((quest+1)%QUESTS.length);setNotice(`Quest complete +${q.reward} XP / +60 Gold`)};
 const unlock=(name)=>{if(skills.includes(name)||skillPts<1)return;setSkills([...skills,name]);setSkillPts(skillPts-1);setNotice(`${name} unlocked`)};
 return <div className="game"><div ref={mount} className="canvas"/><header><div><b>ASHEN FRONTIER</b><small>OPEN WORLD · ADVENTURE RPG</small></div><div className="topstats">LV {level} · {xp}/100 XP · {gold} G</div></header><div className="vitals"><span>HP</span><div><i style={{width:`${hp}%`}}/></div></div><aside className="quest"><span>ACTIVE QUEST</span><h2>{q.name}</h2><p>{q.desc}</p><small>Progress: {q.target==='wraith'?`${Math.min(kills,4)}/4 wraiths`:'Explore the objective zone'}</small><button onClick={complete}>TURN IN · +{q.reward} XP</button></aside><div className="controls"><span>WASD MOVE</span><span>SPACE ATTACK</span></div><nav><button onClick={()=>setMenu('skills')}>✦ Skills <i>{skillPts}</i></button><button onClick={()=>setMenu('tools')}>◈ Tools</button><button onClick={()=>setMenu('map')}>⌖ Map</button></nav>{notice&&<div className="notice">{notice}</div>}{menu&&<div className="modal"><button className="close" onClick={()=>setMenu('')}>×</button>{menu==='skills'?<><h1>SKILL TREE</h1><p>Unlock passive abilities. One point per node.</p><div className="skillgrid">{SKILLS.map((x,i)=><button key={x} className={skills.includes(x)?'unlocked':''} disabled={skills.includes(x)||skillPts<1} onClick={()=>unlock(x)}><strong>{x}</strong><small>{skills.includes(x)?'UNLOCKED':`Tier ${i+1} · Cost 1`}</small></button>)}</div></>:menu==='tools'?<><h1>FIELD TOOLS</h1><p>Utility loadout for exploration.</p><div className="toolgrid"><div><b>Grapple Hook</b><small>Traverse broken paths.</small></div><div><b>Scout Drone</b><small>Reveals objectives and threats.</small></div><div><b>Ember Torch</b><small>Activates ancient beacons.</small></div></div></>:<><h1>WORLD MAP</h1><div className="map"><span>ASHEN FRONTIER</span><b className="m1">◆ Broken Beacon</b><b className="m2">● Ember Grove</b><b className="m3">▲ Silent Shrine</b></div></>}</div>}</div>}
createRoot(document.getElementById('root')).render(<Game/>);

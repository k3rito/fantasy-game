const KEY='ashen_frontier_save_v3';
const VERSION=3;
const defaults={version:VERSION,player:{position:[0,0,10],level:1,xp:0,gold:40,hp:100,skillPoints:2,stats:{strength:5,defense:4,agility:5,focus:4,vitality:5},skills:[],inventory:[{id:'rusty_blade',qty:1},{id:'ember_potion',qty:2}],equipment:{weapon:'rusty_blade',armor:null,accessory:null}},quests:{active:'q_intro',progress:{},completed:[]},world:{discovered:['frontier'],opened:[],bosses:{}},settings:{music:true,sfx:true,quality:'auto'}};
const clone=x=>JSON.parse(JSON.stringify(x));
export function migrate(save){const next=clone(defaults);Object.assign(next,save);next.version=VERSION;next.player={...defaults.player,...save.player,stats:{...defaults.player.stats,...save.player?.stats},equipment:{...defaults.player.equipment,...save.player?.equipment}};next.quests={...defaults.quests,...save.quests,progress:{...save.quests?.progress}};next.world={...defaults.world,...save.world};return next;}
export function loadSave(){try{const raw=localStorage.getItem(KEY);return raw?migrate(JSON.parse(raw)):clone(defaults);}catch{return clone(defaults)}}
export function saveGame(state){const payload={...state,version:VERSION,savedAt:new Date().toISOString()};localStorage.setItem(KEY,JSON.stringify(payload));return payload;}
export function resetSave(){localStorage.removeItem(KEY);return clone(defaults);}
export function exportSave(state){return btoa(unescape(encodeURIComponent(JSON.stringify(saveGame(state)))))}
export function importSave(encoded){return migrate(JSON.parse(decodeURIComponent(escape(atob(encoded)))))}

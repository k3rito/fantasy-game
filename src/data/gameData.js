export const ZONES = {
  frontier:{id:'frontier',name:'Ashen Frontier',subtitle:'The scarred heartland',center:[0,0],color:'#b78a4a'},
  grove:{id:'grove',name:'Silent Grove',subtitle:'Where the old roots remember',center:[-28,-20],color:'#718b55'},
  beacon:{id:'beacon',name:'Broken Beacon',subtitle:'The watch that never returned',center:[0,-38],color:'#c1783e'},
  ruins:{id:'ruins',name:'Forgotten Ruins',subtitle:'A buried kingdom beneath the ash',center:[32,18],color:'#8273a6'},
  void:{id:'void',name:'The Void Scar',subtitle:'Beyond the last ward',center:[38,-32],color:'#754d96'},
};

export const STATS = ['strength','defense','agility','focus','vitality'];
export const STAT_LABELS = {strength:'Strength',defense:'Defense',agility:'Agility',focus:'Focus',vitality:'Vitality'};

export const ITEMS = {
  rusty_blade:{id:'rusty_blade',name:'Rustbound Blade',type:'weapon',slot:'weapon',rarity:'common',stats:{strength:2},value:18,icon:'⚔'},
  ash_saber:{id:'ash_saber',name:'Ashen Saber',type:'weapon',slot:'weapon',rarity:'rare',stats:{strength:7,agility:2},value:90,icon:'⚔'},
  warden_mail:{id:'warden_mail',name:'Warden Mail',type:'armor',slot:'armor',rarity:'rare',stats:{defense:8,vitality:3},value:110,icon:'🛡'},
  void_ring:{id:'void_ring',name:'Voidglass Ring',type:'accessory',slot:'accessory',rarity:'epic',stats:{focus:9,agility:3},value:260,icon:'◈'},
  ember_potion:{id:'ember_potion',name:'Ember Tonic',type:'consumable',slot:null,rarity:'common',heal:35,value:12,icon:'🧪'},
  moon_herb:{id:'moon_herb',name:'Moonleaf',type:'material',slot:null,rarity:'common',value:7,icon:'✦'},
  beacon_core:{id:'beacon_core',name:'Beacon Core',type:'quest',slot:null,rarity:'legendary',value:0,icon:'◆'},
  void_heart:{id:'void_heart',name:'Heart of the Scar',type:'quest',slot:null,rarity:'mythic',value:0,icon:'⬢'},
};

export const ENEMIES = {
  skeleton:{id:'skeleton',name:'Skeleton Warrior',hp:55,damage:9,defense:3,speed:2.1,aggro:13,range:1.7,xp:32,gold:[10,18],drops:[['rusty_blade',.22],['ember_potion',.18]],color:'#7d8791'},
  archer:{id:'archer',name:'Ash Archer',hp:42,damage:11,defense:2,speed:1.8,aggro:18,range:8,xp:38,gold:[12,22],drops:[['moon_herb',.25],['ember_potion',.16]],color:'#56765b'},
  beast:{id:'beast',name:'Cinder Hound',hp:68,damage:13,defense:4,speed:3.2,aggro:15,range:1.8,xp:45,gold:[15,25],drops:[['moon_herb',.3]],color:'#8b4937'},
  mage:{id:'mage',name:'Ashen Hexer',hp:75,damage:16,defense:3,speed:1.5,aggro:20,range:10,xp:65,gold:[22,35],drops:[['ember_potion',.35],['void_ring',.04]],color:'#68538c'},
  elite:{id:'elite',name:'Grave Warden',hp:190,damage:22,defense:10,speed:1.8,aggro:22,range:2.2,xp:160,gold:[60,95],drops:[['warden_mail',.35],['ash_saber',.18]],color:'#8d7443'},
};

export const SKILLS = {
  shadow1:{id:'shadow1',name:'Shadow Step I',kind:'passive',cost:1,requires:[],effect:'moveSpeed',value:.12},
  shadow2:{id:'shadow2',name:'Shadow Step II',kind:'passive',cost:1,requires:['shadow1'],effect:'moveSpeed',value:.12},
  shadow3:{id:'shadow3',name:'Shadow Step III',kind:'passive',cost:1,requires:['shadow2'],effect:'dodge',value:.08},
  phantom:{id:'phantom',name:'Phantom Dash',kind:'active',cost:2,requires:['shadow3'],effect:'dash',value:8,cooldown:6},
  iron1:{id:'iron1',name:'Iron Will I',kind:'passive',cost:1,requires:[],effect:'defense',value:4},
  iron2:{id:'iron2',name:'Iron Will II',kind:'passive',cost:1,requires:['iron1'],effect:'defense',value:5},
  warden:{id:'warden',name:'Warden Guard',kind:'passive',cost:2,requires:['iron2'],effect:'damageReduction',value:.12},
  ember1:{id:'ember1',name:'Ember Blade I',kind:'passive',cost:1,requires:[],effect:'damage',value:4},
  ember2:{id:'ember2',name:'Ember Blade II',kind:'passive',cost:1,requires:['ember1'],effect:'damage',value:6},
  void:{id:'void',name:'Void Pulse',kind:'active',cost:2,requires:['ember2'],effect:'aoe',value:28,cooldown:8},
  hunter:{id:'hunter',name:'Hunter Sense',kind:'passive',cost:1,requires:[],effect:'attackRange',value:1.2},
};

export const QUESTS = [
 {id:'q_intro',title:'Ashes on the Wind',description:'Speak with Elder Maelin at the frontier camp.',giver:'elder',type:'talk',objectives:[{id:'talk',kind:'talk',target:'elder',required:1}],rewards:{xp:50,gold:25,items:[]},requiredLevel:1,status:'available'},
 {id:'q_beacon',title:'The Broken Beacon',description:'Restore the old watch beacon and recover its core.',giver:'warden',type:'explore',objectives:[{id:'reach',kind:'explore',target:'beacon',required:1},{id:'core',kind:'collect',target:'beacon_core',required:1}],rewards:{xp:140,gold:80,items:['ember_potion']},requiredLevel:1,prerequisites:['q_intro'],status:'locked'},
 {id:'q_trail',title:'Ashbound Trail',description:'Hunt the creatures gathering around the old roads.',giver:'scout',type:'kill',objectives:[{id:'kills',kind:'kill',target:'skeleton',required:5},{id:'beasts',kind:'kill',target:'beast',required:2}],rewards:{xp:210,gold:120,items:['ash_saber']},requiredLevel:2,prerequisites:['q_beacon'],status:'locked'},
 {id:'q_grove',title:'The Silent Grove',description:'Meet the Grove Guardian and cleanse the shrine.',giver:'guardian',type:'talk',objectives:[{id:'shrine',kind:'explore',target:'grove_shrine',required:1},{id:'guardian',kind:'boss',target:'grove_guardian',required:1}],rewards:{xp:320,gold:180,items:['warden_mail']},requiredLevel:3,prerequisites:['q_trail'],status:'locked'},
 {id:'q_ruins',title:'Whispers Below Stone',description:'Search the Forgotten Ruins and defeat the Grave Warden.',giver:'wanderer',type:'boss',objectives:[{id:'ruins',kind:'explore',target:'ruins',required:1},{id:'warden',kind:'boss',target:'grave_warden',required:1}],rewards:{xp:500,gold:300,items:['void_ring']},requiredLevel:5,prerequisites:['q_grove'],status:'locked'},
 {id:'q_end',title:'Heart of the Scar',description:'Enter the Void Scar and end the corruption at its source.',giver:'wanderer',type:'boss',objectives:[{id:'scar',kind:'explore',target:'void',required:1},{id:'heart',kind:'collect',target:'void_heart',required:1},{id:'boss',kind:'boss',target:'void_guardian',required:1}],rewards:{xp:1000,gold:1000,items:['void_heart']},requiredLevel:8,prerequisites:['q_ruins'],status:'locked'},
];

export const NPCS = [
 {id:'elder',name:'Elder Maelin',role:'Elder',zone:'frontier',asset:'priest',position:[-5,0,4],portrait:'✧',lines:[['elder','The ash is moving again. Something beneath the frontier has awakened.'],['player','What happened here?'],['elder','The old wards failed one by one. Find the Broken Beacon. It may still remember how to burn.']]},
 {id:'warden',name:'Captain Rhea',role:'Warden',zone:'beacon',asset:'guard',position:[2,0,-34],portrait:'⚔',lines:[['warden','The beacon is dark, but its core may still be intact.'],['player','I will restore it.'],['warden','Then take this road. Do not follow the voices beneath the stones.']]},
 {id:'scout',name:'Kael the Scout',role:'Scout',zone:'frontier',asset:'ranger',position:[8,0,5],portrait:'⌁',lines:[['scout','The roads are crawling with dead things and ash hounds.'],['player','Where do they come from?'],['scout','The grove. The ruins. And somewhere beyond both, a wound in the world.']]},
 {id:'guardian',name:'Aelwen, Grove Guardian',role:'Guardian',zone:'grove',asset:'mage',position:[-27,0,-18],portrait:'◈',lines:[['guardian','The Grove is silent because it is listening.'],['player','Listening to what?'],['guardian','The thing that dreams beneath the roots. Prove you can stand against it.']]},
 {id:'merchant',name:'Mira Ironleaf',role:'Merchant',zone:'frontier',asset:'trader',position:[-2,0,8],portrait:'◆',lines:[['merchant','Steel, tonics, and a fair price. That is all I promise.'],['player','Show me your wares.'],['merchant','Keep your gold ready. The frontier eats careless adventurers.']]},
 {id:'wanderer',name:'The Mysterious Wanderer',role:'Wanderer',zone:'ruins',asset:'mage',position:[30,0,15],portrait:'?',lines:[['wanderer','I have walked beyond the last ward. The Void is not empty.'],['player','What is waiting there?'],['wanderer','A guardian that remembers every soul it has consumed.']]},
];

export const ASSETS = {
 skeleton:'https://cdn.3dassets.dev/assets/32794/v1/model.glb',
 priest:'https://cdn.3dassets.dev/assets/32789/v1/model.glb',
 trader:'https://cdn.3dassets.dev/assets/32792/v1/model.glb',
 mage:'https://cdn.3dassets.dev/assets/32787/v1/model.glb',
 ranger:'https://cdn.3dassets.dev/assets/32788/v1/model.glb',
 guard:'https://cdn.3dassets.dev/assets/32782/v1/model.glb',
};

export const RARITY = {common:'#aeb6c2',uncommon:'#72b58b',rare:'#5b9de6',epic:'#9b6ce0',legendary:'#d59a3e',mythic:'#e05b88'};

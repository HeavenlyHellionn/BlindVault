import { useState, useEffect, useRef, useMemo } from "react";

const FONT_URL = "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap";

const KF = `
@keyframes bvFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes bvFadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes bvScale{0%{transform:scale(0.8);opacity:0}60%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}
@keyframes bvGlow{0%,100%{box-shadow:0 0 6px rgba(192,64,255,0.3)}50%{box-shadow:0 0 24px rgba(192,64,255,0.9)}}
@keyframes bvGlowGold{0%,100%{box-shadow:0 0 6px rgba(243,198,86,0.3)}50%{box-shadow:0 0 22px rgba(243,198,86,0.8)}}
@keyframes bvGlowRed{0%,100%{box-shadow:0 0 6px rgba(255,77,120,0.3)}50%{box-shadow:0 0 22px rgba(255,77,120,0.8)}}
@keyframes bvBlink{0%,49%,100%{opacity:1}50%,99%{opacity:0}}
@keyframes bvFloat{0%,100%{transform:translateY(0px)}50%{transform:translateY(-8px)}}
@keyframes bvFloat2{0%,100%{transform:translateY(0px)}50%{transform:translateY(-5px)}}
@keyframes bvWander{0%{transform:translateX(0px) scaleX(1)}49%{transform:translateX(60px) scaleX(1)}50%{transform:translateX(60px) scaleX(-1)}100%{transform:translateX(0px) scaleX(-1)}}
@keyframes bvWander2{0%{transform:translateX(0px) scaleX(-1)}49%{transform:translateX(-50px) scaleX(-1)}50%{transform:translateX(-50px) scaleX(1)}100%{transform:translateX(0px) scaleX(1)}}
@keyframes bvWander3{0%{transform:translateX(0px) translateY(0px)}25%{transform:translateX(30px) translateY(-10px)}50%{transform:translateX(60px) translateY(0px)}75%{transform:translateX(30px) translateY(10px)}100%{transform:translateX(0px) translateY(0px)}}
@keyframes bvBob{0%,100%{transform:translateY(0px) rotate(0deg)}33%{transform:translateY(-6px) rotate(-3deg)}66%{transform:translateY(-3px) rotate(3deg)}}
@keyframes bvSway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
@keyframes bvPulse{0%,100%{opacity:1}50%{opacity:0.45}}
@keyframes bvShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes confetti{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
@keyframes ringOut{0%{transform:translate(-50%,-50%) scale(0.3);opacity:1}100%{transform:translate(-50%,-50%) scale(3);opacity:0}}
@keyframes deathSink{0%{opacity:1;transform:scale(1) rotate(0deg)}100%{opacity:0;transform:scale(0.6) rotate(-15deg) translateY(40px)}}
@keyframes wipeIn{0%{clip-path:inset(0 100% 0 0)}100%{clip-path:inset(0 0% 0 0)}}
@keyframes wipeOut{0%{clip-path:inset(0 0 0 0);opacity:1}100%{clip-path:inset(0 0 0 100%);opacity:0}}
@keyframes pixelDrop{0%{opacity:0;transform:scaleY(0)}100%{opacity:1;transform:scaleY(1)}}
@keyframes scanMove{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
@keyframes borderMarch{0%{background-position:0 0,100% 0,100% 100%,0 100%}100%{background-position:200px 0,100% 200px,-200px 100%,0 -200px}}
@keyframes titleGlitch{0%,95%,100%{transform:translateX(0);text-shadow:0 0 20px rgba(192,64,255,0.8)}96%{transform:translateX(-3px);text-shadow:-3px 0 rgba(255,77,120,0.8),3px 0 rgba(0,232,122,0.8)}98%{transform:translateX(2px);text-shadow:2px 0 rgba(255,77,120,0.8),-2px 0 rgba(0,232,122,0.8)}}
@keyframes hpFlash{0%,100%{filter:brightness(1)}50%{filter:brightness(2.5) saturate(2)}}
@keyframes slideInLeft{from{transform:translateX(-30px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes slideInRight{from{transform:translateX(30px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes popIn{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
@keyframes logSlide{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
`;

const BG="#04060f", CARD="rgba(6,2,18,0.97)", BD="rgba(160,80,255,0.25)";
const G="#c040ff", TX="#d4f0e8", TM="#698171";
const RED="#ff4d78", GRN="#00e87a", GOLD="#f3c656", BLUE="#79c8ff";
const P="'Press Start 2P',monospace", V="'VT323',monospace";

const CLASSES=[
  {id:"warrior",name:"Warrior",icon:"⚔️",hp:30,stats:{STR:16,DEX:10,CON:15,INT:8,WIS:10,CHA:8},gear:["Longsword","Iron Shield","Chain Mail","Potion"],desc:"Heavy armor. Melee dominance. High survivability."},
  {id:"rogue",name:"Rogue",icon:"🗡️",hp:20,stats:{STR:10,DEX:17,CON:10,INT:13,WIS:10,CHA:12},gear:["Twin Daggers","Lockpicks","Leather Armor","Smoke Bomb"],desc:"Burst damage. Evasion. Crowd control."},
  {id:"mage",name:"Mage",icon:"🔮",hp:15,stats:{STR:6,DEX:10,CON:8,INT:18,WIS:14,CHA:12},gear:["Staff of Focus","Spellbook","Mage Robes","Arcane Focus"],desc:"High damage spells. Utility. Low health."},
  {id:"ranger",name:"Ranger",icon:"🏹",hp:22,stats:{STR:12,DEX:16,CON:12,INT:11,WIS:14,CHA:9},gear:["Longbow","Quiver x20","Studded Leather","Hunting Knife"],desc:"Ranged precision. Tracking. Survival."},
  {id:"paladin",name:"Paladin",icon:"🛡️",hp:28,stats:{STR:15,DEX:8,CON:14,INT:10,WIS:13,CHA:15},gear:["Holy Warhammer","Plate Armor","Holy Symbol","Salve"],desc:"Holy warrior. Self-healing. Protective auras."},
  {id:"druid",name:"Druid",icon:"🌿",hp:20,stats:{STR:10,DEX:12,CON:12,INT:12,WIS:17,CHA:10},gear:["Druidic Staff","Wooden Shield","Hide Armor","Herb Kit"],desc:"Nature magic. Shapeshifting. Healing."},
];
const RACES=[
  {id:"human",name:"Human",icon:"👤",bonuses:{STR:1,DEX:1,CON:1,INT:1,WIS:1,CHA:1},trait:"Adaptable",traitDesc:"Once per run, reroll any die."},
  {id:"elf",name:"High Elf",icon:"🌟",bonuses:{STR:0,DEX:2,CON:0,INT:1,WIS:1,CHA:0},trait:"Keen Senses",traitDesc:"Cannot be surprised. +2 Perception."},
  {id:"dwarf",name:"Dwarf",icon:"⛏️",bonuses:{STR:1,DEX:0,CON:2,INT:0,WIS:1,CHA:0},trait:"Stone's Endurance",traitDesc:"-1 all physical damage. Poison immune."},
  {id:"halforc",name:"Half-Orc",icon:"💪",bonuses:{STR:3,DEX:0,CON:1,INT:0,WIS:0,CHA:0},trait:"Relentless",traitDesc:"Survive at 1 HP once per run instead of dying."},
  {id:"halfling",name:"Halfling",icon:"🍀",bonuses:{STR:0,DEX:2,CON:0,INT:0,WIS:1,CHA:1},trait:"Lucky",traitDesc:"Reroll any natural 1. Must keep result."},
  {id:"tiefling",name:"Tiefling",icon:"🔥",bonuses:{STR:0,DEX:0,CON:0,INT:2,WIS:0,CHA:2},trait:"Infernal Legacy",traitDesc:"Hellfire once per run (d8+INT). Fire resistant."},
];
const TIME_OPTIONS=[
  {id:"quick",label:"Quick Run",sub:"~15 MIN",icon:"⚡",rooms:3,miniBoss:false,desc:"3 rooms straight to the final boss."},
  {id:"standard",label:"Standard",sub:"~35 MIN",icon:"⚔️",rooms:5,miniBoss:true,desc:"5 rooms with a mini-boss before the finale."},
  {id:"deep",label:"Deep Dive",sub:"~70 MIN",icon:"🌑",rooms:8,miniBoss:true,desc:"8 rooms, 2 mini-bosses, and an epic conclusion."},
];
const STATUS_META={
  poison:{label:"POISON",color:"#94d94d"},burn:{label:"BURN",color:"#ff8d3b"},
  shielded:{label:"SHIELD",color:BLUE},marked:{label:"MARKED",color:GOLD},
  exposed:{label:"EXPOSED",color:"#c57bff"},weakened:{label:"WEAK",color:"#b7b7b7"},
  regen:{label:"REGEN",color:"#38d96f"},guard_up:{label:"GUARD+",color:BLUE},
  damage_up:{label:"DMG+",color:"#ffbe61"},damage_reduction:{label:"WARD",color:BLUE},
  evade_next:{label:"EVADE",color:"#c57bff"},
};
const CLASS_GUARD={warrior:2,rogue:3,mage:1,ranger:2,paladin:2,druid:2};
const CLASS_PSTAT={warrior:"STR",rogue:"DEX",mage:"INT",ranger:"DEX",paladin:"STR",druid:"WIS"};
const CLASS_SKILLS={
  warrior:[
    {id:"power_strike",name:"Power Strike",kind:"attack",accuracyStat:"STR",accuracyBonus:-2,basePower:7,damageDie:6,cooldown:2,desc:"Heavy blow. Lower accuracy."},
    {id:"shield_wall",name:"Shield Wall",kind:"buff",cooldown:3,applySelf:[{id:"shielded",value:6,duration:2},{id:"guard_up",value:2,duration:1}],desc:"Raise shield. Absorb hits."},
    {id:"battle_cry",name:"Battle Cry",kind:"buff",cooldown:3,applySelf:[{id:"damage_up",value:2,duration:2}],desc:"Boost all damage for 2 turns."},
  ],
  rogue:[
    {id:"sneak_attack",name:"Sneak Attack",kind:"attack",accuracyStat:"DEX",basePower:5,damageDie:6,cooldown:2,bonusVsExposed:4,desc:"Double damage on exposed targets."},
    {id:"shadow_step",name:"Shadow Step",kind:"buff",cooldown:3,applySelf:[{id:"evade_next",value:1,duration:1}],desc:"Guarantee dodge on next hit."},
    {id:"poison_blade",name:"Poison Blade",kind:"attack",accuracyStat:"DEX",basePower:4,damageDie:4,cooldown:2,applyEnemyOnHit:[{id:"poison",value:2,duration:3}],desc:"Strike and coat blade in venom."},
  ],
  mage:[
    {id:"fireball",name:"Fireball",kind:"attack",accuracyStat:"INT",basePower:6,damageDie:6,cooldown:2,applyEnemyOnHit:[{id:"burn",value:3,duration:2,chance:0.5}],desc:"Arcane blast. 50% burn chance."},
    {id:"arcane_shield",name:"Arcane Shield",kind:"shield",cooldown:3,shieldBase:5,scalingStat:"INT",desc:"Conjure a magical barrier."},
    {id:"frost_bind",name:"Frost Bind",kind:"attack",accuracyStat:"INT",basePower:4,damageDie:4,cooldown:2,applyEnemyOnHit:[{id:"weakened",value:2,duration:2}],desc:"Damage and weaken the target."},
  ],
  ranger:[
    {id:"hunters_mark",name:"Hunter's Mark",kind:"debuff",cooldown:2,applyEnemy:[{id:"marked",value:3,duration:3}],desc:"Mark target for bonus damage."},
    {id:"rapid_shot",name:"Rapid Shot",kind:"multi_attack",accuracyStat:"DEX",hits:2,basePower:2,damageDie:4,cooldown:2,desc:"Fire two quick arrows."},
    {id:"natures_step",name:"Nature's Step",kind:"utility",cooldown:3,clearNegative:1,applySelf:[{id:"guard_up",value:2,duration:1}],desc:"Cleanse a debuff. Gain guard."},
  ],
  paladin:[
    {id:"divine_smite",name:"Divine Smite",kind:"attack",accuracyStat:"STR",basePower:6,damageDie:6,cooldown:2,bonusVsTags:["undead","cursed"],bonusDamage:4,desc:"+4 damage vs cursed and undead."},
    {id:"lay_on_hands",name:"Lay on Hands",kind:"heal",cooldown:4,usesPerCombat:1,healBase:6,healDie:6,scalingStat:"WIS",desc:"Major healing. Once per combat."},
    {id:"holy_aura",name:"Holy Aura",kind:"buff",cooldown:3,applySelf:[{id:"damage_reduction",value:2,duration:2}],desc:"Reduce all incoming damage."},
  ],
  druid:[
    {id:"entangle",name:"Entangle",kind:"debuff",cooldown:2,applyEnemy:[{id:"weakened",value:2,duration:2},{id:"exposed",value:-2,duration:1,chance:0.4}],desc:"Weaken. Chance to expose."},
    {id:"healing_bloom",name:"Healing Bloom",kind:"hot",cooldown:3,applySelf:[{id:"regen",value:3,duration:3}],desc:"Regenerate HP over 3 turns."},
    {id:"wild_shape",name:"Wild Shape",kind:"buff",cooldown:4,applySelf:[{id:"damage_up",value:2,duration:2},{id:"exposed",value:-1,duration:2}],desc:"Increase damage. Lose defense."},
  ],
};
const DUNGEON_NAMES=["THE HOLLOW VAULT","THE ASHEN CRYPT","THE SHIVERING DEEP","THE BONEWORK ARCHIVE","THE THORNED SEPULCHER","THE IRON MAW"];
const QUIRKS=[
  {id:"creeping_dark",name:"CREEPING DARK",text:"All damage from either side is increased by 1."},
  {id:"thin_veil",name:"THIN VEIL",text:"Magic attacks gain +1 power."},
  {id:"blood_echo",name:"BLOOD ECHO",text:"Poison and burn tick for +1."},
  {id:"fractured_guard",name:"FRACTURED GUARD",text:"Guard buffs gain +1 value."},
];
const ENEMY_POOL=[
  {id:"bone_warden",name:"Bone Warden",icon:"💀",sprite:"skull",tags:["undead"],role:"tank",baseHp:24,baseGuard:14,moves:[
    {id:"shield_bash",label:"Shield Bash",intent:"Striking hard",kind:"attack",basePower:4,damageDie:4,accuracyBonus:2},
    {id:"bone_fortress",label:"Bone Fortress",intent:"Raising shield",kind:"buff",cooldown:3,applySelf:[{id:"guard_up",value:2,duration:2}]},
    {id:"crushing_blow",label:"Crushing Blow",intent:"Charging up",kind:"attack",basePower:7,damageDie:6,cooldown:2},
  ]},
  {id:"vault_shade",name:"Vault Shade",icon:"👁️",sprite:"ghost",tags:["shadow","cursed"],role:"caster",baseHp:18,baseGuard:12,moves:[
    {id:"shadow_lash",label:"Shadow Lash",intent:"Whipping shadows",kind:"attack",basePower:4,damageDie:4,accuracyBonus:2},
    {id:"fear_pulse",label:"Fear Pulse",intent:"Casting dread hex",kind:"debuff",cooldown:2,applyEnemy:[{id:"weakened",value:2,duration:2}]},
    {id:"soul_drain",label:"Soul Drain",intent:"Draining your life",kind:"drain",cooldown:3,basePower:5,damageDie:6,accuracyBonus:1,healPercent:0.5},
  ]},
  {id:"rotfang",name:"Rotfang Stalker",icon:"🐉",sprite:"dragon",tags:["beast"],role:"skirmisher",baseHp:20,baseGuard:13,moves:[
    {id:"rake",label:"Rake",intent:"Slashing wildly",kind:"attack",basePower:4,damageDie:4,accuracyBonus:3},
    {id:"venom_bite",label:"Venom Bite",intent:"Lunging with fangs",kind:"attack",cooldown:2,basePower:5,damageDie:4,accuracyBonus:1,applyEnemyOnHit:[{id:"poison",value:2,duration:3}]},
    {id:"pounce",label:"Pounce",intent:"Leaping at you",kind:"attack",cooldown:2,basePower:6,damageDie:6},
  ]},
  {id:"ember_cultist",name:"Ember Cultist",icon:"🕯️",sprite:"flame",tags:["cursed"],role:"caster",baseHp:17,baseGuard:12,moves:[
    {id:"ember_bolt",label:"Ember Bolt",intent:"Hurling fire",kind:"attack",basePower:4,damageDie:4,accuracyBonus:2,applyEnemyOnHit:[{id:"burn",value:2,duration:2,chance:0.5}]},
    {id:"singe_hex",label:"Singe Hex",intent:"Whispering curses",kind:"debuff",cooldown:2,applyEnemy:[{id:"weakened",value:2,duration:2}]},
    {id:"cinder_skin",label:"Cinder Skin",intent:"Hardening with fire",kind:"buff",cooldown:3,applySelf:[{id:"damage_reduction",value:2,duration:2}]},
  ]},
];
const BOSS_POOL=[
  {id:"hollow_warden",name:"The Hollow Warden",icon:"👑",sprite:"crown",tags:["undead","cursed"],role:"boss",baseHp:58,baseGuard:15,weaknessText:"Holy or anti-cursed effects break its fortress form.",phaseThreshold:0.5,moves:[
    {id:"warden_strike",label:"Warden Strike",intent:"Striking with full force",kind:"attack",basePower:6,damageDie:6,accuracyBonus:3},
    {id:"shadow_bind",label:"Shadow Bind",intent:"Binding your limbs",kind:"debuff",cooldown:3,applyEnemy:[{id:"weakened",value:2,duration:2}]},
    {id:"fortress_form",label:"Fortress Form",intent:"Fortifying its shell",kind:"phase_buff",cooldown:99,applySelf:[{id:"guard_up",value:3,duration:99}]},
  ]},
  {id:"heart_of_ashes",name:"Heart of Ashes",icon:"🔥",sprite:"flame",tags:["cursed"],role:"boss",baseHp:54,baseGuard:14,weaknessText:"Frost and cold attacks collapse its flame pulse.",phaseThreshold:0.5,moves:[
    {id:"ash_claw",label:"Ash Claw",intent:"Raking with fire",kind:"attack",basePower:6,damageDie:6,accuracyBonus:2,applyEnemyOnHit:[{id:"burn",value:2,duration:2,chance:0.5}]},
    {id:"ember_maw",label:"Ember Maw",intent:"Charging a fireburst",kind:"attack",cooldown:2,basePower:8,damageDie:6},
    {id:"furnace_pulse",label:"Furnace Pulse",intent:"Pulsing heat outward",kind:"phase_buff",cooldown:99,applySelf:[{id:"damage_up",value:2,duration:99}]},
  ]},
];
const STORY_EVENTS=[
  {id:"ambush",title:"Ambush!",icon:"⚡",desc:"Something lunges from the dark. No time to think.",choices:[
    {id:"fight",label:"Stand your ground",icon:"⚔️",type:"combat",effect:"normal",desc:"Face it head-on. Full HP, no advantage."},
    {id:"dodge",label:"Roll aside",icon:"💨",type:"combat",effect:"hero_guard",desc:"You dodge the first blow. Enemy misses round 1."},
    {id:"call_out",label:"Shout a challenge",icon:"📣",type:"combat",effect:"enemy_weakened",desc:"Your war cry rattles it. Enemy starts weakened."},
  ]},
  {id:"trap_room",title:"Trapped Chamber",icon:"🕸️",desc:"The door clicks behind you. Pressure plates cover the floor.",choices:[
    {id:"disarm",label:"Carefully disarm",icon:"🔧",type:"skill_check",effect:"safe",desc:"Success: proceed safely. Fail: take 4 damage."},
    {id:"rush",label:"Rush straight through",icon:"🏃",type:"damage",effect:"4",desc:"Take 4 damage but skip the room instantly."},
    {id:"search",label:"Search for a bypass",icon:"🔍",type:"heal",effect:"3",desc:"Hidden path. Rest spot. Heal 3 HP."},
    {id:"wait",label:"Study the pattern",icon:"👁️",type:"combat",effect:"enemy_exposed",desc:"Spot the guardian's weakness. It starts exposed."},
  ]},
  {id:"merchant",title:"Wandering Merchant",icon:"🧙",desc:"A hooded figure crouches by a makeshift stall in the dark.",choices:[
    {id:"buy_potion",label:"Buy a potion",icon:"🧪",type:"gain",effect:"potion",desc:"They're fleeing anyway. Gain 1 potion."},
    {id:"trade_info",label:"Ask for dungeon lore",icon:"📜",type:"info",effect:"reveal",desc:"They hint at the boss's weakness."},
    {id:"rob",label:"Take what you need",icon:"💀",type:"combat",effect:"ambush",desc:"They weren't a merchant. Now you fight."},
  ]},
  {id:"shrine",title:"Ancient Shrine",icon:"⛩️",desc:"A crumbling altar pulses with faint energy. Offerings long since taken.",choices:[
    {id:"pray",label:"Offer blood",icon:"🩸",type:"damage_heal",effect:"4_8",desc:"Lose 4 HP, gain 8 HP. Net +4."},
    {id:"desecrate",label:"Smash the idol",icon:"🔨",type:"combat",effect:"enemy_rage",desc:"A guardian manifests. It's enraged."},
    {id:"meditate",label:"Meditate at the shrine",icon:"🧘",type:"buff",effect:"regen",desc:"Gain regen for 3 turns in next combat."},
    {id:"leave",label:"Leave it alone",icon:"🚪",type:"skip",effect:"none",desc:"Move forward. Nothing happens."},
  ]},
  {id:"survivor",title:"Wounded Survivor",icon:"🤕",desc:"A dying adventurer slumped against the wall. Breathing, barely.",choices:[
    {id:"help",label:"Use your potion on them",icon:"🧪",type:"sacrifice",effect:"potion_for_buff",desc:"Spend 1 potion. Gain: +2 to next attack."},
    {id:"take",label:"Search their body",icon:"🎒",type:"gain",effect:"potion",desc:"They're gone. You find a health potion."},
    {id:"ignore",label:"Keep moving",icon:"👣",type:"skip",effect:"none",desc:"No time for sentiment."},
  ]},
  {id:"fork",title:"Split Passage",icon:"🔀",desc:"The corridor divides. Left smells of rot. Right glows faintly.",choices:[
    {id:"left",label:"Go left",icon:"⬅️",type:"combat",effect:"enemy_buff",desc:"A stronger enemy waits. Well-rested."},
    {id:"right",label:"Go right",icon:"➡️",type:"heal",effect:"5",desc:"A shrine room. Heal 5 HP."},
    {id:"both",label:"Scout both",icon:"🔍",type:"info",effect:"reveal",desc:"Map the area. See the boss room."},
  ]},
  {id:"horror",title:"The Whispering Dark",icon:"🌑",desc:"Something in the walls speaks your name. It knows your fears.",choices:[
    {id:"resist",label:"Block it out",icon:"🧠",type:"buff",effect:"resist",desc:"Mental fortitude. Gain +1 guard."},
    {id:"listen",label:"Listen to the whispers",icon:"👂",type:"info",effect:"reveal",desc:"Disturbing but useful. Learn what's ahead."},
    {id:"run",label:"Sprint through",icon:"🏃",type:"damage",effect:"2",desc:"Psychological shock. Lose 2 HP."},
  ]},
];

const FLOATING_SPRITES=[
  {emoji:"💀",anim:"bvWander",dur:"8s",delay:"0s",top:"15%",left:"5%",size:28},
  {emoji:"👁️",anim:"bvFloat",dur:"4s",delay:"0.5s",top:"70%",left:"8%",size:24},
  {emoji:"🐉",anim:"bvWander2",dur:"10s",delay:"1s",top:"45%",left:"88%",size:26},
  {emoji:"🕯️",anim:"bvSway",dur:"2s",delay:"0.2s",top:"20%",left:"92%",size:22},
  {emoji:"💀",anim:"bvBob",dur:"3s",delay:"1.5s",top:"80%",left:"85%",size:20},
  {emoji:"👁️",anim:"bvFloat2",dur:"5s",delay:"0.8s",top:"35%",left:"3%",size:18},
  {emoji:"🕷️",anim:"bvWander3",dur:"12s",delay:"2s",top:"60%",left:"90%",size:20},
  {emoji:"🦴",anim:"bvSway",dur:"2.5s",delay:"0.3s",top:"88%",left:"15%",size:18},
];

function rd(s){return Math.floor(Math.random()*s)+1;}
function rollMany(c,s){let t=0;for(let i=0;i<c;i++)t+=rd(s);return t;}
function r4d6(){const r=[rd(6),rd(6),rd(6),rd(6)];return r.reduce((a,b)=>a+b,0)-Math.min(...r);}
function sm(s){return Math.floor((s-10)/2);}
function jc(v){return JSON.parse(JSON.stringify(v));}
function addBonuses(base,race){const n={...base};Object.entries(race.bonuses||{}).forEach(([k,v])=>{n[k]=(n[k]||0)+v;});return n;}
function getStat(e,id){return e.statuses.find(s=>s.id===id);}
function hasStat(e,id){return Boolean(getStat(e,id));}
function addStat(e,st){const f=e.statuses.find(s=>s.id===st.id);if(f){f.value=st.value;f.duration=Math.max(f.duration,st.duration);}else{e.statuses.push({...st});}}
function remStat(e,id){e.statuses=e.statuses.filter(s=>s.id!==id);}
function currGuard(e){let t=e.baseGuard;e.statuses.forEach(s=>{if(s.id==="guard_up")t+=s.value;if(s.id==="exposed")t+=s.value;});return Math.max(6,t);}
function dmgBon(e){return e.statuses.filter(s=>s.id==="damage_up").reduce((a,s)=>a+s.value,0);}
function dmgRed(e){return e.statuses.filter(s=>s.id==="damage_reduction").reduce((a,s)=>a+s.value,0);}
function checkHit(raw,bonus,guard,crit){if(crit===undefined)crit=20;if(raw===1)return{hit:false,crit:false};if(raw>=crit)return{hit:true,crit:true};return{hit:raw+bonus>=guard,crit:false};}
function qDmg(bp,kind){if(!bp)return 0;if(bp.quirk.id==="creeping_dark")return 1;if(bp.quirk.id==="thin_veil"&&kind==="magic")return 1;return 0;}
function dotBon(bp){return bp&&bp.quirk.id==="blood_echo"?1:0;}
function bufBon(bp){return bp&&bp.quirk.id==="fractured_guard"?1:0;}
function calcDmg(actor,stat,base,die,crit,flat,bp,kind){
  const roll=crit?rollMany(2,die):rd(die);
  return Math.max(1,base+roll+sm(actor.stats[stat]||10)+flat+dmgBon(actor)+qDmg(bp,kind));
}
function applyDmg(target,amt,ignoreRed){
  let rem=amt,sd=0;
  const sh=getStat(target,"shielded");
  if(sh){sd=Math.min(rem,sh.value);sh.value-=sd;rem-=sd;if(sh.value<=0)remStat(target,"shielded");}
  const red=ignoreRed?0:dmgRed(target);
  const hd=Math.max(0,rem-red);
  target.hp=Math.max(0,target.hp-hd);
  return{sd,hd};
}
function applyHeal(target,amt){const b=target.hp;target.hp=Math.min(target.maxHp,target.hp+amt);return target.hp-b;}
function decCD(e){Object.keys(e.cooldowns||{}).forEach(k=>{e.cooldowns[k]=Math.max(0,(e.cooldowns[k]||0)-1);});}
function clearNeg(e,n){const neg=["poison","burn","weakened","exposed"];let rm=0;e.statuses=e.statuses.filter(s=>{if(rm>=n)return true;if(neg.includes(s.id)){rm++;return false;}return true;});return rm;}
function tickStats(e,log,label,bp){
  const ex=dotBon(bp);
  e.statuses.forEach(s=>{
    if(s.id==="poison"){const d=applyDmg(e,s.value+ex,true).hd;if(d>0)log.push({t:"dmg",m:`${label} suffers ${d} poison.`});}
    if(s.id==="burn"){const d=applyDmg(e,s.value+ex,true).hd;if(d>0)log.push({t:"dmg",m:`${label} burns for ${d}.`});}
    if(s.id==="regen"){const h=applyHeal(e,s.value);if(h>0)log.push({t:"heal",m:`${label} regens ${h} HP.`});}
  });
  e.statuses=e.statuses.map(s=>({...s,duration:s.duration===999?999:s.duration-1})).filter(s=>s.duration>0||s.id==="shielded");
}
function pickEnemyMove(enemy,round,hero){
  const ok=enemy.moves.filter(m=>(enemy.cooldowns[m.id]||0)===0);
  if(!ok.length)return enemy.moves[0];
  if(enemy.role==="tank"){const b=ok.find(m=>m.kind==="buff"&&!hasStat(enemy,"guard_up"));if(b)return b;}
  if(enemy.role==="caster"){const pat=["debuff","attack","drain"];const w=pat[(round-1)%pat.length];const f=ok.find(m=>m.kind===w);if(f)return f;}
  if(enemy.role==="skirmisher"){const v=ok.find(m=>m.id==="venom_bite"&&!hasStat(hero,"poison"));if(v)return v;}
  if(enemy.role==="boss"&&enemy.phase===1&&enemy.hp<=enemy.maxHp*enemy.phaseThreshold){const p=ok.find(m=>m.kind==="phase_buff");if(p)return p;}
  return ok[Math.floor(Math.random()*ok.length)];
}
function buildHero(name,cls,race,rolled){
  const stats=addBonuses(rolled,race);
  const maxHp=cls.hp+Math.max(1,sm(stats.CON));
  return{
    name:(name||"HERO").toUpperCase(),cls,race,stats,
    hp:maxHp,maxHp,
    baseGuard:10+CLASS_GUARD[cls.id]+Math.max(0,sm(stats.DEX)),
    cooldowns:Object.fromEntries((CLASS_SKILLS[cls.id]||[]).map(sk=>[sk.id,0])),
    uses:{},resources:{potions:1},statuses:[],
    passives:{hardened:false,holyResolve:false,wildPulse:false,arcaneCount:0,relentless:false},
    pendingBuffs:[],
  };
}
function buildEnemy(template,roomIndex,roomType){
  const bonus=roomType==="boss"?roomIndex*4:roomType==="elite"?roomIndex*3:roomIndex*2;
  return{
    ...jc(template),
    hp:template.baseHp+bonus,maxHp:template.baseHp+bonus,
    baseGuard:template.baseGuard+(roomType==="boss"?1:0),
    statuses:[],cooldowns:{},
    intent:{moveId:null,label:"Watching..."},
    phase:1,
  };
}
function setIntent(enemy,round,hero){
  const m=pickEnemyMove(enemy,round,hero);
  enemy.intent={moveId:m.id,label:m.intent};
}
function genRooms(timeOpt){
  const total=timeOpt.rooms;
  const miniBoss=timeOpt.miniBoss?Math.floor(total/2):null;
  const rooms=[];
  const shuffleEvents=[...STORY_EVENTS].sort(()=>Math.random()-0.5);
  let evIdx=0;
  for(let i=1;i<=total;i++){
    if(i===total){
      rooms.push({index:i,type:"boss",enemyTemplate:jc(BOSS_POOL[Math.floor(Math.random()*BOSS_POOL.length)]),event:null});
    } else if(miniBoss&&i===miniBoss){
      const tpl=jc(ENEMY_POOL[Math.floor(Math.random()*ENEMY_POOL.length)]);
      tpl.baseHp+=10;tpl.baseGuard+=1;tpl.name="Elite "+tpl.name;
      rooms.push({index:i,type:"elite",enemyTemplate:tpl,event:null});
    } else {
      const ev=shuffleEvents[evIdx%shuffleEvents.length];evIdx++;
      rooms.push({index:i,type:"normal",enemyTemplate:jc(ENEMY_POOL[Math.floor(Math.random()*ENEMY_POOL.length)]),event:ev});
    }
  }
  return rooms;
}

function Pill({status}){
  const m=STATUS_META[status.id]||{label:status.id.toUpperCase(),color:"#aaa"};
  return(
    <span style={{border:`1px solid ${m.color}`,color:m.color,padding:"2px 5px",fontFamily:P,fontSize:6,borderRadius:2,marginRight:3,marginBottom:3,display:"inline-block",background:`${m.color}11`}}>
      {m.label}{typeof status.value==="number"?` ${status.value}`:""} [{status.duration===999?"inf":status.duration}]
    </span>
  );
}

function HpBar({val,max,color,flash}){
  const w=`${Math.max(0,Math.min(100,(val/max)*100))}%`;
  const pct=val/max;
  const barColor=pct<0.25?RED:pct<0.5?"#ffbe61":color;
  return(
    <div style={{border:`1px solid ${BD}`,height:14,background:"rgba(255,255,255,0.04)",borderRadius:2,position:"relative",overflow:"hidden"}}>
      <div style={{width:w,height:"100%",background:barColor,borderRadius:2,transition:"width 0.4s ease",animation:flash?"hpFlash 0.3s ease":undefined}}/>
      <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(90deg,transparent,transparent 4px,rgba(0,0,0,0.15) 4px,rgba(0,0,0,0.15) 5px)",pointerEvents:"none"}}/>
    </div>
  );
}

export default function Blindvault(){
  useEffect(()=>{
    const l=document.createElement("link");l.rel="stylesheet";l.href=FONT_URL;document.head.appendChild(l);
    const s=document.createElement("style");s.textContent=KF;document.head.appendChild(s);
    return()=>{try{document.head.removeChild(l);}catch{}try{document.head.removeChild(s);}catch{}};
  },[]);

  const [phase,setPhase]=useState("intro");
  const [prevPhase,setPrevPhase]=useState("");
  const [transitioning,setTransitioning]=useState(false);
  const [timeOpt,setTimeOpt]=useState(TIME_OPTIONS[1]);
  const [nameIn,setNameIn]=useState("");
  const [selCls,setSelCls]=useState(CLASSES[0]);
  const [selRace,setSelRace]=useState(RACES[0]);
  const [rolled,setRolled]=useState({STR:14,DEX:12,CON:13,INT:11,WIS:10,CHA:9});
  const [hero,setHero]=useState(null);
  const [blueprint,setBlueprint]=useState(null);
  const [rooms,setRooms]=useState([]);
  const [roomIdx,setRoomIdx]=useState(1);
  const [clearedRooms,setClearedRooms]=useState([]);
  const [enemy,setEnemy]=useState(null);
  const [combatLog,setCombatLog]=useState([]);
  const [round,setRound]=useState(1);
  const [narrative,setNarrative]=useState("");
  const [storyChoices,setStoryChoices]=useState([]);
  const [pendingEvent,setPendingEvent]=useState(null);
  const [busy,setBusy]=useState(false);
  const [hasSave,setHasSave]=useState(false);
  const [victoryBossName,setVictoryBossName]=useState("");
  const [revealedWeakness,setRevealedWeakness]=useState(false);
  const [nextDmgBonus,setNextDmgBonus]=useState(0);
  const [hpFlash,setHpFlash]=useState(false);
  const [pageKey,setPageKey]=useState(0);
  const logRef=useRef(null);

  useEffect(()=>{try{setHasSave(Boolean(localStorage.getItem("bv3")));}catch{};},[]);
  useEffect(()=>{if(logRef.current)logRef.current.scrollTop=logRef.current.scrollHeight;},[combatLog]);

  function clearSave(){try{localStorage.removeItem("bv3");}catch{}setHasSave(false);}

  function goPhase(next){
    setTransitioning(true);
    setTimeout(()=>{
      setPrevPhase(phase);
      setPhase(next);
      setPageKey(k=>k+1);
      setTransitioning(false);
    },320);
  }

  function hardReset(){
    clearSave();
    setTransitioning(true);
    setTimeout(()=>{
      setPhase("intro");setHero(null);setBlueprint(null);setRooms([]);setRoomIdx(1);
      setClearedRooms([]);setEnemy(null);setCombatLog([]);setRound(1);
      setNarrative("");setStoryChoices([]);setPendingEvent(null);setBusy(false);
      setVictoryBossName("");setRevealedWeakness(false);setNextDmgBonus(0);setHpFlash(false);
      setPageKey(k=>k+1);setTransitioning(false);
    },320);
  }

  function rollStats(){setRolled({STR:r4d6(),DEX:r4d6(),CON:r4d6(),INT:r4d6(),WIS:r4d6(),CHA:r4d6()});}

  function beginRun(){
    const h=buildHero(nameIn,selCls,selRace,rolled);
    const dn=DUNGEON_NAMES[Math.floor(Math.random()*DUNGEON_NAMES.length)];
    const q=QUIRKS[Math.floor(Math.random()*QUIRKS.length)];
    const bp={dungeonName:dn,quirk:q,totalRooms:timeOpt.rooms};
    const rs=genRooms(timeOpt);
    setHero(h);setBlueprint(bp);setRooms(rs);setRoomIdx(1);setClearedRooms([]);
    setNarrative(`${dn} yawns open before ${h.name}. The quirk "${q.name}" hangs over the run like a curse. What waits inside is already decided. You just don't know it yet.`);
    goPhase("reveal");
  }

  function enterRoom(idx){
    const room=rooms[idx-1];
    if(!room)return;
    setRoomIdx(idx);
    setCombatLog([]);
    setRevealedWeakness(false);
    if(room.type==="normal"&&room.event){
      const ev=room.event;
      setNarrative(`Room ${idx} of ${blueprint.totalRooms}: ${ev.title}\n\n${ev.desc}`);
      setStoryChoices(ev.choices);
      setPendingEvent({room,ev});
      goPhase("event");
    } else {
      startCombat(idx,room,null);
    }
  }

  function buildNavChoices(currentIdx,totalRooms,rms){
    if(currentIdx>=totalRooms)return[];
    const next=currentIdx+1;
    const nextRoom=rms[next-1];
    const choices=[];
    choices.push({
      id:"advance",label:`Advance to Room ${next}`,
      icon:nextRoom.type==="boss"?"👑":nextRoom.type==="elite"?"⚡":"🗡️",
      desc:nextRoom.type==="boss"?"The final boss chamber awaits. No turning back.":nextRoom.type==="elite"?"An elite guardian blocks the way.":"The next chamber of the dungeon.",
      action:"enter",roomIndex:next,
    });
    if(next<totalRooms){
      choices.push({
        id:"rest",label:"Rest in the shadows",icon:"🕯️",
        desc:"Take a moment. Recover 3 HP before pressing on.",
        action:"rest_then_enter",roomIndex:next,
      });
    }
    return choices;
  }

  function resolveEventCommon(h,log,nav,msg){
    setHero(h);setStoryChoices([]);setPendingEvent(null);
    setClearedRooms(p=>[...new Set([...p,roomIdx])]);
    setNarrative(msg);setStoryChoices(nav);setCombatLog(log);
    goPhase("explore");
  }

  function handleEventChoice(choice){
    const room=pendingEvent.room;
    const h=jc(hero);
    const log=[];
    const nav=buildNavChoices(roomIdx,blueprint.totalRooms,rooms);
    if(choice.type==="combat"){
      const e=buildEnemy(room.enemyTemplate,roomIdx,room.type);
      if(choice.effect==="hero_guard")addStat(h,{id:"guard_up",value:3,duration:1});
      if(choice.effect==="enemy_weakened")addStat(e,{id:"weakened",value:2,duration:2});
      if(choice.effect==="enemy_exposed")addStat(e,{id:"exposed",value:-2,duration:2});
      if(choice.effect==="enemy_buff"){addStat(e,{id:"guard_up",value:2,duration:3});addStat(e,{id:"damage_up",value:1,duration:3});}
      if(choice.effect==="ambush")log.push({t:"sys",m:"The merchant reveals their true form!"});
      if(choice.effect==="enemy_rage")addStat(e,{id:"damage_up",value:3,duration:99});
      setHero(h);setStoryChoices([]);setPendingEvent(null);
      startCombatWithEnemy(roomIdx,room,e,h,log);
    } else if(choice.type==="damage"){
      const dmg=parseInt(choice.effect)||0;
      h.hp=Math.max(1,h.hp-dmg);
      log.push({t:"dmg",m:`You take ${dmg} damage pushing through.`});
      resolveEventCommon(h,log,nav,`Room ${roomIdx} passed. The vault offers no mercy.`);
    } else if(choice.type==="heal"){
      const gained=applyHeal(h,parseInt(choice.effect)||0);
      log.push({t:"heal",m:`You rest and recover ${gained} HP.`});
      resolveEventCommon(h,log,nav,`Room ${roomIdx} cleared without a fight. The vault grows quieter.`);
    } else if(choice.type==="gain"){
      if(choice.effect==="potion")h.resources.potions+=1;
      log.push({t:"heal",m:choice.effect==="potion"?"You found a potion!":"You gained something useful."});
      resolveEventCommon(h,log,nav,`Room ${roomIdx} — a lucky find in the dark.`);
    } else if(choice.type==="sacrifice"){
      if(h.resources.potions>0){h.resources.potions-=1;setNextDmgBonus(2);log.push({t:"sys",m:"You spend a potion. Next attack deals +2 damage."});}
      else log.push({t:"sys",m:"No potions to spare. You move on."});
      resolveEventCommon(h,log,nav,`Room ${roomIdx} passed. A choice made in the dark.`);
    } else if(choice.type==="buff"){
      if(choice.effect==="regen")h.pendingBuffs=[...(h.pendingBuffs||[]),{id:"regen",value:3,duration:3}];
      if(choice.effect==="resist")h.baseGuard+=1;
      log.push({t:"heal",m:"You feel strengthened for the next fight."});
      resolveEventCommon(h,log,nav,`Room ${roomIdx} — a moment of preparation in the dark.`);
    } else if(choice.type==="damage_heal"){
      const pts=(choice.effect||"0_0").split("_");
      const dmg=parseInt(pts[0])||0;const hl=parseInt(pts[1])||0;
      h.hp=Math.max(1,h.hp-dmg);applyHeal(h,hl);
      log.push({t:"heal",m:`Lose ${dmg} HP, gain ${hl} HP. Net +${hl-dmg}.`});
      resolveEventCommon(h,log,nav,`Room ${roomIdx} — the shrine extracts its price.`);
    } else if(choice.type==="info"){
      if(choice.effect==="reveal")setRevealedWeakness(true);
      log.push({t:"sys",m:"You learn something useful about what lies ahead."});
      resolveEventCommon(h,log,nav,`Room ${roomIdx} — knowledge gathered. The path forward clears.`);
    } else if(choice.type==="skill_check"){
      const roll=rd(20);
      if(roll>=10){
        log.push({t:"sys",m:`Skill check passed (${roll}). You navigate safely.`});
        resolveEventCommon(h,log,nav,`Room ${roomIdx} cleared. You thread through the danger.`);
      } else {
        h.hp=Math.max(1,h.hp-4);
        log.push({t:"dmg",m:`Skill check failed (${roll}). You take 4 damage.`});
        resolveEventCommon(h,log,nav,`Room ${roomIdx} — a painful lesson. Keep moving.`);
      }
    } else {
      resolveEventCommon(h,log,nav,`Room ${roomIdx} — you move on through the silence.`);
    }
  }

  function startCombat(idx,room,initLog){
    startCombatWithEnemy(idx,room,buildEnemy(room.enemyTemplate,idx,room.type),hero,initLog||[]);
  }

  function startCombatWithEnemy(idx,room,e,h,initLog){
    const he=jc(h);
    (he.pendingBuffs||[]).forEach(b=>addStat(he,b));
    he.pendingBuffs=[];
    const eI=jc(e);
    setIntent(eI,1,he);
    setHero(he);setEnemy(eI);setRound(1);
    setStoryChoices([]);setPendingEvent(null);
    setNarrative(`Room ${idx} — ${room.type==="boss"?"FINAL BOSS: ":room.type==="elite"?"ELITE: ":""}${e.name} blocks your path.`);
    setCombatLog([...(initLog||[]),{t:"sys",m:`${e.name} emerges from the dark. Round 1.`}]);
    goPhase("combat");
  }

  function enemyTurnInline(h,e,log,bp){
    const move=e.moves.find(m=>m.id===e.intent.moveId)||pickEnemyMove(e,round,h);
    if(!move)return;
    if(hasStat(h,"evade_next")){
      log.push({t:"sys",m:`${h.name} dodges ${e.name}'s ${move.label}.`});
      remStat(h,"evade_next");e.cooldowns[move.id]=move.cooldown||0;return;
    }
    if(move.kind==="buff"||move.kind==="phase_buff"){
      (move.applySelf||[]).forEach(s=>addStat(e,{...s,value:s.id==="guard_up"?s.value+bufBon(bp):s.value}));
      if(move.kind==="phase_buff")e.phase=2;
      log.push({t:"sys",m:`${e.name} uses ${move.label}!`});
    } else if(move.kind==="debuff"){
      (move.applyEnemy||[]).forEach(s=>addStat(h,{...s}));
      log.push({t:"dmg",m:`${e.name} afflicts you with ${move.label}.`});
    } else {
      const d20=rd(20);
      const eAStat=["fear_pulse","soul_drain","ember_bolt","singe_hex"].includes(move.id)?"INT":"STR";
      const hit=checkHit(d20,2+(move.accuracyBonus||0),currGuard(h),20);
      if(!hit.hit){log.push({t:"sys",m:`${e.name}'s ${move.label} misses.`});}
      else{
        let flat=0;
        if(h.cls.id==="warrior"&&!h.passives.hardened){h.passives.hardened=true;flat=-2;log.push({t:"sys",m:"Battle Hardened blunts the blow."});}
        const actor={...e,stats:{STR:14,DEX:12,INT:14,WIS:12}};
        const kind=move.kind==="drain"||move.id.includes("ember")?"magic":"physical";
        const dmg=calcDmg(actor,eAStat,move.basePower,move.damageDie,hit.crit,flat,bp,kind);
        const res=applyDmg(h,dmg,false);
        log.push({t:"dmg",m:`${e.name} hits for ${res.hd+res.sd}${hit.crit?" CRIT!":""}`});
        setHpFlash(true);setTimeout(()=>setHpFlash(false),350);
        (move.applyEnemyOnHit||[]).forEach(s=>{if(!s.chance||Math.random()<=s.chance)addStat(h,{...s});});
        if(move.kind==="drain"){const hl=applyHeal(e,Math.floor(res.hd*(move.healPercent||0)));if(hl>0)log.push({t:"heal",m:`${e.name} drains ${hl} HP.`});}
      }
    }
    e.cooldowns[move.id]=move.cooldown||0;
  }

  function finalizeCombatTurn(nh,ne,log){
    decCD(nh);decCD(ne);
    tickStats(nh,log,nh.name,blueprint);
    tickStats(ne,log,ne.name,blueprint);
    if(nh.cls.id==="paladin"&&!nh.passives.holyResolve&&nh.hp>0&&nh.hp<=Math.floor(nh.maxHp/2)){
      nh.passives.holyResolve=true;const hl=applyHeal(nh,4+sm(nh.stats.WIS));log.push({t:"heal",m:`Holy Resolve restores ${hl} HP.`});
    }
    if(nh.cls.id==="druid"&&!nh.passives.wildPulse&&nh.hp>0&&nh.hp<=Math.floor(nh.maxHp*0.4)){
      nh.passives.wildPulse=true;addStat(nh,{id:"regen",value:2,duration:3});log.push({t:"sys",m:"Wild Pulse activates."});
    }
    if(nh.race.id==="halforc"&&!nh.passives.relentless&&nh.hp<=0){
      nh.passives.relentless=true;nh.hp=1;log.push({t:"sys",m:`Relentless keeps ${nh.name} at 1 HP!`});
    }
    if(ne.hp<=0){
      const isLast=roomIdx>=blueprint.totalRooms;
      setHero(nh);setEnemy(ne);
      setCombatLog(prev=>[...log,...prev].slice(0,30));
      setClearedRooms(p=>[...new Set([...p,roomIdx])]);
      if(isLast){setVictoryBossName(ne.name);clearSave();goPhase("victory");}
      else{
        const nav=buildNavChoices(roomIdx,blueprint.totalRooms,rooms);
        setNarrative(`${ne.name} collapses. Room ${roomIdx} of ${blueprint.totalRooms} cleared. Choose your next move.`);
        setStoryChoices(nav);
        goPhase("explore");
      }
      return;
    }
    if(nh.hp<=0){
      setHero(nh);setEnemy(ne);
      setCombatLog(prev=>[...log,...prev].slice(0,30));
      clearSave();goPhase("death");return;
    }
    const nr=round+1;setRound(nr);
    setIntent(ne,nr,nh);
    setHero(nh);setEnemy(ne);
    setCombatLog(prev=>[...log,...prev].slice(0,30));
    setNarrative(`Round ${nr}. ${ne.name} prepares to ${ne.intent.label.toLowerCase()}.`);
  }

  function doAttack(){
    if(busy||!hero||!enemy)return;setBusy(true);
    const nh=jc(hero);const ne=jc(enemy);const log=[];
    const ps=CLASS_PSTAT[nh.cls.id];
    const d20=rd(20);
    const critFloor=nh.cls.id==="rogue"&&(ne.hp===ne.maxHp||hasStat(ne,"exposed"))?19:20;
    const hit=checkHit(d20,2+sm(nh.stats[ps]),currGuard(ne),critFloor);
    if(!hit.hit){log.push({t:"sys",m:`${nh.name}'s attack misses! (rolled ${d20})`});}
    else{
      let flat=nextDmgBonus;if(nextDmgBonus>0)setNextDmgBonus(0);
      if(nh.cls.id==="ranger"&&!hasStat(ne,"marked")){addStat(ne,{id:"marked",value:3,duration:3});log.push({t:"sys",m:`${ne.name} is marked.`});}
      if(hasStat(ne,"marked"))flat+=3;
      const kind=["INT","WIS"].includes(ps)?"magic":"physical";
      const dmg=calcDmg(nh,ps,4,4,hit.crit,flat,blueprint,kind);
      const res=applyDmg(ne,dmg,false);
      log.push({t:"hit",m:`${nh.name} strikes for ${res.hd+res.sd}${hit.crit?" CRIT!":""}`});
    }
    if(ne.hp>0&&nh.hp>0)enemyTurnInline(nh,ne,log,blueprint);
    finalizeCombatTurn(nh,ne,log);
    setBusy(false);
  }
  function doGuard(){
    if(busy||!hero||!enemy)return;setBusy(true);
    const nh=jc(hero);const ne=jc(enemy);const log=[];
    addStat(nh,{id:"guard_up",value:2+bufBon(blueprint),duration:1});
    addStat(nh,{id:"damage_reduction",value:3,duration:1});
    log.push({t:"sys",m:`${nh.name} braces for impact.`});
    if(ne.hp>0&&nh.hp>0)enemyTurnInline(nh,ne,log,blueprint);
    finalizeCombatTurn(nh,ne,log);
    setBusy(false);
  }
  function doPotion(){
    if(busy||!hero||!enemy)return;setBusy(true);
    const nh=jc(hero);const ne=jc(enemy);const log=[];
    if(nh.resources.potions<=0){log.push({t:"sys",m:"No potions left."});}
    else{nh.resources.potions-=1;const hl=applyHeal(nh,6+rd(6));log.push({t:"heal",m:`Potion! Recovered ${hl} HP.`});}
    if(ne.hp>0&&nh.hp>0)enemyTurnInline(nh,ne,log,blueprint);
    finalizeCombatTurn(nh,ne,log);
    setBusy(false);
  }
  function doSkill(skill){
    if(busy||!hero||!enemy)return;setBusy(true);
    const nh=jc(hero);const ne=jc(enemy);const log=[];
    if((nh.cooldowns[skill.id]||0)>0){log.push({t:"sys",m:`${skill.name} on cooldown.`});setBusy(false);return;}
    if(skill.usesPerCombat&&(nh.uses[skill.id]||0)>=skill.usesPerCombat){log.push({t:"sys",m:`${skill.name} exhausted.`});setBusy(false);return;}
    nh.cooldowns[skill.id]=skill.cooldown||0;
    nh.uses[skill.id]=(nh.uses[skill.id]||0)+1;
    if(nh.cls.id==="mage")nh.passives.arcaneCount+=1;
    const overflow=nh.cls.id==="mage"&&nh.passives.arcaneCount>0&&nh.passives.arcaneCount%3===0;
    const isMag=["INT","WIS"].includes(skill.accuracyStat||skill.scalingStat);
    if(skill.kind==="buff"){
      (skill.applySelf||[]).forEach(s=>addStat(nh,{...s,value:s.id==="guard_up"?s.value+bufBon(blueprint):s.value}));
      log.push({t:"sys",m:`${nh.name} activates ${skill.name}.`});
    } else if(skill.kind==="shield"){
      const sv=skill.shieldBase+sm(nh.stats[skill.scalingStat])+qDmg(blueprint,"magic");
      addStat(nh,{id:"shielded",value:sv,duration:2});
      log.push({t:"heal",m:`Arcane shield of ${sv} conjured.`});
    } else if(skill.kind==="heal"){
      const hl=applyHeal(nh,skill.healBase+rd(skill.healDie)+sm(nh.stats[skill.scalingStat]));
      log.push({t:"heal",m:`${skill.name} restores ${hl} HP.`});
    } else if(skill.kind==="hot"){
      (skill.applySelf||[]).forEach(s=>addStat(nh,{...s}));
      log.push({t:"heal",m:"Regenerative growth wraps you."});
    } else if(skill.kind==="utility"){
      const rm=clearNeg(nh,skill.clearNegative||1);
      (skill.applySelf||[]).forEach(s=>addStat(nh,{...s,value:s.id==="guard_up"?s.value+bufBon(blueprint):s.value}));
      log.push({t:"sys",m:`Cleared ${rm} debuff(s). Guard restored.`});
    } else if(skill.kind==="debuff"){
      (skill.applyEnemy||[]).forEach(s=>{if(!s.chance||Math.random()<=s.chance)addStat(ne,{...s});});
      log.push({t:"sys",m:`${skill.name} applied to ${ne.name}.`});
    } else if(skill.kind==="multi_attack"){
      let total=0;
      for(let i=0;i<skill.hits;i++){
        const d20=rd(20);const hit=checkHit(d20,2+sm(nh.stats[skill.accuracyStat]),currGuard(ne),20);
        if(!hit.hit)continue;
        const dmg=calcDmg(nh,skill.accuracyStat,skill.basePower,skill.damageDie,hit.crit,hasStat(ne,"marked")?3:0,blueprint,isMag?"magic":"physical");
        const res=applyDmg(ne,dmg,false);total+=res.hd+res.sd;
      }
      log.push({t:"hit",m:`${skill.name}: ${total} total damage.`});
    } else {
      const d20=rd(20);
      const critFloor=nh.cls.id==="rogue"&&(ne.hp===ne.maxHp||hasStat(ne,"exposed"))?19:20;
      const hit=checkHit(d20,2+sm(nh.stats[skill.accuracyStat])+(skill.accuracyBonus||0),currGuard(ne),critFloor);
      if(!hit.hit){log.push({t:"sys",m:`${skill.name} misses!`});}
      else{
        let flat=nextDmgBonus;if(nextDmgBonus>0)setNextDmgBonus(0);
        if(skill.bonusVsExposed&&hasStat(ne,"exposed"))flat+=skill.bonusVsExposed;
        if(skill.bonusVsTags&&ne.tags.some(t=>skill.bonusVsTags.includes(t)))flat+=skill.bonusDamage||0;
        if(hasStat(ne,"marked"))flat+=3;if(overflow)flat+=4;
        const dmg=calcDmg(nh,skill.accuracyStat,skill.basePower,skill.damageDie,hit.crit,flat,blueprint,isMag?"magic":"physical");
        const res=applyDmg(ne,dmg,false);
        log.push({t:"hit",m:`${skill.name}: ${res.hd+res.sd}${overflow?" +ARCANE OVERFLOW!":""}`});
        (skill.applyEnemyOnHit||[]).forEach(s=>{if(!s.chance||Math.random()<=s.chance)addStat(ne,{...s});});
        if(skill.id==="divine_smite"&&ne.role==="boss"){remStat(ne,"guard_up");log.push({t:"sys",m:"Holy force shatters the fortress form!"});}
      }
    }
    if(ne.hp>0&&nh.hp>0)enemyTurnInline(nh,ne,log,blueprint);
    finalizeCombatTurn(nh,ne,log);
    setBusy(false);
  }
  function handleNavChoice(choice){
    if(choice.action==="rest_then_enter"){
      const nh=jc(hero);const hl=applyHeal(nh,3);
      setHero(nh);setCombatLog([{t:"heal",m:`You rest in the shadows. Recovered ${hl} HP.`}]);
      setTimeout(()=>enterRoom(choice.roomIndex),500);
    } else {
      enterRoom(choice.roomIndex);
    }
  }

  const skills=hero?CLASS_SKILLS[hero.cls.id]||[]:[];
  const isM=typeof window!=="undefined"&&window.innerWidth<640;

  function lc(t){if(t==="hit")return GOLD;if(t==="dmg")return RED;if(t==="heal")return GRN;return TM;}
  function roomIcon(type){if(type==="boss")return"👑";if(type==="elite")return"⚡";return"🗡️";}

  const scanline=(
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:999,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.08) 2px,rgba(0,0,0,0.08) 4px)"}}/>
  );

  const wipeOverlay=(
    <div style={{position:"fixed",inset:0,zIndex:9999,background:"#04060f",animation:"wipeOut 0.32s ease forwards",pointerEvents:"none"}}/>
  );

  function renderFloatingSprites(){
    return(
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:1,overflow:"hidden"}}>
        {FLOATING_SPRITES.map((sp,i)=>(
          <div key={i} style={{position:"absolute",top:sp.top,left:sp.left,fontSize:sp.size,opacity:0.18,animation:`${sp.anim} ${sp.dur} ${sp.delay} ease-in-out infinite`,userSelect:"none"}}>
            {sp.emoji}
          </div>
        ))}
      </div>
    );
  }

  function renderPathBar(){
    if(!blueprint||!rooms.length)return null;
    return(
      <div style={{background:CARD,border:`2px solid ${BD}`,boxShadow:"0 0 14px rgba(192,64,255,0.1)",padding:isM?10:14,marginBottom:10,animation:"bvFade 0.4s ease"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:4}}>
          <div style={{fontFamily:P,fontSize:"7px",color:G}}>DUNGEON PATH</div>
          <div style={{fontFamily:V,fontSize:isM?14:16,color:TM,opacity:0.8}}>{blueprint.dungeonName}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",overflowX:"auto",paddingBottom:4,gap:0,scrollbarWidth:"none"}}>
          {rooms.map((room,i)=>{
            const ri=i+1;
            const cleared=clearedRooms.includes(ri);
            const active=(phase==="combat"||phase==="event")&&ri===roomIdx;
            const future=ri>roomIdx&&!clearedRooms.includes(ri);
            const bc=active?G:cleared?GRN:future?BD:TM;
            const col=active?G:cleared?GRN:future?"rgba(105,129,113,0.5)":TX;
            return(
              <div key={ri} style={{display:"flex",alignItems:"center",flexShrink:0}}>
                <div style={{
                  border:`2px solid ${bc}`,
                  background:active?"rgba(192,64,255,0.18)":cleared?"rgba(0,232,122,0.1)":"rgba(255,255,255,0.02)",
                  padding:"5px 7px",borderRadius:3,textAlign:"center",minWidth:38,position:"relative",
                  animation:active?"bvGlow 1.5s ease infinite":cleared?"bvFade 0.5s ease":undefined,
                  transition:"border-color 0.4s,background 0.4s",
                }}>
                  <div style={{fontFamily:V,fontSize:17,color:col,opacity:future?0.45:1}}>{roomIcon(room.type)}</div>
                  <div style={{fontFamily:P,fontSize:5,color:col,opacity:future?0.45:1}}>R{ri}</div>
                  {room.type==="boss"&&<div style={{fontFamily:P,fontSize:4,color:GOLD}}>BOSS</div>}
                  {room.type==="elite"&&<div style={{fontFamily:P,fontSize:4,color:BLUE}}>ELITE</div>}
                  {cleared&&<div style={{position:"absolute",top:-5,right:-5,fontSize:9,animation:"popIn 0.3s ease"}}>✅</div>}
                  {active&&<div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",fontFamily:P,fontSize:5,color:G,whiteSpace:"nowrap",animation:"bvBlink 1s infinite"}}>YOU</div>}
                </div>
                {ri<blueprint.totalRooms&&(
                  <div style={{width:12,height:2,flexShrink:0,background:cleared?GRN:future?"rgba(160,80,255,0.15)":BD,transition:"background 0.4s"}}/>
                )}
              </div>
            );
          })}
        </div>
        <div style={{marginTop:8,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
          <div style={{fontFamily:P,fontSize:6,color:TM}}>QUIRK:</div>
          <div style={{fontFamily:V,fontSize:isM?15:17,color:GOLD}}>{blueprint.quirk.name}</div>
          <div style={{fontFamily:V,fontSize:isM?14:15,color:TM,opacity:0.8}}>— {blueprint.quirk.text}</div>
        </div>
      </div>
    );
  }

  const ph={background:CARD,border:`2px solid ${BD}`,boxShadow:"0 0 14px rgba(192,64,255,0.1)",padding:isM?10:14};
  const btn={fontFamily:P,fontSize:isM?"7px":"9px",background:"rgba(14,6,32,0.9)",color:TX,border:`2px solid ${BD}`,padding:isM?"9px 8px":"11px 12px",cursor:"pointer",textAlign:"left",width:"100%",lineHeight:1.5,transition:"border-color 0.2s,background 0.2s"};
  const btnP={fontFamily:P,fontSize:isM?"7px":"9px",background:"rgba(192,64,255,0.12)",color:TX,border:`2px solid ${G}`,padding:isM?"9px 8px":"11px 12px",cursor:"pointer",textAlign:"left",width:"100%",lineHeight:1.5,transition:"border-color 0.2s,background 0.2s"};

  if(transitioning) return(
    <div style={{minHeight:"100vh",background:BG,position:"relative"}}>
      <div style={{position:"fixed",inset:0,background:"#04060f",zIndex:9999}}/>
    </div>
  );

  if(phase==="intro") return(
    <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:V,position:"relative",overflow:"hidden"}}>
      {scanline}
      {renderFloatingSprites()}
      <div style={{maxWidth:500,width:"100%",display:"flex",flexDirection:"column",gap:12,position:"relative",zIndex:2}}>
        <div style={{ background:CARD,border:`2px solid ${BD}`,boxShadow:"0 0 14px rgba(192,64,255,0.1)",padding:isM?10:14,textAlign:"center",padding:isM?20:32,animation:"bvFade 0.7s ease",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 0%,rgba(192,64,255,0.08) 0%,transparent 70%)",pointerEvents:"none"}}/>
          <div style={{fontFamily:P,fontSize:isM?"clamp(14px,5vw,22px)":"clamp(18px,4vw,28px)",color:G,animation:"titleGlitch 4s ease infinite,bvGlow 3s ease infinite",lineHeight:1.6,letterSpacing:2}}>BLINDVAULT</div>
          <div style={{fontFamily:P,fontSize:"7px",color:TM,marginTop:8,letterSpacing:2,animation:"bvBlink 2s ease infinite"}}>SOLO DUNGEON CRAWLER</div>
          <div style={{fontFamily:V,fontSize:isM?18:22,color:TX,marginTop:16,lineHeight:1.6,opacity:0.9}}>Choose your hero. Enter the vault. The dungeon reveals itself only after you commit.</div>
          <div style={{display:"flex",gap:5,justifyContent:"center",flexWrap:"wrap",marginTop:14}}>
            {["STORY CHOICES","PATH MAP","COMBAT","STATUS EFFECTS","SAVES"].map(t=>(
              <span key={t} style={{fontFamily:P,fontSize:6,padding:"3px 7px",border:`1px solid ${BD}`,color:G,background:"rgba(192,64,255,0.05)"}}>{t}</span>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:10,marginTop:20,flexWrap:"wrap"}}>
            <button onClick={()=>goPhase("setup")} style={{ fontFamily:P,fontSize:isM?"7px":"9px",background:"rgba(192,64,255,0.12)",color:TX,border:`2px solid ${G}`,padding:isM?"9px 8px":"11px 12px",cursor:"pointer",textAlign:"left",width:"100%",lineHeight:1.5,transition:"border-color 0.2s,background 0.2s",width:"auto",padding:"12px 22px",fontSize:"9px",animation:"bvGlow 2s ease infinite"}}>[ NEW RUN ]</button>
            {hasSave&&<button onClick={()=>{try{const d=JSON.parse(localStorage.getItem("bv3"));if(d){setPhase(d.phase);setHero(d.hero);setBlueprint(d.blueprint);setRooms(d.rooms);setRoomIdx(d.roomIdx);setClearedRooms(d.clearedRooms);setEnemy(d.enemy);setCombatLog(d.combatLog||[]);setRound(d.round||1);setNarrative(d.narrative||"");setStoryChoices(d.storyChoices||[]);}}catch{}}} style={{ fontFamily:P,fontSize:isM?"7px":"9px",background:"rgba(14,6,32,0.9)",color:TX,border:`2px solid ${BD}`,padding:isM?"9px 8px":"11px 12px",cursor:"pointer",textAlign:"left",width:"100%",lineHeight:1.5,transition:"border-color 0.2s,background 0.2s",width:"auto",padding:"12px 22px",fontSize:"9px"}}>[ RESUME ]</button>}
          </div>
        </div>
        <div style={{fontFamily:V,fontSize:isM?14:16,color:"rgba(105,129,113,0.5)",textAlign:"center",letterSpacing:1}}>v2.0 — ENTER BLIND</div>
      </div>
    </div>
  );

  if(phase==="setup") return(
    <div style={{minHeight:"100vh",background:BG,color:TX,fontFamily:V,padding:isM?10:20,position:"relative"}}>
      {scanline}
      <div style={{maxWidth:820,margin:"0 auto",display:"flex",flexDirection:"column",gap:10}}>
        <div style={{ background:CARD,border:`2px solid ${BD}`,boxShadow:"0 0 14px rgba(192,64,255,0.1)",padding:isM?10:14,animation:"bvFade 0.5s ease",background:"rgba(6,2,18,0.98)",borderBottom:`3px solid ${G}`}}>
          <div style={{fontFamily:P,fontSize:isM?"10px":"13px",color:G,animation:"titleGlitch 5s ease infinite"}}>CHARACTER SETUP</div>
          <div style={{fontFamily:V,fontSize:isM?16:20,color:TM,marginTop:4}}>Build your hero before the vault reveals its name.</div>
        </div>
        <div style={ph}>
          <div style={{fontFamily:P,fontSize:"8px",color:G,marginBottom:10}}>RUN LENGTH</div>
          {TIME_OPTIONS.map(opt=>(
            <button key={opt.id} onClick={()=>setTimeOpt(opt)} style={timeOpt.id===opt.id?{...btnP,marginBottom:6}:{...btn,marginBottom:6}}>
              <span style={{color:timeOpt.id===opt.id?G:TX,fontFamily:P,fontSize:"8px"}}>{opt.icon} {opt.label} — {opt.sub}</span>
              <span style={{display:"block",fontFamily:V,fontSize:isM?16:20,color:TM,marginTop:4}}>{opt.desc}</span>
            </button>
          ))}
        </div>
        <div style={ph}>
          <div style={{fontFamily:P,fontSize:"8px",color:G,marginBottom:8}}>HERO NAME</div>
          <input value={nameIn} onChange={e=>setNameIn(e.target.value.toUpperCase())} placeholder="ENTER NAME" maxLength={18}
            style={{width:"100%",padding:10,background:"#080415",border:`2px solid ${BD}`,color:TX,fontFamily:P,fontSize:isM?"9px":"11px",boxSizing:"border-box",outline:"none"}}/>
        </div>
        <div style={ph}>
          <div style={{fontFamily:P,fontSize:"8px",color:G,marginBottom:8}}>CLASS</div>
          <div style={{display:"grid",gridTemplateColumns:isM?"1fr 1fr":"repeat(3,1fr)",gap:6}}>
            {CLASSES.map(cls=>(
              <button key={cls.id} onClick={()=>setSelCls(cls)} style={selCls.id===cls.id?{...btnP}:{...btn}}>
                <span style={{color:selCls.id===cls.id?G:TX,fontFamily:P,fontSize:"8px"}}>{cls.icon} {cls.name}</span>
                <span style={{display:"block",fontFamily:V,fontSize:isM?14:18,color:TM,marginTop:4}}>{cls.desc}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={ph}>
          <div style={{fontFamily:P,fontSize:"8px",color:G,marginBottom:8}}>RACE</div>
          <div style={{display:"grid",gridTemplateColumns:isM?"1fr 1fr":"repeat(3,1fr)",gap:6}}>
            {RACES.map(race=>(
              <button key={race.id} onClick={()=>setSelRace(race)} style={selRace.id===race.id?{...btnP}:{...btn}}>
                <span style={{color:selRace.id===race.id?G:TX,fontFamily:P,fontSize:"8px"}}>{race.icon} {race.name}</span>
                <span style={{display:"block",fontFamily:V,fontSize:isM?14:17,color:TM,marginTop:3}}>{race.trait}: {race.traitDesc}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={ph}>
          <div style={{fontFamily:P,fontSize:"8px",color:G,marginBottom:8}}>STATS — 4d6 DROP LOWEST</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6}}>
            {Object.entries(rolled).map(([k,v])=>{
              const final=v+(selRace.bonuses[k]||0);
              const isPrimary=CLASS_PSTAT[selCls.id]===k;
              return(
                <div key={k} style={{border:`2px solid ${isPrimary?G:BD}`,padding:isM?"5px 3px":"7px",textAlign:"center",background:isPrimary?"rgba(192,64,255,0.08)":"rgba(192,64,255,0.02)",transition:"border-color 0.3s"}}>
                  <div style={{fontFamily:P,fontSize:6,color:isPrimary?G:TM}}>{k}</div>
                  <div style={{fontFamily:P,fontSize:isM?"10px":"13px",color:TX,marginTop:3}}>{final}</div>
                  <div style={{fontFamily:P,fontSize:7,color:isPrimary?GOLD:G,marginTop:2}}>{sm(final)>=0?"+":""}{sm(final)}</div>
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap",alignItems:"center"}}>
            <button onClick={rollStats} style={{ fontFamily:P,fontSize:isM?"7px":"9px",background:"rgba(14,6,32,0.9)",color:TX,border:`2px solid ${BD}`,padding:isM?"9px 8px":"11px 12px",cursor:"pointer",textAlign:"left",width:"100%",lineHeight:1.5,transition:"border-color 0.2s,background 0.2s",width:"auto",padding:"9px 16px",fontSize:"8px"}}>[ REROLL STATS ]</button>
            <button onClick={beginRun} style={{ fontFamily:P,fontSize:isM?"7px":"9px",background:"rgba(192,64,255,0.12)",color:TX,border:`2px solid ${G}`,padding:isM?"9px 8px":"11px 12px",cursor:"pointer",textAlign:"left",width:"100%",lineHeight:1.5,transition:"border-color 0.2s,background 0.2s",width:"auto",padding:"9px 16px",fontSize:"8px",animation:"bvGlow 2s ease infinite"}}>[ REVEAL THE VAULT ]</button>
          </div>
        </div>
      </div>
    </div>
  );

  if(phase==="reveal"&&hero&&blueprint) return(
    <div style={{minHeight:"100vh",background:BG,color:TX,fontFamily:V,padding:isM?12:24,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      {scanline}
      {renderFloatingSprites()}
      <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse at 50% 30%,rgba(192,64,255,0.07) 0%,transparent 60%)",pointerEvents:"none"}}/>
      <div style={{maxWidth:560,width:"100%",display:"flex",flexDirection:"column",gap:12,position:"relative",zIndex:2}}>
        <div style={{ background:CARD,border:`2px solid ${BD}`,boxShadow:"0 0 14px rgba(192,64,255,0.1)",padding:isM?10:14,textAlign:"center",padding:isM?18:30,animation:"wipeIn 0.4s ease"}}>
          <div style={{fontFamily:P,fontSize:"7px",color:TM,letterSpacing:3,animation:"bvBlink 3s ease infinite"}}>THE VAULT REVEALS ITSELF</div>
          <div style={{fontFamily:P,fontSize:isM?"clamp(11px,4vw,18px)":"clamp(13px,3vw,22px)",color:G,marginTop:12,lineHeight:1.5,animation:"titleGlitch 4s ease infinite,bvGlow 2s ease infinite"}}>{blueprint.dungeonName}</div>
          <div style={{fontFamily:V,fontSize:isM?19:23,color:TX,marginTop:16,lineHeight:1.6,padding:"0 4px"}}>{narrative}</div>
          <div style={{ background:CARD,border:`2px solid ${BD}`,boxShadow:"0 0 14px rgba(192,64,255,0.1)",padding:isM?10:14,marginTop:16,textAlign:"left",borderColor:`rgba(243,198,86,0.4)`,animation:"bvGlowGold 2s ease infinite"}}>
            <div style={{fontFamily:P,fontSize:"6px",color:GOLD,marginBottom:6}}>ACTIVE QUIRK</div>
            <div style={{fontFamily:V,fontSize:isM?21:25,color:GOLD}}>{blueprint.quirk.name}</div>
            <div style={{fontFamily:V,fontSize:isM?17:21,color:TM,marginTop:3}}>{blueprint.quirk.text}</div>
          </div>
        </div>
        {renderPathBar()}
        <button onClick={()=>enterRoom(1)} style={{ fontFamily:P,fontSize:isM?"7px":"9px",background:"rgba(192,64,255,0.12)",color:TX,border:`2px solid ${G}`,padding:isM?"9px 8px":"11px 12px",cursor:"pointer",textAlign:"left",width:"100%",lineHeight:1.5,transition:"border-color 0.2s,background 0.2s",textAlign:"center",padding:"14px",fontSize:"10px",animation:"bvGlow 1.5s ease infinite"}}>
          [ STEP INTO THE VAULT ]
        </button>
      </div>
    </div>
  );

  if((phase==="event"||phase==="explore"||phase==="combat")&&hero&&blueprint){
    const currentEnemy=enemy;
    const isBoss=rooms[roomIdx-1]&&rooms[roomIdx-1].type==="boss";
    return(
      <div style={{minHeight:"100vh",background:BG,color:TX,fontFamily:V,padding:isM?8:16,position:"relative"}} key={pageKey}>
        {scanline}
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",flexDirection:"column",gap:10}}>

          {/* TOP BAR */}
          <div style={{ background:CARD,border:`2px solid ${BD}`,boxShadow:"0 0 14px rgba(192,64,255,0.1)",padding:isM?10:14,display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap",borderBottom:`3px solid ${isBoss?GOLD:G}`,animation:"bvFade 0.4s ease"}}>
            <div>
              <div style={{fontFamily:P,fontSize:isM?"7px":"9px",color:isBoss?GOLD:G,animation:isBoss?"titleGlitch 3s ease infinite":undefined}}>{blueprint.dungeonName}</div>
              <div style={{fontFamily:V,fontSize:isM?16:20,color:TM,marginTop:2}}>
                ROOM {roomIdx}/{blueprint.totalRooms} — {rooms[roomIdx-1]&&rooms[roomIdx-1].type.toUpperCase()}{phase==="combat"?` — RND ${round}`:""}
              </div>
            </div>
            <div style={{display:"flex",gap:16,alignItems:"center"}}>
              {hero&&(
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:P,fontSize:"6px",color:TM}}>HERO HP</div>
                  <div style={{fontFamily:V,fontSize:isM?19:23,color:hero.hp<hero.maxHp*0.3?RED:GRN,animation:hpFlash?"hpFlash 0.3s ease":undefined}}>{hero.hp}/{hero.maxHp}</div>
                </div>
              )}
              {phase==="combat"&&currentEnemy&&(
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:P,fontSize:"6px",color:TM}}>ENEMY HP</div>
                  <div style={{fontFamily:V,fontSize:isM?19:23,color:RED}}>{currentEnemy.hp}/{currentEnemy.maxHp}</div>
                </div>
              )}
            </div>
          </div>

          {renderPathBar()}

          <div style={{display:"grid",gridTemplateColumns:isM?"1fr":(phase==="combat"?"250px 1fr 230px":"240px 1fr"),gap:10}}>

            {/* LEFT: HERO SHEET */}
            {(!isM||phase!=="combat")&&(
              <div style={{ background:CARD,border:`2px solid ${BD}`,boxShadow:"0 0 14px rgba(192,64,255,0.1)",padding:isM?10:14,display:"flex",flexDirection:"column",gap:9,animation:"slideInLeft 0.4s ease"}}>
                <div style={{fontFamily:P,fontSize:"7px",color:G,borderBottom:`1px solid ${BD}`,paddingBottom:6}}>HERO</div>
                <div>
                  <div style={{fontFamily:P,fontSize:isM?"10px":"12px",color:TX}}>{hero.cls.icon} {hero.name}</div>
                  <div style={{fontFamily:V,fontSize:isM?16:20,color:TM,marginTop:2}}>{hero.race.name} {hero.cls.name}</div>
                </div>
                <div>
                  <div style={{fontFamily:P,fontSize:"6px",color:TM,marginBottom:4}}>HP {hero.hp}/{hero.maxHp}</div>
                  <HpBar val={hero.hp} max={hero.maxHp} color={GRN} flash={hpFlash}/>
                </div>
                <div style={{fontFamily:V,fontSize:isM?15:18,color:TM}}>
                  GUARD {currGuard(hero)} &nbsp;|&nbsp; POTIONS {hero.resources.potions}
                  {nextDmgBonus>0&&<span style={{color:GOLD}}> | +{nextDmgBonus} ATK</span>}
                </div>
                <div>
                  <div style={{fontFamily:P,fontSize:"6px",color:G,marginBottom:5}}>STATUS</div>
                  <div style={{display:"flex",flexWrap:"wrap"}}>
                    {hero.statuses.length?hero.statuses.map((s,i)=><Pill key={i} status={s}/>):<span style={{fontFamily:V,fontSize:16,opacity:0.35}}>NONE</span>}
                  </div>
                </div>
                <div>
                  <div style={{fontFamily:P,fontSize:"6px",color:G,marginBottom:5}}>STATS</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4}}>
                    {Object.entries(hero.stats).map(([k,v])=>{
                      const isPrimary=CLASS_PSTAT[hero.cls.id]===k;
                      return(
                        <div key={k} style={{border:`1px solid ${isPrimary?G:BD}`,padding:"3px 5px",textAlign:"center",background:isPrimary?"rgba(192,64,255,0.06)":"transparent"}}>
                          <div style={{fontFamily:P,fontSize:5,color:isPrimary?G:TM}}>{k}</div>
                          <div style={{fontFamily:P,fontSize:9,color:isPrimary?GOLD:TX,marginTop:2}}>{v}</div>
                          <div style={{fontFamily:P,fontSize:6,color:G}}>{sm(v)>=0?"+":""}{sm(v)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div style={{fontFamily:V,fontSize:isM?14:16,color:BLUE,lineHeight:1.5}}>{hero.race.trait}: {hero.race.traitDesc}</div>
                <div style={{fontFamily:V,fontSize:isM?13:15,color:TM,lineHeight:1.4,borderTop:`1px solid ${BD}`,paddingTop:6}}>{hero.cls.gear.join("  /  ")}</div>
              </div>
            )}

            {/* CENTER: NARRATIVE + CHOICES + COMBAT */}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>

              {/* NARRATIVE */}
              <div style={{ background:CARD,border:`2px solid ${BD}`,boxShadow:"0 0 14px rgba(192,64,255,0.1)",padding:isM?10:14,animation:"bvFade 0.4s ease"}}>
                <div style={{fontFamily:P,fontSize:"7px",color:phase==="event"?GOLD:G,marginBottom:8}}>
                  {phase==="event"?"EVENT":phase==="explore"?"PATH AHEAD":"NARRATIVE"}
                </div>
                <div style={{fontFamily:V,fontSize:isM?19:23,color:TX,lineHeight:1.6,whiteSpace:"pre-line"}}>{narrative}</div>
                {revealedWeakness&&currentEnemy&&currentEnemy.weaknessText&&(
                  <div style={{marginTop:10,fontFamily:V,fontSize:isM?16:20,color:GOLD,borderTop:`1px solid rgba(243,198,86,0.3)`,paddingTop:8,animation:"bvFadeUp 0.4s ease"}}>
                    WEAKNESS REVEALED: {currentEnemy.weaknessText}
                  </div>
                )}
              </div>

              {/* COMBAT ENEMY PANEL */}
              {phase==="combat"&&currentEnemy&&(
                <div style={{ background:CARD,border:`2px solid ${BD}`,boxShadow:"0 0 14px rgba(192,64,255,0.1)",padding:isM?10:14,borderColor:isBoss?"rgba(243,198,86,0.5)":BD,animation:"slideInRight 0.4s ease"}}>
                  <div style={{fontFamily:P,fontSize:"7px",color:isBoss?GOLD:G,marginBottom:8}}>{isBoss?"FINAL BOSS":"ENEMY"}</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,flexWrap:"wrap"}}>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:P,fontSize:isM?"10px":"13px",color:TX,animation:isBoss?"bvGlowGold 2s ease infinite":undefined}}>
                        {currentEnemy.icon} {currentEnemy.name}
                        {currentEnemy.phase===2&&<span style={{color:RED,fontSize:"8px",marginLeft:8}}>[PHASE 2]</span>}
                      </div>
                      <div style={{fontFamily:V,fontSize:isM?17:21,color:RED,marginTop:3}}>
                        Intent: {currentEnemy.intent.label}
                        <span style={{fontFamily:P,fontSize:6,color:TM,marginLeft:8}}>GUARD {currGuard(currentEnemy)}</span>
                      </div>
                      {currentEnemy.weaknessText&&(
                        <div style={{fontFamily:V,fontSize:isM?15:18,color:revealedWeakness?GOLD:"rgba(243,198,86,0.35)",marginTop:4,transition:"color 0.4s"}}>
                          {revealedWeakness?`WEAKNESS: ${currentEnemy.weaknessText}`:"Has a hidden weakness..."}
                        </div>
                      )}
                    </div>
                    <div style={{minWidth:130}}>
                      <div style={{fontFamily:P,fontSize:"6px",color:TM,marginBottom:4}}>HP {currentEnemy.hp}/{currentEnemy.maxHp}</div>
                      <HpBar val={currentEnemy.hp} max={currentEnemy.maxHp} color={RED}/>
                    </div>
                  </div>
                  <div style={{marginTop:8}}>
                    <div style={{fontFamily:P,fontSize:"6px",color:G,marginBottom:5}}>ENEMY STATUS</div>
                    <div style={{display:"flex",flexWrap:"wrap"}}>
                      {currentEnemy.statuses.length?currentEnemy.statuses.map((s,i)=><Pill key={i} status={s}/>):<span style={{fontFamily:V,fontSize:16,opacity:0.35}}>NONE</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* COMBAT ACTIONS */}
              {phase==="combat"&&(
                <div style={{ background:CARD,border:`2px solid ${BD}`,boxShadow:"0 0 14px rgba(192,64,255,0.1)",padding:isM?10:14,animation:"bvFade 0.5s ease"}}>
                  <div style={{fontFamily:P,fontSize:"7px",color:G,marginBottom:8}}>ACTIONS</div>
                  <div style={{display:"grid",gridTemplateColumns:isM?"1fr 1fr":"repeat(3,1fr)",gap:6,marginBottom:12}}>
                    {[
                      {label:"ATTACK",sub:"Basic strike",fn:doAttack,primary:true},
                      {label:"GUARD",sub:"Brace + reduce dmg",fn:doGuard,primary:false},
                      {label:`POTION (${hero.resources.potions}x)`,sub:"Heal 6+d6 HP",fn:doPotion,primary:false,disabled:hero.resources.potions<=0},
                    ].map(a=>(
                      <button key={a.label} disabled={busy||a.disabled} onClick={a.fn}
                        style={{fontFamily:P,fontSize:isM?"7px":"9px",background:a.primary?"rgba(192,64,255,0.12)":"rgba(14,6,32,0.9)",color:TX,border:a.primary?`2px solid ${G}`:`2px solid ${BD}`,padding:"10px 6px",cursor:"pointer",textAlign:"center",width:"100%",lineHeight:1.5,transition:"border-color 0.2s",opacity:(busy||a.disabled)?0.4:1}}>
                        <div style={{fontFamily:P,fontSize:"7px"}}>[{a.label}]</div>
                        <div style={{fontFamily:V,fontSize:14,color:TM,marginTop:3}}>{a.sub}</div>
                      </button>
                    ))}
                  </div>
                  <div style={{fontFamily:P,fontSize:"7px",color:G,marginBottom:6}}>SKILLS</div>
                  <div style={{display:"flex",flexDirection:"column",gap:5}}>
                    {skills.map(sk=>{
                      const cd=(hero.cooldowns[sk.id]||0)>0;
                      const ex=sk.usesPerCombat&&(hero.uses[sk.id]||0)>=sk.usesPerCombat;
                      return(
                        <button key={sk.id} disabled={busy||cd||ex} onClick={()=>doSkill(sk)}
                          style={{ fontFamily:P,fontSize:isM?"7px":"9px",background:"rgba(14,6,32,0.9)",color:TX,border:`2px solid ${BD}`,padding:isM?"9px 8px":"11px 12px",cursor:"pointer",textAlign:"left",width:"100%",lineHeight:1.5,transition:"border-color 0.2s,background 0.2s",opacity:(busy||cd||ex)?0.35:1,animation:(!cd&&!ex)?"undefined":undefined}}>
                          <span style={{fontFamily:P,fontSize:"7px",color:(cd||ex)?TM:G}}>
                            {sk.name}{cd?` [CD ${hero.cooldowns[sk.id]}]`:""}{ex?" [USED]":""}
                          </span>
                          <span style={{display:"block",fontFamily:V,fontSize:isM?15:19,color:TM,marginTop:3}}>{sk.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* EVENT / EXPLORE CHOICES */}
              {(phase==="event"||phase==="explore")&&storyChoices.length>0&&(
                <div style={{ background:CARD,border:`2px solid ${BD}`,boxShadow:"0 0 14px rgba(192,64,255,0.1)",padding:isM?10:14,animation:"bvFade 0.4s ease"}}>
                  <div style={{fontFamily:P,fontSize:"7px",color:G,marginBottom:10}}>
                    {phase==="event"?"WHAT DO YOU DO?":"PATH FORWARD"}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:7}}>
                    {storyChoices.map((c,i)=>{
                      const isBossRoom=c.roomIndex&&rooms[c.roomIndex-1]&&rooms[c.roomIndex-1].type==="boss";
                      const isEliteRoom=c.roomIndex&&rooms[c.roomIndex-1]&&rooms[c.roomIndex-1].type==="elite";
                      const isHeal=c.type==="heal"||c.action==="rest_then_enter";
                      const isDanger=c.type==="damage";
                      const borderCol=isBossRoom?GOLD:isEliteRoom?BLUE:isHeal?GRN:isDanger?RED:BD;
                      return(
                        <button key={c.id||i}
                          onClick={()=>phase==="event"?handleEventChoice(c):handleNavChoice(c)}
                          style={{ fontFamily:P,fontSize:isM?"7px":"9px",background:"rgba(14,6,32,0.9)",color:TX,border:`2px solid ${BD}`,padding:isM?"9px 8px":"11px 12px",cursor:"pointer",textAlign:"left",width:"100%",lineHeight:1.5,transition:"border-color 0.2s,background 0.2s",borderColor:borderCol,padding:"12px 14px",animation:`bvFadeUp 0.3s ${i*0.06}s ease both`,position:"relative",overflow:"hidden"}}>
                          <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:borderCol,opacity:0.7}}/>
                          <span style={{fontFamily:P,fontSize:"7px",color:isBossRoom?GOLD:isEliteRoom?BLUE:TX,paddingLeft:8}}>
                            {c.icon&&`${c.icon}  `}{c.label}
                          </span>
                          <span style={{display:"block",fontFamily:V,fontSize:isM?17:21,color:TM,marginTop:5,paddingLeft:8,lineHeight:1.4}}>{c.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: COMBAT LOG (desktop combat) */}
            {phase==="combat"&&!isM&&(
              <div ref={logRef} style={{ background:CARD,border:`2px solid ${BD}`,boxShadow:"0 0 14px rgba(192,64,255,0.1)",padding:isM?10:14,overflowY:"auto",maxHeight:600,display:"flex",flexDirection:"column",gap:4,animation:"slideInRight 0.4s ease"}}>
                <div style={{fontFamily:P,fontSize:"7px",color:G,marginBottom:6,position:"sticky",top:0,background:CARD,paddingBottom:4}}>COMBAT LOG</div>
                {combatLog.map((entry,i)=>{
                  const e=typeof entry==="string"?{t:"sys",m:entry}:entry;
                  return(
                    <div key={i} style={{borderLeft:`3px solid ${lc(e.t)}`,paddingLeft:7,fontFamily:V,fontSize:18,color:lc(e.t),lineHeight:1.3,animation:"logSlide 0.2s ease",background:i===0?`${lc(e.t)}0a`:"transparent",padding:"3px 3px 3px 7px",borderRadius:"0 2px 2px 0"}}>
                      {e.m}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* MOBILE COMBAT LOG */}
          {phase==="combat"&&isM&&(
            <div ref={logRef} style={{ background:CARD,border:`2px solid ${BD}`,boxShadow:"0 0 14px rgba(192,64,255,0.1)",padding:isM?10:14,overflowY:"auto",maxHeight:170,display:"flex",flexDirection:"column",gap:3}}>
              <div style={{fontFamily:P,fontSize:"6px",color:G,marginBottom:4}}>COMBAT LOG</div>
              {combatLog.map((entry,i)=>{
                const e=typeof entry==="string"?{t:"sys",m:entry}:entry;
                return(
                  <div key={i} style={{borderLeft:`2px solid ${lc(e.t)}`,paddingLeft:5,fontFamily:V,fontSize:16,color:lc(e.t),lineHeight:1.2,animation:"logSlide 0.2s ease"}}>
                    {e.m}
                  </div>
                );
              })}
            </div>
          )}

          {/* MOBILE HERO COMPACT */}
          {isM&&phase==="combat"&&(
            <div style={{ background:CARD,border:`2px solid ${BD}`,boxShadow:"0 0 14px rgba(192,64,255,0.1)",padding:isM?10:14 }}>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <div style={{flex:1}}>
                  <div style={{fontFamily:P,fontSize:"6px",color:TM,marginBottom:3}}>YOUR HP</div>
                  <HpBar val={hero.hp} max={hero.maxHp} color={GRN} flash={hpFlash}/>
                </div>
                <div style={{fontFamily:V,fontSize:16,color:TM,whiteSpace:"nowrap"}}>
                  G:{currGuard(hero)} P:{hero.resources.potions}
                </div>
              </div>
              <div style={{marginTop:5,display:"flex",flexWrap:"wrap"}}>
                {hero.statuses.map((s,i)=><Pill key={i} status={s}/>)}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  if(phase==="victory"){
    const confetti=Array.from({length:30},(_,i)=>({
      id:i,
      left:`${Math.round((i/30)*100)}%`,
      color:[G,GRN,GOLD,BLUE,RED,TX][i%6],
      size:Math.round(Math.random()*8+4),
      delay:`${(Math.random()*2).toFixed(2)}s`,
      dur:`${(Math.random()*1.5+2).toFixed(2)}s`,
      round:i%3===0,
    }));
    return(
      <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",padding:16,position:"relative",overflow:"hidden"}}>
        {scanline}
        <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
          {confetti.map(c=>(
            <div key={c.id} style={{position:"absolute",top:-10,left:c.left,width:c.size,height:c.size,background:c.color,borderRadius:c.round?"50%":"0",animation:`confetti ${c.dur} ${c.delay} ease-in forwards`}}/>
          ))}
          {[0,1,2,3].map(i=>(
            <div key={i} style={{position:"absolute",top:"50%",left:"50%",width:200,height:200,border:`2px solid ${i%2===0?G:GOLD}`,borderRadius:"50%",animation:`ringOut 2.5s ${i*0.5}s ease-out infinite`}}/>
          ))}
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 50%,rgba(243,198,86,0.06) 0%,transparent 60%)"}}/>
        </div>
        <div style={{position:"relative",zIndex:1,maxWidth:540,width:"100%",display:"flex",flexDirection:"column",gap:14,textAlign:"center"}}>
          <div style={{fontFamily:V,fontSize:72,animation:"bvFloat 2s ease infinite",lineHeight:1}}>🏆</div>
          <div style={{fontFamily:P,fontSize:isM?"clamp(13px,5vw,20px)":"clamp(15px,3vw,22px)",color:GOLD,animation:"bvScale 0.6s ease,bvGlowGold 2s 0.6s ease infinite",lineHeight:1.5}}>DUNGEON CLEARED</div>
          <div style={{fontFamily:P,fontSize:"8px",color:G,animation:"bvFade 0.7s 0.3s ease both"}}>{blueprint&&blueprint.dungeonName}</div>
          <div style={{fontFamily:V,fontSize:isM?19:23,color:TX,lineHeight:1.6,padding:"0 8px",animation:"bvFade 0.7s 0.5s ease both"}}>
            {victoryBossName} lies broken. {hero&&hero.name} walks out carrying nothing but scars and the silence of an empty vault.
          </div>
          <div style={{ background:CARD,border:`2px solid ${BD}`,boxShadow:"0 0 14px rgba(192,64,255,0.1)",padding:isM?10:14,textAlign:"left",animation:"bvFade 0.7s 0.7s ease both",borderColor:`rgba(243,198,86,0.4)`}}>
            <div style={{fontFamily:P,fontSize:"7px",color:GOLD,marginBottom:10}}>RUN COMPLETE</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {hero&&blueprint&&[["HERO",hero.name],["CLASS",`${hero.cls.icon} ${hero.cls.name}`],["RACE",`${hero.race.icon} ${hero.race.name}`],["ROOMS",`${blueprint.totalRooms} cleared`],["HP LEFT",`${hero.hp}/${hero.maxHp}`],["DUNGEON",blueprint.dungeonName]].map(([k,v])=>(
                <div key={k}>
                  <div style={{fontFamily:P,fontSize:5,color:TM}}>{k}</div>
                  <div style={{fontFamily:V,fontSize:isM?17:21,color:TX}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={hardReset} style={{ fontFamily:P,fontSize:isM?"7px":"9px",background:"rgba(192,64,255,0.12)",color:TX,border:`2px solid ${G}`,padding:isM?"9px 8px":"11px 12px",cursor:"pointer",textAlign:"left",width:"100%",lineHeight:1.5,transition:"border-color 0.2s,background 0.2s",textAlign:"center",padding:"14px",fontSize:"10px",animation:"bvGlowGold 1.5s ease infinite,bvFade 0.7s 0.9s ease both",borderColor:GOLD,color:GOLD}}>[ BEGIN A NEW RUN ]</button>
        </div>
      </div>
    );
  }

  if(phase==="death") return(
    <div style={{minHeight:"100vh",background:"#060002",display:"flex",alignItems:"center",justifyContent:"center",padding:16,position:"relative",overflow:"hidden"}}>
      <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse at center,rgba(255,77,120,0.08) 0%,transparent 65%)",pointerEvents:"none"}}/>
      <div style={{position:"fixed",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,77,120,0.03) 2px,rgba(255,77,120,0.03) 4px)",pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:1,maxWidth:480,width:"100%",display:"flex",flexDirection:"column",gap:13,textAlign:"center"}}>
        <div style={{fontFamily:V,fontSize:80,lineHeight:1,animation:"deathSink 3.5s 0.3s ease forwards",display:"inline-block"}}>💀</div>
        <div style={{fontFamily:P,fontSize:isM?"clamp(13px,5vw,19px)":"clamp(14px,3vw,21px)",color:RED,lineHeight:1.5,animation:"bvFade 0.6s 0.2s ease both"}}>YOU HAVE FALLEN</div>
        <div style={{fontFamily:P,fontSize:"7px",color:"rgba(255,77,120,0.55)",animation:"bvFade 0.6s 0.4s ease both"}}>{blueprint&&blueprint.dungeonName} claims another soul.</div>
        <div style={{fontFamily:V,fontSize:isM?19:23,color:"rgba(212,240,232,0.6)",lineHeight:1.6,padding:"0 8px",animation:"bvFade 0.6s 0.6s ease both"}}>
          {hero&&hero.name} is swallowed by the dark. The vault closes. All progress is gone.
        </div>
        <div style={{background:"rgba(255,77,120,0.05)",border:`2px solid rgba(255,77,120,0.22)`,padding:16,animation:"bvFade 0.6s 0.8s ease both"}}>
          <div style={{fontFamily:P,fontSize:"7px",color:RED,marginBottom:8}}>RUN ENDED — ALL PROGRESS LOST</div>
          <div style={{fontFamily:V,fontSize:isM?17:21,color:"rgba(212,240,232,0.5)"}}>No save. No second chance. The next adventurer enters blind, as it should be.</div>
        </div>
        <button onClick={hardReset} style={{ fontFamily:P,fontSize:isM?"7px":"9px",background:"rgba(14,6,32,0.9)",color:TX,border:`2px solid ${BD}`,padding:isM?"9px 8px":"11px 12px",cursor:"pointer",textAlign:"left",width:"100%",lineHeight:1.5,transition:"border-color 0.2s,background 0.2s",border:`2px solid ${RED}`,background:"rgba(255,77,120,0.07)",color:RED,textAlign:"center",padding:"13px",fontSize:"9px",animation:"bvGlowRed 1.5s ease infinite,bvFade 0.6s 1s ease both"}}>[ START FRESH ]</button>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <button onClick={hardReset} style={{ fontFamily:P,fontSize:isM?"7px":"9px",background:"rgba(192,64,255,0.12)",color:TX,border:`2px solid ${G}`,padding:isM?"9px 8px":"11px 12px",cursor:"pointer",textAlign:"left",width:"100%",lineHeight:1.5,transition:"border-color 0.2s,background 0.2s",width:"auto",padding:"12px 20px"}}>[ RELOAD ]</button>
    </div>
  );
}

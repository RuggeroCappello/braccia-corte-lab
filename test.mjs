/* Test di comportamento senza DOM, Canvas, librerie o server.
   Eseguire: node test.mjs. Ogni scenario usa gli stessi tick 60 Hz del browser. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const Game = require('./game.js');
const Level = require('./level.js');
const { C } = Game;
const results = [];
const measurements = {};
function test(name, fn) {
  try { fn(); results.push({ name, pass: true }); console.log(`✓ ${name}`); }
  catch (error) { results.push({ name, pass: false, error: error.message }); console.error(`✗ ${name}\n  ${error.stack}`); }
}
function tick(s, input = {}, n = 1) {
  const events = [];
  for (let k = 0; k < n; k++) {
    Game.step(s, k ? { ...input, jumpPressed: false, abilityPressed: false } : input);
    events.push(...s.events);
  }
  return events;
}
function fixture({ floor = true } = {}) {
  const s = Game.create({ mode: 'playing' });
  s.mode = 'playing';
  Object.assign(s.level, { width: 6000, spawn: { x: 40, y: 394 }, solids: floor ? [{ x: 0, y: 440, w: 6000, h: 100, kind: 'ground' }] : [], hazards: [], coins: [], enemies: [], gates: [], moving: [], checkpoints: [], signs: [] });
  s.boss.active = false;
  Object.assign(s.player, { x: 100, y: 394, vx: 0, vy: 0, grounded: false, invuln: 0, dead: 0, dash: 0, cooldown: 0, coyote: 0, jumpBuffer: 0 });
  return s;
}
function setPlayer(s, values) { Object.assign(s.player, values); }
function flight(holdTicks = 120) {
  const s = fixture(); tick(s, { right: true, run: true }, 12);
  const start = { x: s.player.x, y: s.player.y }; let minY = start.y, land;
  for (let k = 0; k < 120; k++) {
    tick(s, { right: true, run: true, jump: k < holdTicks, jumpPressed: k === 0 });
    minY = Math.min(minY, s.player.y);
    if (k > 1 && s.player.grounded) { land = k + 1; break; }
  }
  assert.ok(land, 'Il salto deve tornare sul pavimento entro 2 s');
  return { height: start.y - minY, range: s.player.x - start.x, seconds: land * C.DT };
}
function tax(x = 250) { return { type: 'tax', x, y: 396, w: 30, h: 44, originX: x, minX: x - 30, maxX: x + 30, vx: 0, alive: true, passed: false, phase: 'walk', timer: 0, facing: 1 }; }
function libo(x = 250) { return { ...tax(x), type: 'libo', y: 388, w: 44, h: 52 }; }
function floorIntervals(level) {
  const blocks = level.solids.filter(b => b.kind === 'ground' && b.y === 440).sort((a,b) => a.x - b.x);
  const merged = [];
  for (const b of blocks) {
    const previous = merged.at(-1);
    if (previous && b.x <= previous.end + .01) previous.end = Math.max(previous.end, b.x + b.w);
    else merged.push({ start: b.x, end: b.x + b.w });
  }
  return merged;
}

test('Contratto pubblico e stato iniziale: titolo, tre vite, due checkpoint', () => {
  for (const name of ['create', 'step', 'start', 'restart', 'teleportSection', 'toggleDebug']) assert.equal(typeof Game[name], 'function', name);
  const s = Game.create(); assert.equal(s.mode, 'title'); assert.equal(s.lives, 3);
  assert.equal(s.level.checkpoints.length, 2); assert.equal(s.level.gates.length, 2);
  assert.equal(C.DT, 1 / 60); Game.start(s); assert.equal(s.mode, 'playing');
});

test('Accelerazione, frenata e velocità massima coerenti a 60 Hz', () => {
  const s = fixture(); tick(s, { right: true });
  assert.ok(s.player.vx > 0 && s.player.vx < C.WALK_SPEED);
  tick(s, { right: true, run: true }, 60); assert.equal(s.player.vx, C.RUN_SPEED);
  const x = s.player.x; tick(s, {}, 30);
  assert.equal(s.player.vx, 0); assert.ok(s.player.x > x && s.player.x - x < 60);
});

test('Salto misurato: altezza, gittata e pressione variabile', () => {
  const high = flight(), short = flight(1);
  const idealHeight = C.JUMP_SPEED ** 2 / (2 * C.GRAVITY);
  const idealRange = 2 * C.JUMP_SPEED / C.GRAVITY * C.RUN_SPEED;
  assert.ok(Math.abs(high.height - idealHeight) < 8, `${high.height} contro ${idealHeight}`);
  assert.ok(Math.abs(high.range - idealRange) < C.RUN_SPEED * C.DT * 3);
  assert.ok(high.height > short.height * 1.7, 'Rilasciare il salto deve ridurne sensibilmente l’altezza');
  measurements.jump = { idealHeight, idealRange, measured: high, short };
});

test('Coyote time: salto entro 100 ms, nessun salto dopo la finestra', () => {
  function leave() { const s = fixture({floor:false}); s.level.solids=[{x:0,y:440,w:200,h:100,kind:'ground'}]; setPlayer(s,{x:199,y:394,vx:C.RUN_SPEED,grounded:true}); tick(s,{right:true,run:true}); return s; }
  const s = leave(); tick(s, { right:true,run:true }, 2); tick(s,{right:true,run:true,jump:true,jumpPressed:true});
  assert.ok(s.player.vy < -400, 'Salto ancora accettato tre tick dopo il bordo');
  const late=leave(); tick(late,{right:true,run:true},9); tick(late,{jump:true,jumpPressed:true});
  assert.ok(late.player.vy > 0, 'Non deve esserci doppio salto oltre il coyote time');
});

test('Jump buffer: pressione poco prima dell’atterraggio viene eseguita', () => {
  const s=fixture(); setPlayer(s,{y:381,vy:120,grounded:false,coyote:0});
  const events=tick(s,{jump:true,jumpPressed:true},10);
  assert.ok(events.some(e=>e.type==='jump')); assert.ok(s.player.vy<0);
});

test('Ogni varco reale è saltato con margine, senza usare E', () => {
  const original=Level.build(), intervals=floorIntervals(original);
  const gaps=intervals.slice(1).map((b,i)=>({from:intervals[i].end,to:b.start,width:b.start-intervals[i].end}));
  assert.equal(gaps.length,7,'Il conteggio nasce dai solidi, non dalle annotazioni requiredJumps');
  const max=flight().range, measured=[];
  for(const gap of gaps){
    assert.ok(max-gap.width>=40,`Margine insufficiente: varco ${gap.from} largo ${gap.width}`);
    const s=Game.create({mode:'playing'}); s.mode='playing'; s.level.enemies=[];s.level.coins=[];s.level.gates=[];s.boss.active=false;
    setPlayer(s,{x:gap.from-50,y:394,vx:C.RUN_SPEED,vy:0,grounded:true,coyote:C.COYOTE});
    let landed=false;
    for(let n=0;n<70;n++){
      tick(s,{right:true,run:true,jump:true,jumpPressed:n===0});
      assert.equal(s.lives,3,`Pericolo toccato al varco x=${gap.from}`);
      if(s.player.grounded&&s.player.x>=gap.to){landed=true;break;}
    }
    assert.ok(landed,`Il varco x=${gap.from} non è stato attraversato e completato`);
    measured.push({...gap,flightMargin:max-gap.width,landedX:s.player.x});
  }
  measurements.requiredGaps=measured;
});

test('Atterraggio su piattaforma e piattaforma mobile che trasporta il giocatore',()=>{
  const s=fixture();s.level.solids.push({x:80,y:360,w:180,h:14,kind:'platform'});setPlayer(s,{x:110,y:240,vy:0});tick(s,{},60);
  assert.equal(s.player.y,360-s.player.h);assert.equal(s.player.grounded,true);
  const m=fixture();m.level.moving=[{x:100,y:360,w:100,h:15,originX:100,originY:360,range:42,speed:1.25,phase:0,axis:'x',dx:0,dy:0}];setPlayer(m,{x:130,y:280,vy:0});
  tick(m,{},30);assert.equal(m.player.y,360-m.player.h); const p0=m.player.x, m0=m.level.moving[0].x;
  tick(m,{},25);const pd=m.player.x-p0, md=m.level.moving[0].x-m0;
  assert.ok(Math.abs(md)>3);assert.ok(Math.abs(pd-md)<2,`Trasporto incoerente: player ${pd}, piattaforma ${md}`);
});

test('Spesa letale, tre vite, respawn e game over',()=>{
  const s=fixture({floor:false});s.level.solids=[{x:0,y:440,w:100,h:100,kind:'ground'},{x:240,y:440,w:1000,h:100,kind:'ground'}];s.level.hazards=[{x:100,y:447,w:140,h:100,kind:'spend'}];
  for(let remaining=2;remaining>=0;remaining--){
    setPlayer(s,{x:145,y:420,vy:200,vx:0,invuln:0,dead:0});tick(s,{},2);
    assert.equal(s.lives,remaining);
    if(remaining){tick(s,{},100);assert.equal(s.mode,'playing');assert.ok(s.player.x<100,'Respawn nella partenza sicura');}
  }
  assert.equal(s.mode,'gameover');
});

test('Due checkpoint reali e respawn all’ultimo raggiunto',()=>{
  const s=Game.create({mode:'playing'});s.mode='playing';s.level.enemies=[];
  for(const cp of s.level.checkpoints){setPlayer(s,{x:cp.x,y:394,vx:0,vy:0,invuln:0,dead:0});tick(s);assert.equal(s.checkpoint,cp.id);assert.equal(cp.active,true);}
  const cp=s.level.checkpoints.at(-1);setPlayer(s,{x:cp.x+100,y:700,invuln:0});tick(s,{},100);
  assert.equal(s.lives,2);assert.ok(Math.abs(s.player.x-cp.x)<100);assert.equal(s.checkpoint,2);
});

test('Raccolta una sola volta: denaro, punteggio e feedback',()=>{
  const s=fixture();s.level.coins=[{x:105,y:405,w:20,h:20,collected:false}];const before={money:s.money,score:s.score};
  const ev=tick(s);assert.equal(s.level.coins[0].collected,true);assert.ok(s.money>before.money);assert.ok(s.score>before.score);assert.ok(ev.some(e=>e.type==='coin'));
  const after={money:s.money,score:s.score};tick(s,{},20);assert.equal(s.money,after.money);assert.equal(s.score,after.score);
});

test('Uomo delle tasse schiacciato dall’alto con rimbalzo',()=>{
  const s=fixture();const e=tax();s.level.enemies=[e];setPlayer(s,{x:e.x,y:e.y-s.player.h-6,vy:300,grounded:false});
  const ev=tick(s,{},3);assert.equal(e.alive,false);assert.ok(s.player.vy<0);assert.equal(s.lives,3);assert.ok(ev.some(e=>e.type==='stomp'));
});

test('Libo resiste allo stomp ma viene sconfitto dallo Scatto Tirchio',()=>{
  const s=fixture();const e=libo();s.level.enemies=[e];setPlayer(s,{x:e.x,y:e.y-s.player.h-6,vy:300,grounded:false});tick(s,{},3);assert.equal(e.alive,true);assert.equal(s.lives,2,'Libo non è sicuro da schiacciare');
  const a=fixture();const target=libo();a.level.enemies=[target];setPlayer(a,{x:target.x-60,facing:1,grounded:true});const ev=tick(a,{right:true,abilityPressed:true},20);
  assert.equal(target.alive,false);assert.equal(a.lives,3);assert.ok(ev.some(e=>e.type==='dash'));
});

test('Superare nemici aumenta risparmio e moltiplicatore una sola volta',()=>{
  const s=fixture();const e=tax(170);s.level.enemies=[e];setPlayer(s,{x:100,y:240,vx:C.RUN_SPEED,vy:0});const money=s.money; const multi=s.multiplier;
  tick(s,{right:true,run:true},30);assert.equal(e.passed,true);assert.ok(s.money>money);assert.ok(s.multiplier>multi);
  const after=s.multiplier;setPlayer(s,{x:100,y:200,vx:C.RUN_SPEED,vy:0});tick(s,{right:true,run:true},30);assert.equal(s.multiplier,after);
});

test('Entrambe le barriere reali richiedono E e si aprono con E',()=>{
  for(const source of Level.build().gates){
    const s=fixture();const gate={...source};s.level.width=9440;s.level.solids=[{x:0,y:440,w:9440,h:100,kind:'ground'}];s.level.gates=[gate];
    setPlayer(s,{x:gate.x-80,grounded:true});tick(s,{right:true,run:true},80);
    assert.equal(gate.open,false);assert.ok(s.player.x+s.player.w<=gate.x+.1,'La corsa non attraversa la barriera');
    const ev=tick(s,{right:true,abilityPressed:true},30);assert.equal(gate.open,true);assert.ok(s.player.x>gate.x+gate.w);assert.ok(ev.some(e=>e.type==='gate'));
  }
});

test('Danno al boss con cocco riflesso; nessun danno da semplice contatto',()=>{
  const s=Game.create({mode:'playing'});s.mode='playing';Game.teleportSection(s,2);const b=s.boss;
  b.active=true;b.phase='recover';b.timer=10;setPlayer(s,{x:b.x-250,y:394,grounded:true,facing:1,invuln:0});
  const hp=b.hp;s.projectiles=[{type:'coconut',x:s.player.x+48,y:408,w:30,h:30,vx:-260,vy:0,timer:10,reflected:false,alive:true}];
  const ev=tick(s,{right:true,abilityPressed:true},45);
  assert.ok(ev.some(e=>e.type==='reflect'),'Il cocco deve essere respinto da E');assert.ok(b.hp<hp);assert.ok(ev.some(e=>e.type==='bossHit'));
  const touch=Game.create({mode:'playing'});Game.teleportSection(touch,2);touch.boss.active=true;touch.boss.phase='recover';touch.boss.timer=10;touch.debug.invincible=true;
  setPlayer(touch,{x:touch.boss.x+10,y:394,grounded:true});const initialHP=touch.boss.hp;tick(touch,{},10);assert.equal(touch.boss.hp,initialHP,'Toccare il boss non gli fa danno');
});

test('Boss: preavviso cocco, preavviso sigaro, esplosione differita',()=>{
  const s=Game.create({mode:'playing'});s.mode='playing';Game.teleportSection(s,2);const b=s.boss;s.debug.invincible=true;setPlayer(s,{x:s.level.arena.trigger+20,y:394});
  const history=[];
  for(let k=0;k<1500;k++){tick(s);for(const e of s.events)history.push({type:e.type,value:e.value,tick:k});}
  const coconut=history.find(e=>e.type==='coconut'),cigar=history.find(e=>e.type==='cigar'),blast=history.find(e=>e.type==='explosion');
  assert.ok(coconut&&cigar&&blast,'Entrambi gli attacchi devono essere eseguiti');
  assert.ok(history.some(e=>e.type==='bossWindup'&&e.value==='coconut'&&e.tick<coconut.tick-40));
  assert.ok(history.some(e=>e.type==='bossWindup'&&e.value==='cigar'&&e.tick<cigar.tick-50));
  assert.ok(blast.tick>cigar.tick+10,'Il sigaro deve lasciare tempo di evitare il bersaglio');
  measurements.bossFirstAttacks={coconut:coconut.tick*C.DT,cigar:cigar.tick*C.DT,explosion:blast.tick*C.DT};
});

test('Vittoria attraverso sei cocchi riflessi, con punteggio e tempo',()=>{
  const s=Game.create({mode:'playing'});s.mode='playing';Game.teleportSection(s,2);const b=s.boss;s.debug.invincible=true;
  const seen=[];
  for(let h=0;h<b.maxHp;h++){
    b.active=true;b.phase='recover';b.timer=10;b.flash=0;setPlayer(s,{x:b.x-250,y:394,vx:0,vy:0,grounded:true,facing:1,dash:0,cooldown:0});
    s.projectiles=[{type:'coconut',x:s.player.x+48,y:408,w:30,h:30,vx:-260,vy:0,timer:10,reflected:false,alive:true}];
    seen.push(...tick(s,{right:true,abilityPressed:true},55));
  }
  assert.equal(b.hp,0);assert.equal(s.mode,'victory');assert.ok(s.score>0);assert.ok(s.time>0);assert.ok(seen.some(e=>e.type==='victory'));
});

test('Demo: sezioni 1/2/3, hitbox e invincibilità indicano DEBUG',()=>{
  const s=Game.create({mode:'playing'});s.mode='playing';
  for(let section=0;section<3;section++){Game.teleportSection(s,section);assert.equal(s.section,section);assert.equal(s.debug.active,true);}
  Game.toggleDebug(s,'hitboxes');assert.equal(s.debug.hitboxes,true);Game.toggleDebug(s,'invincible');assert.equal(s.debug.invincible,true);
  const lives=s.lives;setPlayer(s,{y:700});tick(s,{},2);assert.equal(s.lives,lives);
});


test('Simulazione deterministica: gli stessi input producono esattamente lo stesso stato',()=>{
  const a=Game.create({mode:'playing'}), b=Game.create({mode:'playing'});
  for(let n=0;n<1800;n++){
    const input={right:n%600<500,left:n%600>=500,run:true,jump:n%70<35,jumpPressed:n%70===0,abilityPressed:n%100===0};
    Game.step(a,input);Game.step(b,input);
  }
  assert.deepEqual(a,b);
});

test('Pausa e stati terminali fermano tempo e logica',()=>{
  for(const mode of ['title','paused','gameover','victory']){
    const s=Game.create();s.mode=mode;const time=s.time,x=s.player.x;
    tick(s,{right:true,run:true,jump:true,jumpPressed:true,abilityPressed:true},60);
    assert.equal(s.time,time);assert.equal(s.player.x,x);assert.equal(s.mode,mode);
  }
});


test('Ultimo tick dello scatto: Libo è sconfitto senza perdere una vita',()=>{
  const s=fixture();const e=libo(300);s.level.enemies=[e];setPlayer(s,{x:100,y:394,facing:1,grounded:true});
  tick(s,{right:true,abilityPressed:true},15);
  assert.equal(e.alive,false);assert.equal(s.lives,3);
});

test('Percorso completo: solo input, nessun teleport/debug, entrambi checkpoint e vittoria',()=>{
  const s=Game.create({mode:'playing'}),intervals=floorIntervals(s.level);
  const gaps=intervals.slice(1).map((b,i)=>({from:intervals[i].end,to:b.start}));
  let jumps=0,dashes=0;const checkpoints=[];
  for(let n=0;n<60*180&&s.mode==='playing';n++){
    const p=s.player,b=s.boss,input={right:true,jump:true};
    if(b.active){
      let goal=b.x-390;
      if(b.phase==='cigar-windup'||b.phase==='cigar')goal=b.targetX>b.x-420?b.x-605:b.x-255;
      input.right=p.x<goal-8;input.left=p.x>goal+8;input.jump=false;
      const coconut=s.projectiles.find(q=>q.type==='coconut'&&!q.reflected&&q.alive&&q.x>p.x&&q.x-(p.x+p.w)<90);
      if(coconut&&p.cooldown<=0){input.right=true;input.left=false;input.abilityPressed=true;}
    }else{
      const gap=gaps.find(g=>g.to>p.x);
      input.run=!!(gap&&gap.from-p.x<155&&gap.to>p.x);
      if(gap&&gap.from-p.x<53&&gap.from-p.x>-10&&p.grounded)input.jumpPressed=true;
      const enemy=s.level.enemies.find(e=>e.alive&&e.x>p.x-10&&e.x-p.x<100);
      const gate=s.level.gates.find(g=>!g.open&&g.x>p.x&&g.x-p.x<100);
      if(((enemy&&enemy.type==='libo')||gate)&&p.cooldown<=0)input.abilityPressed=true;
      if(enemy&&enemy.type==='tax'&&p.grounded)input.jumpPressed=true;
    }
    if(input.jumpPressed)jumps++;if(input.abilityPressed)dashes++;
    Game.step(s,input);
    for(const e of s.events)if(e.type==='checkpoint')checkpoints.push(s.checkpoint);
  }
  assert.equal(s.mode,'victory');assert.equal(s.debug.active,false);assert.equal(s.debug.invincible,false);
  assert.equal(s.lives,3);assert.deepEqual(checkpoints,[1,2]);assert.ok(s.level.gates.every(g=>g.open));assert.equal(s.boss.hp,0);
  measurements.fullRun={seconds:s.time,lives:s.lives,score:s.score,money:s.money,jumps,dashes,checkpoints,note:'Bot con reazione immediata: misura di fattibilità, non misura del giocatore medio.'};
});

test('Demo dopo game over: nuova sezione con tre vite e tempo azzerato',()=>{
  const s=Game.create({mode:'playing'});s.mode='gameover';s.lives=0;s.time=90;
  Game.teleportSection(s,1);
  assert.equal(s.mode,'playing');assert.equal(s.lives,3);assert.equal(s.time,0);
  assert.equal(s.section,1);assert.equal(s.debug.active,true);
  setPlayer(s,{y:700,invuln:0});tick(s);
  assert.equal(s.lives,2,'La prima morte demo non deve portare le vite sotto zero');
});

const passed=results.filter(r=>r.pass).length;
const root=path.dirname(fileURLToPath(import.meta.url));fs.mkdirSync(path.join(root,'qa'),{recursive:true});
fs.writeFileSync(path.join(root,'qa','test-report.json'),JSON.stringify({passed,total:results.length,measurements,results},null,2)+'\n');
console.log(`\n${passed}/${results.length} verifiche superate. Misure: qa/test-report.json`);
if(measurements.jump)console.log(`Salto: ${measurements.jump.measured.height.toFixed(1)} px in alto, ${measurements.jump.measured.range.toFixed(1)} px in corsa; varco massimo 160 px.`);
if(passed!==results.length)process.exitCode=1;

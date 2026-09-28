/* Logica pura e deterministica: nessun DOM, Canvas, audio o orologio reale.
   step() = esattamente 1/60 s. Tutti gli effetti passano per state.events. */
(function(root){
  'use strict';
  const Level=typeof module!=='undefined'&&module.exports?require('./level.js'):root.BracciaLevel;
  const C=Object.freeze({DT:1/60,GRAVITY:1700,JUMP_SPEED:600,JUMP_CUT:240,WALK_SPEED:210,RUN_SPEED:320,ACCEL:2100,FRICTION:2400,PLAYER_W:30,PLAYER_H:46,COYOTE:.1,BUFFER:.1,DASH_SPEED:700,DASH_TIME:.24,DASH_COOLDOWN:1.05,MAX_FALL:850});
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
  const horizontal=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x;
  const toward=(a,b,d)=>a+clamp(b-a,-d,d);
  function playerAt(pos){return {x:pos.x,y:pos.y,w:C.PLAYER_W,h:C.PLAYER_H,vx:0,vy:0,facing:1,grounded:false,coyote:0,jumpBuffer:0,invuln:0,dash:0,cooldown:0,dead:0,bounce:0,support:-1};}
  function bossAt(level){return {x:level.width-400,y:328,w:100,h:112,hp:6,maxHp:6,active:false,phase:'idle',timer:1.15,facing:-1,flash:0,attackCount:0,targetX:0};}
  function create(options={}){
    const level=Level.build();
    return {mode:options.mode||'title',level,player:playerAt(level.spawn),time:0,tick:0,events:[],camera:{x:0,y:0},debug:{hitboxes:false,invincible:false,active:false},lives:3,score:0,money:0,multiplier:1,checkpoint:0,section:0,boss:bossAt(level),projectiles:[],shake:0,toast:'',toastTime:0,collected:0,defeated:0,bestCombo:1,deathReason:'',lastSafe:{...level.spawn}};
  }
  function emit(s,type,x=s.player.x,y=s.player.y,value){s.events.push({type,x,y,value});}
  function toast(s,text,time=2.2){s.toast=text;s.toastTime=time;}
  function start(s){if(s.mode==='title'){s.mode='playing';toast(s,'Fatto in casa. Nessun abbonamento.',2.8);}}
  function restart(s){const fresh=create({mode:'playing'});Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,fresh);toast(s,'Nuova partita. Portafoglio salvo.');return s;}
  function toggleDebug(s,key){if(key==='hitboxes'||key==='invincible')s.debug[key]=!s.debug[key];s.debug.active=s.debug.hitboxes||s.debug.invincible||!!s.debug.usedTeleport;}
  function teleportSection(s,index){
    if(s.mode==='gameover'||s.mode==='victory'||s.lives<=0)restart(s);
    index=clamp(Math.floor(index),0,2);const section=s.level.sections[index];
    s.mode='playing';s.player=playerAt(section.spawn);s.player.invuln=1;s.checkpoint=index;s.section=index;s.camera.x=clamp(section.x,0,s.level.width-960);s.projectiles=[];s.boss=bossAt(s.level);s.events=[];s.debug.usedTeleport=true;s.debug.active=true;
    for(const cp of s.level.checkpoints)cp.active=cp.id<=index;toast(s,'DEMO · '+section.name,2.5);
  }
  function respawn(s){
    const cp=s.level.checkpoints.find(c=>c.id===s.checkpoint);
    const pos=cp?{x:cp.x-1,y:440-C.PLAYER_H}:s.level.spawn;
    s.player=playerAt(pos);s.player.invuln=1.25;s.projectiles=[];s.boss=bossAt(s.level);s.lastSafe={...pos};
    s.camera.x=clamp(pos.x-240,0,s.level.width-960);emit(s,'respawn');
  }
  function hurt(s,reason,ignoreInvuln=false){
    const p=s.player;if(p.dead>0||s.mode!=='playing'||s.debug.invincible||(!ignoreInvuln&&p.invuln>0))return false;
    s.lives--;s.multiplier=1;s.deathReason=reason;s.shake=11;p.invuln=2;p.dash=0;p.vx=0;p.vy=-160;emit(s,'hurt');
    if(s.lives<=0){s.mode='gameover';emit(s,'gameover');}else{p.dead=.72;toast(s,reason+' · Ti riprendi al checkpoint.',2.7);}return true;
  }
  function rewardEnemy(s,e,kind){
    if(!e.passed){e.passed=true;s.multiplier=Math.min(8,s.multiplier+1);s.bestCombo=Math.max(s.bestCombo,s.multiplier);const value=10*s.multiplier;s.money+=value;s.score+=value*10;emit(s,'pass',e.x,e.y,value);toast(s,'RISPARMIATO! ×'+s.multiplier+' · +'+value+' €',1.4);}
    if(kind){s.defeated++;emit(s,kind,e.x+e.w/2,e.y,100);s.score+=100;}
  }
  function updateMoving(s){
    for(const m of s.level.moving){const oldX=m.x,oldY=m.y;const v=Math.sin(s.time*m.speed+m.phase)*m.range;m.x=m.originX+(m.axis==='x'?v:0);m.y=m.originY+(m.axis==='y'?v:0);m.dx=m.x-oldX;m.dy=m.y-oldY;}
    const p=s.player,m=s.level.moving[p.support];if(m&&p.grounded){p.x+=m.dx;p.y+=m.dy;}
  }
  function movePlayer(s,i){
    const p=s.player,dt=C.DT,wasGrounded=p.grounded;
    p.invuln=Math.max(0,p.invuln-dt);p.cooldown=Math.max(0,p.cooldown-dt);p.bounce=Math.max(0,p.bounce-dt);
    p.coyote=p.grounded?C.COYOTE:Math.max(0,p.coyote-dt);
    p.jumpBuffer=i.jumpPressed?C.BUFFER:Math.max(0,p.jumpBuffer-dt);
    const dir=(i.right?1:0)-(i.left?1:0);if(dir&&p.dash<=0)p.facing=dir;
    if(i.abilityPressed&&p.cooldown<=0){p.dash=C.DASH_TIME;p.cooldown=C.DASH_COOLDOWN;p.vy=0;emit(s,'dash');}
    if(p.dash>0){p.vx=p.facing*C.DASH_SPEED;p.vy=0;}
    else{
      p.vx=toward(p.vx,dir*(i.run?C.RUN_SPEED:C.WALK_SPEED),(dir?C.ACCEL:C.FRICTION)*dt);
      if(p.jumpBuffer>0&&p.coyote>0){p.vy=-C.JUMP_SPEED;p.jumpBuffer=0;p.coyote=0;p.grounded=false;p.support=-1;emit(s,'jump',p.x+p.w/2,p.y+p.h);}
      if(!i.jump&&p.vy<-C.JUMP_CUT&&p.bounce<=0)p.vy=-C.JUMP_CUT;
      p.vy=Math.min(C.MAX_FALL,p.vy+C.GRAVITY*dt);
    }
    const previousBottom=p.y+p.h;
    p.x+=p.vx*dt;
    for(const gate of s.level.gates){if(!gate.open&&overlap(p,gate)&&p.dash>0){gate.open=true;s.score+=250;emit(s,'gate',gate.x,360);s.shake=5;toast(s,'ABBONAMENTO ANNULLATO · 0,00 €',2);}}
    const walls=s.level.solids.filter(b=>b.kind==='ground').concat(s.level.gates.filter(g=>!g.open));
    for(const b of walls){if(overlap(p,b)){if(p.vx>0)p.x=b.x-p.w;else if(p.vx<0)p.x=b.x+b.w;p.vx=0;}}
    const arena=s.level.arena;
    p.x=clamp(p.x,s.boss&&s.boss.active?arena.left:0,(s.boss&&s.boss.active?arena.right:s.level.width)-p.w);
    p.y+=p.vy*dt;p.grounded=false;p.support=-1;
    const floors=s.level.solids.concat(s.level.moving);
    for(let k=0;k<floors.length;k++){
      const b=floors[k];if(!horizontal(p,b))continue;
      if(p.vy>=0&&previousBottom<=b.y+Math.max(2,b.dy||0)&&p.y+p.h>=b.y){
        p.y=b.y-p.h;p.vy=0;p.grounded=true;p.support=k>=s.level.solids.length?k-s.level.solids.length:-1;
      }else if(b.kind==='ground'&&p.vy<0&&overlap(p,b)){p.y=b.y+b.h;p.vy=0;}
    }
    if(!wasGrounded&&p.grounded){emit(s,'land',p.x+p.w/2,p.y+p.h);if(p.jumpBuffer>0){p.vy=-C.JUMP_SPEED;p.grounded=false;p.jumpBuffer=0;p.coyote=0;p.support=-1;emit(s,'jump',p.x+p.w/2,p.y+p.h);}}
    if(p.grounded)s.lastSafe={x:p.x,y:p.y};
    if(p.y>620){if(s.debug.invincible)respawn(s);else hurt(s,'Hai pagato il conto!',true);}
    for(const h of s.level.hazards)if(overlap(p,h)){hurt(s,'Se spendi, perdi una vita.',true);break;}
    return previousBottom;
  }
  function updateEnemies(s,previousBottom){
    const p=s.player,dt=C.DT;
    for(const e of s.level.enemies){
      if(!e.alive)continue;
      e.timer=Math.max(0,e.timer-dt);
      if(e.type==='libo'){
        const near=Math.abs(p.x-e.x)<180&&Math.abs(p.y-e.y)<110;
        if(e.phase==='walk'&&near){e.phase='windup';e.timer=.7;e.facing=p.x>=e.x?1:-1;}
        if(e.phase==='windup'&&e.timer<=0){e.phase='punch';e.timer=.32;}
        else if(e.phase==='punch'&&e.timer<=0){e.phase='recover';e.timer=1.2;}
        else if(e.phase==='recover'&&e.timer<=0)e.phase='walk';
        if(e.phase==='punch'){
          const fist={x:e.facing>0?e.x+e.w-4:e.x-36,y:e.y+12,w:40,h:25};
          if(overlap(p,fist)&&p.dash<=0)hurt(s,'Libo ha consegnato il progetto. Con un pugno.');
        }
      }
      if(e.phase==='walk'){
        e.x+=e.vx*dt;if(e.x<e.minX){e.x=e.minX;e.vx=Math.abs(e.vx);}if(e.x>e.maxX){e.x=e.maxX;e.vx=-Math.abs(e.vx);}e.facing=e.vx>=0?1:-1;
      }
      if(overlap(p,e)){
        if(p.dash>0){e.alive=false;rewardEnemy(s,e,'stomp');s.shake=4;}
        else if(e.type==='tax'&&p.vy>0&&previousBottom<=e.y+12){e.alive=false;p.y=e.y-p.h;p.vy=-420;p.bounce=.2;p.grounded=false;rewardEnemy(s,e,'stomp');}
        else hurt(s,e.type==='tax'?'L’uomo delle tasse ha presentato il conto.':'Le mani di Libo non sono in garanzia.');
      }
      if(p.x>e.x+e.w+5&&!e.passed&&p.x-e.x<200&&p.y+p.h<=e.y+e.h+12)rewardEnemy(s,e);
    }
  }
  function bossDamage(s,value=1){
    const b=s.boss;if(!b||!b.active||b.hp<=0)return;
    b.hp=Math.max(0,b.hp-value);b.flash=.4;s.shake=14;s.score+=500;emit(s,'bossHit',b.x+b.w/2,b.y+40,value);
    if(b.hp===0){b.phase='defeated';b.active=false;s.mode='victory';s.projectiles=[];s.money+=500;s.score+=5000+Math.max(0,Math.round(180-s.time))*10;toast(s,'DIRETTORE LICENZIATO. PORTAFOGLIO PROMOSSO.',5);emit(s,'victory',b.x,b.y);}
  }
  function spawnCoconut(s){const b=s.boss;s.projectiles.push({type:'coconut',x:b.x-34,y:408,w:32,h:32,vx:-290,vy:0,timer:8,reflected:false,alive:true});emit(s,'coconut',b.x,410);}
  function updateBoss(s){
    const b=s.boss,p=s.player,dt=C.DT;if(!b)return;b.flash=Math.max(0,b.flash-dt);
    if(!b.active&&b.hp>0&&p.x>=s.level.arena.trigger){b.active=true;b.timer=1;b.phase='idle';toast(s,'COCCOBELLO · Premi E contro i cocchi!',3.4);}
    if(!b.active)return;
    b.timer-=dt;
    if(b.phase==='idle'&&b.timer<=0){b.phase='coconut-windup';b.timer=.95;emit(s,'bossWindup',b.x,b.y,'coconut');}
    else if(b.phase==='coconut-windup'&&b.timer<=0){spawnCoconut(s);b.phase='coconut';b.timer=1.9;}
    else if(b.phase==='coconut'&&b.timer<=0){b.phase='cigar-windup';b.timer=1.25;b.targetX=clamp(p.x+p.w/2,s.level.arena.left+60,b.x-80);emit(s,'bossWindup',b.targetX,440,'cigar');}
    else if(b.phase==='cigar-windup'&&b.timer<=0){s.projectiles.push({type:'cigar',x:b.targetX-10,y:180,w:20,h:42,vx:0,vy:390,timer:3,reflected:false,alive:true});emit(s,'cigar',b.targetX,190);b.phase='cigar';b.timer=.95;}
    else if(b.phase==='cigar'&&b.timer<=0){b.phase='recover';b.timer=1.05;}
    else if(b.phase==='recover'&&b.timer<=0){b.phase='idle';b.timer=.2;b.attackCount++;}
    if(overlap(p,b)&&p.dash<=0)hurt(s,'Coccobello vuole riscuotere di persona.');
  }
  function updateProjectiles(s){
    const p=s.player,dt=C.DT;const newly=[];
    for(const q of s.projectiles){
      if(!q.alive)continue;q.timer-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;
      if(q.type==='cigar'&&q.y+q.h>=438){q.alive=false;newly.push({type:'blast',x:q.x+q.w/2-66,y:356,w:132,h:84,vx:0,vy:0,timer:.48,alive:true,reflected:false});s.shake=8;emit(s,'explosion',q.x,425);}
      else if(q.type==='coconut'){
        if(!q.reflected&&overlap(p,q)&&p.dash>0){q.reflected=true;q.vx=640;q.x=Math.max(q.x,p.x+p.w+3);s.score+=50;emit(s,'reflect',q.x,q.y);s.shake=5;}
        else if(!q.reflected&&overlap(p,q)){if(hurt(s,'Investito da un cocco in leasing.'))q.alive=false;}
        if(q.reflected&&s.boss&&overlap(q,s.boss)){q.alive=false;bossDamage(s);}
      }else if(q.type==='blast'&&overlap(p,q)){hurt(s,'Un sigaro dal costo esplosivo.');}
      if(q.timer<=0||q.x<0||q.x>s.level.width)q.alive=false;
    }
    // bossDamage può svuotare la lista in caso di vittoria.
    if(s.mode==='playing')s.projectiles=s.projectiles.filter(q=>q.alive).concat(newly);
  }
  function step(s,i={}){
    s.events=[];if(s.mode!=='playing')return;
    s.time+=C.DT;s.tick++;s.shake=Math.max(0,s.shake-35*C.DT);s.toastTime=Math.max(0,s.toastTime-C.DT);
    if(s.player.dead>0){s.player.dead-=C.DT;if(s.player.dead<=0)respawn(s);return;}
    updateMoving(s);const previousBottom=movePlayer(s,i);
    if(s.player.dead>0||s.mode!=='playing')return;
    for(const coin of s.level.coins)if(!coin.collected&&overlap(s.player,coin)){coin.collected=true;s.collected++;const value=s.multiplier;s.money+=value;s.score+=50*value;emit(s,'coin',coin.x+10,coin.y+10,value);}
    for(const cp of s.level.checkpoints)if(cp.id>s.checkpoint&&overlap(s.player,cp)){s.checkpoint=cp.id;cp.active=true;s.score+=200;emit(s,'checkpoint',cp.x,cp.y);toast(s,'SALVATO IN LOCALE · Checkpoint '+cp.id,2.7);}
    updateEnemies(s,previousBottom);
    if(s.player.dead>0||s.mode!=='playing')return;
    updateBoss(s);updateProjectiles(s);
    // Lo scatto resta attivo per TUTTE le collisioni del tick in cui muove.
    s.player.dash=Math.max(0,s.player.dash-C.DT);
    s.section=s.player.x>=s.level.sections[2].x?2:s.player.x>=s.level.sections[1].x?1:0;
    let cameraTarget=clamp(s.player.x-350+s.player.vx*.22,0,s.level.width-960);
    if(s.boss.active)cameraTarget=clamp(cameraTarget,s.level.arena.left-120,s.level.width-960);
    s.camera.x+=(cameraTarget-s.camera.x)*.085;
  }
  const api={C,create,start,restart,step,teleportSection,toggleDebug,overlap,clamp};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;root.BracciaGame=api;
})(typeof globalThis!=='undefined'?globalThis:this);

/* MAPPA DISEGNATA A MANO — una cella = 40 px; modificare le righe qui sotto.
   # terreno, = piattaforma a senso unico, ~ spesa letale, o moneta,
   S partenza, T tasse (stomp), L Libo (scatto), G abbonamento (E),
   M piattaforma mobile, C checkpoint, B boss. . aria.
   Le tre sezioni si uniscono orizzontalmente. Pavimento: riga 11.
*/
(function(root){
  'use strict';
  const TILE=40;
  const MAPS=[[
    '........................................................................................',
    '........................................................................................',
    '........................................................................................',
    '........................................................................................',
    '........................................................................................',
    '........................................................................................',
    '........................................................................................',
    '........................................................................................',
    '..................ooo......oo..........ooo......oo................oo.............oo.....',
    '.........................=====..........M.....====..............................=====...',
    '..S....ooo..T..................L..o................T..o..G...o...........o...T..........',
    '##################~~~##################~~~#######################~~~~###################',
    '##################~~~##################~~~#######################~~~~###################',
  ],[
    '............................................................................................................',
    '............................................................................................................',
    '............................................................................................................',
    '............................................................................................................',
    '............................................................................................................',
    '............................................................................................................',
    '............................................................................................................',
    '............................................................................................................',
    '..................ooo.....oo.......oo......ooo.............oo.............ooo...........oo......oo..........',
    '...................M.....====.....=====.....M.............====..............M..........====.................',
    '..C...oo...L...o...............T...................o...L........G....o............o...T.............o..L....',
    '##################~~~~#####################~~~~############################~~~~#################~~~#########',
    '##################~~~~#####################~~~~############################~~~~#################~~~#########',
  ],[
    '........................................',
    '........................................',
    '........................................',
    '........................................',
    '........................................',
    '........................................',
    '........................................',
    '........................................',
    '........................................',
    '...............===.......===............',
    '..C...o.o.o...................B.........',
    '########################################',
    '########################################',
  ]];
  const SECTIONS=[
    {name:'I CARUGGI',subtitle:'Ogni centesimo è un’avventura.',x:0,width:3520,spawn:{x:90,y:394}},
    {name:'SOPRA I TETTI',subtitle:'Sale la città. Anche il moltiplicatore.',x:3520,width:4320,spawn:{x:3604,y:394}},
    {name:'PORTO COCCOBELLO',subtitle:'L’ultimo conto lo paga il direttore.',x:7840,width:1600,spawn:{x:7924,y:394}}
  ];
  function build(){
    const level={width:9440,height:540,spawn:{...SECTIONS[0].spawn},solids:[],hazards:[],coins:[],enemies:[],gates:[],moving:[],checkpoints:[],signs:[],sections:SECTIONS.map(s=>({...s,spawn:{...s.spawn}})),requiredJumps:[],arena:{left:8320,right:9360,trigger:8440}};
    let offset=0,gateId=0,checkpointId=0;
    MAPS.forEach((rows,section)=>{
      if(rows.some(r=>r.length!==rows[0].length))throw new Error('Larghezza ASCII incoerente nella sezione '+section);
      rows.forEach((row,iy)=>[...row].forEach((ch,ix)=>{
        const x=offset+ix*TILE,y=iy*TILE;
        if(ch==='#')level.solids.push({x,y,w:TILE,h:TILE,kind:'ground'});
        if(ch==='=')level.solids.push({x,y,w:TILE,h:14,kind:'platform'});
        if(ch==='~'&&iy===11)level.hazards.push({x,y:y+7,w:TILE,h:93,kind:'spend'});
        if(ch==='o')level.coins.push({x:x+10,y:y+10,w:20,h:20,collected:false});
        if(ch==='G')level.gates.push({x:x+10,y:0,w:28,h:440,open:false,id:++gateId});
        if(ch==='C')level.checkpoints.push({x:x+10,y:360,w:30,h:80,id:++checkpointId,active:false});
        if(ch==='M')level.moving.push({x:x-20,y:y+12,w:100,h:15,originX:x-20,originY:y+12,range:42,speed:1.25,phase:section,axis:'x',dx:0,dy:0});
        if(ch==='T'||ch==='L'){
          const type=ch==='T'?'tax':'libo',w=type==='tax'?30:44,h=type==='tax'?44:52;
          level.enemies.push({type,x:x+4,y:440-h,w,h,originX:x+4,minX:x-42,maxX:x+54,vx:type==='tax'?35:25,alive:true,passed:false,phase:'walk',timer:0,facing:1});
        }
      }));
      // Deriva i salti obbligatori dai buchi effettivi della riga di terreno.
      const ground=rows[11];let start=-1;
      for(let ix=0;ix<=ground.length;ix++){
        if(ground[ix]==='~'&&start<0)start=ix;
        if(ground[ix]!=='~'&&start>=0){level.requiredJumps.push({section,from:offset+start*TILE,to:offset+ix*TILE,width:(ix-start)*TILE,rise:0,label:'Varco '+(level.requiredJumps.length+1)});start=-1;}
      }
      offset+=rows[0].length*TILE;
    });
    level.signs=[
      {x:120,y:292,text:'GENOVA, ORE 18:04',sub:'Un’altra app fatta in casa. Un altro abbonamento evitato.'},
      {x:480,y:295,text:'LE TASSE? SALTACI SOPRA.',sub:'SPAZIO tenuto = salto più alto • SHIFT = rincorsa'},
      {x:1060,y:257,text:'LIBO HA LE MANI PESANTI',sub:'Evitalo o premi E per lo Scatto Tirchio.'},
      {x:1930,y:250,text:'ABBONAMENTO IN VISTA',sub:'E attraversa la barriera • Nessun centesimo speso.'},
      {x:2820,y:254,text:'SUPERALI. RISPARMIA.',sub:'Ogni nemico superato aumenta il tuo moltiplicatore.'},
      {x:3680,y:275,text:'IL CONTO SALE. TU PURE.',sub:'Le piattaforme mobili possono darti un passaggio.'},
      {x:5760,y:256,text:'UN ALTRO RINNOVO AUTOMATICO',sub:'Tieni lo scatto pronto: E rompe anche questa barriera.'},
      {x:8030,y:258,text:'IL DIRETTORE TI ASPETTA',sub:'E contro i cocchi per rispedirli. Via dai cerchi dei sigari!'}
    ];
    return level;
  }
  const api={TILE,MAPS,ASCII:MAPS,SECTIONS,build};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;root.BracciaLevel=api;
})(typeof globalThis!=='undefined'?globalThis:this);

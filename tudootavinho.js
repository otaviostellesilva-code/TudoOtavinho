"use strict";
document.addEventListener("DOMContentLoaded", () => {

/* ══════════════════════════════════════════
   CANVAS CÓSMICO
══════════════════════════════════════════ */
const canvas = document.getElementById("star-canvas");
const ctx    = canvas.getContext("2d");
let W, H;
function resizeCanvas(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resizeCanvas(); window.addEventListener("resize", resizeCanvas);

const STAR_COLORS = ["rgba(200,220,255,","rgba(240,245,255,","rgba(255,248,230,","rgba(255,235,180,","rgba(255,200,120,","rgba(255,160,100,"];
const stars = Array.from({length:250}, () => ({
  x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight,
  r: Math.pow(Math.random(),2.5)*2.2+.3,
  phase: Math.random()*Math.PI*2, speed: Math.random()*.006+.001,
  color: STAR_COLORS[Math.floor(Math.random()*STAR_COLORS.length)]
}));
const constLines = [];
for(let i=0;i<18;i++){
  const a=stars[Math.floor(Math.random()*stars.length)],b=stars[Math.floor(Math.random()*stars.length)];
  if(Math.hypot(a.x-b.x,a.y-b.y)<200) constLines.push([a,b]);
}
const PLANETS = [
  {rx:.10,ry:.22,r:24,c1:"rgba(80,130,255,.85)",c2:"rgba(30,70,180,.65)",ring:true,rc:"rgba(120,170,255,.28)"},
  {rx:.88,ry:.55,r:16,c1:"rgba(255,175,80,.80)",c2:"rgba(180,90,30,.60)",ring:false},
  {rx:.50,ry:.04,r:11,c1:"rgba(200,220,200,.75)",c2:"rgba(120,150,120,.55)",ring:false},
];
const shooters=[];
function maybeShooter(){
  if(shooters.length<3&&Math.random()<.004)
    shooters.push({x:Math.random()*W,y:Math.random()*H*.4,
      vx:5+Math.random()*7,vy:2+Math.random()*4,
      len:70+Math.random()*120,life:1});
}
function draw(t){
  ctx.clearRect(0,0,W,H);
  // Nebulosa
  let g=ctx.createRadialGradient(W*.3,H*.25,0,W*.3,H*.25,W*.3);
  g.addColorStop(0,`rgba(0,40,130,${.04+.015*Math.sin(t*.001)})`);g.addColorStop(1,"transparent");
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  // Constelações
  constLines.forEach(([a,b])=>{
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
    ctx.strokeStyle="rgba(201,162,39,.06)";ctx.lineWidth=.6;ctx.stroke();
  });
  // Estrelas
  stars.forEach(s=>{
    const a=.28+.65*Math.abs(Math.sin(t*s.speed+s.phase));
    ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle=s.color+a+")";
    if(s.r>1.2){ctx.shadowColor=s.color+".8)";ctx.shadowBlur=s.r*5;}
    ctx.fill();ctx.shadowBlur=0;
  });
  // Lua
  const mx=W*.86,my=H*.10,mr=34;
  let mg=ctx.createRadialGradient(mx-mr*.22,my-mr*.22,mr*.1,mx,my,mr);
  mg.addColorStop(0,"rgba(255,255,235,.92)");mg.addColorStop(1,"rgba(190,185,155,.70)");
  ctx.beginPath();ctx.arc(mx,my,mr,0,Math.PI*2);ctx.fillStyle=mg;ctx.fill();
  ctx.beginPath();ctx.arc(mx+mr*.38,my-mr*.08,mr*.82,0,Math.PI*2);
  ctx.fillStyle="rgba(0,10,30,.88)";ctx.fill();
  // Planetas
  PLANETS.forEach(p=>{
    const x=p.rx*W,y=p.ry*H;
    let bg=ctx.createRadialGradient(x-p.r*.28,y-p.r*.28,p.r*.1,x,y,p.r);
    bg.addColorStop(0,p.c1);bg.addColorStop(1,p.c2);
    ctx.beginPath();ctx.arc(x,y,p.r,0,Math.PI*2);ctx.fillStyle=bg;ctx.fill();
    if(p.ring){
      ctx.save();ctx.translate(x,y);ctx.scale(1,.3);
      ctx.beginPath();ctx.arc(0,0,p.r*2.1,0,Math.PI*2);
      ctx.strokeStyle=p.rc;ctx.lineWidth=5;ctx.stroke();ctx.restore();
    }
  });
  // Estrelas cadentes
  maybeShooter();
  for(let i=shooters.length-1;i>=0;i--){
    const s=shooters[i];
    let sg=ctx.createLinearGradient(s.x,s.y,s.x-s.vx*s.len/8,s.y-s.vy*s.len/8);
    sg.addColorStop(0,`rgba(255,255,240,${s.life})`);
    sg.addColorStop(1,"rgba(200,220,255,0)");
    ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(s.x-s.vx*s.len/8,s.y-s.vy*s.len/8);
    ctx.strokeStyle=sg;ctx.lineWidth=1.8*s.life;ctx.stroke();
    s.x+=s.vx;s.y+=s.vy;s.life-=.018;
    if(s.life<=0||s.x>W||s.y>H)shooters.splice(i,1);
  }
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

/* ══════════════════════════════════════════
   PARTÍCULAS
══════════════════════════════════════════ */
const pc=document.getElementById("particles");
const PSYMS=["🍕","⭐","✨","🌙","⚡","🔱","🌟","☄️","🍕","♌","🎹","📐","🪐","🌍","🍕"];
for(let i=0;i<24;i++){
  const p=document.createElement("div");p.classList.add("particle");
  p.innerText=PSYMS[i%PSYMS.length];
  p.style.left=(Math.random()*100)+"vw";
  p.style.animationDuration=(15+Math.random()*24)+"s";
  p.style.animationDelay=(Math.random()*20)+"s";
  p.style.fontSize=(11+Math.random()*17)+"px";
  p.style.opacity=.05+Math.random()*.1;
  pc.appendChild(p);
}

/* ══════════════════════════════════════════
   ZODIAC — CLICK
══════════════════════════════════════════ */
document.querySelectorAll(".zodiac-ring span").forEach(el=>{
  el.addEventListener("click",()=>{
    el.style.transform="scale(1.8)translateY(-6px)";
    el.style.filter="drop-shadow(0 0 14px #FFD700)";
    setTimeout(()=>{el.style.transform="";el.style.filter="";},800);
  });
});

/* ══════════════════════════════════════════
   SISTEMA DE MODAL
══════════════════════════════════════════ */
const IMG = (id,w=600,h=300) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const MODAL_DATA = {
  // ─ ZODÍACO ─
  aries:       {badge:"♈",title:"♈ Áries — O Carneiro de Ouro",img:IMG("1546182990-dffeafbe841d"),body:"Na mitologia grega, Áries representa Crisômalo, o carneiro de velocino dourado que Zeus transformou em constelação. Seu velocino foi o objetivo da busca dos Argonautas liderados por Jasão. Áries é associado ao início, à coragem e à ação impulsiva — qualidades de guerreiros e pioneiros.",tags:["🐏 Carneiro","♈ Fogo","Marte","Mar 21–Abr 19"]},
  taurus:      {badge:"♉",title:"♉ Touro — A Forma de Zeus",img:IMG("1526045612212-70cac16ab8f2"),body:"Zeus se transformou em touro branco para raptar a bela Europa, filha do rei de Fenícia. Tocado pela beleza do animal, Zeus levou Europa pelo mar até Creta, onde revelou sua identidade divina. A constelação Touro também está ligada ao Minotauro de Creta e ao poderoso touro de Possêidon.",tags:["🐂 Touro","♉ Terra","Vênus","Abr 20–Mai 20"]},
  gemini:      {badge:"♊",title:"♊ Gêmeos — Os Dióscuros",img:IMG("1519681393784-d1bc9aa42b5e"),body:"Castor e Pólux, os Dióscuros, foram filhos de Leda — mas Pólux era filho de Zeus enquanto Castor era mortal. Quando Castor morreu em batalha, Pólux pediu a Zeus que dividisse sua imortalidade com o irmão. Zeus os transformou na constelação dos Gêmeos, alternando entre o Olimpo e o Hades eternamente.",tags:["👬 Dióscuros","♊ Ar","Mercúrio","Mai 21–Jun 20"]},
  cancer:      {badge:"♋",title:"♋ Câncer — O Caranguejo de Hera",img:IMG("1505118380757-91f5f5632de0"),body:"Durante o segundo trabalho de Hércules — matar a Hidra de Lerna — Hera enviou um caranguejo gigante para morder os pés do herói e distraí-lo. Embora Hércules tenha esmagado o caranguejo imediatamente, Hera, em reconhecimento à fidelidade do animal, o colocou entre as estrelas como a constelação de Câncer.",tags:["🦀 Caranguejo","♋ Água","Lua","Jun 21–Jul 22"]},
  leo:         {badge:"♌",title:"♌ Leão — O Signo de Otávio",img:IMG("1546182990-dffeafbe841d"),body:"Leão representa o Leão de Neméia, criatura invulnerável enviada por Hera que aterrorizava a região de Neméia. Hércules, em seu primeiro trabalho, estrangulou o animal com as próprias mãos. A pele do leão tornou-se a armadura sagrada de Hércules. Otávio, nascido em 08/08/2008, porta a força e o brilho do Leão — signo do Sol, da criatividade e da liderança.",tags:["♌ Leão","☀️ Fogo","Sol","Jul 23–Ago 22","👑 Realeza"]},
  virgo:       {badge:"♍",title:"♍ Virgem — A Deusa da Justiça",img:IMG("1444703686981-a3abbc4d4fe3"),body:"Virgem representa Astréia, a deusa da justiça e inocência. Durante a Era de Ouro, Astréia viveu entre os mortais; conforme a humanidade decaiu moralmente, ela foi a última deusa a abandonar a Terra. Zeus a transformou em constelação, e ela segura a balança da justiça (Libra) em sua mão.",tags:["👩 Astréia","♍ Terra","Mercúrio","Ago 23–Set 22"]},
  libra:       {badge:"♎",title:"♎ Libra — A Balança de Têmis",img:IMG("1513364776144-60967b0f800f"),body:"Libra representa a balança sagrada da deusa Têmis (ou Astréia), símbolo da justiça divina. Os gregos usavam balanças de dois pratos para pesar ouro e julgamentos. A constelação de Libra é a única do zodíaco que representa um objeto inanimado — a balança perfeita do equilíbrio cósmico.",tags:["⚖️ Equilíbrio","♎ Ar","Vênus","Set 23–Out 22"]},
  scorpio:     {badge:"♏",title:"♏ Escorpião — O Caçador das Estrelas",img:IMG("1419242902214-272b3f66ee7a"),body:"Ártemis, deusa da caça, enviou um escorpião gigante para matar Orion, o grande caçador que havia ofendido os deuses com sua arrogância. O escorpião matou Orion com sua picada venenosa. Zeus os colocou em lados opostos do céu: quando Escorpião sobe no horizonte, Orion se põe — eternamente fugindo.",tags:["🦂 Escorpião","♏ Água","Plutão","Out 23–Nov 21"]},
  sagittarius: {badge:"♐",title:"♐ Sagitário — O Centauro Sábio",img:IMG("1485827404703-89b55fcc595e"),body:"Sagitário é frequentemente identificado com Quíron, o mais sábio de todos os centauros, tutor de Aquiles, Jasão e Asclépio. Quíron foi acidentalmente ferido por uma flecha envenenada de Hércules e, imortal mas em eterno sofrimento, pediu para morrer. Zeus o honrou transformando-o na constelação do Sagitário.",tags:["🏹 Arqueiro","♐ Fogo","Júpiter","Nov 22–Dez 21"]},
  capricorn:   {badge:"♑",title:"♑ Capricórnio — Pan nas Águas",img:IMG("1505118380757-91f5f5632de0"),body:"Quando o monstro Tifão atacou o Olimpo, os deuses fugiram transformando-se em animais. Pan, em pânico, mergulhou num rio e tentou transformar-se em peixe — mas a magia foi incompleta: sua parte superior permaneceu de cabra e a inferior de peixe. Zeus imortalizou esta forma estranha e cômica na constelação de Capricórnio.",tags:["🐐 Cabra","♑ Terra","Saturno","Dez 22–Jan 19"]},
  aquarius:    {badge:"♒",title:"♒ Aquário — O Copeiro dos Deuses",img:IMG("1504253109451-45d29bb786c0"),body:"Aquário representa Ganimedes, um jovem troiano de extraordinária beleza. Zeus se apaixonou por ele e o levou ao Olimpo transformado em águia (ou enviando uma), tornando-o copeiro dos deuses imortais. Em reconhecimento, Zeus o transformou na constelação de Aquário, derramando para sempre a água (ou néctar) para os mortais.",tags:["💧 Água","♒ Ar","Urano","Jan 20–Fev 18"]},
  pisces:      {badge:"♓",title:"♓ Peixes — Afrodite e Eros",img:IMG("1505118380757-91f5f5632de0"),body:"Quando Tifão aterrorizou o Olimpo, Afrodite e seu filho Eros fugiram para o Oriente Médio. Para escapar do monstro, transformaram-se em peixes e mergulharam no rio Eufrates. Em agradecimento por terem sobrevivido, foram colocados como estrelas no céu — duas figuras em forma de peixe ligadas por um laço de amor eterno.",tags:["🐟 Peixes","♓ Água","Netuno","Fev 19–Mar 20"]},

  // ─ BADGES DAS PÁGINAS ─
  "badge-oracle": {badge:"🔮",title:"O Oráculo de Delfos",img:IMG("1519681393784-d1bc9aa42b5e"),body:"O Oráculo de Delfos era a sacerdotisa de Apolo conhecida como Pítia, que transmitia profecias divinas no Templo de Delfos. Governantes, generais e filósofos viajavam de toda a Grécia para consultar o oráculo. Suas profecias eram famosas por serem ambíguas e frequentemente mal interpretadas — um lembrete de que o destino nunca é simples.",tags:["🏛️ Delfos","🕊️ Apolo","⚡ Profecia"]},
  "badge-mural":  {badge:"🏛️",title:"O Partenon — Templo do Olimpo",img:IMG("1555993539-1732b0258235"),body:"O Partenon, no alto da Acrópole de Atenas, é o mais famoso templo grego, dedicado à deusa Atena. Construído entre 447 e 432 a.C., é um ícone da arquitetura clássica com proporções baseadas na seção áurea. Suas colunas dóricas e frisos esculpidos narram as batalhas dos deuses — similar ao Mural do Herói, onde a história de Otávio é esculpida para a eternidade.",tags:["🏛️ Atenas","✨ Ictino","📐 Seção Áurea"]},
  "badge-science":{badge:"⚙️",title:"Hefesto — Deus da Forja e Inventor",img:IMG("1485827404703-89b55fcc595e"),body:"Hefesto, deus da forja e do fogo, era o engenheiro-mor do Olimpo. Criou as armaduras dos deuses, os raios de Zeus, a armadura de Aquiles e até autômatos de metal — robôs da Antiguidade! Seu espírito inventivo é a essência da Engenharia Mecatrônica moderna: mecânica, eletrônica e inteligência fundidas em uma só arte.",tags:["🔨 Forja","🤖 Autômatos","⚙️ Invenção"]},
  "badge-saga":   {badge:"📚",title:"A Biblioteca de Alexandria",img:IMG("1519682337058-a94d519337bc"),body:"A Biblioteca de Alexandria, fundada no século III a.C., foi a maior fonte de conhecimento do mundo antigo. Estimava-se que abrigava 700 mil rolos de papiro cobrindo filosofia, matemática, astronomia e mitologia. Percy Jackson estudaria ali sobre o Olimpo — enquanto Otávio encontraria equações de engenharia e histórias dos deuses entre seus rolos.",tags:["📚 Conhecimento","🌍 Alexandria","🔭 Ciência"]},
  "badge-arena":  {badge:"⚔️",title:"As Arenas Gregas — Teatro da Glória",img:IMG("1568454537842-d933259bb258"),body:"Na Grécia antiga, as arenas (ou estádios) eram locais sagrados de competição física e dramática. Os Jogos Olímpicos, realizados em Olímpia desde 776 a.C., honravam Zeus. Os atletas competiam nus, cobertas de óleo, buscando a coroa de oliveira. Hoje, a arena de Otávio é diferente: os adversários são deuses imortais, e a arma é a estratégia.",tags:["⚔️ Combate","🏟️ Olímpia","🏆 Glória"]},

  // ─ STATS DE HERÓI ─
  "stat-city":    {badge:"🏙️",title:"São Paulo — A Metrópole Titã",img:IMG("1568454537842-d933259bb258"),body:"São Paulo é a maior cidade da América Latina, com mais de 12 milhões de habitantes. Fundada pelos jesuítas em 1554, tornou-se o coração econômico e cultural do Brasil. Seus arranha-céus, museus, restaurantes e universidades fazem dela um Olimpo moderno — um lugar onde semideuses podem se perder e se encontrar ao mesmo tempo.",tags:["🏙️ SP","🌍 Brasil","11+ milhões","Arte & Cultura"]},
  "stat-destiny": {badge:"⚙️",title:"Engenharia Mecatrônica — O Futuro",img:IMG("1485827404703-89b55fcc595e"),body:"A Engenharia Mecatrônica combina mecânica, eletrônica, computação e controle. Mecatrônicos projetam robôs industriais, veículos autônomos, próteses biônicas e sistemas de automação. É a engenharia que mais cresce no século XXI — e Hefesto, o divino ferreiro, seria o seu patrono mitológico perfeito.",tags:["🤖 Robótica","🏭 Automação","🛰️ Embarcados","⚡ Futuro"]},
  "stat-gift":    {badge:"📐",title:"Matemática na Grécia Antiga",img:IMG("1509228468518-180dd4864904"),body:"Os gregos foram os primeiros a tratar a matemática como ciência pura. Euclides definiu a geometria; Pitágoras revelou a harmonia dos números; Arquimedes calculou Pi e inventou a alavanca. Para os gregos, os números eram divinos — Pitágoras acreditava que 'tudo é número' e que a harmonia do cosmos poderia ser expressa matematicamente.",tags:["📐 Euclides","∑ Pitágoras","π Arquimedes","🔢 Puro"]},

  // ─ SKILLS ─
  "skill-cooking":{badge:"🍳",title:"A Arte Culinária — Do Olimpo à Cozinha",img:IMG("1556909114-f6e7ad7d3136"),body:"A culinária é uma das mais antigas artes humanas. No Olimpo, os deuses se alimentavam de ambrosia e néctar — alimentos que conferiam imortalidade. Nas cozinhas mortais, a alquimia dos ingredientes cria experiências igualmente transcendentes. Aprender a cozinhar é dominar o fogo de Prometeu: transformar o cru em sublime através do calor e da criatividade.",tags:["👨‍🍳 Arte","🔥 Fogo","🌿 Ingredientes","✨ Criação"]},
  "skill-drawing":{badge:"✏️",title:"O Desenho — Linguagem Visual dos Deuses",img:IMG("1513364776144-60967b0f800f"),body:"Os gregos elevaram o desenho à categoria de arte sagrada. As pinturas em vasos cerâmicos, os afrescos e as esculturas eram formas de eternizar histórias dos deuses e heróis. Aprender a desenhar é aprender a ver — capturar em linhas o que os olhos percebem e a imaginação cria. É a habilidade que aproxima mortais dos criadores divinos.",tags:["✏️ Traço","🎨 Arte","👁️ Percepção","📜 História"]},
  "skill-piano":  {badge:"🎹",title:"O Piano — Instrumento de Apolo",img:IMG("1520523839897-bd0b52f945a0"),body:"Apolo era o deus da música, da poesia e da harmonia. Seu instrumento era a lira — e o piano moderno é seu herdeiro direto. Inventado por Bartolomeo Cristofori por volta de 1700, o piano combina percussão e melodia num único instrumento de 88 teclas. Tocar piano é estabelecer comunicação direta com Apolo — transformar matemática (frequências e ritmos) em emoção pura.",tags:["🎹 Cristofori","☀️ Apolo","🎵 Harmonia","88 teclas"]},
  "skill-pizza":  {badge:"🍕",title:"Pizza — A Constelação Gastronômica",img:IMG("1513104890138-7c749659a591"),body:"A pizza nasceu em Nápoles, Itália, no século XIX, quando a Rainha Margherita recebeu uma pizza com as cores da bandeira italiana: vermelho (tomate), branco (mozzarella) e verde (manjericão). Tipos icônicos: Margherita clássica, Pepperoni americano, Quatro Queijos cremoso, Calabresa brasileira e a Pizza de Nutella (para os mais ousados). A pizza é, oficialmente, a constelação mais deliciosa do universo gastronômico.",tags:["🍕 Napolitana","🇮🇹 Nápoles","🧀 4 Queijos","⭐ Constelação"]},

  // ─ MATEMÁTICA ─
  "math-geometry":{badge:"📐",title:"Geometria Sagrada de Euclides",img:IMG("1509228468518-180dd4864904"),body:"Euclides de Alexandria (c. 300 a.C.) sistematizou toda a geometria conhecida em 13 livros chamados 'Os Elementos'. Sua geometria plana ainda é ensinada hoje. O Partenon, o Coliseu e as pirâmides foram construídos usando geometria sagrada. A seção áurea (φ ≈ 1,618) aparece na natureza, na arte e na arquitetura — é o código secreto da beleza universal.",tags:["📐 Euclides","φ Seção Áurea","🏛️ Partenon","300 a.C."]},
  "math-binomial":{badge:"🔢",title:"Binômio de Newton — A Expansão Divina",img:IMG("1509228468518-180dd4864904"),body:"Isaac Newton (1643–1727) generalizou a fórmula de expansão de potências de binômios. A fórmula (a+b)ⁿ = Σ C(n,k)·aⁿ⁻ᵏ·bᵏ permite calcular qualquer potência de uma soma sem multiplicações repetidas. O mesmo Newton que descobriu a gravidade e inventou o cálculo também criou essa ferramenta fundamental da álgebra — provando que a matemática é a linguagem do universo.",tags:["🔢 Newton","∑ Somatório","C(n,k) Combinatória","📐 Álgebra"]},
  "math-calculus":{badge:"∫",title:"Cálculo — A Guerra dos Gênios",img:IMG("1509228468518-180dd4864904"),body:"Isaac Newton (Inglaterra) e Gottfried Leibniz (Alemanha) desenvolveram o cálculo diferencial e integral independentemente no século XVII, desencadeando uma das maiores disputas científicas da história. Newton focou em fluxões (física do movimento); Leibniz criou a notação ∫ e dy/dx que usamos hoje. O cálculo permite descrever tudo que muda no universo: do crescimento das bactérias à órbita dos planetas.",tags:["∫ Integral","∂ Derivada","Newton vs Leibniz","XVII"]},

  // ─ ENGENHARIA ─
  "eng-robotics":   {badge:"🤖",title:"Robótica — Autômatos Modernos",img:IMG("1485827404703-89b55fcc595e"),body:"Hefesto construiu os primeiros 'robôs' da história: autômatos de ouro que serviam no Olimpo e o gigante de bronze Talos que guardava a ilha de Creta. Hoje, robôs industriais realizam soldagem, pintura e montagem com precisão milimétrica. Robôs cirúrgicos operam com maior precisão que mãos humanas. A robótica é o sonho de Hefesto tornado realidade.",tags:["🤖 Industrial","🏥 Cirúrgico","🏎️ Autônomo","⚙️ IA"]},
  "eng-automation": {badge:"🏭",title:"Automação — Eficiência Olímpica",img:IMG("1485827404703-89b55fcc595e"),body:"Automação industrial é a substituição de trabalho humano repetitivo por máquinas e sistemas controlados. PLCs (Controladores Lógicos Programáveis), sensores e atuadores criam linhas de produção que nunca param. A Revolução Industrial de 1760 começou esse processo; a Indústria 4.0 de hoje conecta fábricas inteiras em redes digitais — o Olimpo da eficiência produtiva.",tags:["🏭 PLC","🔄 CNC","📡 IoT","Indústria 4.0"]},
  "eng-embedded":   {badge:"🛰️",title:"Sistemas Embarcados — O Cérebro Oculto",img:IMG("1485827404703-89b55fcc595e"),body:"Sistemas embarcados são computadores miniaturizados integrados em dispositivos físicos. Seu smartphone tem dezenas deles. O Mars Rover usa sistemas embarcados para navegar em Marte. Marcapassos cardíacos, drones militares, ECUs de carros elétricos — todos têm um microcontrolador tomando decisões em tempo real. É a tecnologia invisível que governa o mundo moderno.",tags:["💻 Microcontrolador","🛰️ Satélite","🚗 Automotivo","🏥 Médico"]},
  "eng-research":   {badge:"🔬",title:"Pesquisa & Inovação — A Fronteira",img:IMG("1485827404703-89b55fcc595e"),body:"A pesquisa em engenharia mecatrônica está na fronteira do impossível: exoesqueletos que permitem paraplégicos andarem, interfaces neurais que controlam braços robóticos com o pensamento, nano-robôs que destroem células cancerígenas no interior do corpo humano. Cada descoberta expande o que é possível — como os semideuses que cruzavam as fronteiras entre o mortal e o divino.",tags:["🧬 Nano","🧠 Neural","🦾 Exoesqueleto","🔭 Futuro"]},

  // ─ LIVROS ─
  "book-1":{badge:"⚡",title:"Livro I — O Ladrão de Raios",img:IMG("1444703686981-a3abbc4d4fe3"),body:"Percy Jackson, um garoto de 12 anos com dislexia e TDAH, descobre ser filho de Poseidon — um dos 'Três Grandes'. Acusado de roubar o raio mestre de Zeus, ele parte numa missão impossível pelos EUA modernos, onde os monstros da mitologia grega vivem disfarçados. Acompanhado de Annabeth Chase (filha de Atena) e Grover (um sátiro), Percy enfrenta Medusa, o Quiméra e Ares — até chegar ao Olimpo no topo do Empire State Building.",tags:["⚡ Zeus","🔱 Poseidon","📅 Ano 1","🏛️ Olimpo NY"]},
  "book-2":{badge:"🌊",title:"Livro II — O Mar de Monstros",img:IMG("1505118380757-91f5f5632de0"),body:"A árvore de Tália, que protegia o Acampamento Meio-Sangue, foi envenenada. A única cura é o Velocino de Ouro, guardado pelo Ciclope Polifemo no Mar de Monstros (o Triângulo das Bermudas). Percy embarca numa corrida contra o filho de Hermes, Luke, para encontrar o velocino antes que Cronos use-o para ressuscitar seu exército de Titãs. Tyson, o irmão Ciclope de Percy, se revela uma surpresa emocionante.",tags:["🌊 Mar de Monstros","🐑 Velocino","🔺 Bermudas","👁️ Polifemo"]},
  "book-3":{badge:"🌙",title:"Livro III — A Maldição do Titã",img:IMG("1419242902214-272b3f66ee7a"),body:"Ártemis desaparece enquanto caçava um monstro terrível no Oeste. Percy, Thalia e os Caçadores de Ártemis partem numa jornada desesperada para encontrá-la. A grande profecia começa a se revelar: um semideus de 16 anos decidirá o destino do Olimpo. Atlas, o Titã, quer usar Ártemis para segurar o céu, libertando-se de sua maldição eterna. A batalha no Monte Othrys muda tudo.",tags:["🌙 Ártemis","📜 Profecia","🏔️ Atlas","⛓️ Maldição"]},
  "book-4":{badge:"🌀",title:"Livro IV — A Batalha do Labirinto",img:IMG("1519681393784-d1bc9aa42b5e"),body:"O exército de Cronos planeja invadir o Acampamento pelo Labirinto de Dédalo — um labirinto mágico vivo que cresce sob toda a América. Percy e Annabeth mergulham no labirinto para encontrar Dédalo antes de Luke. Dentro do labirinto: o Monstro de Espanha, Pan (o deus morto das florestas) e Níquel (um jovem Ciclope). Cronos finalmente ressurge em forma física dentro do corpo de Luke.",tags:["🌀 Dédalo","🧱 Labirinto","💀 Cronos","🏕️ Acampamento"]},
  "book-5":{badge:"⚡",title:"Livro V — O Último Olimpiano",img:IMG("1444703686981-a3abbc4d4fe3"),body:"A grande guerra final chegou. Cronos, no corpo de Luke, lidera os Titãs contra Nova York enquanto os deuses do Olimpo estão presos batalhando Tifão. Percy e os semideuses de 16 anos defendem a cidade sozinhos. A grande profecia se cumpre: Percy escolhe entre o poder ilimitado e sacrificar tudo pelo bem do Olimpo. Luke finalmente recobra a consciência e faz a escolha definitiva — a mais nobre e dolorosa da saga.",tags:["⚡ Cronos","🗽 Nova York","📜 Profecia Final","🏆 Vitória"]},

  // ─ DEUSES ─
  "god-zeus":      {badge:"⚡",title:"Zeus — Rei dos Deuses",img:IMG("1504253109451-45d29bb786c0"),body:"Zeus é o deus do céu, do trovão e rei do Olimpo. Filho de Cronos e Reia, foi salvo de ser devorado pelo pai e liderou a revolta dos deuses olímpicos contra os Titãs (Titanomaquia). Casado com Hera, teve inúmeros filhos com deusas e mortais — incluindo Hércules, Apolo, Ártemis, Atena e Perseus. Seu símbolo é o raio dourado forjado pelos Ciclopes.",tags:["⚡ Trovão","🦅 Águia","🏔️ Olimpo","👑 Rei"]},
  "god-poseidon":  {badge:"🔱",title:"Poseidon — Senhor dos Mares",img:IMG("1505118380757-91f5f5632de0"),body:"Poseidon governa os mares, oceanos e terremotos. Irmão de Zeus e Hades, recebeu o mar como domínio após a derrota de Cronos. Com seu tridente, pode criar tempestades, acalmar o oceano e fazer a terra tremer. Pai de Percy Jackson na saga, Poseidon é patron de São Paulo do Mar, pescadores e navegadores. Seu palácio fica no fundo do Atlântico.",tags:["🔱 Tridente","🌊 Mar","🐎 Cavalos","⛈️ Tempestade"]},
  "god-hades":     {badge:"💀",title:"Hades — Senhor do Submundo",img:IMG("1419242902214-272b3f66ee7a"),body:"Hades reina sobre o Submundo — o reino dos mortos. Ao contrário do que muitos pensam, Hades não é o deus da morte (esse é Tânatos), mas o governante soberano do reino pós-morte. Com seu elmo da invisibilidade, Hades mantém ordem entre as almas. Guardado pelo cão de três cabeças Cérbero, o Submundo tem várias regiões: Campos Elísios (paraíso), Tártaro (prisão) e Campos do Asfódelo.",tags:["💀 Submundo","👑 Elmo","🐕 Cérbero","⚖️ Julgamento"]},
  "god-demeter":   {badge:"🌾",title:"Deméter — Mãe da Colheita",img:IMG("1556909114-f6e7ad7d3136"),body:"Deméter é a deusa da agricultura, das estações e da fertilidade da terra. Quando sua filha Perséfone foi raptada por Hades, Deméter mergulhou em luto e a terra parou de produzir — criando o inverno. Quando Perséfone retorna do Submundo, Deméter celebra com o florescimento — criando a primavera. Seus mistérios de Elêusis eram os rituais religiosos mais sagrados da Grécia.",tags:["🌾 Colheita","🌸 Primavera","❄️ Inverno","🌿 Natureza"]},
  "god-athena":    {badge:"🦉",title:"Atena — Deusa da Sabedoria",img:IMG("1555993539-1732b0258235"),body:"Atena nasceu diretamente da cabeça de Zeus, já adulta e em armadura completa. Deusa da sabedoria, estratégia militar, artesanato e ciências, Atena era a favorita de Zeus. Sua cidade era Atenas, ganha num concurso contra Poseidon ao oferecer a oliveira aos cidadãos. Seu símbolo é a coruja (sabedoria) e a égide (escudo). Na saga, Annabeth Chase é sua filha mais famosa.",tags:["🦉 Sabedoria","🛡️ Estratégia","🏛️ Atenas","⚔️ Arte da Guerra"]},
  "god-apollo":    {badge:"☀️",title:"Apolo — Deus do Sol e da Arte",img:IMG("1444703686981-a3abbc4d4fe3"),body:"Apolo é o deus do sol, da música, da poesia, da medicina, da profecia e do arco. Filho de Zeus e Leto, gêmeo de Ártemis. Conduz sua biga de cavalos dourados pelo céu, trazendo a luz do dia. O Oráculo de Delfos era sua sacerdotisa. Na mitologia romana, Apolo é o único deus que manteve o mesmo nome. Na saga de Percy, Apolo aparece como um adolescente californiano obcecado por rimas.",tags:["☀️ Sol","🎵 Música","🏹 Arco","🔮 Profecia"]},
  "god-artemis":   {badge:"🌙",title:"Ártemis — A Caçadora Eterna",img:IMG("1419242902214-272b3f66ee7a"),body:"Ártemis é a deusa da lua, da caça, da natureza selvagem e protetora das virgens. Gêmea de Apolo, filha de Zeus e Leto. Lidera as Caçadoras de Ártemis — um grupo de ninfas imortais que renunciaram aos homens. Com seu arco prateado, caça os monstros mais perigosos do mundo. Na saga de Percy, ela desempenha papel crucial no Livro III, sendo capturada por Atlas.",tags:["🌙 Lua","🏹 Caçadora","🦌 Natureza","⭐ Caçadoras"]},
  "god-ares":      {badge:"⚔️",title:"Ares — Deus da Guerra",img:IMG("1504253109451-45d29bb786c0"),body:"Ares é o deus da guerra, da violência e da carnificina. Filho de Zeus e Hera, representa o lado brutal e caótico do conflito — diferente de Atena, que representa a estratégia. Ares era amante de Afrodite e pai de Fobos (Medo) e Deimos (Terror). Na saga de Percy, Ares aparece como um motoqueiro brutal que interfere na primeira missão de Percy, sendo derrotado pelo jovem semideus na praia.",tags:["⚔️ Guerra","🔴 Violência","🗡️ Lança","🏍️ Guerreiro"]},
  "god-hephaestus":{badge:"🔨",title:"Hefesto — Divino Ferreiro",img:IMG("1485827404703-89b55fcc595e"),body:"Hefesto é o deus do fogo, da forja e dos artesãos. Jogado do Olimpo por Hera (ou Zeus) ainda bebê, ficou manco mas se tornou o mais habilidoso artesão divino. Criou as armaduras dos deuses, o cinturão de Afrodite, os automatons de ouro, o tridente de Poseidon e os raios de Zeus. Seu equivalente romano, Vulcano, deu nome ao vulcanismo geológico. É o patrono perfeito dos engenheiros.",tags:["🔨 Forja","🔥 Fogo","⚙️ Engenharia","🤖 Autômatos"]},
  "god-aphrodite": {badge:"❤️",title:"Afrodite — Deusa do Amor",img:IMG("1505118380757-91f5f5632de0"),body:"Afrodite nasceu da espuma do mar onde o sangue de Urano caiu após ser mutilado por Cronos. Deusa do amor, da beleza e do desejo, tem poder sobre todos os seres — mortais e imortais. Casada com Hefesto, era apaixonada por Ares. Sua maçã dourada causou a Guerra de Troia ao ser entregue a Páris. Na saga, filhos de Afrodite têm poderes de controle emocional.",tags:["❤️ Amor","🌹 Beleza","🍎 Maçã Dourada","🌊 Mar"]},
  "god-hermes":    {badge:"🪽",title:"Hermes — O Mensageiro Veloz",img:IMG("1444703686981-a3abbc4d4fe3"),body:"Hermes é o mensageiro dos deuses, guia das almas ao Submundo (psicopompo), deus dos viajantes, comerciantes e ladrões. Com suas sandálias aladas (talária) e o caduceu (bastão com duas serpentes), Hermes percorre o cosmos na velocidade do pensamento. É o mais esperto dos olímpicos — ainda bebê, roubou o gado de Apolo! Na saga, Luke Castellan é seu filho mais famoso.",tags:["🪽 Sandálias Aladas","🐍 Caduceu","⚡ Velocidade","📬 Mensageiro"]},
  "god-dionysus":  {badge:"🍇",title:"Dionísio — Deus do Vinho e Êxtase",img:IMG("1556909114-f6e7ad7d3136"),body:"Dionísio é o deus do vinho, do êxtase, da fertilidade e do teatro. Nascido duas vezes — primeiro mortal, depois imortal — é o deus mais próximo da humanidade. Seu culto era associado a festas, máscaras e transformação. Foi ele quem criou o teatro grego. Na saga de Percy, Dionísio (apelidado de 'Sr. D') é o diretor do Acampamento Meio-Sangue, cumprindo punição por perseguir uma ninfa proibida por Zeus.",tags:["🍇 Vinho","🎭 Teatro","🎉 Êxtase","🏕️ Sr. D"]},
};

/* ─ Abrir / Fechar modal ─ */
const modal      = document.getElementById("info-modal");
const modalImg   = document.getElementById("modal-img");
const modalBadge = document.getElementById("modal-badge");
const modalTitle = document.getElementById("modal-title");
const modalDesc  = document.getElementById("modal-desc");
const modalTags  = document.getElementById("modal-tags");
const closeBtnM  = document.getElementById("modal-close-btn");

function openModal(key){
  const d = MODAL_DATA[key];
  if(!d) return;
  modalImg.src    = d.img || "";
  modalImg.style.display = d.img ? "block" : "none";
  modalBadge.innerText   = d.badge || "";
  modalTitle.innerText   = d.title;
  modalDesc.innerText    = d.body;
  modalTags.innerHTML    = (d.tags||[]).map(t => `<span class="modal-tag gold">${t}</span>`).join("");
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal(){
  modal.classList.remove("open");
  document.body.style.overflow = "";
}
closeBtnM.addEventListener("click", closeModal);
modal.addEventListener("click", e => { if(e.target===modal) closeModal(); });
document.addEventListener("keydown", e => { if(e.key==="Escape") closeModal(); });

/* ─ Delegação de clique para todos os [data-modal] ─ */
document.addEventListener("click", e => {
  const el = e.target.closest("[data-modal]");
  if(el && el.dataset.modal) openModal(el.dataset.modal);
});

/* ══════════════════════════════════════════
   VÉUS DE TRANSIÇÃO
══════════════════════════════════════════ */
const veil     = document.getElementById("page-veil");
const veilSym  = document.getElementById("veil-symbol");
const veilLbl  = document.getElementById("veil-label");
const PAGE_SYMS = ["🔮","🏛️","⚙️","📚","⚔️"];
const PAGE_LBLS = ["O Oráculo Aguarda…","Mural dos Heróis…","Câmara das Ciências…","Biblioteca do Olimpo…","Arena dos Deuses…"];
const pages = document.querySelectorAll(".page");

function goTo(from, to, onMid){
  veilSym.innerText = PAGE_SYMS[to]||"⚡";
  veilLbl.innerText = PAGE_LBLS[to]||"Navegando…";
  veil.classList.remove("veil-out"); veil.classList.add("veil-in");
  setTimeout(()=>{ pages[from].classList.remove("active"); pages[to].classList.add("active");
    window.scrollTo({top:0}); if(onMid) onMid(); }, 260);
  setTimeout(()=>{ veil.classList.remove("veil-in"); veil.classList.add("veil-out");
    setTimeout(()=>veil.classList.remove("veil-out"),420); }, 520);
}
document.getElementById("btn-next-1").addEventListener("click",()=>goTo(0,1));
document.getElementById("btn-next-2").addEventListener("click",()=>goTo(1,2,initQuiz));
document.getElementById("btn-next-3").addEventListener("click",()=>goTo(2,3));
document.getElementById("btn-next-4").addEventListener("click",()=>goTo(3,4,initGame));
document.getElementById("btn-home").addEventListener("click", ()=>goTo(4,0,()=>{resetGame();initOracle();}));

/* ══════════════════════════════════════════
   PÁGINA 1 — ORÁCULO
══════════════════════════════════════════ */
const targetName="otávio stelle";
const lettersPool=document.getElementById("letters-pool");
const wordSlots=document.getElementById("word-slots");
const btnNext1=document.getElementById("btn-next-1");
const hintBox=document.getElementById("hint-box");
const hintText=document.getElementById("hint-text");
let state=[],errorCount=0;
const HINTS=["🔮 Dica 1: O nome tem duas palavras — pense num semideus brasileiro.",
  "⭐ Dica 2: A primeira palavra começa com 'O' e tem 6 letras.",
  "🌙 Dica 3: A segunda palavra lembra corpos brilhantes no céu noturno.",
  "♌ Dica 4: Nascido sob o signo de Leão, em agosto de 2008.",
  "🪐 Dica 5: A segunda palavra vem do italiano e significa 'estrelas'. St…",
  "✨ Última dica: Otá___  St____ — 6 e 6 letras."];

function initOracle(){
  wordSlots.innerHTML="";lettersPool.innerHTML="";state=[];errorCount=0;
  hintBox.classList.add("hidden");hintBox.classList.remove("show");
  btnNext1.setAttribute("disabled","true");
  for(const char of targetName){
    const slot=document.createElement("div");slot.classList.add("slot-box");
    if(char===" ")slot.classList.add("space");
    wordSlots.appendChild(slot);state.push(char===" "?" ":"");
  }
  const arr=targetName.replace(/ /g,"").split("");
  for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}
  arr.forEach(letter=>{
    const el=document.createElement("div");el.classList.add("letter-box");el.innerText=letter;
    el.addEventListener("click",()=>{
      const idx=state.findIndex((v,i)=>v===""&&targetName[i]!==" ");
      if(idx===-1)return;
      if(targetName[idx]===letter){
        state[idx]=letter;wordSlots.children[idx].innerText=letter;
        wordSlots.children[idx].classList.add("filled");el.remove();
        if(state.join("")===targetName){
          btnNext1.removeAttribute("disabled");hintBox.classList.add("hidden");
          Array.from(wordSlots.children).forEach((s,i)=>setTimeout(()=>s.classList.add("celebrate"),i*55));
        }
      } else {
        el.classList.add("error");setTimeout(()=>el.classList.remove("error"),500);
        errorCount++;const i2=Math.min(errorCount-1,HINTS.length-1);
        hintText.innerText=HINTS[i2];hintBox.classList.remove("hidden");
        hintBox.classList.remove("show");void hintBox.offsetWidth;hintBox.classList.add("show");
      }
    });
    lettersPool.appendChild(el);
  });
}
initOracle();

/* ══════════════════════════════════════════
   PÁGINA 2 — TEXTO EDITÁVEL (botão livre)
══════════════════════════════════════════ */
const desc=document.querySelector(".editable-desc");
const counter=document.getElementById("char-counter");
desc.addEventListener("input",()=>{
  const len=desc.innerText.trim().length;
  counter.innerText=`${len} caracteres escritos`;
  counter.style.color=len>10?"#4ade80":"#60a5fa";
});

/* ══════════════════════════════════════════
   PÁGINA 3 — QUIZ BINÔMIO
══════════════════════════════════════════ */
const QUIZ_OPTS=[
  {text:"(a+b)ⁿ = Σ C(n,k) · aⁿ⁻ᵏ · bᵏ",correct:true},
  {text:"(a+b)ⁿ = aⁿ + bⁿ",correct:false},
  {text:"(a+b)ⁿ = Σ k! · aⁿ⁻ᵏ · bᵏ",correct:false},
  {text:"(a·b)ⁿ = aⁿ + nab + bⁿ",correct:false},
];
function initQuiz(){
  const cont=document.getElementById("quiz-container");
  const fb=document.getElementById("quiz-feedback");
  const btn3=document.getElementById("btn-next-3");
  fb.className="quiz-feedback hidden";btn3.setAttribute("disabled","true");
  const opts=[...QUIZ_OPTS];
  for(let i=opts.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[opts[i],opts[j]]=[opts[j],opts[i]];}
  cont.innerHTML="";
  opts.forEach((opt,idx)=>{
    const b=document.createElement("button");b.classList.add("quiz-opt");
    b.innerText=`${["A","B","C","D"][idx]}) ${opt.text}`;
    b.addEventListener("click",()=>{
      if(opt.correct){
        b.classList.add("quiz-correct");cont.querySelectorAll(".quiz-opt").forEach(x=>x.disabled=true);
        fb.innerHTML="✅ Correto! Essa é a fórmula do Binômio de Newton!";
        fb.className="quiz-feedback correct-fb";btn3.removeAttribute("disabled");
      } else {
        b.classList.add("quiz-wrong");b.disabled=true;
        fb.innerHTML="❌ Não é essa… pense em combinatórias C(n,k). Tente outra!";
        fb.className="quiz-feedback wrong-fb";
      }
    });
    cont.appendChild(b);
  });
}

/* ══════════════════════════════════════════
   PÁGINA 5 — ARENA DOS DEUSES
══════════════════════════════════════════ */
const GODS_DATA=[
  {name:"Ares",  face:"😡",crown:"🪖",weapon:"⚔️",title:"Deus da Guerra",     maxHp:65,  dmgMin:10,dmgMax:18,progId:"prog-0",borderColor:"#ef4444",bgColor:"rgba(239,68,68,.35)"},
  {name:"Hermes",face:"😏",crown:"🌿",weapon:"🌀",title:"Mensageiro Divino",   maxHp:82,  dmgMin:13,dmgMax:23,progId:"prog-1",borderColor:"#a78bfa",bgColor:"rgba(167,139,250,.35)"},
  {name:"Zeus",  face:"😤",crown:"⚡",weapon:"⛈️",title:"Rei do Olimpo",       maxHp:115, dmgMin:18,dmgMax:32,progId:"prog-2",borderColor:"#fbbf24",bgColor:"rgba(251,191,36,.35)"},
];
const INTROS=["⚔️ Ares avança com fúria incontrolável! A terra treme!",
  "🪽 Hermes surge num piscar de olhos! Velocidade divina!",
  "⚡ Zeus desce do trono! O céu racha com seu rugido!"];

let godIndex,godHp,playerHp,magicUses,defending,gameActive;

const enemyPortrait = document.getElementById("enemy-portrait");
const heroPortrait  = document.getElementById("hero-portrait");
const enemyFx  = document.getElementById("enemy-fx");
const heroFx   = document.getElementById("hero-fx");
const pECrown  = document.getElementById("p-enemy-crown");
const pEFace   = document.getElementById("p-enemy-face");
const pEWeapon = document.getElementById("p-enemy-weapon");
const enemyPlate= document.getElementById("enemy-plate");
const enemyTitle= document.getElementById("enemy-title");
const godNameEl = document.getElementById("god-name");
const godHpBar  = document.getElementById("god-hp-bar");
const godHpText = document.getElementById("god-hp-text");
const playerHpBar  = document.getElementById("player-hp-bar");
const playerHpText = document.getElementById("player-hp-text");
const battleLog = document.getElementById("battle-log");
const actionBtns= document.getElementById("action-btns");
const gameOverScr= document.getElementById("game-over-screen");
const resultIcon = document.getElementById("result-icon");
const resultTitle= document.getElementById("result-title");
const resultMsg  = document.getElementById("result-msg");
const btnAttack  = document.getElementById("btn-attack");
const btnMagic   = document.getElementById("btn-magic");
const btnDefend  = document.getElementById("btn-defend");
const btnRetry   = document.getElementById("btn-retry");
const dmgFloats  = document.getElementById("dmg-floats");

function initGame(){
  godIndex=0;playerHp=100;magicUses=3;defending=false;gameActive=true;
  gameOverScr.style.display="none";actionBtns.style.display="flex";
  battleLog.innerHTML="";
  GODS_DATA.forEach(g=>{ const el=document.getElementById(g.progId);
    el.classList.remove("active","defeated"); });
  loadGod(0);updatePlayerHp();updateMagicPips();setButtons(true);
  addLog(INTROS[0],"special");
}
function resetGame(){ gameActive=false; }

function loadGod(idx){
  const g=GODS_DATA[idx];godHp=g.maxHp;
  pECrown.innerText=g.crown;pEFace.innerText=g.face;pEWeapon.innerText=g.weapon;
  enemyPlate.innerText=g.name;enemyTitle.innerText=g.title;godNameEl.innerText=g.name;
  // Atualiza estilo do retrato do inimigo
  enemyPortrait.style.borderColor=g.borderColor;
  enemyPortrait.style.boxShadow=`0 0 25px ${g.borderColor}80,inset 0 0 30px rgba(0,0,0,.15)`;
  // Atualiza cor do fundo
  const bd=document.getElementById("enemy-backdrop");
  if(bd)bd.style.background=`radial-gradient(ellipse at center,${g.bgColor},transparent)`;
  setPortraitAnim(enemyPortrait,"idle");setPortraitAnim(heroPortrait,"idle");
  updateGodHp();document.getElementById(g.progId).classList.add("active");
}

function setPortraitAnim(el, anim){
  el.className=el.className.replace(/\banim-\S+\b|\bidle\b/g,"").trim();
  if(el.id==="enemy-portrait") el.className="char-portrait enemy-portrait "+(anim||"idle");
  else el.className="char-portrait hero-portrait "+(anim||"idle");
}
function playPortraitAnim(el,anim,dur=650){
  return new Promise(res=>{ setPortraitAnim(el,anim);
    setTimeout(()=>{ setPortraitAnim(el,"idle"); res(); },dur); });
}

function spawnDmg(dmg,isPlayer,big=false){
  const d=document.createElement("div");d.classList.add("dmg-float");
  d.classList.add(isPlayer?"p-dmg":"g-dmg");if(big)d.classList.add("big");
  d.innerText="-"+dmg;d.style.left=(isPlayer?"18%":"62%");d.style.top="-30px";
  dmgFloats.appendChild(d);setTimeout(()=>d.remove(),1200);
}

function updateGodHp(){
  const g=GODS_DATA[godIndex];const pct=Math.max(0,godHp/g.maxHp*100);
  godHpBar.style.width=pct+"%";godHpText.innerText=`${Math.max(0,godHp)} / ${g.maxHp}`;
}
function updatePlayerHp(){
  const pct=Math.max(0,playerHp/100*100);playerHpBar.style.width=pct+"%";
  playerHpText.innerText=`${Math.max(0,playerHp)} / 100`;
  playerHpBar.style.background=playerHp<=30
    ?"linear-gradient(90deg,#7f1d1d,#ef4444)"
    :"linear-gradient(90deg,#002D8A,#38BDEF)";
}
function updateMagicPips(){
  [0,1,2].forEach(i=>{const p=document.getElementById(`magic-pip-${i}`);
    if(p)p.classList.toggle("active",i<magicUses);});
  btnMagic.disabled=!gameActive||magicUses<=0;
}
function setButtons(on){
  btnAttack.disabled=!on;btnDefend.disabled=!on;btnMagic.disabled=!on||magicUses<=0;
}
function addLog(msg,type="normal"){
  const el=document.createElement("div");el.classList.add("log-entry");
  if(type==="p-action")el.classList.add("p-action");
  if(type==="g-action")el.classList.add("g-action");
  if(type==="special")el.classList.add("special");
  if(type==="intro")el.classList.add("intro-log");
  el.innerText=msg;battleLog.appendChild(el);battleLog.scrollTop=battleLog.scrollHeight;
}
function rand(min,max){return Math.floor(Math.random()*(max-min+1))+min;}

async function godTurn(){
  if(!gameActive)return;
  const g=GODS_DATA[godIndex];let dmg=rand(g.dmgMin,g.dmgMax);let extra="";
  const roll=Math.random();const big=roll<.12;
  if(big){dmg=Math.floor(dmg*1.8);extra=" 💥 GOLPE DEVASTADOR!";}
  else if(roll<.22){dmg=Math.floor(dmg*.4);extra=" (golpe fraco)";}
  if(defending){dmg=Math.floor(dmg*.3);extra+=" 🛡️ Bloqueado!";defending=false;}
  // Animações: inimigo ataca, herói pisca
  await playPortraitAnim(enemyPortrait,"anim-atk-l",500);
  setTimeout(()=>playPortraitAnim(heroPortrait,"anim-blink-damage",680),120);
  playerHp=Math.max(0,playerHp-dmg);spawnDmg(dmg,false,big);
  addLog(`${g.icon||g.crown} ${g.name} ataca por ${dmg} de dano!${extra}`,"g-action");
  updatePlayerHp();
  if(playerHp<=0){setTimeout(defeat,700);}
  else{setTimeout(()=>setButtons(true),560);}
}

async function playerAction(dmg,type){
  if(!gameActive)return;setButtons(false);
  if(type==="magic"){
    await playPortraitAnim(heroPortrait,"anim-magic-explosion",850);
    setTimeout(()=>playPortraitAnim(enemyPortrait,"anim-blink-damage",680),200);
  } else if(type==="defend"){
    await playPortraitAnim(heroPortrait,"anim-defend",480);
  } else {
    await playPortraitAnim(heroPortrait,"anim-atk-r",500);
    setTimeout(()=>playPortraitAnim(enemyPortrait,"anim-blink-damage",680),150);
  }
  if(type==="attack"){
    godHp=Math.max(0,godHp-dmg);spawnDmg(dmg,true,dmg>=20);
    addLog(`⚔️ Você atacou ${GODS_DATA[godIndex].name} por ${dmg} de dano!`,"p-action");updateGodHp();
  } else if(type==="magic"){
    godHp=Math.max(0,godHp-dmg);spawnDmg(dmg,true,true);
    addLog(`✨ Magia oceânica atinge ${GODS_DATA[godIndex].name} por ${dmg} de dano!`,"p-action");updateGodHp();
  } else if(type==="defend"){
    addLog("🛡️ Postura defensiva! Próximo ataque reduzido em 70%!","p-action");
  }
  if(godHp<=0){setTimeout(nextGod,700);return;}
  setTimeout(godTurn,700);
}

function nextGod(){
  const g=GODS_DATA[godIndex];
  addLog(`🏆 ${g.name} foi derrotado! Glória ao semideus!`,"special");
  setPortraitAnim(heroPortrait,"anim-victory");
  setPortraitAnim(enemyPortrait,"anim-defeat");
  document.getElementById(g.progId).classList.remove("active");
  document.getElementById(g.progId).classList.add("defeated");
  godIndex++;
  if(godIndex>=GODS_DATA.length){setTimeout(victory,900);}
  else{setTimeout(()=>{loadGod(godIndex);addLog(INTROS[godIndex],"special");setButtons(true);},1100);}
}

function victory(){
  gameActive=false;setPortraitAnim(heroPortrait,"anim-victory");
  resultIcon.innerText="🏆";resultTitle.innerText="Vitória Olímpica!";
  resultMsg.innerText="Você derrotou Ares, Hermes e o próprio Zeus! O Olimpo reconhece seu valor! 🍕⚡🔱";
  gameOverScr.style.display="flex";actionBtns.style.display="none";
}
function defeat(){
  gameActive=false;setPortraitAnim(heroPortrait,"anim-defeat");
  resultIcon.innerText="💀";resultTitle.innerText="Derrotado...";
  resultMsg.innerText="Os deuses se mostram poderosos demais desta vez. Tente novamente, guerreiro!";
  gameOverScr.style.display="flex";actionBtns.style.display="none";
}

btnAttack.addEventListener("click",()=>playerAction(rand(14,24),"attack"));
btnMagic.addEventListener("click",()=>{
  if(magicUses<=0)return;magicUses--;updateMagicPips();playerAction(rand(26,40),"magic");});
btnDefend.addEventListener("click",()=>{defending=true;playerAction(0,"defend");});
btnRetry.addEventListener("click",initGame);

}); // DOMContentLoaded

const $=id=>document.getElementById(id);
const song=$('song'),musicToggle=$('musicToggle'),loginForm=$('loginForm'),loginScreen=$('loginScreen'),loginError=$('loginError'),duckLayer=$('duckLayer');
const cakeAction=$('cakeAction'),cakeScene=$('cakeScene'),cakeTitle=$('cakeTitle'),cakeInstruction=$('cakeInstruction'),wishResult=$('wishResult'),cakeNext=$('cakeNext');
const envelopeBtn=$('envelopeBtn'),letter=$('letter'),replay=$('replay');
const lightbox=$('lightbox'),lightboxImg=$('lightboxImg'),lightboxCaption=$('lightboxCaption'),closeLightbox=$('closeLightbox');
let candlesOut=0,cakeCut=false,unlocked=false,currentPage='cakePage';
const pages=['cakePage','memory1','memory2','memory3','memory4','memory5','memory6','final'];

function createLoginDucks(){
  if(!duckLayer || duckLayer.children.length) return;
  const positions=[
    [2,7,0.15,-8],[18,20,0.10,6],[34,5,0.14,-4],[51,16,0.12,7],[69,6,0.16,-6],[87,18,0.11,5],
    [5,72,0.12,5],[21,87,0.15,-7],[43,74,0.11,4],[62,88,0.16,-5],[80,72,0.13,6],[93,88,0.10,-4],
    [3,44,0.09,3],[91,45,0.13,-5],[14,55,0.08,7],[84,57,0.09,-6]
  ];
  positions.forEach(([x,y,scale,rot],i)=>{
    const d=document.createElement('img');
    d.className='login-duck-image';
    d.src='images/duck-reference.png';
    d.alt='';
    d.style.left=x+'%'; d.style.top=y+'%';
    d.style.setProperty('--duck-scale',scale);
    d.style.setProperty('--duck-rot',rot+'deg');
    d.style.setProperty('--dur',(4.8+(i%5)*.5)+'s');
    d.style.setProperty('--delay',(-i*.37)+'s');
    duckLayer.appendChild(d);
  });
}
createLoginDucks();

function showPage(id){if(!unlocked)return;pages.forEach(p=>$(p).classList.remove('active'));$(id).classList.add('active');currentPage=id; if(id.startsWith('memory'))playMusic(); else stopMusic(); popPageSparkles();}
function playMusic(){if(!unlocked)return;song.play().then(()=>musicToggle.innerHTML='♫ <span>Music playing</span>').catch(()=>{});}
function stopMusic(){song.pause();musicToggle.innerHTML='♫ <span>Music</span>';}
loginForm.addEventListener('submit',e=>{e.preventDefault();const u=$('username').value.trim(),p=$('password').value;if(u==='Dheposh'&&p==='Moumithebest1'){unlocked=true;document.body.classList.remove('locked');document.body.classList.add('unlocked');loginScreen.classList.add('login-exit');setTimeout(()=>{loginScreen.style.display='none';showPage('cakePage');startPetals();},650);loginError.textContent='';}else{loginError.textContent='That username or password is not quite right. ✿';$('password').value='';}});
musicToggle.addEventListener('click',()=>song.paused?playMusic():stopMusic());
function blowCandle(n){if(cakeCut||n>3)return;const candle=document.querySelector(`.candle[data-candle="${n}"]`),flame=document.querySelector(`.flame[data-candle="${n}"]`);if(!candle||candle.classList.contains('blown-candle'))return;flame.classList.add('blown');candle.classList.add('blown-candle');candlesOut++;popSparks(flame);if(candlesOut<3){cakeInstruction.textContent=`Beautiful. ${3-candlesOut} candle${3-candlesOut>1?'s':''} left. ✨`;}else{cakeTitle.textContent='Wish made. ✿';cakeInstruction.textContent='Now click the cake to cut it!';cakeAction.classList.add('hidden');cakeScene.classList.add('cut-ready');wishResult.classList.add('show');}}
document.querySelectorAll('.candle,.flame').forEach(el=>el.addEventListener('click',e=>{e.stopPropagation();blowCandle(Number(el.dataset.candle));}));
cakeAction.addEventListener('click',()=>{if(candlesOut<3)blowCandle(candlesOut+1);});
cakeScene.addEventListener('click',()=>{if(candlesOut===3&&!cakeCut){cakeCut=true;cakeScene.classList.add('cake-cut');cakeScene.classList.remove('cut-ready');cakeTitle.textContent='Cake cut! 🎂';cakeInstruction.textContent='A little celebration before the memories…';wishResult.classList.add('show');wishResult.innerHTML='<strong>Party time! 🎊</strong><p>Now press the button when you are ready.</p>';playCannonCelebration();burstParty();cakeNext.classList.remove('hidden');cakeNext.classList.add('show-next');}});
cakeNext.addEventListener('click',()=>showPage('memory1'));
$('nextMemory1').addEventListener('click',()=>showPage('memory2'));$('nextMemory2').addEventListener('click',()=>showPage('memory3'));$('nextMemory3').addEventListener('click',()=>showPage('memory4'));$('nextMemory4').addEventListener('click',()=>showPage('memory5'));$('nextMemory5').addEventListener('click',()=>showPage('memory6'));$('nextFinal').addEventListener('click',()=>showPage('final'));
function playCannonCelebration(){
  // The cake click is a user gesture, so a short Web Audio celebration can play without an external sound file.
  try{
    const Ctx=window.AudioContext||window.webkitAudioContext;
    if(!Ctx)return;
    const ctx=new Ctx();
    const now=ctx.currentTime;
    [0.04,0.22].forEach((delay,index)=>{
      const t=now+delay;
      const osc=ctx.createOscillator(), gain=ctx.createGain(), filter=ctx.createBiquadFilter();
      osc.type='sine'; osc.frequency.setValueAtTime(170+index*35,t); osc.frequency.exponentialRampToValueAtTime(55,t+0.18);
      filter.type='lowpass'; filter.frequency.value=1800;
      gain.gain.setValueAtTime(0.0001,t); gain.gain.exponentialRampToValueAtTime(0.55,t+0.008); gain.gain.exponentialRampToValueAtTime(0.0001,t+0.22);
      osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination); osc.start(t); osc.stop(t+0.24);
      const buffer=ctx.createBuffer(1,ctx.sampleRate*0.16,ctx.sampleRate), data=buffer.getChannelData(0);
      for(let i=0;i<data.length;i++) data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,2);
      const src=ctx.createBufferSource(), ng=ctx.createGain(), hp=ctx.createBiquadFilter();
      src.buffer=buffer; hp.type='highpass'; hp.frequency.value=900; ng.gain.setValueAtTime(0.0001,t); ng.gain.exponentialRampToValueAtTime(0.28,t+0.004); ng.gain.exponentialRampToValueAtTime(0.0001,t+0.15);
      src.connect(hp); hp.connect(ng); ng.connect(ctx.destination); src.start(t);
    });
    setTimeout(()=>ctx.close(),900);
  }catch(e){}
  launchSidePopper('left',0);
  launchSidePopper('right',140);
}
function launchSidePopper(side,delay){
  setTimeout(()=>{
    const cannon=document.createElement('div'); cannon.className='popper-cannon '+side; cannon.innerHTML='<span class="popper-mouth"></span><b>POP!</b>'; document.body.appendChild(cannon);
    requestAnimationFrame(()=>cannon.classList.add('fire'));
    const symbols=['✿','✦','❀','•','✧','🌼'];
    for(let i=0;i<26;i++){
      const bit=document.createElement('span'); bit.className='party-bit '+side; bit.textContent=symbols[Math.floor(Math.random()*symbols.length)];
      const spread=side==='left'? (Math.random()*42-4) : (Math.random()*42+62);
      bit.style.left=spread+'vw'; bit.style.top=(48+Math.random()*9)+'vh';
      bit.style.setProperty('--dx',(side==='left'?(90+Math.random()*42):(-90-Math.random()*42))+'px');
      bit.style.setProperty('--dy',(-40-Math.random()*190)+'px');
      bit.style.setProperty('--rot',(Math.random()*720-360)+'deg'); bit.style.animationDelay=(Math.random()*.16)+'s';
      document.body.appendChild(bit); setTimeout(()=>bit.remove(),2300);
    }
    setTimeout(()=>cannon.remove(),1100);
  },delay);
}

function openPhoto(photo){const img=photo.querySelector('img');lightboxImg.src=img.src;lightboxCaption.textContent='✿ Dheposh · exact photo · tap × to close';lightbox.classList.add('show');}document.querySelectorAll('.photo').forEach(photo=>photo.addEventListener('click',()=>openPhoto(photo)));function closeBox(){lightbox.classList.remove('show');setTimeout(()=>lightboxImg.src='',250);}closeLightbox.addEventListener('click',closeBox);lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeBox();});
envelopeBtn.addEventListener('click',()=>{letter.classList.add('open');envelopeBtn.classList.add('opened');stopMusic();popSparks(envelopeBtn);});
function popSparks(origin){const r=origin.getBoundingClientRect();for(let i=0;i<14;i++){const s=document.createElement('div');s.className='spark';s.textContent=['✦','✧','✿','•','✨'][Math.floor(Math.random()*5)];s.style.position='fixed';s.style.zIndex='150';s.style.left=(r.left+r.width/2)+'px';s.style.top=(r.top+r.height/2)+'px';s.style.setProperty('--dx',(Math.random()*240-120)+'px');s.style.setProperty('--dy',(Math.random()*220-110)+'px');s.style.animation='sparkOut 1.5s ease forwards';document.body.appendChild(s);setTimeout(()=>s.remove(),1600);}}
function popPageSparkles(){for(let i=0;i<12;i++)setTimeout(()=>{const x=document.createElement('div');x.className='page-spark';x.textContent=['✦','✿','❀','✨'][Math.floor(Math.random()*4)];x.style.left=(10+Math.random()*80)+'vw';x.style.top=(15+Math.random()*65)+'vh';document.body.appendChild(x);setTimeout(()=>x.remove(),1300);},i*55);}
function burstParty(){for(let i=0;i<70;i++){const p=document.createElement('div');p.className='party-popper';p.textContent=['🎉','🎊','✨','✿','🌸','⭐','🪻'][Math.floor(Math.random()*7)];p.style.left=Math.random()*100+'vw';p.style.setProperty('--dx',(Math.random()*420-210)+'px');p.style.setProperty('--rot',(Math.random()*1000-500)+'deg');p.style.animationDelay=Math.random()*.8+'s';document.body.appendChild(p);setTimeout(()=>p.remove(),4500);}}
function startPetals(){if(window._petalTimer)return;const box=$('petals'),chars=['✿','❀','✦','🌸','🪻'];function add(){const p=document.createElement('div');p.className='petal';p.textContent=chars[Math.floor(Math.random()*chars.length)];p.style.left=Math.random()*100+'vw';p.style.fontSize=(12+Math.random()*14)+'px';p.style.animationDuration=(5+Math.random()*7)+'s';p.style.setProperty('--wind',(Math.random()*180-90)+'px');p.style.opacity=.25+Math.random()*.5;box.appendChild(p);setTimeout(()=>p.remove(),13000);}window._petalTimer=setInterval(add,700);for(let i=0;i<10;i++)setTimeout(add,i*180);}
replay.addEventListener('click',()=>{stopMusic();candlesOut=0;cakeCut=false;unlocked=false;currentPage='cakePage';document.querySelectorAll('.flame').forEach(x=>x.classList.remove('blown'));document.querySelectorAll('.candle').forEach(x=>x.classList.remove('blown-candle'));cakeScene.classList.remove('cake-cut','cut-ready');cakeTitle.textContent='Make a wish.';cakeInstruction.textContent='Click each candle to blow it out ✨';cakeAction.classList.remove('hidden');wishResult.classList.remove('show');cakeNext.classList.remove('show-next');letter.classList.remove('open');envelopeBtn.classList.remove('opened');pages.forEach(p=>$(p).classList.remove('active'));$('cakePage').classList.add('active');document.body.classList.add('locked');document.body.classList.remove('unlocked');loginScreen.classList.remove('login-exit');loginScreen.style.display='grid';loginForm.reset();});

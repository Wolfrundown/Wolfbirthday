const $ = (id) => document.getElementById(id);
const song = $('song'), musicToggle = $('musicToggle');
const loginForm = $('loginForm'), loginScreen = $('loginScreen'), siteContent = $('siteContent'), loginError = $('loginError');
const cakeAction = $('cakeAction'), cakeScene = $('cakeScene'), cakeTitle = $('cakeTitle'), cakeInstruction = $('cakeInstruction'), wishResult = $('wishResult'), cakeNext = $('cakeNext');
const envelopeBtn = $('envelopeBtn'), letter = $('letter'), replay = $('replay');
const lightbox = $('lightbox'), lightboxImg = $('lightboxImg'), lightboxCaption = $('lightboxCaption'), closeLightbox = $('closeLightbox');
let candlesOut = 0, cakeCut = false, unlocked = false;

function scrollToId(id){ $(id)?.scrollIntoView({behavior:'smooth', block:'start'}); }
function playMusic(){ if(!unlocked) return; song.play().then(()=>musicToggle.innerHTML='♫ <span>Music playing</span>').catch(()=>{}); }
function stopMusic(){ song.pause(); musicToggle.innerHTML='♫ <span>Music</span>'; }

loginForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  const u=$('username').value.trim(), p=$('password').value;
  if(u==='Dheposh' && p==='Moumithebest1'){
    unlocked=true; document.body.classList.remove('locked'); document.body.classList.add('unlocked');
    loginScreen.classList.add('login-exit');
    setTimeout(()=>{ loginScreen.style.display='none'; $('cakePage').classList.add('active'); scrollToId('cakePage'); startPetals(); },650);
    loginError.textContent='';
  } else { loginError.textContent='That username or password is not quite right. ♡'; $('password').value=''; }
});

musicToggle.addEventListener('click',()=>song.paused?playMusic():stopMusic());

function blowCandle(n){
  if(cakeCut || n>3) return;
  const candle=document.querySelector(`.candle[data-candle="${n}"]`), flame=document.querySelector(`.flame[data-candle="${n}"]`);
  if(!candle || candle.classList.contains('blown-candle')) return;
  flame.classList.add('blown'); candle.classList.add('blown-candle'); candlesOut++; popSparks(flame);
  if(candlesOut<3){ cakeInstruction.textContent=`Beautiful. ${3-candlesOut} candle${3-candlesOut>1?'s':''} left. ✨`; }
  else { cakeTitle.textContent='Wish made. 💗'; cakeInstruction.textContent='Now click the cake to cut it!'; cakeAction.classList.add('hidden'); cakeScene.classList.add('cut-ready'); wishResult.classList.add('show'); }
}
document.querySelectorAll('.candle,.flame').forEach(el=>el.addEventListener('click',e=>{e.stopPropagation();blowCandle(Number(el.dataset.candle));}));
cakeAction.addEventListener('click',()=>{ if(candlesOut<3) blowCandle(candlesOut+1); });
cakeScene.addEventListener('click',()=>{
  if(candlesOut===3 && !cakeCut){
    cakeCut=true; cakeScene.classList.add('cake-cut'); cakeScene.classList.remove('cut-ready'); cakeTitle.textContent='Cake cut! 🎂'; cakeInstruction.textContent='Okay… NOW LET THE PARTY BEGIN! 🎉';
    wishResult.classList.add('show'); wishResult.innerHTML='<strong>Party time! 🎊</strong><p>Press the button below when you are ready.</p>'; burstParty(); cakeNext.classList.remove('hidden'); cakeNext.classList.add('show-next'); playMusic();
  }
});
cakeNext.addEventListener('click',()=>{playMusic(); scrollToId('memory1');});

$('nextMemory1').addEventListener('click',()=>scrollToId('memory2'));
$('nextMemory2').addEventListener('click',()=>scrollToId('memory3'));
$('nextFinal').addEventListener('click',()=>scrollToId('final'));

function openPhoto(photo){ const img=photo.querySelector('img'); lightboxImg.src=img.src; lightboxCaption.textContent='♡ Dheposh · exact photo · tap × to close'; lightbox.classList.add('show'); }
document.querySelectorAll('.photo').forEach(photo=>photo.addEventListener('click',()=>openPhoto(photo)));
function closeBox(){lightbox.classList.remove('show');setTimeout(()=>lightboxImg.src='',250);}
closeLightbox.addEventListener('click',closeBox); lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeBox();});

envelopeBtn.addEventListener('click',()=>{letter.classList.add('open'); envelopeBtn.classList.add('opened'); stopMusic(); setTimeout(()=>letter.scrollIntoView({behavior:'smooth',block:'center'}),120); popSparks(envelopeBtn);});

const memorySections=['memory1','memory2','memory3'];
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting && unlocked){ entry.target.classList.add('active'); if(memorySections.includes(entry.target.id)) playMusic(); else if(entry.target.id==='final') stopMusic(); }
}),{threshold:.35});
['cakePage',...memorySections,'final'].forEach(id=>sectionObserver.observe($(id)));

function popSparks(origin){const r=origin.getBoundingClientRect();for(let i=0;i<12;i++){const s=document.createElement('div');s.className='spark';s.textContent=['✦','✧','♡','•','✨'][Math.floor(Math.random()*5)];s.style.left=(r.left+r.width/2)+'px';s.style.top=(r.top+r.height/2)+'px';s.style.setProperty('--dx',(Math.random()*240-120)+'px');s.style.setProperty('--dy',(Math.random()*220-110)+'px');document.body.appendChild(s);setTimeout(()=>s.remove(),1800);}}
function burstParty(){for(let i=0;i<60;i++){const p=document.createElement('div');p.className='party-popper';p.textContent=['🎉','🎊','✨','♡','🌸','⭐','💗'][Math.floor(Math.random()*7)];p.style.left=Math.random()*100+'vw';p.style.setProperty('--dx',(Math.random()*420-210)+'px');p.style.setProperty('--rot',(Math.random()*1000-500)+'deg');p.style.animationDelay=Math.random()*.8+'s';document.body.appendChild(p);setTimeout(()=>p.remove(),4500);}}
function startPetals(){ if(window._petalTimer) return; const box=$('petals'); const chars=['✿','❀','♡','✦','🌸']; function add(){const p=document.createElement('div');p.className='petal';p.textContent=chars[Math.floor(Math.random()*chars.length)];p.style.left=Math.random()*100+'vw';p.style.fontSize=(12+Math.random()*14)+'px';p.style.animationDuration=(5+Math.random()*7)+'s';p.style.opacity=.25+Math.random()*.5;box.appendChild(p);setTimeout(()=>p.remove(),13000);} window._petalTimer=setInterval(add,700); for(let i=0;i<10;i++)setTimeout(add,i*180);}

replay.addEventListener('click',()=>{
  stopMusic(); candlesOut=0; cakeCut=false; unlocked=false;
  document.querySelectorAll('.flame').forEach(x=>x.classList.remove('blown')); document.querySelectorAll('.candle').forEach(x=>x.classList.remove('blown-candle'));
  cakeScene.classList.remove('cake-cut','cut-ready'); cakeTitle.textContent='Make a wish.'; cakeInstruction.textContent='Click each candle to blow it out ✨'; cakeAction.classList.remove('hidden'); wishResult.classList.remove('show'); cakeNext.classList.remove('show-next'); letter.classList.remove('open'); envelopeBtn.classList.remove('opened');
  document.body.classList.add('locked'); document.body.classList.remove('unlocked'); loginScreen.classList.remove('login-exit'); loginScreen.style.display='grid'; loginForm.reset(); window.scrollTo({top:0,behavior:'smooth'});
});

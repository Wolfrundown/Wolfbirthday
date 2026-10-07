const song=document.getElementById('song');
const musicToggle=document.getElementById('musicToggle');
const loginForm=document.getElementById('loginForm');
const loginScreen=document.getElementById('loginScreen');
const siteContent=document.getElementById('siteContent');
const loginError=document.getElementById('loginError');
const cakeAction=document.getElementById('cakeAction');
const cakeScene=document.getElementById('cakeScene');
const cakeTitle=document.getElementById('cakeTitle');
const cakeInstruction=document.getElementById('cakeInstruction');
const wishResult=document.getElementById('wishResult');
const photoPages=[document.getElementById('memories'),document.getElementById('moreMemories')];
const envelopeBtn=document.getElementById('envelopeBtn');
const letter=document.getElementById('letter');
const replay=document.getElementById('replay');
const lightbox=document.getElementById('lightbox');
const lightboxImg=document.getElementById('lightboxImg');
const lightboxCaption=document.getElementById('lightboxCaption');
const closeLightbox=document.getElementById('closeLightbox');
let candlesOut=0, cakeCut=false, unlocked=false;

loginForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  const u=document.getElementById('username').value.trim();
  const p=document.getElementById('password').value;
  if(u==='Dheposh' && p==='Moumithebest1'){
    unlocked=true;
    document.body.classList.remove('locked');
    document.body.classList.add('unlocked');
    loginScreen.style.display='none';
    loginError.textContent='';
    window.scrollTo({top:0,behavior:'instant'});
  }else{
    loginError.textContent='That username or password is not quite right. ♡';
    document.getElementById('password').value='';
  }
});

function playMusic(){
  if(!unlocked) return;
  song.play().then(()=>{musicToggle.innerHTML='♫ <span>Music playing</span>';}).catch(()=>{});
}
function stopMusic(){song.pause();musicToggle.innerHTML='♫ <span>Music</span>';}
musicToggle.addEventListener('click',()=>song.paused?playMusic():stopMusic());

const photoObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting && unlocked) playMusic();
  });
},{threshold:.3});
photoPages.forEach(p=>photoObserver.observe(p));

const pageObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting && (entry.target.id==='cakePage'||entry.target.id==='final')) stopMusic();
  });
},{threshold:.35});
pageObserver.observe(document.getElementById('cakePage')); pageObserver.observe(document.getElementById('final'));

function blowCandle(n){
  if(cakeCut || n>3 || document.querySelector(`.candle[data-candle="${n}"]`).classList.contains('blown-candle')) return;
  const flame=document.querySelector(`.flame[data-candle="${n}"]`), candle=document.querySelector(`.candle[data-candle="${n}"]`);
  flame.classList.add('blown'); candle.classList.add('blown-candle'); candlesOut++;
  popSparks(flame);
  if(candlesOut<3){ cakeInstruction.textContent=`Beautiful. ${3-candlesOut} candle${3-candlesOut>1?'s':''} left. ✨`; }
  else { cakeTitle.textContent='Wish made. 💗'; cakeInstruction.textContent='Now click the cake to cut it!'; cakeAction.style.display='none'; cakeScene.classList.add('cut-ready'); wishResult.classList.add('show'); }
}
document.querySelectorAll('.candle,.flame').forEach(el=>el.addEventListener('click',e=>{e.stopPropagation();blowCandle(Number(el.dataset.candle));}));
cakeAction.addEventListener('click',()=>{ if(candlesOut<3) blowCandle(candlesOut+1); });

cakeScene.addEventListener('click',()=>{
  if(candlesOut===3 && !cakeCut){
    cakeCut=true; cakeScene.classList.add('cake-cut'); cakeScene.classList.remove('cut-ready');
    cakeTitle.textContent='Cake cut! 🎂'; cakeInstruction.textContent='Okay… NOW LET THE PARTY BEGIN! 🎉';
    wishResult.classList.add('show'); wishResult.innerHTML='<strong>Party time! 🎊</strong><p>Scroll down for the little memory archive.</p>';
    burstParty(); setTimeout(()=>document.getElementById('memories').scrollIntoView({behavior:'smooth'}),1800);
  }
});

document.querySelectorAll('.photo').forEach(photo=>photo.addEventListener('click',()=>{
  const img=photo.querySelector('img'); lightboxImg.src=img.src; lightboxCaption.textContent='♡ Dheposh · exact photo · tap × to close'; lightbox.classList.add('show');
}));
function closeBox(){lightbox.classList.remove('show');lightboxImg.src='';}
closeLightbox.addEventListener('click',closeBox); lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeBox();});

envelopeBtn.addEventListener('click',()=>{letter.classList.add('open'); envelopeBtn.style.transform='scale(.92)'; stopMusic(); setTimeout(()=>letter.scrollIntoView({behavior:'smooth',block:'center'}),120); popSparks(envelopeBtn);});

replay.addEventListener('click',()=>{
  stopMusic(); candlesOut=0; cakeCut=false; unlocked=false;
  document.querySelectorAll('.flame').forEach(x=>x.classList.remove('blown'));
  document.querySelectorAll('.candle').forEach(x=>x.classList.remove('blown-candle'));
  cakeScene.classList.remove('cake-cut','cut-ready'); cakeTitle.textContent='Make a wish.'; cakeInstruction.textContent='Click each candle to blow it out ✨';
  cakeAction.style.display='inline-block'; cakeAction.textContent='Blow out the candles ✨'; wishResult.classList.remove('show'); letter.classList.remove('open');
  document.body.classList.add('locked'); document.body.classList.remove('unlocked'); loginScreen.style.display='grid'; loginForm.reset(); window.scrollTo({top:0,behavior:'smooth'});
});
function popSparks(origin){const r=origin.getBoundingClientRect();const x=r.left+r.width/2,y=r.top+r.height/2;for(let i=0;i<9;i++){const s=document.createElement('div');s.className='spark';s.textContent=['✦','✧','♡','•'][Math.floor(Math.random()*4)];s.style.left=x+'px';s.style.top=y+'px';s.style.setProperty('--dx',(Math.random()*180-90)+'px');s.style.setProperty('--dy',(Math.random()*180-90)+'px');document.body.appendChild(s);setTimeout(()=>s.remove(),1800);}}
function burstParty(){for(let i=0;i<42;i++){const p=document.createElement('div');p.className='party-popper';p.textContent=['🎉','🎊','✨','♡','🌸','⭐'][Math.floor(Math.random()*6)];p.style.left=Math.random()*100+'vw';p.style.setProperty('--dx',(Math.random()*300-150)+'px');p.style.setProperty('--rot',(Math.random()*720-360)+'deg');p.style.animationDelay=Math.random()*.7+'s';document.body.appendChild(p);setTimeout(()=>p.remove(),4300);}}

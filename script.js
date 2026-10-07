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
const memories=document.getElementById('memories');
const envelopeBtn=document.getElementById('envelopeBtn');
const letter=document.getElementById('letter');
const replay=document.getElementById('replay');
const lightbox=document.getElementById('lightbox');
const lightboxImg=document.getElementById('lightboxImg');
const lightboxCaption=document.getElementById('lightboxCaption');
const closeLightbox=document.getElementById('closeLightbox');

let candlesOut=0;
let cakeCut=false;

loginForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  const u=document.getElementById('username').value.trim();
  const p=document.getElementById('password').value;
  if(u==='Dheposh' && p==='Moumithebest1'){
    document.body.classList.remove('locked');
    document.body.classList.add('unlocked');
    loginScreen.style.display='none';
    window.scrollTo(0,0);
  }else{
    loginError.textContent='Hmm… that is not the birthday-girl password. ♡';
    document.getElementById('password').value='';
  }
});

function startMusic(){
  song.play().catch(()=>{});
  musicToggle.innerHTML='♫ <span>Music playing</span>';
}
musicToggle.addEventListener('click',()=>{
  if(song.paused) startMusic();
  else {song.pause();musicToggle.innerHTML='♫ <span>Play music</span>';}
});

// Music is deliberately NOT started at login/cake/final.
// It starts when the photos section is entered.
let musicStarted=false;
const observer=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting && !musicStarted){
      musicStarted=true;
      startMusic();
    }
  });
},{threshold:.35});
observer.observe(memories);

cakeAction.addEventListener('click',()=>{
  if(candlesOut<3){
    const next=candlesOut+1;
    const flame=document.querySelector(`.flame[data-candle="${next}"]`);
    const candle=document.querySelector(`.candle[data-candle="${next}"]`);
    if(flame) flame.style.display='none';
    if(candle) candle.classList.add('blown-candle');
    candlesOut++;
    popSparks(flame||cakeAction);
    if(candlesOut<3){
      cakeInstruction.textContent=`Nice! ${3-candlesOut} candle${3-candlesOut>1?'s':''} left. Click again ✨`;
      cakeAction.textContent='Blow the next candle 🕯️';
    }else{
      cakeTitle.textContent='Wish made. 💗';
      cakeInstruction.textContent='Now click the cake to cut it!';
      cakeAction.style.display='none';
      cakeScene.classList.add('cut-ready');
      wishResult.classList.add('show');
      wishResult.innerHTML='<strong>Cut the cake! 🎂</strong><p>Click the cake once to make the cut.</p>';
    }
  }
});

cakeScene.addEventListener('click',(e)=>{
  if(candlesOut===3 && !cakeCut){
    cakeCut=true;
    cakeScene.classList.add('cake-cut');
    cakeScene.classList.remove('cut-ready');
    cakeTitle.textContent='Cake cut! 🎂';
    cakeInstruction.textContent='Okay… NOW LET THE PARTY BEGIN! 🎉';
    wishResult.innerHTML='<strong>Party time! 🎊</strong><p>Scroll down for your little memory archive.</p>';
    burstParty();
    setTimeout(()=>memories.scrollIntoView({behavior:'smooth'}),1800);
  }
});

document.querySelectorAll('.photo').forEach(photo=>{
  photo.addEventListener('click',()=>{
    const img=photo.querySelector('img');
    lightboxImg.src=img.src;
    lightboxCaption.textContent='♡  Dheposh  ·  tap × to close';
    lightbox.classList.add('show');
  });
});
function closeBox(){lightbox.classList.remove('show');lightboxImg.src='';}
closeLightbox.addEventListener('click',closeBox);
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeBox();});

envelopeBtn.addEventListener('click',()=>{
  letter.classList.add('open');
  envelopeBtn.style.transform='scale(.92)';
  setTimeout(()=>letter.scrollIntoView({behavior:'smooth',block:'center'}),120);
  popSparks(envelopeBtn);
});

replay.addEventListener('click',()=>{
  song.pause();
  song.currentTime=0;
  musicStarted=false;
  candlesOut=0;cakeCut=false;
  document.querySelectorAll('.flame').forEach(x=>x.style.display='block');
  cakeScene.classList.remove('cake-cut','cut-ready');
  cakeTitle.textContent='Make a wish.';
  cakeInstruction.textContent='Click the candles to blow them out ✨';
  cakeAction.style.display='inline-block';
  cakeAction.textContent='Blow out the candles ✨';
  wishResult.classList.remove('show');
  wishResult.innerHTML='<strong>Now cut the cake! 🎂</strong><p>Click the cake to make the first cut.</p>';
  letter.classList.remove('open');
  document.body.classList.add('locked');
  document.body.classList.remove('unlocked');
  loginScreen.style.display='grid';
  loginForm.reset();
  window.scrollTo({top:0,behavior:'smooth'});
});

function popSparks(origin){
  const r=origin.getBoundingClientRect ? origin.getBoundingClientRect() : {left:innerWidth/2,top:innerHeight/2,width:0,height:0};
  const x=r.left+r.width/2, y=r.top+r.height/2;
  for(let i=0;i<8;i++){
    const s=document.createElement('div');
    s.className='spark';
    s.textContent=['✦','✧','♡','•'][Math.floor(Math.random()*4)];
    s.style.left=x+'px';s.style.top=y+'px';
    s.style.setProperty('--dx',(Math.random()*180-90)+'px');
    s.style.setProperty('--dy',(Math.random()*180-90)+'px');
    document.body.appendChild(s);
    setTimeout(()=>s.remove(),1900);
  }
}
function burstParty(){
  for(let i=0;i<30;i++){
    const p=document.createElement('div');
    p.className='party-popper';
    p.textContent=['🎉','🎊','✨','♡','🌸','⭐'][Math.floor(Math.random()*6)];
    p.style.left=(Math.random()*100)+'vw';
    p.style.setProperty('--dx',(Math.random()*260-130)+'px');
    p.style.setProperty('--rot',(Math.random()*720-360)+'deg');
    p.style.animationDelay=(Math.random()*.8)+'s';
    document.body.appendChild(p);
    setTimeout(()=>p.remove(),4600);
  }
}

const PAGES = [
  'welcome','wish','why','gallery','promises','game','question','love','finale'
];
let pageIndex = 0;

function showPage(idx){
  pageIndex = Math.max(0, Math.min(PAGES.length-1, idx));
  document.querySelectorAll('.page').forEach(p => p.style.display='none');
  const id = PAGES[pageIndex];
  document.getElementById(id).style.display='block';
  document.getElementById('badgeStep').textContent = `Page ${pageIndex+1} / ${PAGES.length}`;
  if(id==='finale'){ startConfetti(); } else { stopConfetti(); }
  if(id==='game'){ startGame(); } else { stopGame(); }
}

function nextPage(){ showPage(pageIndex+1) }
function prevPage(){ showPage(pageIndex-1) }

// Floating background hearts/teddies
function spawnFloatingBG(){
  const wrap = document.querySelector('.floating-bg');
  const icons = ['assets/heart.svg','assets/teddy.svg'];
  for(let i=0;i<16;i++){
    const img = document.createElement('img');
    img.src = icons[i%2];
    img.style.left = (Math.random()*95)+'%';
    img.style.top = (100 + Math.random()*120)+'%';
    img.style.animationDelay = (Math.random()*12)+'s';
    img.style.transform = `scale(${0.6 + Math.random()*0.8})`;
    wrap.appendChild(img);
  }
}

// GAME: Catch the Hearts/Teddies
let gameTimer=null, spawnTimer=null, score=0;
const sweetMsgs = [
  "I love you Nidhu Babyy 💖",
  "You're my sunshine ☀️",
  "My favorite hello, my hardest goodbye 🥺",
  "You + Me = Forever 🫶",
  "Your laughter is my music 🎶",
  "You're the prettiest thought in my head 🌸"
];
function startGame(){
  const area = document.getElementById('game-area');
  score = 0;
  document.getElementById('score').textContent = score;
  clearInterval(spawnTimer);
  spawnTimer = setInterval(()=>spawnFloaty(area), 900);
  if(!gameTimer){
    gameTimer = setTimeout(()=>{
      clearInterval(spawnTimer);
      gameTimer=null;
      toast('Time up! You caught '+score+' cuties 💕');
    }, 20000);
  }
}
function stopGame(){
  clearInterval(spawnTimer);
  spawnTimer=null;
  const area = document.getElementById('game-area');
  [...area.querySelectorAll('.floaty')].forEach(n=>n.remove());
  clearTimeout(gameTimer);
  gameTimer=null;
}
function spawnFloaty(area){
  const img = document.createElement('img');
  img.src = Math.random()>.5?'assets/heart.svg':'assets/teddy.svg';
  img.className='floaty';
  const w = area.clientWidth, h = area.clientHeight;
  const x = Math.random()*(w-64), y = h-72;
  img.style.left = x+'px'; img.style.top = y+'px';
  area.appendChild(img);
  const vx = (Math.random()*2-1)*0.6;
  let vy = - (1.0 + Math.random()*1.8);
  const rot = (Math.random()*2-1)*0.02;
  const id = setInterval(()=>{
    const nx = parseFloat(img.style.left) + vx*14;
    const ny = parseFloat(img.style.top) + vy*14;
    img.style.left = nx+'px'; img.style.top = ny+'px';
    img.style.transform = `rotate(${(parseFloat(img.style.top)||0)*rot}deg)`;
    vy += 0.006; // gravity-like
    if(ny<-80){ clearInterval(id); img.remove(); }
  }, 16);

  img.addEventListener('click', ()=>{
    score++; document.getElementById('score').textContent = score;
    toast(sweetMsgs[Math.floor(Math.random()*sweetMsgs.length)]);
    img.remove();
    clearInterval(id);
  });
}

// Cute toast
let toastTimer=null;
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.opacity='1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ t.style.opacity='0' }, 1500);
}

// Question page "No" dodge
function initQuestion(){
  const noBtn = document.getElementById('noBtn');
  noBtn.addEventListener('mouseenter', ()=>dodge(noBtn));
  noBtn.addEventListener('click', ()=>dodge(noBtn));
}
function dodge(btn){
  btn.classList.add('dodge');
  const parent = btn.parentElement;
  const rect = parent.getBoundingClientRect();
  const x = Math.random()*(rect.width- btn.offsetWidth);
  const y = Math.random()*(rect.height- btn.offsetHeight - 10);
  btn.style.left = x+'px';
  btn.style.top = y+'px';
}

// Finale confetti
let confettiRAF=null, confettiCtx=null, confettiPieces=[];
function startConfetti(){
  const canvas = document.getElementById('confettiCanvas');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  confettiCtx = canvas.getContext('2d');
  confettiPieces = Array.from({length: 150}).map(()=> ({
    x: Math.random()*canvas.width,
    y: Math.random()*-canvas.height,
    r: 4+Math.random()*6,
    vy: 1+Math.random()*3,
    vx: -1+Math.random()*2,
    rot: Math.random()*Math.PI
  }));
  function draw(){
    confettiCtx.clearRect(0,0,canvas.width,canvas.height);
    confettiPieces.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy; p.rot+=0.05;
      if(p.y>canvas.height){ p.y = -10; p.x = Math.random()*canvas.width; }
      confettiCtx.save();
      confettiCtx.translate(p.x,p.y);
      confettiCtx.rotate(p.rot);
      confettiCtx.fillStyle = ['#ff6fb7','#a78bfa','#60a5fa','#ffd166','#06d6a0'][Math.floor(Math.random()*5)];
      confettiCtx.fillRect(-p.r/2,-p.r/2,p.r,p.r);
      confettiCtx.restore();
    });
    confettiRAF = requestAnimationFrame(draw);
  }
  draw();
}
function stopConfetti(){ if(confettiRAF) cancelAnimationFrame(confettiRAF); confettiRAF=null; }

// Init
window.addEventListener('load', ()=>{
  spawnFloatingBG();
  initQuestion();
  showPage(0);
});
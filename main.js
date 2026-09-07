(function(){
'use strict';
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav=document.querySelector('[data-nav]');
const mobile=document.querySelector('[data-mobile]');
const burger=document.querySelector('.nav-burger');
if(burger&&mobile){burger.addEventListener('click',()=>{mobile.classList.toggle('open');document.body.classList.toggle('menu-open');});mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobile.classList.remove('open');document.body.classList.remove('menu-open');}));}
const scenes=[...document.querySelectorAll('[data-scene]')];
// Turn every cinematic scene into a pinned viewport stage. The parent remains the scroll timeline.
scenes.forEach(s=>{if(s.dataset.pin && !s.querySelector(':scope > .scene-stage')){const stage=document.createElement('div');stage.className='scene-stage';while(s.firstChild)stage.appendChild(s.firstChild);s.appendChild(stage);}});
function clamp(v,a=0,b=1){return Math.max(a,Math.min(b,v));}
function sceneProgress(el){const r=el.getBoundingClientRect(), travel=Math.max(1,r.height-innerHeight); return clamp((-r.top)/travel);}
function render(){
 const sy=scrollY;
 if(nav) nav.classList.toggle('scrolled',sy>40);
 scenes.forEach((s,i)=>{
   const p=sceneProgress(s), active=p>.08&&p<.94; s.classList.toggle('active',active); s.style.setProperty('--progress',p.toFixed(4));
   if(reduce)return;
   s.querySelectorAll('.depth-bg').forEach(el=>{el.style.transform=`translate3d(0,${(p-.5)*-70}px,0) scale(${1.03+p*.06})`;});
   s.querySelectorAll('.depth-mid').forEach(el=>{el.style.transform=`translate3d(${(p-.5)*18}px,${(p-.5)*-42}px,0) rotate(${(p-.5)*1.8}deg)`;});
   s.querySelectorAll('.depth-fg').forEach(el=>{el.style.transform=`translate3d(${(p-.5)*-10}px,${(p-.5)*-24}px,0)`;el.style.opacity=String(.45+p*.7);});
   const line=s.querySelector('.compare-line'), newer=s.querySelector('.compare-new');
   if(line&&newer){const q=clamp((s.getBoundingClientRect().top*-1)/(s.offsetHeight-innerHeight),0,1);line.style.left=(q*100)+'%';newer.style.clipPath=`inset(0 0 0 ${q*100}%)`;}
   const stack=s.querySelector('.process-stack');
   if(stack){[...stack.children].forEach((el,k)=>{const q=clamp(p*1.45-k*.18);el.style.transform=`translate3d(${(1-q)*80}px,${k*7*(1-q)}px,0)`;el.style.opacity=q;});}
   const cards=s.querySelectorAll('.cap-orbit article'); if(cards.length){cards.forEach((el,k)=>{const q=clamp(p*1.65-k*.11);el.style.transform=`translate3d(0,${(1-q)*45}px,0) rotate(${(k%2?1:-1)*(1-q)*1.5}deg)`;el.style.opacity=.25+q*.75;});}
   const lead=s.querySelectorAll('.lead-cards article'); if(lead.length){lead.forEach((el,k)=>{el.style.transform=`translate3d(${(1-p)*(-20+k*8)}px,${(1-p)*30}px,0) rotate(${(k%2?1:-1)*(1-p)*1.5}deg)`;});}
   const journey=s.querySelector('.journey-line:after'); if(journey) journey.style.height=(Math.max(5,p*100))+'%';
 });
 requestAnimationFrame(render);
}
if(!reduce) requestAnimationFrame(render); else {scenes.forEach(s=>s.classList.add('active'));if(nav)nav.classList.toggle('scrolled',scrollY>40);window.addEventListener('scroll',()=>nav&&nav.classList.toggle('scrolled',scrollY>40),{passive:true});}
// Gallery filtering
const buttons=[...document.querySelectorAll('[data-filter]')];const items=[...document.querySelectorAll('[data-cat]')];buttons.forEach(b=>b.addEventListener('click',()=>{buttons.forEach(x=>x.classList.remove('is-active'));b.classList.add('is-active');const cat=b.dataset.filter;items.forEach(i=>{i.style.display=cat==='all'||i.dataset.cat===cat?'':'none';});}));
// Subtle pointer depth on desktop
if(!reduce && matchMedia('(pointer:fine)').matches){window.addEventListener('pointermove',e=>{const x=(e.clientX/innerWidth-.5),y=(e.clientY/innerHeight-.5);document.querySelectorAll('.scene.active .depth-fg').forEach(el=>{el.style.marginLeft=(x*8)+'px';el.style.marginTop=(y*6)+'px';});},{passive:true});}
})();

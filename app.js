/* SoulFriends concept — interactions */
(function(){
  // nav solidify on scroll
  var nav=document.querySelector('.nav');
  function onScroll(){ if(!nav)return; if(window.scrollY>40)nav.classList.add('solid'); else nav.classList.remove('solid'); }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // mobile menu
  var burger=document.querySelector('.nav-burger'), mm=document.querySelector('.mobile-menu'),
      mc=document.querySelector('.mobile-close');
  if(burger&&mm){ burger.onclick=function(){mm.classList.add('open');document.body.style.overflow='hidden';}; }
  if(mc&&mm){ mc.onclick=function(){mm.classList.remove('open');document.body.style.overflow='';}; }
  if(mm){ mm.querySelectorAll('a').forEach(function(a){a.onclick=function(){mm.classList.remove('open');document.body.style.overflow='';};}); }

  // reveal on scroll (sections + images fade/rise in)
  var obs=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){e.target.classList.add('in'); obs.unobserve(e.target);} });
  },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){obs.observe(el);});

  // subtle parallax/zoom for figures as they enter
  var zoomObs=new IntersectionObserver(function(es){
    es.forEach(function(e){ var f=e.target; if(e.isIntersecting){f.style.transform='scale(1)';f.style.opacity='1';} });
  },{threshold:.15});
  document.querySelectorAll('[data-zoom]').forEach(function(f){
    f.style.transform='scale(1.08)';f.style.opacity='.0';f.style.transition='transform 1.4s cubic-bezier(.2,.7,.3,1),opacity 1.1s ease';
    zoomObs.observe(f);
  });

  // carousel (infinite loop, autoplay, pause on hover)
  document.querySelectorAll('.carousel').forEach(function(car){
    var t=car.querySelector('.car-track'); if(!t)return;
    var orig=[].slice.call(t.children), n=orig.length; if(!n)return;
    orig.forEach(function(c){t.appendChild(c.cloneNode(true));});
    function step(){var c=t.children[0],g=parseFloat(getComputedStyle(t).gap||22)||22;return c.getBoundingClientRect().width+g;}
    function W(){return step()*n;}
    t.addEventListener('scroll',function(){requestAnimationFrame(function(){var w=W();if(t.scrollLeft>=w)t.scrollLeft-=w;else if(t.scrollLeft<0)t.scrollLeft+=w;});},{passive:true});
    function go(d){if(d<0&&t.scrollLeft<step())t.scrollLeft+=W();t.scrollBy({left:d*step(),behavior:'smooth'});}
    var id;function start(){stop();id=setInterval(function(){go(1);},3600);}function stop(){clearInterval(id);}
    var nb=car.querySelector('.car-btn.next'),pb=car.querySelector('.car-btn.prev');
    if(nb)nb.onclick=function(){go(1);start();}; if(pb)pb.onclick=function(){go(-1);start();};
    t.addEventListener('pointerenter',stop);t.addEventListener('pointerleave',start);start();
  });

  // forms: friendly fake-submit (demo)
  document.querySelectorAll('form[data-demo]').forEach(function(f){
    f.addEventListener('submit',function(ev){ev.preventDefault();
      var note=f.querySelector('.form-note')||document.createElement('p');
      note.className='form-note';note.style.cssText='margin-top:16px;color:#C66E48;font-weight:600';
      note.textContent='Thank you, beautiful. This is a concept demo — on the live site this would reach the SoulFriends team. ✦';
      f.appendChild(note);f.reset();
    });
  });

  // QUIZ
  var quiz=document.getElementById('quiz'); if(quiz){ initQuiz(quiz); }
  function initQuiz(root){
    var steps=[].slice.call(root.querySelectorAll('.q-step'));
    var bar=root.querySelector('.quiz-progress i');
    var result=root.querySelector('.quiz-result');
    var scores={POWERHOUSE:0,BUILDER:0,ELDER:0,ARCHITECT:0};
    var idx=0, history=[];
    var archetypes={
      POWERHOUSE:{name:'The Pivoting Powerhouse',line:'Successful, accomplished — and quietly craving a truer next chapter. You are ready to recalibrate and reconnect to what actually matters now.',rec:'Begin with <b>The Sanctuary</b> or a <b>Summer Camp</b> retreat — spaces to exhale and remember your own voice.',cta:'Explore The Sanctuary',href:'sanctuary.html'},
      BUILDER:{name:'The Sacred Builder',line:'Your vision is alive and you are ready to bring it into form — with devotion, structure, and the right women around you.',rec:'Begin with <b>The Studio</b> or an Immersive — frameworks and practice to turn vision into income-generating soul work.',cta:'Explore The Studio',href:'studio.html'},
      ELDER:{name:'The Embodied Elder',line:'You are rooted in wisdom and crave sacred spaces that meet you at depth — not surface networking, but soul recognition.',rec:'Begin with <b>The Sanctuary</b> or a <b>Summer Camp</b> retreat — depth, ritual, and lifelong connection.',cta:'Explore The Sanctuary',href:'sanctuary.html'},
      ARCHITECT:{name:'The Awakening Architect',line:'Something is rising. You are still in the beautiful fog, but you can feel the clarity coming. This is the threshold.',rec:'Begin with <b>The Sanctuary</b> — monthly breathwork and community to let the next chapter name itself.',cta:'Explore The Sanctuary',href:'sanctuary.html'}
    };
    function show(i){ steps.forEach(function(s,k){s.classList.toggle('active',k===i);}); if(result)result.classList.remove('active');
      if(bar)bar.style.width=((i)/steps.length*100)+'%'; }
    function finish(){
      var best='POWERHOUSE',mx=-1; for(var k in scores){if(scores[k]>mx){mx=scores[k];best=k;}}
      var a=archetypes[best];
      result.querySelector('.arch-name').textContent=a.name;
      result.querySelector('.arch-line').textContent=a.line;
      result.querySelector('.result-rec').innerHTML='Your aligned first step → '+a.rec;
      var btn=result.querySelector('.arch-cta'); btn.textContent=a.cta; btn.href=a.href;
      steps.forEach(function(s){s.classList.remove('active');});
      if(bar)bar.style.width='100%'; result.classList.add('active');
      result.scrollIntoView({behavior:'smooth',block:'center'});
    }
    root.querySelectorAll('.opt').forEach(function(b){
      b.onclick=function(){ var tag=b.getAttribute('data-arch'); if(tag&&scores[tag]!=null)scores[tag]++;
        history.push(idx); idx++; if(idx<steps.length)show(idx); else finish(); };
    });
    root.querySelectorAll('.q-back').forEach(function(b){ b.onclick=function(){ if(history.length){idx=history.pop();show(idx);} }; });
    var restart=root.querySelector('.q-restart'); if(restart)restart.onclick=function(){
      for(var k in scores)scores[k]=0; idx=0;history=[];show(0); window.scrollTo({top:root.offsetTop-80,behavior:'smooth'});
    };
    show(0);
  }

  // year
  document.querySelectorAll('.yr').forEach(function(e){e.textContent=new Date().getFullYear();});
})();

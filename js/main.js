const nav=document.querySelector('.navbar');
const links=[...document.querySelectorAll('.nav-links a')];
const toggle=document.querySelector('.nav-toggle');
const body=document.body;
function getNavH(){return nav.getBoundingClientRect().height}
function toId(id){return document.querySelector(id)}
function scrollToTarget(target){const y=target.getBoundingClientRect().top+window.pageYOffset-getNavH()+2;window.scrollTo({top:y,behavior:'smooth'})}
links.forEach(a=>{a.addEventListener('click',e=>{const href=a.getAttribute('href');if(href.startsWith('#')){e.preventDefault();const el=toId(href);if(el)scrollToTarget(el);body.classList.remove('nav-open')}})});
toggle.addEventListener('click',()=>{body.classList.toggle('nav-open')});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){body.classList.remove('nav-open')}});
document.addEventListener('click',e=>{if(body.classList.contains('nav-open')){if(!nav.contains(e.target)){body.classList.remove('nav-open')}}},true);
function onScroll(){if(window.scrollY>8){nav.classList.add('nav-scrolled')}else{nav.classList.remove('nav-scrolled')}}
document.addEventListener('scroll',onScroll,{passive:true});
onScroll();
const sections=[...document.querySelectorAll('section[id]')];
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){const id='#'+entry.target.id;links.forEach(a=>{a.classList.toggle('active',a.getAttribute('href')===id)})}})},{rootMargin:'-40% 0px -55% 0px',threshold:[0,0.2,0.6]});
sections.forEach(s=>observer.observe(s));
const bottle=document.querySelector('.hero-bottle');
let rafId=null;let lastY=window.scrollY;function parallax(){const y=window.scrollY;const dy=y-lastY;lastY=y;if(bottle){const offset=Math.max(-20,Math.min(20,y*0.04));bottle.style.transform=`translateY(${offset}px)`}rafId=requestAnimationFrame(parallax)}
parallax();
const aosEls=[...document.querySelectorAll('[data-aos]')];
const aosObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('aos-in')}})},{rootMargin:'-10% 0px -15% 0px',threshold:0.2});
aosEls.forEach(el=>aosObserver.observe(el));
const counters=[...document.querySelectorAll('.counter')];
function toArabicDigits(str){return String(str).replace(/[0-9]/g,d=>'٠١٢٣٤٥٦٧٨٩'[d])}
function animateCounter(el,target,duration=1600){const startTime=performance.now();function format(n){const lang=document.documentElement.lang||'ar';return lang==='ar'?toArabicDigits(n):String(n)}function step(now){const p=Math.min((now-startTime)/duration,1);const val=Math.round(p*target);el.textContent=format(val)+(el.dataset.suffix||'');if(p<1){requestAnimationFrame(step)}else{el.dataset.ran='1'}}requestAnimationFrame(step)}
const counterObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){const el=entry.target;if(el.dataset.ran)return;const t=parseInt(el.dataset.target||'0',10);if(!isNaN(t))animateCounter(el,t)}})},{rootMargin:'-10% 0px -20% 0px',threshold:0.5});
counters.forEach(el=>counterObserver.observe(el));
function getRegCount(){return parseInt(localStorage.getItem('registrationsCount')||'0',10)}
function setRegCount(n){localStorage.setItem('registrationsCount',String(n))}
const regEl=document.querySelector('.registered-count');
function pulseCount(){try{if(regEl&&regEl.parentElement){const chip=regEl.parentElement;chip.classList.add('bump');setTimeout(()=>{chip.classList.remove('bump')},480)}}catch(_){}}
function initRegCount(){
  if(regEl){
  }
}
initRegCount();
function resetRegCount(){setRegCount(0);if(regEl){regEl.dataset.target='0';animateCounter(regEl,0,800)}}
try{const qp=new URLSearchParams(location.search);if(qp.get('resetCount')==='1'){resetRegCount()}}catch(_){}
const preorderForm=document.querySelector('.preorder-form');
if(preorderForm){
  const nameInput=preorderForm.querySelector('input[name="name"]');
  const emailInput=preorderForm.querySelector('input[name="email"]');
  const phoneInput=preorderForm.querySelector('input[name="phone"]');
  const submitBtn=preorderForm.querySelector('button[type="submit"]');
  const statusEl=preorderForm.querySelector('.form-status');
  function setStatus(msg,type){if(statusEl){statusEl.textContent=msg||'';statusEl.className='form-status'+(type?' '+type:'')}}
  function setHint(input,msg,ok){const wrap=input.parentElement;const hint=wrap.querySelector('.field-hint');if(hint)hint.textContent=msg||'';wrap.classList.toggle('is-valid',!!ok);wrap.classList.toggle('is-invalid',ok===false)}
  function validateName(v){const s=v.trim();if(s.length<2)return {ok:false,msg:'أدخل اسمًا صحيحًا'};return {ok:true,msg:'ممتاز'}}
  function validateEmail(v){const ok=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);return {ok, msg: ok?'صحيح':'أدخل بريدًا صحيحًا'} }
  function normalizePhone(v){return v.replace(/\s+/g,'').replace(/-/g,'')}
  function validatePhone(v){const n=normalizePhone(v);const saLocal=/^05\d{8}$/;const saIntl=/^\+?9665\d{8}$/;const ok=saLocal.test(n)||saIntl.test(n);return {ok, msg: ok?'صحيح':'أدخل رقمًا بصيغة 05XXXXXXXX أو +9665XXXXXXXX'} }
  function bind(input,validator){input.addEventListener('input',()=>{const {ok,msg}=validator(input.value);setHint(input,msg,ok)});input.addEventListener('blur',()=>{const {ok,msg}=validator(input.value);setHint(input,msg,ok)})}
  bind(nameInput,validateName);bind(emailInput,validateEmail);bind(phoneInput,validatePhone);
  preorderForm.addEventListener('submit',(e)=>{
    const v1=validateName(nameInput.value);
    const v2=validateEmail(emailInput.value);
    const v3=validatePhone(phoneInput.value);
    setHint(nameInput,v1.msg,v1.ok);
    setHint(emailInput,v2.msg,v2.ok);
    setHint(phoneInput,v3.msg,v3.ok);
    if(!(v1.ok&&v2.ok&&v3.ok)){
      e.preventDefault();
      return;
    }
    e.preventDefault();
    const endpoint=(preorderForm.dataset.endpoint||'').trim();
    const _name=nameInput.value.trim();
    const payload={
      name:_name,
      fullName:_name,
      Name:_name,
      email:emailInput.value.trim(),
      phone:normalizePhone(phoneInput.value),
      lang:document.documentElement.lang||'ar',
      ts:Date.now()
    };
    function inc(){
      const curr=getRegCount();
      const next=curr+1;
      setRegCount(next);
      if(regEl){
        const lang=document.documentElement.lang||'ar';
        regEl.dataset.target=String(next);
        regEl.textContent=lang==='ar'?toArabicDigits(next):String(next);
        pulseCount();
      }
    }
    function clear(){
      nameInput.value='';
      emailInput.value='';
      phoneInput.value='';
    }
    if(endpoint){
      if(submitBtn){submitBtn.disabled=true}
      setStatus(document.documentElement.lang==='ar'?'جارٍ الإرسال...':'Sending...', 'pending');
      fetch(endpoint,{
        method:'POST',
        headers:{'Content-Type':'text/plain'},
        body:JSON.stringify(payload)
      })
      .then(r=>{ if(!r.ok) throw new Error('request_failed'); return r.text().catch(()=> '') })
      .then(msg=>{ setStatus(msg||(document.documentElement.lang==='ar'?'تم التسجيل بنجاح':'Registered successfully'),'success'); inc(); (function(){try{const p=refreshRegCount(); if(p&&typeof p.then==='function'){p.then(total=>{if(!isNaN(total)){const lang=document.documentElement.lang||'ar';const display=lang==='ar'?toArabicDigits(total):String(total); setStatus((document.documentElement.lang==='ar'?'تم التسجيل بنجاح — الإجمالي الآن: ':'Registered successfully — total now: ')+display,'success')}})}else{refreshRegCount()}}catch(_){refreshRegCount()}})(); clear(); })
      .catch(()=>{ setStatus(document.documentElement.lang==='ar'?'حدث خطأ، حاول لاحقاً':'An error occurred, please try later','error'); })
      .finally(()=>{ if(submitBtn){submitBtn.disabled=false} });
    }else{
      inc();
      clear();
    }
  });
  let isRefreshing=false;
  function fetchWithTimeout(url,ms=4000){
    try{
      const ctrl=new AbortController();
      const t=setTimeout(()=>{try{ctrl.abort()}catch(_){ }},ms);
      return fetch(url,{cache:'no-store',signal:ctrl.signal}).finally(()=>{try{clearTimeout(t)}catch(_){ }});
    }catch(_){
      return fetch(url,{cache:'no-store'});
    }
  }
  function setCountDisplay(n){
    const val=Number(n);
    if(isNaN(val)||!regEl)return;
    setRegCount(val);
    const lang=document.documentElement.lang||'ar';
    const first=!regEl.dataset.animatedOnce;
    if(first){
      const from=0;
      const startTime=performance.now();
      const dur=Math.max(600,Math.min(1600,Math.abs(val-from)*80));
      function step(now){
        const p=Math.min((now-startTime)/dur,1);
        const v=Math.round(from+(val-from)*p);
        regEl.textContent=lang==='ar'?toArabicDigits(v):String(v);
        if(p<1){requestAnimationFrame(step)}else{regEl.dataset.target=String(val);regEl.dataset.ran='1';regEl.dataset.animatedOnce='1';pulseCount()}
      }
      requestAnimationFrame(step);
    }else{
      regEl.dataset.target=String(val);
      regEl.textContent=lang==='ar'?toArabicDigits(val):String(val);
      regEl.dataset.ran='1';
      pulseCount();
    }
  }
  function loadRegCountJsonp(){
    const endpoint=(preorderForm.dataset.endpoint||'').trim();
    if(!endpoint)return;
    const cbName='__regCountCallback';
    try{ delete window[cbName] }catch(_){}
    window[cbName]=function(payload){
      try{
        let v=payload;
        if(payload&&typeof payload==='object'){
          if(payload.total!==undefined)v=payload.total; else if(payload.count!==undefined)v=payload.count;
        }
        setCountDisplay(v);
      }catch(_){ }
    };
    const s=document.createElement('script');
    s.src=endpoint+(endpoint.includes('?')?'&':'?')+'mode=count&callback='+cbName;
    s.async=true;
    s.onerror=function(){ try{ delete window[cbName] }catch(_){} };
    document.head.appendChild(s);
    setTimeout(()=>{ try{ delete window[cbName] }catch(_){} },4000);
  }
  function refreshRegCount(){
    const endpoint=(preorderForm.dataset.endpoint||'').trim();
    if(!endpoint||!regEl)return;
    if(isRefreshing)return;
    isRefreshing=true;
    const url=endpoint+(endpoint.includes('?')?'&':'?')+'mode=count';
    return fetchWithTimeout(url,4000)
      .then(async r=>{
        try{
          const d=await r.json();
          let v=NaN;
          if(d&&d.total!==undefined){v=typeof d.total==='number'?d.total:parseInt(String(d.total),10)}
          else if(d&&d.count!==undefined){v=typeof d.count==='number'?d.count:parseInt(String(d.count),10)}
          return isNaN(v)?NaN:v;
        }catch(_){
          const t=await r.text().catch(()=> '');
          const m=t.match(/[0-9٠-٩]+/);
          if(!m)return NaN;
          const latin=toLatinDigits(m[0]);
          return parseInt(latin,10);
        }
      })
      .then(c=>{ if(!isNaN(c)){ setCountDisplay(c) } else { loadRegCountJsonp() } })
      .catch(()=>{ loadRegCountJsonp() })
      .finally(()=>{isRefreshing=false});
  }
  refreshRegCount();
  try{
    document.addEventListener('visibilitychange',()=>{ if(!document.hidden){ try{ refreshRegCount() }catch(_){ } } });
  }catch(_){ }
}
const i18n={
  ar:{
    'nav.about':'عن iMIZE',
    'nav.features':'المزايا',
    'nav.solution':'الحل',
    'nav.preorder':'الحجز المسبق',
    'nav.contact':'تواصل',
    'hero.title':'iMIZE - الذكاء الذي يرطب حياتك',
    'hero.subtitle':'هو نظام ترطيب ذكي متكامل، يجمع بين زمزمية عالية الجودة وتطبيق ذكي، لتحويل عملية شرب الماء من عادة عشوائية إلى ممارسة صحية دقيقة',
    'hero.ctaPrimary':'الحجز المسبق',
    'hero.ctaSecondary':'اكتشف المزايا',
    'problem.title':'المشكلة: الجفاف الخفي الذي يهدد صحتنا وبيئتنا',
    'problem.desc':'معظم الناس لا يدركون أنهم يعانون من الجفاف المزمن، مما يؤثر سلباً على صحتهم وإنتاجيتهم وبيئتهم',
    'problem.healthTitle':'المشكلة الصحية',
    'problem.health.statChronic':'٧٥٪ من السعوديين يعانون من الجفاف المزمن',
    'problem.health.statKidney':'٤٠٪ زيادة في مشاكل الكلى المرتبطة بالجفاف',
    'problem.health.statProductivity':'٢٥٪ انخفاض في الإنتاجية بسبب الجفاف',
    'problem.envTitle':'المشكلة البيئية',
    'problem.env.statWaste':'٣٠٪ هدر في استهلاك المياه المنزلية',
    'problem.env.statPlastic':'٦٧٪ من النفايات البلاستيكية في المملكة تأتي من العبوات ذات الاستخدام الواحد',
    'problem.env.statCarbon':'٢٥٪ من انبعاثات الكربون في قطاع المياه تأتي من التعبئة والنقل',
    'solution.title':'الحل المتكامل: iMIZE نظام الترطيب الذكي',
    'solution.desc':'دمجنا الذكاء الاصطناعي مع التصميم الحديث لإنشاء نظام ترطيب شخصي يحافظ على صحتك وبيئتك',
    'solution.hwTitle':'الزمزمية الذكية',
    'solution.swTitle':'التطبيق الذكي',
    'compare.traditional':'الحل التقليدي',
    'compare.traditional1':'عدم تتبع دقيق للاستهلاك',
    'compare.traditional2':'تنبيهات يدوية وغير فعّالة',
    'compare.traditional3':'غياب التحليلات الشخصية',
    'compare.imize':'حل iMIZE',
    'compare.imize1':'تتبع لحظي دقيق',
    'compare.imize2':'تنبيهات ذكية مخصصة',
    'compare.imize3':'تقارير وإحصائيات شخصية',
    'preorder.title':'الحجز المسبق',
    'preorder.desc':'سجل اهتمامك للحصول على iMIZE عند الإطلاق الأول وبسعر حصري.',
    'preorder.name':'الاسم الكامل',
    'preorder.email':'البريد الإلكتروني',
    'preorder.phone':'رقم الجوال',
    'preorder.submit':'تأكيد الحجز',
    'preorder.registeredLabel':'عدد المسجلين',
    'contact.title':'تواصل معنا',
    'contact.desc':'للاستفسارات أو الشراكات، يسعدنا تواصلك. سنعود إليك سريعًا.',
    'contact.emailLabel':'البريد:',
    'contact.phoneLabel':'الهاتف:',
    'about.brand':'iMIZE',
    'about.desc':'منظومة متكاملة لمتابعة مستوى الترطيب اليومي باستخدام مستشعرات دقيقة وخوارزميات ذكية، مع تطبيق مخصص يقدم توصيات وشعارات تحفيزية مدعومة بالبيانات.',
    'features.title':'المزايا الرئيسية',
    'features.card1.title':'مستشعرات قياس دقيقة',
    'features.card1.desc':'قراءة فورية لكمية الماء المستهلكة وتنبيهات ذكية قائمة على نمطك اليومي.',
    'features.card2.title':'استدامة ومواد آمنة',
    'features.card2.desc':'مواد عالية الجودة قابلة لإعادة الاستخدام بتصميم يحافظ على البيئة.',
    'features.card3.title':'تطبيق مرافق',
    'features.card3.desc':'لوحة تحكم لمتابعة أهدافك اليومية مع إحصائيات وتوصيات شخصية.'
  },
  en:{
    'nav.about':'About iMIZE',
    'nav.features':'Features',
    'nav.solution':'Solution',
    'nav.preorder':'Preorder',
    'nav.contact':'Contact',
    'hero.title':'iMIZE – Intelligence that hydrates your life',
    'hero.subtitle':'A smart hydration system combining premium bottle and intelligent app to turn random drinking into precise healthy practice',
    'hero.ctaPrimary':'Preorder',
    'hero.ctaSecondary':'Discover Features',
    'problem.title':'The hidden dehydration threatening our health and environment',
    'problem.desc':'Most people do not realize they suffer from chronic dehydration, impacting health, productivity, and the environment',
    'problem.healthTitle':'Health Issue',
    'problem.health.statChronic':'75% of Saudis suffer from chronic dehydration',
    'problem.health.statKidney':'40% increase in kidney problems linked to dehydration',
    'problem.health.statProductivity':'25% drop in productivity due to dehydration',
    'problem.envTitle':'Environmental Issue',
    'problem.env.statWaste':'30% waste in household water consumption',
    'problem.env.statPlastic':'67% of plastic waste comes from single-use bottles in KSA',
    'problem.env.statCarbon':'25% of water sector carbon emissions come from bottling and transport',
    'solution.title':'Integrated solution: iMIZE smart hydration system',
    'solution.desc':'We merged AI with modern design to create a personal hydration system that preserves your health and the environment',
    'solution.hwTitle':'Smart Bottle',
    'solution.swTitle':'Smart App',
    'compare.traditional':'Traditional Approach',
    'compare.traditional1':'No precise consumption tracking',
    'compare.traditional2':'Manual, ineffective reminders',
    'compare.traditional3':'No personalized analytics',
    'compare.imize':'iMIZE Solution',
    'compare.imize1':'Real-time precise tracking',
    'compare.imize2':'Smart personalized reminders',
    'compare.imize3':'Personal reports and analytics',
    'preorder.title':'Preorder',
    'preorder.desc':'Register your interest to get iMIZE at launch with an exclusive price.',
    'preorder.name':'Full name',
    'preorder.email':'Email',
    'preorder.phone':'Mobile number',
    'preorder.submit':'Confirm Preorder',
    'preorder.registeredLabel':'Registered users',
    'contact.title':'Contact Us',
    'contact.desc':'For inquiries or partnerships, we are happy to hear from you. We will reply soon.',
    'contact.emailLabel':'Email:',
    'contact.phoneLabel':'Phone:',
    'about.brand':'iMIZE',
    'about.desc':'An integrated system that tracks daily hydration using precise sensors and intelligent algorithms, with a dedicated app that provides recommendations and data-driven motivational prompts.',
    'features.title':'Key Features',
    'features.card1.title':'Precision Sensors',
    'features.card1.desc':'Instant readings of water consumed with smart alerts based on your daily pattern.',
    'features.card2.title':'Sustainability & Safe Materials',
    'features.card2.desc':'High-quality reusable materials with a design that protects the environment.',
    'features.card3.title':'Companion App',
    'features.card3.desc':'A dashboard to track your daily goals with personalized insights and recommendations.'
  }
};
function toLatinDigits(str){return String(str).replace(/[٠-٩]/g,d=>'0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)])}
function applyLanguage(lang){document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n');const t=i18n[lang][k];if(typeof t==='string')el.textContent=t});document.querySelectorAll('[data-i18n-ph]').forEach(el=>{const k=el.getAttribute('data-i18n-ph');const t=i18n[lang][k];if(typeof t==='string')el.setAttribute('placeholder',t)});const suffix=lang==='ar'?'٪':'%';document.querySelectorAll('.counter').forEach(el=>{const hasSuffix=el.hasAttribute('data-suffix');if(hasSuffix){el.dataset.suffix=suffix}else{el.removeAttribute('data-suffix');delete el.dataset.suffix}const m=el.textContent.match(/[٠-٩0-9]+/);if(m){const num=m[0];const conv=lang==='ar'?toArabicDigits(num):toLatinDigits(num);el.textContent=el.textContent.replace(/[٠-٩0-9]+/,conv)}if(hasSuffix){el.textContent=el.textContent.replace(/[٪%]/,suffix)}else{el.textContent=el.textContent.replace(/[٪%]/,'')}});document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang))}
document.querySelectorAll('.lang-btn').forEach(btn=>{btn.addEventListener('click',()=>{applyLanguage(btn.dataset.lang)})});
applyLanguage(document.documentElement.lang||'ar');
try{if(typeof refreshRegCount==='function'){refreshRegCount()}}catch(_){}
 

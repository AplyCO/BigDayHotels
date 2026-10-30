const languageSwitch=document.getElementById('languageSwitch');
let currentLanguage='es';
function setLanguage(language){currentLanguage=language;document.documentElement.lang=language;document.querySelectorAll('[data-es][data-en]').forEach(element=>{element.textContent=element.dataset[language]});languageSwitch.textContent=language==='es'?'ES / EN':'EN / ES';}
languageSwitch.addEventListener('click',()=>setLanguage(currentLanguage==='es'?'en':'es'));
const menuToggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
menuToggle.addEventListener('click',()=>{const opened=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(opened));});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false')}));
document.getElementById('year').textContent=new Date().getFullYear();

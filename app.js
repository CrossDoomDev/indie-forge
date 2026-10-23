const toast=document.querySelector('.toast');
let toastTimer;
function announce(text){clearTimeout(toastTimer);toast.textContent=text;toast.hidden=false;toastTimer=setTimeout(()=>toast.hidden=true,4200);}
document.querySelectorAll('[data-soon]').forEach(button=>button.addEventListener('click',()=>{announce('«'+button.dataset.soon+'» — этот раздел появится на следующем этапе.');}));
const search=document.querySelector('#search');
const results=document.querySelector('.search-results');
const entries=[['HTML — основы структуры','#learning'],['Веб-разработка с нуля','#learning'],['Личный сайт','#projects'],['Игра Змейка','#projects'],['Список задач','#projects']];
function showSearch(){const q=search.value.trim().toLocaleLowerCase('ru');results.replaceChildren();if(!q){results.hidden=true;return;}const found=entries.filter(([title])=>title.toLocaleLowerCase('ru').includes(q));for(const [title,selector] of found){const button=document.createElement('button');button.textContent=title;button.addEventListener('click',()=>{results.hidden=true;const target=document.querySelector(selector);target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});target.classList.remove('highlight');void target.offsetWidth;target.classList.add('highlight');});results.append(button);}if(!found.length){const message=document.createElement('p');message.textContent='Ничего не найдено';results.append(message);}results.hidden=false;}
search.addEventListener('input',showSearch);search.addEventListener('focus',showSearch);
document.querySelector('.search-field').addEventListener('click',()=>search.focus());
const popovers=[['.notification-button','.notification-popover'],['.profile-button','.profile-popover']];
function closePopovers(){popovers.forEach(([b,p])=>{document.querySelector(p).hidden=true;document.querySelector(b).setAttribute('aria-expanded','false');});}
popovers.forEach(([b,p])=>document.querySelector(b).addEventListener('click',()=>{const panel=document.querySelector(p);const opening=panel.hidden;closePopovers();panel.hidden=!opening;document.querySelector(b).setAttribute('aria-expanded',String(opening));}));
const menu=document.querySelector('.mobile-menu');const sidebar=document.querySelector('.sidebar');
menu.addEventListener('click',()=>{const open=sidebar.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');});
document.addEventListener('click',event=>{if(!event.target.closest('.search-wrap'))results.hidden=true;if(!event.target.closest('.notification-wrap,.profile-wrap'))closePopovers();if(!event.target.closest('.sidebar,.mobile-menu')){sidebar.classList.remove('open');menu.setAttribute('aria-expanded','false');}});
document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();search.focus();}if(event.key==='Escape'){results.hidden=true;closePopovers();toast.hidden=true;search.blur();sidebar.classList.remove('open');menu.setAttribute('aria-expanded','false');}if(event.key==='ArrowDown'&&event.target===search&&!results.hidden){event.preventDefault();results.querySelector('button')?.focus();}});


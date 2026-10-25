"use strict";
// Rewards and their receipts share one storage record: a reload cannot pay twice.
window.DailyQuests=(()=>{
 const KEY='indieforge.daily-quests.v1';
 const BASE={xp:3320,gems:1240}; // Preserve the dashboard's existing starting balance.
 const definitions=Object.freeze([
  Object.freeze({id:'lesson',xp:50,gems:10}),
  Object.freeze({id:'code',xp:50,gems:10}),
  Object.freeze({id:'project',xp:75,gems:15}),
  Object.freeze({id:'visit',xp:25,gems:5})
 ]);
 const dayKey=date=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
 function read(){
  const raw=JSON.parse(localStorage.getItem(KEY)||'null');
  if(raw===null)return {version:1,days:{}};
  if(raw.version!==1||!raw.days||typeof raw.days!=='object'||Array.isArray(raw.days))throw Error('Некорректные данные наград.');
  return raw;
 }
 function balance(data){
  const result={...BASE};
  for(const claims of Object.values(data.days))for(const def of definitions){
   const reward=claims?.[def.id];
   if(reward&&Number.isSafeInteger(reward.xp)&&reward.xp>=0&&Number.isSafeInteger(reward.gems)&&reward.gems>=0){result.xp+=reward.xp;result.gems+=reward.gems;}
  }
  return result;
 }
 let queue=Promise.resolve();
 const pending=new Map();
 function transact(ids){
  const occurredAt=new Date(),day=dayKey(occurredAt);
  if(!pending.has(day))pending.set(day,new Map());
  ids.forEach(id=>{if(!pending.get(day).has(id))pending.get(day).set(id,occurredAt.toISOString());});
  const write=()=>{
   const data=read(),earned=[];
   for(const [date,events] of pending){
    const claims=data.days[date]||{};
    for(const def of definitions)if(events.has(def.id)&&!Object.hasOwn(claims,def.id)){
     claims[def.id]={xp:def.xp,gems:def.gems,completedAt:events.get(def.id)};earned.push(def);
    }
    data.days[date]=claims;
   }
   if(earned.length)localStorage.setItem(KEY,JSON.stringify(data));
   pending.clear();render(data);document.querySelector('#questStorageStatus').hidden=true;
   if(earned.length){
    const xp=earned.reduce((sum,d)=>sum+d.xp,0),gems=earned.reduce((sum,d)=>sum+d.gems,0);
    announce(`Ежедневные задания: +${xp} XP, +${gems} кристаллов. Награда начислена.`);
   }
  };
  // Web Locks serialize read/modify/write between tabs as well as within this tab.
  const job=queue.then(()=>navigator.locks?navigator.locks.request(KEY,write):write());
  queue=job.catch(()=>{
   const status=document.querySelector('#questStorageStatus');status.textContent='Не удалось сохранить награды. Проверьте доступность хранилища браузера.';status.hidden=false;
  });
  return queue;
 }
 function render(data){
  const now=new Date(),claims=data.days[dayKey(now)]||{},totals=balance(data);
  for(const def of definitions){
   const row=document.querySelector(`[data-quest="${def.id}"]`),done=Object.hasOwn(claims,def.id);
   row.classList.toggle('is-complete',done);
   row.querySelector('.quest-status').textContent=done?'Выполнено, награда начислена':'Не выполнено';
   row.querySelector('.quest-xp').textContent=`+${def.xp} XP`;
   row.querySelector('.quest-gems-value').textContent=`+${def.gems}`;
  }
  const format=value=>new Intl.NumberFormat('ru-RU').format(value);
  document.querySelectorAll('[data-balance=gems]').forEach(el=>el.textContent=format(totals.gems));
  document.querySelector('[data-balance=xp]').textContent=format(totals.xp);
  const level=Math.floor(totals.xp/600)+1,xp=totals.xp%600;
  document.querySelectorAll('[data-player-level]').forEach(el=>el.textContent=level);
  document.querySelector('[data-profile-progress]').textContent=`Уровень ${level} · ${xp} / 600 XP`;
  const bar=document.querySelector('.xp-progress');bar.setAttribute('aria-valuenow',xp);
  bar.querySelector('span').style.width=`${xp/6}%`;bar.querySelector('small').textContent=`${xp} / 600 XP`;
  const midnight=new Date(now);midnight.setHours(24,0,0,0);
  const minutes=Math.ceil((midnight-now)/60000);
  document.querySelector('[data-quest-reset]').textContent=`Обновятся через ${Math.floor(minutes/60)} ч. ${minutes%60} мин.`;
 }
 const refresh=()=>transact(['visit']);
 // Called only after saving a learner's attempts, never by opening a lesson or by author autosave.
 function recordLessonCompletion(courseId,before,after){
  if(typeof courseId!=='string'||!Array.isArray(before)||!Array.isArray(after))return Promise.resolve();
  return after.some(id=>!before.includes(id))?transact(['visit','lesson']):Promise.resolve();
 }
 // Integration points for the future sandbox and project workspace. No click-to-complete API.
 function recordCodeSubmission({id,code,accepted}={}){
  if(typeof id!=='string'||!id.trim()||accepted!==true||typeof code!=='string'||code.split(/\r\n|\r|\n/).filter(line=>line.trim()).length<20)return Promise.resolve();
  return transact(['visit','code']);
 }
 function recordProjectSave({id,previous,content}={}){
  if(typeof id!=='string'||!id.trim()||typeof previous!=='string'||typeof content!=='string'||!content.trim()||previous===content)return Promise.resolve();
  return transact(['visit','project']);
 }
 window.addEventListener('storage',event=>{if(event.key===KEY||event.key===null)refresh();});
 window.addEventListener('focus',refresh);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
 setInterval(()=>{if(!document.hidden)refresh();},30000);
 refresh();
 return Object.freeze({definitions,refresh,recordLessonCompletion,recordCodeSubmission,recordProjectSave});
})();

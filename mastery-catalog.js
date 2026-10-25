"use strict";
// The UI depends on this store, not on the seed format or storage implementation.
// A server-backed repository can implement the same methods later.
window.MasteryCatalog = (() => {
  const KEY = 'indieforge.mastery.catalog.v1';
  const levels = {beginner:'Новичок',intermediate:'Средний',advanced:'Продвинутый'};
  const branches = {core:'Основные курсы',applied:'Прикладные курсы'};
  const categories = {engine:'Движки',language:'Языки и веб',art:'Графика и арт',audio:'Музыка и звук',tools:'Инструменты',design:'Геймдизайн'};
  const icons = ['godot','gamemaker','rpgmaker','blender','aseprite','unity','web','csharp','pixelart','audio','tools','design','ui'];
  const plain = (v,max=2000) => String(v??'').trim().slice(0,max);
  function required(value,label) {const result=plain(value,160);if(!result)throw Error('Заполните поле «'+label+'».');return result;}
  function safeUrl(value) {
    const url=plain(value,1500);
    if(!url)return '';
    if(/[\u0000-\u0020\\]/.test(url)||url.startsWith('//'))throw Error('В ссылке недопустимые символы.');
    if(/^[a-z][a-z0-9+.-]*:/i.test(url)&&!/^https?:\/\//i.test(url))throw Error('Для ссылок разрешены только HTTP и HTTPS.');
    return url;
  }
  function safeImage(value) {
    if(typeof value==='string'&&value.startsWith('data:')) {
      if(value.length>550000||!/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/.test(value))throw Error('Загрузите PNG, JPEG, WebP или GIF размером до 400 КБ.');
      return value;
    }
    return safeUrl(value);
  }
  function identifier(value) {const id=plain(value,80);if(!/^[a-z0-9][a-z0-9_-]*$/.test(id))throw Error('ID должен содержать латинские буквы, цифры, дефис или подчёркивание.');return id;}
  const number=(value,fallback,max)=>Number.isFinite(Number(value))?Math.max(0,Math.min(max,Math.round(Number(value)))):fallback;
  function validate(input) {
    if(!input||!Array.isArray(input.technologies)||!Array.isArray(input.courses))throw Error('В каталоге нужны массивы technologies и courses.');
    if(input.version!==undefined&&input.version!==1)throw Error('Эта версия каталога не поддерживается.');
    if(input.technologies.length>100||input.courses.length>2000)throw Error('Допускается до 100 технологий и 2000 курсов.');
    if(new TextEncoder().encode(JSON.stringify(input)).byteLength>4*1024*1024)throw Error('Каталог с материалами превышает 4 МБ. Экспортируйте курс и уменьшите размер изображений.');
    const ids=new Set();
    const technologies=input.technologies.map((t,i)=>{
      if(!t||typeof t!=='object')throw Error('Некорректная технология.');
      const id=identifier(t.id);if(ids.has(id))throw Error('Повторяется ID технологии: '+id);ids.add(id);
      return {id,title:required(t.title,'Название технологии'),description:plain(t.description),about:plain(t.about,12000),category:Object.hasOwn(categories,t.category)?t.category:'tools',tags:(Array.isArray(t.tags)?t.tags:[]).slice(0,10).map(v=>plain(v,40)).filter(Boolean),image:safeImage(t.image)||'assets/mastery/technologies/tools.webp',icon:icons.includes(t.icon)?t.icon:'tools',iconUrl:safeImage(t.iconUrl),color:/^#[0-9a-f]{6}$/i.test(t.color)?t.color:'#40bfff',order:number(t.order,i,100000),published:t.published!==false};
    });
    const courseIds=new Set();
    const courses=input.courses.map((c,i)=>{
      if(!c||typeof c!=='object')throw Error('Некорректный курс.');
      const id=identifier(c.id);if(courseIds.has(id))throw Error('Повторяется ID курса: '+id);courseIds.add(id);
      const technologyId=identifier(c.technologyId);if(!ids.has(technologyId))throw Error('Для курса «'+plain(c.title)+'» не найдена технология '+technologyId+'.');
      if(!Object.hasOwn(branches,c.branch))throw Error('Ветка курса должна быть core или applied.');
      const curriculum=window.CourseContent.normalize(c.curriculum);
      return {curriculum,id,technologyId,branch:c.branch,title:required(c.title,'Название курса'),description:plain(c.description),about:plain(c.about,12000),audience:plain(c.audience,6000),requirements:plain(c.requirements,6000),learningFormat:plain(c.learningFormat,6000),author:plain(c.author,160),level:Object.hasOwn(levels,c.level)?c.level:'beginner',topic:plain(c.topic,60)||'Практика',lessonCount:curriculum?curriculum.lessons.length:number(c.lessonCount,0,3000),durationMinutes:number(c.durationMinutes,0,60000),order:number(c.order,i,100000),published:c.published!==false,capstone:c.capstone===true,image:safeImage(c.image),icon:icons.includes(c.icon)?c.icon:'',iconUrl:safeImage(c.iconUrl),url:safeUrl(c.url),outcomes:(Array.isArray(c.outcomes)?c.outcomes:[]).slice(0,30).map(v=>plain(v,500)).filter(Boolean)};
    });
    return {version:1,technologies,courses};
  }
  let catalog=validate(window.MASTERY_SEED);
  let recovery='';
  function refreshDefaultArtwork(saved) {
    // Update only known old built-in covers. Keep uploads, custom links and all authored data.
    for(const collection of ['technologies','courses']) {
      const defaults=new Map(window.MASTERY_SEED[collection].map(record=>[record.id,record]));
      for(const record of saved[collection]) {
        const original=defaults.get(record.id);
        if(original&&record.image===`assets/mastery/${collection==='courses'?original.technologyId:original.id}.svg`)record.image=original.image;
      }
    }
    return saved;
  }
  try {const stored=localStorage.getItem(KEY);if(stored)catalog=refreshDefaultArtwork(validate(JSON.parse(stored)));}catch {recovery='Сохранённый каталог не удалось прочитать. Открыта исходная версия.';}
  function commit(next) {
    const checked=validate(next);
    try {localStorage.setItem(KEY,JSON.stringify(checked));}catch {throw Error('Браузер не смог сохранить каталог. Освободите место или разрешите локальное хранение.');}
    catalog=checked;
    window.dispatchEvent(new Event('mastery:catalog-changed'));
  }
  function upsert(collection,record) {const next=structuredClone(catalog),index=next[collection].findIndex(v=>v.id===record.id);if(index<0)next[collection].push(record);else next[collection][index]=record;commit(next);}
  function remove(collection,id,{cascade=false}={}) {
    if(collection==='technologies'&&!cascade&&catalog.courses.some(c=>c.technologyId===id))throw Error('Сначала перенесите или удалите курсы этой технологии.');
    const next=structuredClone(catalog);
    next[collection]=next[collection].filter(v=>v.id!==id);
    if(collection==='technologies'&&cascade)next.courses=next.courses.filter(c=>c.technologyId!==id);
    commit(next);
  }
  function move(collection,id,targetId,placement) {
    const next=structuredClone(catalog),record=next[collection].find(v=>v.id===id),target=next[collection].find(v=>v.id===targetId);
    if(!record||!target||id===targetId)return false;
    if(collection==='courses'&&(record.technologyId!==target.technologyId||record.branch!==target.branch))throw Error('Порядок меняется внутри одной ветки технологии.');
    const group=next[collection].filter(v=>collection==='technologies'||(v.technologyId===record.technologyId&&v.branch===record.branch)).sort((a,b)=>a.order-b.order||a.title.localeCompare(b.title,'ru'));
    const from=group.findIndex(v=>v.id===id),to=group.findIndex(v=>v.id===targetId);
    group.splice(from,1);
    const destination=placement==='before'||placement==='after'?group.findIndex(v=>v.id===targetId)+(placement==='after'?1:0):to;
    group.splice(destination,0,record);
    if(group.findIndex(v=>v.id===id)===from)return false;
    group.forEach((v,i)=>v.order=i+1);
    commit(next);
    return true;
  }
  function newId(prefix) {return prefix+'-'+crypto.randomUUID().slice(0,8);}
  return {levels,branches,categories,icons,safeUrl,safeImage,validate,newId,
    snapshot:()=>structuredClone(catalog),recoveryMessage:()=>recovery,
    saveTechnology:record=>upsert('technologies',record),saveCourse:record=>upsert('courses',record),
    deleteTechnology:(id,options)=>remove('technologies',id,options),deleteCourse:id=>remove('courses',id),
    moveTechnology:(id,targetId,placement)=>move('technologies',id,targetId,placement),moveCourse:(id,targetId,placement)=>move('courses',id,targetId,placement),
    importCatalog:commit,
    reset:()=>commit(window.MASTERY_SEED)
  };
})();

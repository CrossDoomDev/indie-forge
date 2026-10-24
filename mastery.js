"use strict";
(() => {
  const store=window.MasteryCatalog, page=document.querySelector('#masteryPage');
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon=(name,cls='')=>`<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  const notify=text=>window.announce(text);
  const routeFor=(tech='',branch='',course='')=>'#/mastery'+[tech,branch,course].filter(Boolean).map(v=>'/'+encodeURIComponent(v)).join('');
  const safeRead=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
  let layout=safeRead('indieforge.mastery.layout','grid');if(!['grid','list'].includes(layout))layout='grid';
  let plan=safeRead('indieforge.mastery.plan',[]);if(!Array.isArray(plan))plan=[];
  let progress=safeRead('indieforge.mastery.progress',{});if(!progress||typeof progress!=='object'||Array.isArray(progress))progress={};
  let catalog=store.snapshot(), current={kind:'catalog'}, manager={tab:'courses',query:'',tech:'',editing:null};
  const filters=new Map();
  const ordered=items=>[...items].sort((a,b)=>a.order-b.order||a.title.localeCompare(b.title,'ru'));
  const visibleTechs=()=>ordered(catalog.technologies.filter(t=>t.published));
  const coursesFor=(id,branch)=>ordered(catalog.courses.filter(c=>c.published&&c.technologyId===id&&(!branch||c.branch===branch)));
  const completedLessons=c=>Math.max(0,Math.min(c.lessonCount,Number(progress[c.id])||0));
  const percent=c=>c.lessonCount?Math.round(completedLessons(c)/c.lessonCount*100):0;
  const plural=(n,forms)=>forms[n%100>=11&&n%100<=14?2:n%10===1?0:n%10>=2&&n%10<=4?1:2];
  const courseCount=n=>n+' '+plural(n,['курс','курса','курсов']);
  const lessonCount=n=>n+' '+plural(n,['урок','урока','уроков']);
  const duration=minutes=>minutes?(Math.floor(minutes/60)?Math.floor(minutes/60)+' ч ':'')+(minutes%60?minutes%60+' мин':''):'Не указана';
  const tags=(values,cls='')=>`<div class="m-tags ${cls}">${values.map(v=>`<span>${esc(v)}</span>`).join('')}</div>`;
  function logo(t,large=false) {
    const branded=['godot','gamemaker','blender','aseprite','unity','web','csharp'].includes(t.icon);
    const fallback={rpgmaker:'home',pixelart:'gem',audio:'play',tools:'refresh',design:'game',ui:'monitor'}[t.icon]||'tree';
    return `<span class="m-logo ${large?'large':''}" style="--brand:${t.color}" aria-hidden="true">${branded?`<span class="m-brand-icon" style="mask-image:url('assets/mastery/logo-${t.icon}.svg');-webkit-mask-image:url('assets/mastery/logo-${t.icon}.svg')"></span>`:icon(fallback)}</span>`;
  }
  function breadcrumbs(t,branch,course) {
    return `<nav class="m-breadcrumbs" aria-label="Путь по древу мастерства"><a href="${routeFor()}">Древо мастерства</a>${t?`<span>›</span><a href="${routeFor(t.id)}">${esc(t.title)}</a>`:''}${branch?`<span>›</span><a href="${routeFor(t.id,branch)}">${store.branches[branch]}</a>`:''}${course?`<span>›</span><span aria-current="page">${esc(course.title)}</span>`:''}</nav>`;
  }
  function hero({title,description,t=null,branch='',course=null}) {
    const image=course?.image||t?.image||'assets/hero.png';
    return `<header class="m-hero ${t?'m-tech-hero':''}" style="--hero:${esc('url('+JSON.stringify(image)+')')}">${t?breadcrumbs(t,branch,course):'<span class="m-kicker">ИНДИ КУЗНИЦА · ТВОЙ ПУТЬ В ГЕЙМДЕВЕ</span>'}<div class="m-hero-main">${t?logo(t,true):`<span class="m-tree-emblem">${icon('tree')}</span>`}<div><h1 tabindex="-1">${esc(title)}</h1><p>${esc(description)}</p></div></div>${t?tags(t.tags):'<span class="m-hero-motto">Разные инструменты.<br>Одна цель — твои игры.</span>'}</header>`;
  }
  const utility=()=>`<div class="m-utility"><a href="${routeFor()}">${icon('tree')} Все технологии</a><button type="button" data-action="manage">${icon('code')} Управление каталогом</button></div>`;
  const branchTabs=(t,branch)=>`<nav class="m-branch-tabs" aria-label="Ветки технологии"><a class="${branch==='core'?'selected':''}" ${branch==='core'?'aria-current="page"':''} href="${routeFor(t.id,'core')}">${icon('book')} Основные курсы</a><a class="${branch==='applied'?'selected':''}" ${branch==='applied'?'aria-current="page"':''} href="${routeFor(t.id,'applied')}">${icon('game')} Прикладные курсы</a></nav>`;
  function filterState() {
    const key=current.kind+':'+(current.tech?.id||'');
    if(!filters.has(key))filters.set(key,{query:'',category:'all',level:'all',sort:'recommended'});
    return filters.get(key);
  }
  function toolbar(applied=false) {
    const state=filterState();
    const options=applied?[...new Set(coursesFor(current.tech.id,'applied').map(c=>c.topic))].map(v=>[v,v]):Object.entries(store.categories);
    return `<div class="m-toolbar"><div class="m-view-switch" role="group" aria-label="Вид каталога"><button type="button" data-layout="grid" aria-pressed="${layout==='grid'}">${icon('grid')} Сетка</button><button type="button" data-layout="list" aria-pressed="${layout==='list'}">${icon('list')} Список</button></div><label class="m-select"><span class="m-sr">${applied?'Тема курса':'Категория технологий'}</span><select data-filter="category"><option value="all">${applied?'Все темы':'Все технологии'}</option>${options.map(([value,label])=>`<option value="${esc(value)}" ${value===state.category?'selected':''}>${esc(label)}</option>`).join('')}</select></label><label class="m-select"><span class="m-sr">Уровень</span><select data-filter="level"><option value="all">Все уровни</option>${Object.entries(store.levels).map(([value,label])=>`<option value="${value}" ${value===state.level?'selected':''}>${label}</option>`).join('')}</select></label><label class="m-select"><span class="m-sr">Сортировка</span><select data-filter="sort"><option value="recommended" ${state.sort==='recommended'?'selected':''}>По рекомендации</option><option value="title" ${state.sort==='title'?'selected':''}>По названию</option><option value="${applied?'duration':'courses'}" ${['duration','courses'].includes(state.sort)?'selected':''}>${applied?'Сначала короткие':'По числу курсов'}</option></select></label><label class="m-local-search">${icon('search')}<input type="search" data-filter="query" value="${esc(state.query)}" placeholder="${applied?'Поиск прикладных курсов…':'Поиск технологий…'}" aria-label="${applied?'Поиск прикладных курсов':'Поиск технологий'}"></label></div><div class="m-results-meta"><span id="masteryResultCount" role="status" aria-live="polite"></span><button type="button" data-action="reset-filters">Сбросить фильтры</button></div>`;
  }
  function technologyCard(t) {
    const core=coursesFor(t.id,'core').length,applied=coursesFor(t.id,'applied').length;
    return `<article class="m-tech-card" data-technology="${t.id}" style="--brand:${t.color}"><a class="m-tech-art" href="${routeFor(t.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(t.image)}" alt="" loading="lazy"></a><div class="m-tech-info">${logo(t)}<div class="m-tech-copy"><a href="${routeFor(t.id)}" class="m-card-title">${esc(t.title)}</a><p>${esc(t.description)}</p>${tags(t.tags)}</div></div><div class="m-tech-category">${esc(store.categories[t.category])}</div><div class="m-tech-branches"><a class="m-core-count" href="${routeFor(t.id,'core')}">${icon('book')}<span><strong>${core}</strong><small>Основные курсы</small></span></a><a class="m-applied-count" href="${routeFor(t.id,'applied')}">${icon('folder')}<span><strong>${applied}</strong><small>Прикладные курсы</small></span></a><a class="m-card-arrow" href="${routeFor(t.id)}" aria-label="Открыть ${esc(t.title)}">${icon('arrow')}</a></div></article>`;
  }
  function courseCard(c,t,core=false,index=0) {
    const pct=percent(c),url=routeFor(t.id,c.branch,c.id),image=c.image||t.image;
    return `<article class="m-course-card ${core?'m-path-card':''} ${pct===100?'m-course-complete':''} ${core&&c.capstone?'m-capstone':''}" data-course="${c.id}"><a class="m-course-art" href="${url}" tabindex="-1" aria-hidden="true"><img src="${esc(image)}" alt="" loading="lazy"></a>${core?`<span class="m-path-number">${index+1}</span>`:''}<div class="m-course-copy"><a class="m-card-title" href="${url}">${esc(c.title)}</a><p>${esc(c.description)}</p>${!core?tags(['Мини-проект',store.levels[c.level],c.topic]):''}<div class="m-course-meta"><span>${icon('book')}${lessonCount(c.lessonCount)}</span><span>${icon('refresh')}${duration(c.durationMinutes)}</span></div>${core?`<div class="m-course-progress"><progress value="${pct}" max="100" aria-label="Прогресс курса ${esc(c.title)}"></progress><span>${pct}%</span></div>`:''}</div><a class="m-card-arrow" href="${url}" aria-label="Подробнее: ${esc(c.title)}">${icon('arrow')}</a></article>`;
  }
  function renderResults() {
    const results=page.querySelector('#masteryResults');if(!results)return;
    const state=filterState(),q=state.query.toLocaleLowerCase('ru');
    const items=current.kind==='catalog'?visibleTechs().filter(t=>(state.category==='all'||state.category===t.category)&&(state.level==='all'||coursesFor(t.id).some(c=>c.level===state.level))&&[t.title,t.description,...t.tags].join(' ').toLocaleLowerCase('ru').includes(q)):coursesFor(current.tech.id,'applied').filter(c=>(state.category==='all'||c.topic===state.category)&&(state.level==='all'||c.level===state.level)&&[c.title,c.description,c.topic].join(' ').toLocaleLowerCase('ru').includes(q));
    if(state.sort==='title')items.sort((a,b)=>a.title.localeCompare(b.title,'ru'));
    if(state.sort==='courses')items.sort((a,b)=>coursesFor(b.id).length-coursesFor(a.id).length);
    if(state.sort==='duration')items.sort((a,b)=>a.durationMinutes-b.durationMinutes);
    results.className='m-results '+(layout==='list'?'m-list':'m-grid');
    results.innerHTML=items.length?items.map(item=>current.kind==='catalog'?technologyCard(item):courseCard(item,current.tech)).join(''):`<div class="m-empty">${icon('search')}<h2>Ничего не найдено</h2><p>Попробуйте другой запрос или уберите часть фильтров.</p><button class="m-button" data-action="reset-filters">Сбросить фильтры</button></div>`;
    page.querySelector('#masteryResultCount').textContent=(current.kind==='catalog'?'Технологий: ':'Курсов: ')+items.length;
    page.querySelectorAll('[data-layout]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.layout===layout)));
  }
  function renderTechnology(t) {
    const branch=(type)=>{const items=coursesFor(t.id,type),core=type==='core';return `<a class="m-branch-card ${core?'m-core':'m-applied'}" href="${routeFor(t.id,type)}"><img src="${esc(t.image)}" alt=""><div class="m-branch-copy"><span class="m-branch-icon">${icon(core?'book':'game')}</span><h2>${store.branches[type]}</h2><strong>${courseCount(items.length)}</strong><p>${core?'Пошаговый путь от первых инструментов к уверенной работе. Изучите основы и соберите свои первые проекты.':'Практическая разработка небольших проектов. Применяйте знания: создавайте механики, интерфейсы и игровые системы.'}</p><div class="m-branch-features"><span>${icon(core?'terminal':'game')}${core?'Основы и логика':'Реальные проекты'}</span><span>${icon(core?'code':'refresh')}${core?'Работа с инструментами':'Игровые механики'}</span><span>${icon(core?'monitor':'trophy')}${core?'Понятная последовательность':'Практика и результат'}</span><span>${icon('check')}${core?'Закрепление знаний':'Новые навыки'}</span></div><span class="m-branch-cta">Открыть ветку «${store.branches[type]}» ${icon('arrow')}</span></div></a>`;};
    return hero({title:t.title,description:t.description+' Выберите одну из двух веток обучения.',t})+utility()+`<div class="m-branches">${branch('core')}${branch('applied')}</div><aside class="m-path-help">${icon('tree')}<div><h2>Не уверены, с чего начать?</h2><p>Начните с основных курсов, чтобы освоить инструменты. Если база уже есть — переходите к прикладным проектам.</p></div><a class="m-button" href="${routeFor(t.id,'core')}">Посмотреть путь обучения ${icon('arrow')}</a></aside>`;
  }
  function coreContent(t) {
    const courses=coursesFor(t.id,'core'),done=courses.filter(c=>percent(c)===100).length,pct=courses.length?Math.round(done/courses.length*100):0,hours=Math.round(courses.reduce((sum,c)=>sum+c.durationMinutes,0)/60);
    return hero({title:'Основные курсы '+t.title,description:'Пошаговый путь от новичка к уверенной работе. Изучайте инструменты по порядку и закрепляйте знания на практике.',t,branch:'core'})+utility()+branchTabs(t,'core')+`<section class="m-progress-summary"><div class="m-progress-ring" style="--progress:${pct}%" role="img" aria-label="Завершено ${pct}%"><span>${pct}%</span></div><div class="m-progress-copy"><h2>${done} из ${courses.length} курсов завершено</h2><p>Каждый курс — ещё один шаг к вашей собственной игре.</p></div><div class="m-path-stats"><span>${icon('book')}<strong>${courseCount(courses.length)}</strong><small>Полный путь обучения</small></span><span>${icon('refresh')}<strong>~${hours} часов</strong><small>Общая длительность</small></span><span>${icon('bars')}<strong>Новичок → Профи</strong><small>От основ к проекту</small></span></div></section><div class="m-section-title">${icon('tree')}<div><h2>Путь обучения</h2><p>Идите по порядку или выберите тему, которую хотите изучить.</p></div></div><div class="m-learning-path">${courses.length?courses.map((c,i)=>courseCard(c,t,true,i)).join(''):'<div class="m-empty"><h2>Путь ещё формируется</h2><p>Основные курсы появятся здесь после добавления в каталог.</p></div>'}</div>`;
  }
  function renderCourse(c,t) {
    const inPlan=plan.includes(c.id);
    return hero({title:c.title,description:c.description,t,branch:c.branch,course:c})+`<div class="m-course-detail"><section class="m-program"><div class="m-section-title">${icon('book')}<div><span class="m-kicker">ПРОГРАММА КУРСА</span><h2>Что вы изучите</h2></div></div><ul>${(c.outcomes.length?c.outcomes:[c.description||'Подробная программа будет добавлена автором.']).map(o=>`<li>${icon('check')}<span>${esc(o)}</span></li>`).join('')}</ul>${tags([store.levels[c.level],c.topic,store.branches[c.branch]])}<a class="m-text-back" href="${routeFor(t.id,c.branch)}">← Вернуться к курсам ${esc(t.title)}</a></section><aside class="m-course-start"><h2>Ваш следующий шаг</h2><dl><div><dt>Уроков</dt><dd>${c.lessonCount}</dd></div><div><dt>Длительность</dt><dd>${duration(c.durationMinutes)}</dd></div><div><dt>Ветка</dt><dd>${store.branches[c.branch]}</dd></div></dl>${c.url?`<a class="m-button m-primary" href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">Открыть материалы курса ${icon('arrow')}</a>`:'<p class="m-materials-pending">Ссылка на материалы пока не добавлена автором. Программу можно сохранить в план обучения.</p>'}<button class="m-button ${inPlan?'m-in-plan':''}" type="button" data-action="plan" data-id="${c.id}">${icon(inPlan?'check':'book')}${inPlan?'В плане · убрать':'Добавить в план обучения'}</button><p class="m-plan-hint">Ваш план сохраняется в этом браузере.</p></aside></div>`;
  }
  function parseRoute() {
    let parts;try{parts=location.hash.slice(1).split('/').filter(Boolean).map(decodeURIComponent);}catch{return {kind:'missing'};}
    if(parts[0]!=='mastery')return {kind:'home'};
    if(parts.length===1)return {kind:'catalog'};
    const tech=visibleTechs().find(t=>t.id===parts[1]);if(!tech)return {kind:'missing'};
    if(parts.length===2)return {kind:'technology',tech};
    const branch=parts[2];if(!Object.hasOwn(store.branches,branch))return {kind:'missing'};
    if(parts.length===3)return {kind:branch,tech};
    const course=coursesFor(tech.id,branch).find(c=>c.id===parts[3]);return course&&parts.length===4?{kind:'course',tech,course}:{kind:'missing'};
  }
  function render(scroll=false) {
    catalog=store.snapshot();current=parseRoute();
    const active=current.kind!=='home';
    document.querySelector('.dashboard').hidden=active;page.hidden=!active;
    document.querySelectorAll('.sidebar .nav-item').forEach(link=>{const selected=active?link.matches('[data-open-mastery]'):link.matches('a[href="./"]');link.classList.toggle('active',selected);if(selected)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
    document.body.classList.toggle('mastery-open',active);
    if(!active){document.title='Инди Кузница — Платформа';return;}
    document.title=(current.tech?.title||'Древо мастерства')+' — Инди Кузница';
    if(current.kind==='catalog')page.innerHTML=hero({title:'Древо мастерства',description:'Выберите технологию, изучите основы и закрепите знания в прикладных курсах. У каждой технологии — две ветки: от первых шагов к собственным играм.'})+utility()+toolbar()+`<section id="masteryResults" aria-label="Каталог технологий"></section>`;
    else if(current.kind==='technology')page.innerHTML=renderTechnology(current.tech);
    else if(current.kind==='core')page.innerHTML=coreContent(current.tech);
    else if(current.kind==='applied')page.innerHTML=hero({title:'Прикладные курсы '+current.tech.title,description:'Практические мини-проекты и отдельные игровые механики. Создавайте рабочие системы шаг за шагом и применяйте знания на практике.',t:current.tech,branch:'applied'})+utility()+branchTabs(current.tech,'applied')+toolbar(true)+`<section id="masteryResults" aria-label="Прикладные курсы"></section>`;
    else if(current.kind==='course')page.innerHTML=renderCourse(current.course,current.tech);
    else page.innerHTML='<div class="m-empty"><h1>Ветка не найдена</h1><p>Возможно, технология или курс были скрыты из каталога.</p><a class="m-button m-primary" href="'+routeFor()+'">Вернуться к технологиям</a></div>';
    renderResults();
    if(scroll){window.scrollTo({top:0,behavior:'instant'});page.focus({preventScroll:true});}
  }
  page.addEventListener('input',event=>{if(event.target.dataset.filter==='query'){filterState().query=event.target.value;renderResults();}});
  page.addEventListener('change',event=>{if(event.target.matches('select[data-filter]')){filterState()[event.target.dataset.filter]=event.target.value;renderResults();}});
  page.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.layout){layout=button.dataset.layout;try{localStorage.setItem('indieforge.mastery.layout',JSON.stringify(layout));}catch{notify('Не удалось сохранить выбранный вид.');}renderResults();}
    if(button.dataset.action==='reset-filters'){const state=filterState();Object.assign(state,{query:'',category:'all',level:'all',sort:'recommended'});render();}
    if(button.dataset.action==='manage')openManager();
    if(button.dataset.action==='plan'){
      const next=plan.includes(button.dataset.id)?plan.filter(id=>id!==button.dataset.id):[...plan,button.dataset.id];
      try{localStorage.setItem('indieforge.mastery.plan',JSON.stringify(next));plan=next;render();}catch{notify('Не удалось сохранить план в браузере.');}
    }
  });

  // Catalogue management: the same repository powers every public view.
  const dialog=document.createElement('dialog');dialog.id='masteryManager';dialog.className='m-manager';dialog.setAttribute('aria-labelledby','masteryManagerTitle');
  dialog.innerHTML=`<header class="m-manager-heading"><div><span class="m-kicker">КАТАЛОГ · УПРАВЛЕНИЕ</span><h2 id="masteryManagerTitle">Технологии и курсы</h2></div><button type="button" data-admin="close" aria-label="Закрыть управление каталогом">×</button></header><p class="m-manager-note">Изменения сохраняются в этом браузере. Для переноса или публикации скачайте JSON каталога.</p><div class="m-manager-tools"><div class="m-view-switch" role="group" aria-label="Раздел каталога"><button type="button" data-admin-tab="courses">Курсы</button><button type="button" data-admin-tab="technologies">Технологии</button></div><button type="button" class="m-button" data-admin="export">Экспорт JSON</button><button type="button" class="m-button" data-admin="import">Импорт JSON</button><input type="file" id="masteryImport" accept=".json,application/json" hidden></div><p id="masteryManagerMessage" role="status"></p><div id="masteryManagerBody"></div>`;
  document.body.append(dialog);
  const managerBody=()=>dialog.querySelector('#masteryManagerBody');
  const message=text=>{dialog.querySelector('#masteryManagerMessage').textContent=text;};
  function openManager(){manager.tech=current.tech?.id||'';manager.editing=null;manager.query='';renderManager();dialog.showModal();if(store.recoveryMessage())message(store.recoveryMessage());}
  function renderManager() {
    catalog=store.snapshot();dialog.querySelectorAll('[data-admin-tab]').forEach(b=>b.setAttribute('aria-pressed',String(manager.tab===b.dataset.adminTab)));
    if(manager.editing){renderEdit();return;}
    const courseMode=manager.tab==='courses';
    managerBody().innerHTML=`<div class="m-manager-filters"><label class="m-local-search">${icon('search')}<input type="search" id="masteryAdminSearch" aria-label="Поиск в управлении" value="${esc(manager.query)}" placeholder="Поиск в каталоге…"></label>${courseMode?`<label class="m-select"><span class="m-sr">Технология</span><select id="masteryAdminTech"><option value="">Все технологии</option>${ordered(catalog.technologies).map(t=>`<option value="${t.id}" ${t.id===manager.tech?'selected':''}>${esc(t.title)}</option>`).join('')}</select></label>`:''}<button class="m-button m-primary" type="button" data-admin="new">＋ ${courseMode?'Добавить курс':'Добавить технологию'}</button></div><div id="masteryAdminRows"></div>`;
    renderManagerRows();
  }
  function renderManagerRows(){
    const courseMode=manager.tab==='courses',q=manager.query.toLocaleLowerCase('ru');
    const items=ordered(catalog[manager.tab]).filter(item=>item.title.toLocaleLowerCase('ru').includes(q)&&(!courseMode||!manager.tech||item.technologyId===manager.tech));
    dialog.querySelector('#masteryAdminRows').innerHTML=items.length?items.map(item=>{
      const t=courseMode?catalog.technologies.find(t=>t.id===item.technologyId):item;
      return `<div class="m-admin-row"><div><strong>${esc(item.title)}</strong><small>${courseMode?esc(t.title)+' · '+store.branches[item.branch]:esc(store.categories[item.category])} · ${item.published?'В каталоге':'Скрыто'}</small></div><button class="m-button" type="button" data-admin="edit" data-id="${item.id}" aria-label="Редактировать ${esc(item.title)}">Изменить</button><button class="m-admin-delete" type="button" data-admin="delete" data-id="${item.id}" aria-label="Удалить ${esc(item.title)}">×</button></div>`;
    }).join(''):'<div class="m-empty"><h3>Пока ничего нет</h3><p>Добавьте запись или измените фильтр.</p></div>';
  }
  const inputField=(label,name,value,{type='text',required=false,wide=false}={})=>`<label class="m-form-field ${wide?'wide':''}">${label}<input name="${name}" type="${type}" value="${esc(value)}" ${required?'required':''} ${type==='number'?'min="0" max="60000" step="1"':''} ${name==='id'?'readonly':''}></label>`;
  const areaField=(label,name,value)=>`<label class="m-form-field wide">${label}<textarea name="${name}" rows="3" maxlength="2000">${esc(value)}</textarea></label>`;
  const selectField=(label,name,value,entries)=>`<label class="m-form-field">${label}<select name="${name}">${entries.map(([v,t])=>`<option value="${esc(v)}" ${v===value?'selected':''}>${esc(t)}</option>`).join('')}</select></label>`;
  function renderEdit(){
    const courseMode=manager.tab==='courses';
    const record=manager.editing==='new'?null:catalog[manager.tab].find(item=>item.id===manager.editing);
    if(!record&&manager.editing!=='new'){manager.editing=null;renderManager();return;}
    const base=record||(courseMode?{id:store.newId('course'),technologyId:manager.tech||catalog.technologies[0]?.id,branch:'core',title:'',description:'',level:'beginner',topic:'Основы',lessonCount:0,durationMinutes:0,order:catalog.courses.length+1,published:true,capstone:false,image:'',url:'',outcomes:[]}:{id:store.newId('technology'),title:'',description:'',category:'engine',tags:[],icon:'tools',color:'#40bfff',image:'assets/mastery/tools.svg',order:catalog.technologies.length+1,published:true});
    if(courseMode&&!catalog.technologies.length){message('Сначала добавьте технологию.');manager.editing=null;renderManager();return;}
    const common=inputField('Название','title',base.title,{required:true,wide:true})+areaField('Описание','description',base.description);
    const fields=courseMode?selectField('Технология','technologyId',base.technologyId,catalog.technologies.map(t=>[t.id,t.title]))+selectField('Ветка','branch',base.branch,Object.entries(store.branches))+selectField('Уровень','level',base.level,Object.entries(store.levels))+inputField('Тема / механика','topic',base.topic)+inputField('Количество уроков','lessonCount',base.lessonCount,{type:'number'})+inputField('Длительность в минутах','durationMinutes',base.durationMinutes,{type:'number'})+inputField('Ссылка на материалы курса (необязательно)','url',base.url,{wide:true})+areaField('Что изучим — каждый пункт с новой строки','outcomes',base.outcomes.join('\n')):selectField('Категория','category',base.category,Object.entries(store.categories))+selectField('Значок','icon',base.icon,store.icons.map(v=>[v,v]))+inputField('Цвет значка','color',base.color,{type:'color'})+inputField('Метки через запятую','tags',base.tags.join(', '));
    managerBody().innerHTML=`<button class="m-text-back" type="button" data-admin="back">← К списку</button><h3 class="m-edit-title">${record?'Редактировать': 'Добавить'} ${courseMode?'курс':'технологию'}</h3><form id="masteryEditForm" class="m-edit-form">${common}${fields}${courseMode?`<label class="m-publish-toggle wide"><input type="checkbox" name="capstone" ${base.capstone?'checked':''}> Итоговый / дипломный проект (выделенная карточка)</label>`:''}${inputField('Иллюстрация: путь к файлу или HTTPS-ссылка','image',base.image,{wide:true})}${inputField('Порядок в списке','order',base.order,{type:'number'})}${inputField('Постоянный ID','id',base.id)}<label class="m-publish-toggle wide"><input type="checkbox" name="published" ${base.published?'checked':''}> Показывать в каталоге</label><div class="m-form-actions wide"><button class="m-button" type="button" data-admin="back">Отмена</button><button class="m-button m-primary" type="submit">Сохранить ${courseMode?'курс':'технологию'}</button></div></form>`;
    managerBody().querySelector('[name=title]').focus();
  }
  dialog.addEventListener('input',event=>{if(event.target.id==='masteryAdminSearch'){manager.query=event.target.value;renderManagerRows();}});
  dialog.addEventListener('change',async event=>{
    if(event.target.id==='masteryAdminTech'){manager.tech=event.target.value;renderManagerRows();}
    if(event.target.id!=='masteryImport')return;
    const file=event.target.files[0];event.target.value='';if(!file)return;
    try{if(file.size>4*1024*1024)throw Error('Файл каталога должен быть меньше 4 МБ.');const data=store.validate(JSON.parse(await file.text()));if(!confirm('Заменить текущий каталог? В файле '+data.technologies.length+' технологий и '+data.courses.length+' курсов. Экспортируйте текущую версию, если нужна копия.'))return;store.importCatalog(data);manager.editing=null;manager.tech='';renderManager();message('Каталог импортирован.');}catch(error){message(error.message);}
  });
  dialog.addEventListener('submit',event=>{
    if(event.target.getAttribute('id')!=='masteryEditForm')return;event.preventDefault();
    try {
      const values=Object.fromEntries(new FormData(event.target));values.published=event.target.elements.published.checked;
      if(manager.tab==='courses'){values.capstone=event.target.elements.capstone.checked;values.outcomes=values.outcomes.split('\n').map(v=>v.trim()).filter(Boolean);store.saveCourse(values);}else{values.tags=values.tags.split(',').map(v=>v.trim()).filter(Boolean);store.saveTechnology(values);}
      manager.editing=null;renderManager();message('Изменения сохранены.');
    }catch(error){message(error.message);}
  });
  dialog.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.adminTab){manager.tab=button.dataset.adminTab;manager.query='';manager.editing=null;message('');renderManager();return;}
    const action=button.dataset.admin;
    if(action==='close')dialog.close();
    if(action==='new'){manager.editing='new';message('');renderManager();}
    if(action==='back'){manager.editing=null;message('');renderManager();}
    if(action==='edit'){manager.editing=button.dataset.id;message('');renderManager();}
    if(action==='delete'){
      const item=catalog[manager.tab].find(v=>v.id===button.dataset.id);if(!item||!confirm('Удалить «'+item.title+'» из каталога?'))return;
      try{if(manager.tab==='courses')store.deleteCourse(item.id);else store.deleteTechnology(item.id);renderManager();message('Запись удалена.');}catch(error){message(error.message);}
    }
    if(action==='import')dialog.querySelector('#masteryImport').click();
    if(action==='export'){
      const url=URL.createObjectURL(new Blob([JSON.stringify(store.snapshot(),null,2)],{type:'application/json'}));
      const link=document.createElement('a');link.href=url;link.download='mastery-catalog.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),10000);message('Каталог экспортирован.');
    }
  });
  window.addEventListener('hashchange',()=>{render(true);document.querySelector('.sidebar').classList.remove('open');document.querySelector('.mobile-menu').setAttribute('aria-expanded','false');});
  window.addEventListener('mastery:catalog-changed',()=>render());
  window.MasteryApp={
    open:()=>{location.hash='/mastery';},
    search(query){const q=query.toLocaleLowerCase('ru'),active=visibleTechs();return [...active.filter(t=>[t.title,...t.tags].join(' ').toLocaleLowerCase('ru').includes(q)).map(t=>({title:t.title+' · Технология',hash:routeFor(t.id)})),...catalog.courses.filter(c=>c.published&&active.some(t=>t.id===c.technologyId)&&[c.title,c.description].join(' ').toLocaleLowerCase('ru').includes(q)).map(c=>({title:c.title+' · '+catalog.technologies.find(t=>t.id===c.technologyId).title,hash:routeFor(c.technologyId,c.branch,c.id)}))].slice(0,15);},
    // Integration seam for a future lesson player; progress is separate from catalogue data.
    setCourseProgress(id,lessons){const course=catalog.courses.find(c=>c.id===id);if(!course||!Number.isFinite(lessons))return false;const next={...progress,[id]:Math.min(course.lessonCount,Math.max(0,Math.round(lessons)))};try{localStorage.setItem('indieforge.mastery.progress',JSON.stringify(next));progress=next;render();return true;}catch{return false;}}
  };
  document.querySelectorAll('[data-open-mastery]').forEach(button=>button.addEventListener('click',()=>{window.MasteryApp.open();document.querySelector('.sidebar').classList.remove('open');document.querySelector('.mobile-menu').setAttribute('aria-expanded','false');}));
  render();
})();

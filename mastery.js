"use strict";
(() => {
  const store=window.MasteryCatalog, page=document.querySelector('#masteryPage');
  const iconLabels={godot:'Godot',gamemaker:'GameMaker',rpgmaker:'RPG Maker',blender:'Blender',aseprite:'Aseprite',unity:'Unity',web:'JavaScript',csharp:'C#',pixelart:'Пиксель-арт',audio:'Музыка и звук',tools:'Инструменты',design:'Геймдизайн',ui:'Интерфейсы'};
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon=(name,cls='')=>`<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  const notify=text=>window.announce(text);
  const routeFor=(tech='',branch='',course='')=>'#/mastery'+[tech,branch,course].filter(Boolean).map(v=>'/'+encodeURIComponent(v)).join('');
  const safeRead=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
  let layout=safeRead('indieforge.mastery.layout','grid');if(!['grid','list'].includes(layout))layout='grid';
  let adminMode=safeRead('indieforge.mastery.admin',false)===true;
  let plan=safeRead('indieforge.mastery.plan',[]);if(!Array.isArray(plan))plan=[];
  let progress=safeRead('indieforge.mastery.progress',{});if(!progress||typeof progress!=='object'||Array.isArray(progress))progress={};
  let workspace=null;
  let catalog=store.snapshot(), current={kind:'catalog'}, manager={tab:'courses',query:'',tech:'',editing:null};
  const filters=new Map();
  const ordered=items=>[...items].sort((a,b)=>a.order-b.order||a.title.localeCompare(b.title,'ru'));
  const visibleTechs=()=>ordered(catalog.technologies.filter(t=>adminMode||t.published));
  const coursesFor=(id,branch)=>ordered(catalog.courses.filter(c=>(adminMode||c.published)&&c.technologyId===id&&(!branch||c.branch===branch)));
  const completedLessons=c=>c.curriculum?CourseLearning.progress(c).lessons:Math.max(0,Math.min(c.lessonCount,Number(progress[c.id])||0));
  const percent=c=>c.lessonCount?Math.round(completedLessons(c)/c.lessonCount*100):0;
  const plural=(n,forms)=>forms[n%100>=11&&n%100<=14?2:n%10===1?0:n%10>=2&&n%10<=4?1:2];
  const courseCount=n=>n+' '+plural(n,['курс','курса','курсов']);
  const lessonCount=n=>n+' '+plural(n,['урок','урока','уроков']);
  const duration=minutes=>minutes?(Math.floor(minutes/60)?Math.floor(minutes/60)+' ч ':'')+(minutes%60?minutes%60+' мин':''):'Не указана';
  const tags=(values,cls='')=>`<div class="m-tags ${cls}">${values.map(v=>`<span>${esc(v)}</span>`).join('')}</div>`;
  function logo(t,large=false) {
    const branded=['godot','gamemaker','blender','aseprite','unity','web','csharp'].includes(t.icon);
    const fallback={rpgmaker:'home',pixelart:'gem',audio:'play',tools:'refresh',design:'game',ui:'monitor'}[t.icon]||'tree';
    return `<span class="m-logo ${large?'large':''}" style="--brand:${t.color}" aria-hidden="true">${t.iconUrl?`<img class="m-custom-icon" src="${esc(t.iconUrl)}" alt="">`:branded?`<span class="m-brand-icon" style="mask-image:url('assets/mastery/logo-${t.icon}.svg');-webkit-mask-image:url('assets/mastery/logo-${t.icon}.svg')"></span>`:icon(fallback)}</span>`;
  }
  function breadcrumbs(t,branch,course) {
    return `<nav class="m-breadcrumbs" aria-label="Путь по древу мастерства"><a href="${routeFor()}">Древо мастерства</a>${t?`<span>›</span><a href="${routeFor(t.id)}">${esc(t.title)}</a>`:''}${branch?`<span>›</span><a href="${routeFor(t.id,branch)}">${store.branches[branch]}</a>`:''}${course?`<span>›</span><span aria-current="page">${esc(course.title)}</span>`:''}</nav>`;
  }
  function hero({title,description,t=null,branch='',course=null,art=true}) {
    const image=course?.image||t?.image||'assets/hero.png';
    return `<header class="m-hero ${t?'m-tech-hero':''} ${art?'':'m-hero-plain'}" style="--hero:${esc('url('+JSON.stringify(image)+')')}">${t?breadcrumbs(t,branch,course):'<span class="m-kicker">ИНДИ КУЗНИЦА · ТВОЙ ПУТЬ В ГЕЙМДЕВЕ</span>'}<div class="m-hero-main">${t?logo(t,true):`<span class="m-tree-emblem">${icon('tree')}</span>`}<div><h1 tabindex="-1">${esc(title)}</h1><p>${esc(description)}</p></div></div>${t?tags(t.tags):'<span class="m-hero-motto">Разные инструменты.<br>Одна цель — твои игры.</span>'}</header>`;
  }
  function utility() {
    return `<div class="m-utility"><a href="${routeFor()}">${icon('tree')} Все технологии</a><div class="m-utility-actions">${adminMode?`<button type="button" data-action="manage">${icon('code')} Управление каталогом</button>`:''}<div class="m-view-switch m-mode-switch" role="group" aria-label="Режим просмотра"><button type="button" data-action="view-mode" data-mode="student" aria-pressed="${!adminMode}">Ученик</button><button type="button" data-action="view-mode" data-mode="admin" aria-pressed="${adminMode}">Администратор</button></div></div></div>${adminMode?`<div class="m-admin-banner"><span>Режим администратора · скрытые записи видны только в этом режиме</span><button class="m-button" type="button" data-action="add-record" data-collection="${current.kind==='catalog'?'technologies':'courses'}">＋ ${current.kind==='catalog'?'Добавить технологию':'Добавить курс'}</button>${current.tech?`<button class="m-button" type="button" data-card-action="edit" data-collection="${current.course?'courses':'technologies'}" data-id="${current.course?.id||current.tech.id}">Редактировать ${current.course?'курс':'технологию'}</button>${statusBadge(current.course||current.tech,current.course?current.tech:null)}`:''}</div>`:''}`;
  }
  function statusBadge(record,parent=null) {
    if(!adminMode)return '';
    const hidden=!record.published||parent?.published===false;
    const label=!record.published?'Скрыто · черновик':parent?.published===false?'Скрыто вместе с технологией':'Опубликовано';
    return `<span class="m-status ${hidden?'m-status-hidden':'m-status-published'}">${icon(hidden?'eye-off':'eye')}${label}</span>`;
  }
  const canReorder=()=>adminMode&&(!['catalog','applied'].includes(current.kind)||filterState().sort==='recommended');
  function cardControls(record,collection,parent=null) {
    if(!adminMode)return '';
    const reorder=canReorder();
    return `<div class="m-card-admin">${statusBadge(record,parent)}<button class="m-drag-handle" type="button" draggable="${reorder}" data-drag-id="${record.id}" data-collection="${collection}" ${reorder?'':'disabled'} aria-label="Переместить ${esc(record.title)}" title="Перетащите карточку. С клавиатуры: Alt + стрелки.">${icon('grip')}</button><details class="m-card-menu"><summary aria-label="Действия: ${esc(record.title)}">⋯</summary><div class="m-card-menu-items"><button type="button" data-card-action="edit" data-collection="${collection}" data-id="${record.id}">Редактировать карточку</button><button type="button" data-card-action="visibility" data-collection="${collection}" data-id="${record.id}">${record.published?'Скрыть':'Опубликовать'}</button><button type="button" data-card-action="move-up" data-collection="${collection}" data-id="${record.id}" ${reorder?'':'disabled'}>Переместить выше</button><button type="button" data-card-action="move-down" data-collection="${collection}" data-id="${record.id}" ${reorder?'':'disabled'}>Переместить ниже</button><button class="m-danger" type="button" data-card-action="delete" data-collection="${collection}" data-id="${record.id}">Удалить ${collection==='technologies'?'технологию':'курс'}</button></div></details></div>`;
  }
  const branchTabs=(t,branch)=>`<nav class="m-branch-tabs" aria-label="Ветки технологии"><a class="${branch==='core'?'selected':''}" ${branch==='core'?'aria-current="page"':''} href="${routeFor(t.id,'core')}">${icon('book')} Основные курсы</a><a class="${branch==='applied'?'selected':''}" ${branch==='applied'?'aria-current="page"':''} href="${routeFor(t.id,'applied')}">${icon('game')} Прикладные курсы</a></nav>`;
  function filterState() {
    const key=current.kind+':'+(current.tech?.id||'');
    if(!filters.has(key))filters.set(key,{query:'',category:'all',level:'all',sort:'recommended'});
    return filters.get(key);
  }
  function toolbar(applied=false) {
    const state=filterState();
    const options=applied?[...new Set(coursesFor(current.tech.id,'applied').map(c=>c.topic))].map(v=>[v,v]):Object.entries(store.categories);
    return `<div class="m-toolbar"><div class="m-view-switch" role="group" aria-label="Вид каталога"><button type="button" data-layout="grid" aria-pressed="${layout==='grid'}">${icon('grid')} Сетка</button><button type="button" data-layout="list" aria-pressed="${layout==='list'}">${icon('list')} Список</button></div><label class="m-select"><span class="m-sr">${applied?'Тема курса':'Категория технологий'}</span><select data-filter="category"><option value="all">${applied?'Все темы':'Все технологии'}</option>${options.map(([value,label])=>`<option value="${esc(value)}" ${value===state.category?'selected':''}>${esc(label)}</option>`).join('')}</select></label><label class="m-select"><span class="m-sr">Уровень</span><select data-filter="level"><option value="all">Все уровни</option>${Object.entries(store.levels).map(([value,label])=>`<option value="${value}" ${value===state.level?'selected':''}>${label}</option>`).join('')}</select></label><label class="m-select"><span class="m-sr">Сортировка</span><select data-filter="sort"><option value="recommended" ${state.sort==='recommended'?'selected':''}>Порядок автора</option><option value="title" ${state.sort==='title'?'selected':''}>По названию</option><option value="${applied?'duration':'courses'}" ${['duration','courses'].includes(state.sort)?'selected':''}>${applied?'Сначала короткие':'По числу курсов'}</option></select></label><label class="m-local-search">${icon('search')}<input type="search" data-filter="query" value="${esc(state.query)}" placeholder="${applied?'Поиск прикладных курсов…':'Поиск технологий…'}" aria-label="${applied?'Поиск прикладных курсов':'Поиск технологий'}"></label></div><div class="m-results-meta"><span id="masteryResultCount" role="status" aria-live="polite"></span><button type="button" data-action="reset-filters">Сбросить фильтры</button></div>${adminMode?'<p class="m-reorder-note" role="status"></p>':''}`;
  }
  function technologyCard(t) {
    const core=coursesFor(t.id,'core').length,applied=coursesFor(t.id,'applied').length;
    return `<article class="m-tech-card ${adminMode?'m-editable-card':''} ${!t.published?'m-hidden-card':''}" data-technology="${t.id}" data-reorder-id="${t.id}" data-collection="technologies" style="--brand:${t.color}"><a class="m-tech-link" href="${routeFor(t.id)}" aria-label="Открыть технологию ${esc(t.title)}"><div class="m-tech-art"><img src="${esc(t.image)}" alt="" loading="lazy"></div><div class="m-tech-info">${logo(t)}<div class="m-tech-copy"><h2 class="m-card-title">${esc(t.title)}</h2><p>${esc(t.description)}</p>${tags(t.tags)}</div></div><div class="m-tech-category">${esc(store.categories[t.category])}</div><div class="m-tech-branches"><span class="m-core-count">${icon('book')}<span><strong>${core}</strong><small>Основные курсы</small></span></span><span class="m-applied-count">${icon('folder')}<span><strong>${applied}</strong><small>Прикладные курсы</small></span></span></div></a>${cardControls(t,'technologies')}</article>`;
  }
  function courseCard(c,t,core=false,index=0) {
    const pct=percent(c),url=routeFor(t.id,c.branch,c.id),image=c.image||t.image;
    return `<article class="m-course-card ${adminMode?'m-editable-card':''} ${!c.published||!t.published?'m-hidden-card':''} ${core?'m-path-card':''} ${pct===100?'m-course-complete':''} ${core&&c.capstone?'m-capstone':''}" data-course="${c.id}" data-reorder-id="${c.id}" data-collection="courses"><a class="m-course-link" href="${url}" aria-label="Открыть курс ${esc(c.title)}"><div class="m-course-art"><img src="${esc(image)}" alt="" loading="lazy"><span class="m-course-logo">${logo({...t,icon:c.icon||t.icon,iconUrl:c.iconUrl||(c.icon?'':t.iconUrl)})}</span></div>${core?`<span class="m-path-number">${index+1}</span>`:''}<div class="m-course-copy"><h2 class="m-card-title">${esc(c.title)}</h2><p>${esc(c.description)}</p>${tags(core?[store.levels[c.level],c.topic]:['Мини-проект',store.levels[c.level],c.topic])}<div class="m-course-meta"><span>${icon('book')}${lessonCount(c.lessonCount)}</span><span>${icon('refresh')}${duration(c.durationMinutes)}</span></div>${core?`<div class="m-course-progress"><progress value="${pct}" max="100" aria-label="Прогресс курса ${esc(c.title)}"></progress><span>${pct}%</span></div>`:''}</div></a>${cardControls(c,'courses',t)}</article>`;
  }
  function renderResults() {
    if(drag)clearDrag();
    const results=page.querySelector('#masteryResults');if(!results)return;
    const state=filterState(),q=state.query.toLocaleLowerCase('ru');
    const items=current.kind==='catalog'?visibleTechs().filter(t=>(state.category==='all'||state.category===t.category)&&(state.level==='all'||coursesFor(t.id).some(c=>c.level===state.level))&&[t.title,t.description,...t.tags].join(' ').toLocaleLowerCase('ru').includes(q)):coursesFor(current.tech.id,'applied').filter(c=>(state.category==='all'||c.topic===state.category)&&(state.level==='all'||c.level===state.level)&&[c.title,c.description,c.topic].join(' ').toLocaleLowerCase('ru').includes(q));
    if(state.sort==='title')items.sort((a,b)=>a.title.localeCompare(b.title,'ru'));
    if(state.sort==='courses')items.sort((a,b)=>coursesFor(b.id).length-coursesFor(a.id).length);
    if(state.sort==='duration')items.sort((a,b)=>a.durationMinutes-b.durationMinutes);
    const note=page.querySelector('.m-reorder-note');
    if(note)note.textContent=canReorder()?'Перетаскивайте карточки за значок ⠿, чтобы изменить порядок.':'Для перетаскивания выберите сортировку «Порядок автора».';
    results.className='m-results '+(layout==='list'?'m-list':'m-grid');
    results.innerHTML=items.length?items.map(item=>current.kind==='catalog'?technologyCard(item):courseCard(item,current.tech)).join(''):`<div class="m-empty">${icon('search')}<h2>Ничего не найдено</h2><p>Попробуйте другой запрос или уберите часть фильтров.</p><button class="m-button" data-action="reset-filters">Сбросить фильтры</button></div>`;
    page.querySelector('#masteryResultCount').textContent=(current.kind==='catalog'?'Технологий: ':'Курсов: ')+items.length;
    page.querySelectorAll('[data-layout]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.layout===layout)));
  }
  function renderTechnology(t) {
    return hero({title:t.title,description:t.description,t,art:false})+utility()+`<section class="m-technology-intro" aria-labelledby="technologyAboutTitle"><div class="m-technology-copy"><span class="m-kicker">${esc(store.categories[t.category])}</span><h2 id="technologyAboutTitle">Описание технологии</h2><div class="m-technology-description">${paragraphs(t.about||t.description||'Описание технологии появится после заполнения автором.')}</div><a class="m-button m-primary m-start-learning" href="${routeFor(t.id,'core')}">Начать изучать ${icon('arrow')}</a></div><figure class="m-technology-image"><img src="${esc(t.image)}" alt="Иллюстрация технологии ${esc(t.title)}"></figure></section>`;
  }
  function coreContent(t) {
    const courses=coursesFor(t.id,'core'),done=courses.filter(c=>percent(c)===100).length,pct=courses.length?Math.round(done/courses.length*100):0,hours=Math.round(courses.reduce((sum,c)=>sum+c.durationMinutes,0)/60);
    return hero({title:'Основные курсы '+t.title,description:'Пошаговый путь от новичка к уверенной работе. Изучайте инструменты по порядку и закрепляйте знания на практике.',t,branch:'core'})+utility()+branchTabs(t,'core')+`<section class="m-progress-summary"><div class="m-progress-ring" style="--progress:${pct}%" role="img" aria-label="Завершено ${pct}%"><span>${pct}%</span></div><div class="m-progress-copy"><h2>${done} из ${courses.length} курсов завершено</h2><p>Каждый курс — ещё один шаг к вашей собственной игре.</p></div><div class="m-path-stats"><span>${icon('book')}<strong>${courseCount(courses.length)}</strong><small>Полный путь обучения</small></span><span>${icon('refresh')}<strong>~${hours} часов</strong><small>Общая длительность</small></span><span>${icon('bars')}<strong>Новичок → Профи</strong><small>От основ к проекту</small></span></div></section><div class="m-section-title">${icon('tree')}<div><h2>Путь обучения</h2><p>Идите по порядку или выберите тему, которую хотите изучить.</p></div></div><div class="m-core-toolbar">${layoutSwitch()}<p>${adminMode?'Перетаскивайте курсы за ⠿, чтобы настроить путь обучения.':'Выберите удобный вид пути обучения.'}</p></div><div class="m-learning-path ${layout==='list'?'m-list':'m-grid'}">${courses.length?courses.map((c,i)=>courseCard(c,t,true,i)).join(''):'<div class="m-empty"><h2>Путь ещё формируется</h2><p>Основные курсы появятся здесь после добавления в каталог.</p></div>'}</div>`;
  }
  const paragraphs=value=>String(value||'').split(/\n\s*\n/).filter(Boolean).map(p=>'<p>'+esc(p).replace(/\n/g,'<br>')+'</p>').join('');
  const learningRoute=(c,lesson='')=>routeFor(c.technologyId,c.branch,c.id)+'/learn'+(lesson?'/'+encodeURIComponent(lesson):'');
  const modeSwitch=()=>`<div class="m-view-switch m-mode-switch" role="group" aria-label="Режим просмотра"><button type="button" data-action="view-mode" data-mode="student" aria-pressed="${!adminMode}">Ученик</button><button type="button" data-action="view-mode" data-mode="admin" aria-pressed="${adminMode}">Администратор</button></div>`;
  const layoutSwitch=()=>`<div class="m-view-switch" role="group" aria-label="Вид каталога"><button type="button" data-layout="grid" aria-pressed="${layout==='grid'}">${icon('grid')} Сетка</button><button type="button" data-layout="list" aria-pressed="${layout==='list'}">${icon('list')} Список</button></div>`;
  function program(c,t) {
    const content=c.curriculum,done=new Set(CourseLearning.progress(c).completedLessonIds||[]);
    if(!content)return `<div class="m-curriculum-empty"><p>Уроки курса ещё готовятся. Программа появится после добавления материалов автором.</p>${adminMode?`<a class="m-button" href="${learningRoute(c)}">Создать первый урок ${icon('arrow')}</a>`:''}</div>`;
    return content.modules.map((module,mi)=>`<details class="m-program-module" open><summary><span>${mi+1}. ${esc(module.title)}</span><small>${lessonCount(module.lessonIds.length)}</small></summary><ol>${module.lessonIds.map((id,li)=>{const lesson=content.lessons.find(l=>l.id===id);return `<li><a href="${learningRoute(c,id)}" class="${done.has(id)?'m-lesson-done':''}"><span class="m-program-number">${mi+1}.${li+1}</span><span>${esc(lesson.title)}</span><small>${lesson.steps.length} ${plural(lesson.steps.length,['шаг','шага','шагов'])}</small>${icon(done.has(id)?'check':'arrow')}</a></li>`;}).join('')}</ol></details>`).join('');
  }
  function renderCourse(c,t) {
    const inPlan=plan.includes(c.id),enrolled=CourseLearning.enrolled(c.id),stats=CourseLearning.progress(c);
    const about=c.about||c.description,audience=c.audience||(c.level==='beginner'?'Для тех, кто начинает знакомство с '+t.title+'.':'Для тех, кто хочет углубить знания '+t.title+' и применить их на практике.');
    return hero({title:c.title,description:c.description,t,branch:c.branch,course:c})+utility()+`<div class="m-course-detail m-course-promo"><div class="m-course-information"><nav class="m-promo-nav" aria-label="Разделы описания курса"><a href="#course-outcomes" data-promo-section="course-outcomes">Чему вы научитесь</a><a href="#course-about" data-promo-section="course-about">О курсе</a><a href="#course-program" data-promo-section="course-program">Программа</a></nav><section class="m-program" id="course-outcomes"><span class="m-kicker">РЕЗУЛЬТАТ ОБУЧЕНИЯ</span><h2>Чему вы научитесь</h2><ul>${(c.outcomes.length?c.outcomes:['Подробные результаты обучения будут добавлены автором.']).map(o=>`<li>${icon('check')}<span>${esc(o)}</span></li>`).join('')}</ul></section><section class="m-program" id="course-about"><h2>О курсе</h2><div class="m-promo-prose">${paragraphs(about)}</div><h3>Для кого этот курс</h3><div class="m-promo-prose">${paragraphs(audience)}</div><h3>Начальные требования</h3><div class="m-promo-prose">${paragraphs(c.requirements||'Специальные требования пока не указаны автором.')}</div><h3>Как проходит обучение</h3><div class="m-promo-prose">${paragraphs(c.learningFormat||'Проходите уроки в удобном темпе: читайте материалы, выполняйте задания и переходите между шагами. Прогресс сохраняется в этом браузере.')}</div>${c.author?`<div class="m-course-author">${icon('user')}<div><small>Автор курса</small><strong>${esc(c.author)}</strong></div></div>`:''}</section><section class="m-program m-course-syllabus" id="course-program"><div class="m-section-title">${icon('book')}<div><span class="m-kicker">ПРОГРАММА КУРСА</span><h2>Содержание курса</h2></div></div>${program(c,t)}</section><a class="m-text-back" href="${routeFor(t.id,c.branch)}">← Вернуться к курсам ${esc(t.title)}</a></div><aside class="m-course-start"><img class="m-promo-cover" src="${esc(c.image||t.image)}" alt="Обложка курса ${esc(c.title)}">${tags([store.levels[c.level],c.topic])}<h2>${enrolled?'Вы поступили на курс':'Начните обучение'}</h2><dl><div><dt>Уроков</dt><dd>${c.lessonCount}</dd></div>${c.curriculum?`<div><dt>Модулей</dt><dd>${c.curriculum.modules.length}</dd></div><div><dt>Шагов</dt><dd>${stats.totalSteps}</dd></div>`:''}<div><dt>Длительность</dt><dd>${duration(c.durationMinutes)}</dd></div><div><dt>Ветка</dt><dd>${store.branches[c.branch]}</dd></div></dl>${enrolled&&c.curriculum?`<div class="m-promo-progress"><label for="promoCourseProgress">Пройдено ${stats.steps} из ${stats.totalSteps} шагов</label><progress id="promoCourseProgress" max="${stats.totalSteps||1}" value="${stats.steps}"></progress></div>`:''}<button class="m-button m-primary m-enrol-button" type="button" data-action="enrol" data-id="${c.id}">${icon('play')}${enrolled?'Продолжить обучение':'Поступить на курс'}</button>${adminMode?`<a class="m-button" href="${learningRoute(c)}">${icon('code')} Редактировать уроки</a>`:''}<button class="m-button ${inPlan?'m-in-plan':''}" type="button" data-action="plan" data-id="${c.id}">${icon(inPlan?'check':'book')}${inPlan?'В плане · убрать':'Добавить в план обучения'}</button>${c.url?`<a class="m-button m-extra-materials" href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">Дополнительные материалы ${icon('arrow')}</a>`:''}<p class="m-plan-hint">Запись на курс и прогресс сохраняются в этом браузере.</p></aside></div>`;
  }
  function flushWorkspace() {
    if(!workspace)return true;
    try{return page.querySelector('#courseWorkspace')?.contentWindow?.kursografBridge?.saveNow()!==false;}catch{notify('Не удалось сохранить материалы. Сохраните резервную копию в редакторе.');return false;}
  }
  function renderLearning(c,t,lessonId) {
    if(!adminMode&&!CourseLearning.enrolled(c.id))try{CourseLearning.enrol(c.id);}catch{notify('Не удалось сохранить запись на курс в браузере.');}
    const top=`<div class="m-player-context"><a class="m-button" href="${routeFor(t.id,c.branch,c.id)}">← О курсе</a><strong>${esc(c.title)}</strong>${modeSwitch()}</div>`;
    if(!adminMode&&!c.curriculum)return top+`<div class="m-player-empty"><h1>Уроки курса ещё готовятся</h1><p>Вы поступили на «${esc(c.title)}». Материалы появятся здесь после их добавления автором.</p><a class="m-button" href="${routeFor(t.id,c.branch,c.id)}">Вернуться к описанию курса</a></div>`;
    const project=structuredClone(c.curriculum||CourseContent.blank(c.title)),session=CourseLearning.session(c.id,project);
    project.title=c.title;
    if(!adminMode){if(session.activeId)project.activeId=session.activeId;for(const lesson of project.lessons)if(lesson.steps.some(s=>s.id===session.activeSteps[lesson.id]))lesson.activeStepId=session.activeSteps[lesson.id];}
    if(lessonId)project.activeId=lessonId;
    workspace={id:c.id,hash:location.hash,mode:adminMode?'author':'learner',project,attempts:session.attempts,revisions:CourseContent.revisions(project),explicitLesson:!!lessonId,saving:false};
    return top+`<iframe id="courseWorkspace" class="m-course-workspace" title="${adminMode?'Редактор курса':'Уроки курса'}: ${esc(c.title)}" src="course-player/index.html?v=20261024-course-workspace" allow="clipboard-read; clipboard-write"></iframe>`;
  }
  function syncWorkspaceCursor(activeId) {
    if(!workspace?.explicitLesson||location.hash!==workspace.hash)return;
    const course=catalog.courses.find(c=>c.id===workspace.id);if(!course?.curriculum?.lessons.some(l=>l.id===activeId))return;
    const next=learningRoute(course,activeId);if(location.hash===next)return;
    history.replaceState(null,'',next);workspace.hash=next;current.lessonId=activeId;
  }
  const frameMatches=source=>workspace&&page.querySelector('#courseWorkspace')?.contentWindow===source;
  window.CourseWorkspace={
    connect(source){if(!frameMatches(source))throw Error('Курс не открыт.');return structuredClone({mode:workspace.mode,project:workspace.project,attempts:workspace.attempts});},
    saveProject(source,raw){
      if(!frameMatches(source))return true;
      if(workspace.mode!=='author')throw Error('Откройте режим администратора.');
      const course=store.snapshot().courses.find(c=>c.id===workspace.id);if(!course)throw Error('Курс удалён.');
      const project=CourseContent.normalize(raw);
      if(course.curriculum&&JSON.stringify(course.curriculum)===JSON.stringify(project)&&course.title===project.title)return true;
      workspace.saving=true;
      try{store.saveCourse({...course,title:project.title,curriculum:project});workspace.project=project;workspace.revisions=CourseContent.revisions(project);syncWorkspaceCursor(project.activeId);}finally{workspace.saving=false;}
      return true;
    },
    saveSession(source,data){
      if(!frameMatches(source)||workspace.mode!=='learner')return true;
      const course={id:workspace.id,curriculum:workspace.project};
      const before=CourseLearning.progress(course).completedLessonIds;
      CourseLearning.save(workspace.id,data,workspace.revisions);
      window.DailyQuests?.recordLessonCompletion(workspace.id,before,CourseLearning.progress(course).completedLessonIds);
      syncWorkspaceCursor(data.activeId);return true;
    }
  };
  function parseRoute() {
    let parts;try{parts=location.hash.slice(1).split('/').filter(Boolean).map(decodeURIComponent);}catch{return {kind:'missing'};}
    if(parts[0]!=='mastery')return {kind:'home'};
    if(parts.length===1)return {kind:'catalog'};
    const tech=visibleTechs().find(t=>t.id===parts[1]);if(!tech)return {kind:'missing'};
    if(parts.length===2)return {kind:'technology',tech};
    const branch=parts[2];if(!Object.hasOwn(store.branches,branch))return {kind:'missing'};
    if(parts.length===3)return {kind:branch,tech};
    const course=coursesFor(tech.id,branch).find(c=>c.id===parts[3]);
    if(course&&parts.length===4)return {kind:'course',tech,course};
    if(course&&parts[4]==='learn'&&(parts.length===5||(parts.length===6&&course.curriculum?.lessons.some(l=>l.id===parts[5]))))return {kind:'learn',tech,course,lessonId:parts[5]};
    return {kind:'missing'};
  }
  function render(scroll=false) {
    if(drag)clearDrag();
    if(workspace&&!flushWorkspace()){history.replaceState(null,'',workspace.hash);return;}
    workspace=null;
    catalog=store.snapshot();current=parseRoute();
    const active=current.kind!=='home';
    document.querySelector('.dashboard').hidden=active;page.hidden=!active;
    document.querySelectorAll('.sidebar .nav-item').forEach(link=>{const selected=active?link.matches('[data-open-mastery]'):link.matches('a[href="./"]');link.classList.toggle('active',selected);if(selected)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
    document.body.classList.toggle('mastery-open',active);
    page.classList.toggle('m-admin-mode',adminMode);
    document.body.classList.toggle('m-course-open',current.kind==='learn');
    if(!active){document.title='Инди Кузница — Платформа';return;}
    document.title=(current.course?.title||current.tech?.title||'Древо мастерства')+' — Инди Кузница';
    if(current.kind==='catalog')page.innerHTML=hero({title:'Древо мастерства',description:'Выберите технологию, изучите основы и закрепите знания в прикладных курсах. У каждой технологии — две ветки: от первых шагов к собственным играм.'})+utility()+toolbar()+`<section id="masteryResults" aria-label="Каталог технологий"></section>`;
    else if(current.kind==='technology')page.innerHTML=renderTechnology(current.tech);
    else if(current.kind==='core')page.innerHTML=coreContent(current.tech);
    else if(current.kind==='applied')page.innerHTML=hero({title:'Прикладные курсы '+current.tech.title,description:'Практические мини-проекты и отдельные игровые механики. Создавайте рабочие системы шаг за шагом и применяйте знания на практике.',t:current.tech,branch:'applied'})+utility()+branchTabs(current.tech,'applied')+toolbar(true)+`<section id="masteryResults" aria-label="Прикладные курсы"></section>`;
    else if(current.kind==='learn')page.innerHTML=renderLearning(current.course,current.tech,current.lessonId);
    else if(current.kind==='course')page.innerHTML=renderCourse(current.course,current.tech);
    else page.innerHTML=utility()+'<div class="m-empty"><h1>Ветка не найдена</h1><p>Возможно, технология или курс были скрыты из каталога.</p><a class="m-button m-primary" href="'+routeFor()+'">Вернуться к технологиям</a></div>';
    renderResults();
    if(scroll){window.scrollTo({top:0,behavior:'instant'});page.focus({preventScroll:true});}
  }
  page.addEventListener('input',event=>{if(event.target.dataset.filter==='query'){filterState().query=event.target.value;renderResults();}});
  page.addEventListener('change',event=>{if(event.target.matches('select[data-filter]')){filterState()[event.target.dataset.filter]=event.target.value;renderResults();}});
  page.addEventListener('click',event=>{
    if(Date.now()<suppressClickUntil&&event.target.closest('a')){event.preventDefault();return;}
    const section=event.target.closest('[data-promo-section]');if(section){event.preventDefault();page.querySelector('#'+section.dataset.promoSection)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});return;}
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.action==='view-mode') {
      if(!flushWorkspace())return;
      adminMode=button.dataset.mode==='admin';
      try{localStorage.setItem('indieforge.mastery.admin',JSON.stringify(adminMode));}catch{notify('Режим изменён до перезагрузки страницы.');}
      render();return;
    }
    if(button.dataset.cardAction){handleCardAction(button);return;}
    if(button.dataset.action==='add-record'&&adminMode){openManager({collection:button.dataset.collection,id:'new'});return;}
    if(button.dataset.layout){layout=button.dataset.layout;try{localStorage.setItem('indieforge.mastery.layout',JSON.stringify(layout));}catch{notify('Не удалось сохранить выбранный вид.');}if(current.kind==='core')render();else renderResults();}
    if(button.dataset.action==='reset-filters'){const state=filterState();Object.assign(state,{query:'',category:'all',level:'all',sort:'recommended'});render();}
    if(button.dataset.action==='manage'&&adminMode)openManager();
    if(button.dataset.action==='enrol'){
      const course=catalog.courses.find(c=>c.id===button.dataset.id);if(!course)return;
      try{CourseLearning.enrol(course.id);location.hash=learningRoute(course);}catch{notify('Не удалось сохранить запись на курс. Разрешите хранение данных в браузере.');}
      return;
    }
    if(button.dataset.action==='plan'){
      const next=plan.includes(button.dataset.id)?plan.filter(id=>id!==button.dataset.id):[...plan,button.dataset.id];
      try{localStorage.setItem('indieforge.mastery.plan',JSON.stringify(next));plan=next;render();}catch{notify('Не удалось сохранить план в браузере.');}
    }
  });

  function deleteRecord(collection,id) {
    const item=catalog[collection].find(v=>v.id===id);if(!item)return false;
    const children=collection==='technologies'?catalog.courses.filter(c=>c.technologyId===id).length:0;
    const prompt=children?`Удалить технологию «${item.title}» и все её курсы (${children})? Это удалит и скрытые черновики. Сохраните JSON, если нужна копия.`:`Удалить «${item.title}» из каталога?`;
    if(!confirm(prompt))return false;
    if(collection==='technologies')store.deleteTechnology(id,{cascade:true});else store.deleteCourse(id);
    return true;
  }
  function reorderGroup(collection,id) {
    const record=catalog[collection].find(v=>v.id===id);
    return record?ordered(catalog[collection].filter(v=>collection==='technologies'||(v.technologyId===record.technologyId&&v.branch===record.branch))):[];
  }
  function moveRecord(collection,id,targetId,placement) {
    if(!canReorder())return;
    try {
      const changed=collection==='technologies'?store.moveTechnology(id,targetId,placement):store.moveCourse(id,targetId,placement);
      if(changed){notify('Порядок сохранён.');page.querySelector(`[data-drag-id="${id}"]`)?.focus({preventScroll:true});}
    }catch(error){notify(error.message);}
  }
  function moveBy(collection,id,offset) {
    const group=reorderGroup(collection,id),index=group.findIndex(v=>v.id===id),target=group[index+offset];
    if(target)moveRecord(collection,id,target.id);
  }
  function handleCardAction(button) {
    if(!adminMode)return;
    const {cardAction:action,collection,id}=button.dataset;
    button.closest('details')?.removeAttribute('open');
    const record=catalog[collection]?.find(v=>v.id===id);if(!record)return;
    try {
      if(action==='edit')openManager({collection,id});
      if(action==='visibility') {
        const next={...record,published:!record.published};
        if(collection==='technologies')store.saveTechnology(next);else store.saveCourse(next);
        notify(next.published?'Запись опубликована.':'Запись скрыта от учеников.');
      }
      if(action==='delete'&&deleteRecord(collection,id))notify('Запись удалена.');
      if(action==='move-up'||action==='move-down')moveBy(collection,id,action==='move-up'?-1:1);
    }catch(error){notify(error.message);}
  }

  // Preview ordering in the DOM; commit once the pointer is released in the catalogue.
  let drag=null,touchDrag=null,mouseDragHandle=null,suppressClickUntil=0;
  const dropCard=target=>target?.closest('[data-reorder-id]');
  const dragItems=()=>drag?[...drag.container.children].filter(el=>el.matches('[data-reorder-id]')&&el!==drag.source):[];
  function clearDrag() {
    if(drag) {
      cancelAnimationFrame(drag.activationFrame);
      cancelAnimationFrame(drag.scrollFrame);
      drag.animations.forEach(animation=>animation.cancel());
      drag.source.classList.remove('m-drag-source');
      drag.source.style.width=drag.sourceWidth;
      drag.container.append(...drag.originalChildren);
      drag.placeholder.remove();drag.ghost.remove();
    }
    document.body.classList.remove('m-is-dragging');
    drag=null;touchDrag=null;mouseDragHandle=null;
  }
  function makeDragGhost(source,container,rect,touch) {
    const host=document.createElement('div');
    host.className='mastery-page m-drag-ghost '+(container.classList.contains('m-list')?'m-list':'m-grid');
    host.setAttribute('aria-hidden','true');host.inert=true;
    host.style.width=rect.width+'px';host.style.height=rect.height+'px';
    const clone=source.cloneNode(true);
    clone.querySelectorAll('[open]').forEach(el=>el.removeAttribute('open'));
    [clone,...clone.querySelectorAll('*')].forEach(el=>{
      for(const name of ['id','data-reorder-id','data-technology','data-course','data-drag-id'])el.removeAttribute(name);
      if(el.hasAttribute('draggable'))el.draggable=false;
    });
    host.append(clone);document.body.append(host);
    host.classList.toggle('m-touch-ghost',touch);
    return host;
  }
  function beginDrag(handle,touch=false,x=0,y=0) {
    if(!canReorder())return false;
    const source=dropCard(handle),container=source?.parentElement;if(!container)return false;
    const rect=source.getBoundingClientRect(),placeholder=document.createElement('div');
    placeholder.className='m-sort-placeholder';placeholder.setAttribute('aria-hidden','true');
    placeholder.style.minHeight=rect.height+'px';
    placeholder.style.gridColumn=getComputedStyle(source).gridColumn;
    placeholder.innerHTML=icon('grip')+'<span>Отпустите карточку здесь</span>';
    const originalChildren=[...container.children],ghost=makeDragGhost(source,container,rect,touch);
    drag={id:handle.dataset.dragId,collection:handle.dataset.collection,source,container,placeholder,ghost,originalChildren,sourceWidth:source.style.width,width:rect.width,animations:new Map(),offsetX:x-rect.left,offsetY:y-rect.top,touch,point:{x,y},scrollFrame:0,activationFrame:0,active:false};
    if(touch)activateDragLayout();else drag.activationFrame=requestAnimationFrame(activateDragLayout);
    document.body.classList.add('m-is-dragging');
    if(touch)positionTouchGhost(x,y);
    return true;
  }
  function activateDragLayout() {
    if(!drag||drag.active)return;
    drag.active=true;
    drag.source.before(drag.placeholder);drag.source.style.width=drag.width+'px';drag.source.classList.add('m-drag-source');
  }
  // Use final layout coordinates while neighbouring cards animate towards their new slots.
  function slotRect(el) {
    const rect=el.getBoundingClientRect(),transform=getComputedStyle(el).transform;
    const matrix=transform==='none'?null:new DOMMatrixReadOnly(transform);
    return {left:rect.left-(matrix?.m41||0),top:rect.top-(matrix?.m42||0),width:rect.width,height:rect.height};
  }
  function acceptsDrop(x,y) {
    if(!drag||!canReorder())return false;
    const rect=drag.container.getBoundingClientRect();
    return x>=rect.left-8&&x<=rect.right+8&&y>=rect.top-12&&y<=rect.bottom+12;
  }
  function shiftPlaceholder(next) {
    const {container,placeholder,animations}=drag;
    if(placeholder.nextElementSibling===next||(!next&&!placeholder.nextElementSibling))return;
    const items=dragItems(),before=new Map(items.map(el=>[el,el.getBoundingClientRect()]));
    animations.forEach(animation=>animation.cancel());animations.clear();
    container.insertBefore(placeholder,next);
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    items.forEach(el=>{
      const from=before.get(el),to=el.getBoundingClientRect(),dx=from.left-to.left,dy=from.top-to.top;
      if(Math.abs(dx)+Math.abs(dy)<1)return;
      animations.set(el,el.animate([{transform:`translate(${dx}px,${dy}px)`},{transform:'translate(0,0)'}],{duration:180,easing:'cubic-bezier(.2,.75,.3,1)'}));
    });
  }
  function previewDrop(x,y) {
    if(!acceptsDrop(x,y))return false;
    activateDragLayout();
    const placeholder=slotRect(drag.placeholder);
    if(x>=placeholder.left&&x<=placeholder.left+placeholder.width&&y>=placeholder.top&&y<=placeholder.top+placeholder.height)return true;
    const items=dragItems(),rects=items.map(el=>({el,...slotRect(el)}));
    const columns=getComputedStyle(drag.container).gridTemplateColumns.split(' ').length;
    if(drag.container.classList.contains('m-list')||columns===1) {
      shiftPlaceholder(rects.find(r=>y<r.top+r.height/2)?.el||null);
      return true;
    }
    const rows=[];
    rects.forEach(r=>{let row=rows.find(row=>Math.abs(row.top-r.top)<6);if(!row){row={top:r.top,bottom:r.top+r.height,items:[]};rows.push(row);}row.bottom=Math.max(row.bottom,r.top+r.height);row.items.push(r);});
    const row=rows.find((row,i)=>y<=(row.bottom+(rows[i+1]?.top??row.bottom))/2)||rows.at(-1);
    if(!row)return true;
    const next=row.items.find(r=>x<r.left+r.width/2)?.el;
    if(next)shiftPlaceholder(next);
    else{const last=row.items.at(-1).el,index=items.indexOf(last);shiftPlaceholder(items[index+1]||null);}
    return true;
  }
  function finishDrag(x,y) {
    if(!drag)return;
    if(!previewDrop(x,y)){clearDrag();return;}
    const {id,collection,placeholder}=drag;
    let next=placeholder.nextElementSibling;while(next&&!next.matches('[data-reorder-id]:not(.m-drag-source)'))next=next.nextElementSibling;
    let previous=placeholder.previousElementSibling;while(previous&&!previous.matches('[data-reorder-id]:not(.m-drag-source)'))previous=previous.previousElementSibling;
    const target=next||previous,placement=next?'before':'after';
    clearDrag();suppressClickUntil=Date.now()+350;
    if(target)moveRecord(collection,id,target.dataset.reorderId,placement);
  }
  function positionTouchGhost(x,y) {
    if(!drag)return;
    drag.point={x,y};
    const width=drag.ghost.offsetWidth;
    drag.ghost.style.left=Math.max(8,Math.min(innerWidth-width-8,x-drag.offsetX))+'px';
    drag.ghost.style.top=y-Math.min(drag.offsetY,80)+'px';
  }
  function touchAutoScroll() {
    if(!drag?.touch)return;
    const {x,y}=drag.point;
    const amount=y<110?-Math.min(18,(110-y)/3):y>innerHeight-80?Math.min(18,(y-innerHeight+80)/3):0;
    if(amount){window.scrollBy(0,amount);previewDrop(x,y);}
    drag.scrollFrame=requestAnimationFrame(touchAutoScroll);
  }
  page.addEventListener('dragstart',event=>{
    const handle=event.target.closest('[data-drag-id]')||mouseDragHandle;mouseDragHandle=null;
    if(!handle||!beginDrag(handle,false,event.clientX,event.clientY)){event.preventDefault();return;}
    event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',drag.id);
    event.dataTransfer.setDragImage(drag.ghost,Math.max(0,Math.min(drag.width,drag.offsetX)),Math.max(0,Math.min(drag.ghost.offsetHeight,drag.offsetY)));
  });
  page.addEventListener('dragover',event=>{if(previewDrop(event.clientX,event.clientY)){event.preventDefault();event.dataTransfer.dropEffect='move';}});
  page.addEventListener('drop',event=>{if(acceptsDrop(event.clientX,event.clientY)){event.preventDefault();finishDrag(event.clientX,event.clientY);}});
  page.addEventListener('dragend',clearDrag);
  page.addEventListener('keydown',event=>{
    const handle=event.target.closest('[data-drag-id]');
    if(handle&&event.altKey&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)) {
      event.preventDefault();moveBy(handle.dataset.collection,handle.dataset.dragId,['ArrowUp','ArrowLeft'].includes(event.key)?-1:1);
    }
    if(event.key==='Escape')clearDrag();
  });
  page.addEventListener('pointerdown',event=>{
    const handle=event.target.closest('[data-drag-id]');
    if(event.pointerType==='mouse'){mouseDragHandle=handle&&canReorder()?handle:null;return;}
    if(!handle||!canReorder())return;
    event.preventDefault();handle.setPointerCapture(event.pointerId);
    touchDrag={pointerId:event.pointerId,x:event.clientX,y:event.clientY,handle,active:false};
  });
  page.addEventListener('pointermove',event=>{
    if(!touchDrag||touchDrag.pointerId!==event.pointerId)return;
    if(!touchDrag.active) {
      if(Math.hypot(event.clientX-touchDrag.x,event.clientY-touchDrag.y)<8)return;
      touchDrag.active=beginDrag(touchDrag.handle,true,touchDrag.x,touchDrag.y);
      if(!touchDrag.active)return;
      drag.scrollFrame=requestAnimationFrame(touchAutoScroll);
    }
    positionTouchGhost(event.clientX,event.clientY);previewDrop(event.clientX,event.clientY);
  });
  page.addEventListener('pointerup',event=>{
    mouseDragHandle=null;if(!touchDrag||touchDrag.pointerId!==event.pointerId)return;
    if(touchDrag.active)finishDrag(event.clientX,event.clientY);else clearDrag();
  });
  page.addEventListener('pointercancel',()=>{if(touchDrag)clearDrag();});
  window.addEventListener('resize',()=>{if(drag)clearDrag();});
  document.addEventListener('click',event=>{page.querySelectorAll('.m-card-menu[open]').forEach(menu=>{if(!menu.contains(event.target))menu.open=false;});});

  // Catalogue management: the same repository powers every public view.
  const dialog=document.createElement('dialog');dialog.id='masteryManager';dialog.className='m-manager';dialog.setAttribute('aria-labelledby','masteryManagerTitle');
  dialog.innerHTML=`<header class="m-manager-heading"><div><span class="m-kicker">КАТАЛОГ · УПРАВЛЕНИЕ</span><h2 id="masteryManagerTitle">Технологии и курсы</h2></div><button type="button" data-admin="close" aria-label="Закрыть управление каталогом">×</button></header><p class="m-manager-note">Изменения сохраняются в этом браузере. Для переноса или публикации скачайте JSON каталога.</p><div class="m-manager-tools"><div class="m-view-switch" role="group" aria-label="Раздел каталога"><button type="button" data-admin-tab="courses">Курсы</button><button type="button" data-admin-tab="technologies">Технологии</button></div><button type="button" class="m-button" data-admin="export">Экспорт JSON</button><button type="button" class="m-button" data-admin="import">Импорт JSON</button><input type="file" id="masteryImport" accept=".json,application/json" hidden></div><p id="masteryManagerMessage" role="status"></p><div id="masteryManagerBody"></div>`;
  document.body.append(dialog);
  const managerBody=()=>dialog.querySelector('#masteryManagerBody');
  const message=text=>{dialog.querySelector('#masteryManagerMessage').textContent=text;};
  function openManager({collection='courses',id=null}={}){if(!adminMode)return;manager.tab=collection;manager.tech=current.tech?.id||'';manager.editing=id;manager.query='';message('');renderManager();dialog.showModal();if(store.recoveryMessage())message(store.recoveryMessage());}
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
      return `<div class="m-admin-row ${item.published?'':'m-hidden-row'}"><div>${statusBadge(item,courseMode?t:null)}<strong>${esc(item.title)}</strong><small>${courseMode?esc(t.title)+' · '+store.branches[item.branch]:esc(store.categories[item.category])} · ${item.published?'В каталоге':'Скрыто'}</small></div><button class="m-button" type="button" data-admin="visibility" data-id="${item.id}">${item.published?'Скрыть':'Опубликовать'}</button><button class="m-button" type="button" data-admin="edit" data-id="${item.id}" aria-label="Редактировать ${esc(item.title)}">Изменить</button><button class="m-admin-delete" type="button" data-admin="delete" data-id="${item.id}" aria-label="Удалить ${esc(item.title)}">×</button></div>`;
    }).join(''):'<div class="m-empty"><h3>Пока ничего нет</h3><p>Добавьте запись или измените фильтр.</p></div>';
  }
  const inputField=(label,name,value,{type='text',required=false,wide=false}={})=>`<label class="m-form-field ${wide?'wide':''}">${label}<input name="${name}" type="${type}" value="${esc(value)}" ${required?'required':''} ${type==='number'?'min="0" max="60000" step="1"':''} ${name==='id'?'readonly':''}></label>`;
  const areaField=(label,name,value)=>`<label class="m-form-field wide">${label}<textarea name="${name}" rows="3" maxlength="${name==='about'?12000:['audience','requirements','learningFormat'].includes(name)?6000:2000}">${esc(value)}</textarea></label>`;
  const selectField=(label,name,value,entries)=>`<label class="m-form-field">${label}<select name="${name}">${entries.map(([v,t])=>`<option value="${esc(v)}" ${v===value?'selected':''}>${esc(t)}</option>`).join('')}</select></label>`;
  const mediaSpecs={technology:{width:1200,height:600,ratio:'2:1'},course:{width:1200,height:675,ratio:'16:9'},icon:{width:256,height:256,ratio:'1:1'}};
  const mediaTimers=new Map();
  function mediaSpec(name){return mediaSpecs[name==='iconUrl'?'icon':manager.tab==='courses'?'course':'technology'];}
  function mediaField(label,name,value) {
    const spec=mediaSpec(name);
    return `<div class="m-media-field wide"><label class="m-form-field">${label}<input name="${name}" value="${esc(value)}" placeholder="Путь к файлу или HTTPS-ссылка" aria-label="${label}" aria-describedby="mastery-${name}-guide mastery-${name}-size"></label><div class="m-media-tools"><img data-media-preview="${name}" ${value?`src="${esc(value)}"`:'hidden'} alt="Предпросмотр: ${label}"><label class="m-button m-upload-label">Выбрать файл<input type="file" data-media-upload="${name}" accept="image/png,image/jpeg,image/webp,image/gif" aria-describedby="mastery-${name}-guide"></label><button class="m-button" type="button" data-clear-media="${name}">Убрать</button><small>PNG, JPEG, WebP, GIF · до 400 КБ</small></div><p class="m-media-guidance" id="mastery-${name}-guide">Рекомендуемое разрешение: <strong>${spec.width} × ${spec.height} px</strong> · пропорции <strong>${spec.ratio}</strong>. Изображение вписывается целиком, без обрезки и искажения пропорций.</p><p class="m-media-size" id="mastery-${name}-size" data-media-size="${name}" role="status" aria-live="polite">${value?'Определяем размеры изображения…':'Изображение не выбрано.'}</p></div>`;
  }
  function updateMediaPreview(name,value) {
    clearTimeout(mediaTimers.get(name));
    const preview=dialog.querySelector(`[data-media-preview="${name}"]`),status=dialog.querySelector(`[data-media-size="${name}"]`);
    if(!preview||!status)return;
    const token=Symbol();preview.mediaRequest=token;
    const valid=()=>preview.isConnected&&preview.mediaRequest===token;
    let safe;
    try{safe=store.safeImage(value);}catch(error){preview.hidden=true;status.textContent=error.message;status.dataset.fit='error';return;}
    if(!safe){preview.hidden=true;preview.removeAttribute('src');status.textContent='Изображение не выбрано.';status.dataset.fit='empty';return;}
    preview.hidden=false;preview.src=safe;status.textContent='Определяем размеры изображения…';status.dataset.fit='loading';
    const probe=new Image(),spec=mediaSpec(name);
    probe.onload=()=>{
      if(!valid())return;
      const width=probe.naturalWidth,height=probe.naturalHeight,ratioMatches=Math.abs(width/height-spec.width/spec.height)/(spec.width/spec.height)<.015,vector=/\.svg(?:[?#]|$)/i.test(safe);
      status.dataset.fit=ratioMatches?'match':'different';
      status.textContent=`Выбрано: ${width} × ${height} px. `+(ratioMatches?'Пропорции подходят.':`Пропорции отличаются от ${spec.ratio}: по краям останутся поля, изображение сохранится целиком.`)+(vector?' Векторное изображение масштабируется без потери чёткости.':width<spec.width||height<spec.height?' Размер меньше рекомендуемого; для чёткости используйте изображение крупнее.':'');
    };
    probe.onerror=()=>{if(valid()){preview.hidden=true;status.dataset.fit='error';status.textContent='Не удалось загрузить изображение и определить его размеры. Проверьте файл или ссылку.';}};
    probe.src=safe;
  }
  function renderEdit(){
    const courseMode=manager.tab==='courses';
    const record=manager.editing==='new'?null:catalog[manager.tab].find(item=>item.id===manager.editing);
    if(!record&&manager.editing!=='new'){manager.editing=null;renderManager();return;}
    const base=record||(courseMode?{id:store.newId('course'),technologyId:manager.tech||catalog.technologies[0]?.id,branch:current.kind==='applied'?'applied':'core',title:'',description:'',level:'beginner',topic:'Основы',lessonCount:0,durationMinutes:0,order:catalog.courses.length+1,published:false,capstone:false,image:'',icon:'',iconUrl:'',url:'',outcomes:[]}:{id:store.newId('technology'),title:'',description:'',category:'engine',tags:[],icon:'tools',color:'#40bfff',image:'assets/mastery/tools.svg',order:catalog.technologies.length+1,published:false});
    if(courseMode&&!catalog.technologies.length){message('Сначала добавьте технологию.');manager.editing=null;renderManager();return;}
    const common=inputField('Название','title',base.title,{required:true,wide:true})+areaField('Описание','description',base.description);
    const fields=courseMode?selectField('Технология','technologyId',base.technologyId,catalog.technologies.map(t=>[t.id,t.title]))+selectField('Ветка','branch',base.branch,Object.entries(store.branches))+selectField('Уровень','level',base.level,Object.entries(store.levels))+inputField('Тема / механика','topic',base.topic)+inputField('Количество уроков','lessonCount',base.lessonCount,{type:'number'})+inputField('Длительность в минутах','durationMinutes',base.durationMinutes,{type:'number'})+selectField('Значок курса','icon',base.icon||'',[['','Как у технологии'],...store.icons.map(v=>[v,iconLabels[v]])])+inputField('Ссылка на материалы курса (необязательно)','url',base.url,{wide:true})+areaField('Что изучим — каждый пункт с новой строки','outcomes',base.outcomes.join('\n'))+areaField('О курсе — подробное описание','about',base.about||'')+areaField('Для кого этот курс','audience',base.audience||'')+areaField('Начальные требования','requirements',base.requirements||'')+areaField('Как проходит обучение','learningFormat',base.learningFormat||'')+inputField('Автор курса','author',base.author||''):areaField('О технологии — подробное описание','about',base.about||'')+selectField('Категория','category',base.category,Object.entries(store.categories))+selectField('Значок','icon',base.icon,store.icons.map(v=>[v,iconLabels[v]]))+inputField('Цвет значка','color',base.color,{type:'color'})+inputField('Метки через запятую','tags',base.tags.join(', '));
    managerBody().innerHTML=`<button class="m-text-back" type="button" data-admin="back">← К списку</button><h3 class="m-edit-title">${record?'Редактировать': 'Добавить'} ${courseMode?'курс':'технологию'}</h3><form id="masteryEditForm" class="m-edit-form">${common}${fields}${courseMode?`<label class="m-publish-toggle wide"><input type="checkbox" name="capstone" ${base.capstone?'checked':''}> Итоговый / дипломный проект (выделенная карточка)</label>`:''}${mediaField('Изображение карточки','image',base.image)}${mediaField('Собственная иконка (необязательно)','iconUrl',base.iconUrl||'')}${inputField('Порядок в списке','order',base.order,{type:'number'})}${inputField('Постоянный ID','id',base.id)}<label class="m-publish-toggle wide"><input type="checkbox" name="published" ${base.published?'checked':''}> Опубликовано — видно ученикам</label><div class="m-form-actions wide"><button class="m-button" type="button" data-admin="back">Отмена</button><button class="m-button m-primary" type="submit">Сохранить ${courseMode?'курс':'технологию'}</button></div></form>`;
    managerBody().querySelector('[name=title]').focus();
    if(courseMode&&base.curriculum){managerBody().querySelector('[name=lessonCount]').readOnly=true;managerBody().querySelector('[name=lessonCount]').title='Количество уроков определяется программой курса.';}
    for(const name of ['image','iconUrl'])updateMediaPreview(name,managerBody().querySelector(`[name="${name}"]`).value);
  }
  dialog.addEventListener('input',event=>{if(event.target.id==='masteryAdminSearch'){manager.query=event.target.value;renderManagerRows();}if(['image','iconUrl'].includes(event.target.name)){const {name,value}=event.target;clearTimeout(mediaTimers.get(name));mediaTimers.set(name,setTimeout(()=>updateMediaPreview(name,value),200));}});
  dialog.addEventListener('change',async event=>{
    if(event.target.dataset.mediaUpload) {
      const file=event.target.files[0],name=event.target.dataset.mediaUpload;event.target.value='';if(!file)return;
      try {
        if(file.size>400*1024||!['image/png','image/jpeg','image/webp','image/gif'].includes(file.type))throw Error('Выберите PNG, JPEG, WebP или GIF размером до 400 КБ.');
        const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('Не удалось прочитать изображение.'));reader.readAsDataURL(file);});
        store.safeImage(data);
        // Ignore a file read that completed after the form was closed or changed.
        if(!dialog.open||!event.target.isConnected)return;
        const field=dialog.querySelector(`[name="${name}"]`);field.value=data;updateMediaPreview(name,data);message('Изображение выбрано. Сохраните карточку, чтобы применить его.');
      }catch(error){message(error.message);}
      return;
    }
    if(event.target.id==='masteryAdminTech'){manager.tech=event.target.value;renderManagerRows();}
    if(event.target.id!=='masteryImport')return;
    const file=event.target.files[0];event.target.value='';if(!file)return;
    try{if(file.size>4*1024*1024)throw Error('Файл каталога должен быть меньше 4 МБ.');const data=store.validate(JSON.parse(await file.text()));if(!confirm('Заменить текущий каталог? В файле '+data.technologies.length+' технологий и '+data.courses.length+' курсов. Экспортируйте текущую версию, если нужна копия.'))return;store.importCatalog(data);manager.editing=null;manager.tech='';renderManager();message('Каталог импортирован.');}catch(error){message(error.message);}
  });
  dialog.addEventListener('submit',event=>{
    if(event.target.getAttribute('id')!=='masteryEditForm')return;event.preventDefault();
    try {
      const values=Object.fromEntries(new FormData(event.target));values.published=event.target.elements.published.checked;
      if(manager.tab==='courses'){values.capstone=event.target.elements.capstone.checked;values.outcomes=values.outcomes.split('\n').map(v=>v.trim()).filter(Boolean);store.saveCourse({...catalog.courses.find(c=>c.id===values.id),...values});}else{values.tags=values.tags.split(',').map(v=>v.trim()).filter(Boolean);store.saveTechnology(values);}
      manager.editing=null;renderManager();message('Изменения сохранены.');
    }catch(error){message(error.message);}
  });
  dialog.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.clearMedia){const name=button.dataset.clearMedia;dialog.querySelector(`[name="${name}"]`).value='';updateMediaPreview(name,'');return;}
    if(button.dataset.adminTab){manager.tab=button.dataset.adminTab;manager.query='';manager.editing=null;message('');renderManager();return;}
    const action=button.dataset.admin;
    if(action==='close')dialog.close();
    if(action==='new'){manager.editing='new';message('');renderManager();}
    if(action==='back'){manager.editing=null;message('');renderManager();}
    if(action==='edit'){manager.editing=button.dataset.id;message('');renderManager();}
    if(action==='delete'){
      try{if(deleteRecord(manager.tab,button.dataset.id)){renderManager();message('Запись удалена.');}}catch(error){message(error.message);}
    }
    if(action==='visibility') {
      const item=catalog[manager.tab].find(v=>v.id===button.dataset.id);if(!item)return;
      try{const next={...item,published:!item.published};if(manager.tab==='courses')store.saveCourse(next);else store.saveTechnology(next);renderManager();message(next.published?'Запись опубликована.':'Запись скрыта от учеников.');}catch(error){message(error.message);}
    }
    if(action==='import')dialog.querySelector('#masteryImport').click();
    if(action==='export'){
      const url=URL.createObjectURL(new Blob([JSON.stringify(store.snapshot(),null,2)],{type:'application/json'}));
      const link=document.createElement('a');link.href=url;link.download='mastery-catalog.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),10000);message('Каталог экспортирован.');
    }
  });
  window.addEventListener('hashchange',()=>{render(true);document.querySelector('.sidebar').classList.remove('open');document.querySelector('.mobile-menu').setAttribute('aria-expanded','false');});
  window.addEventListener('mastery:catalog-changed',()=>{catalog=store.snapshot();if(!workspace)render();});
  window.addEventListener('beforeunload',flushWorkspace);
  window.MasteryApp={
    open:()=>{location.hash='/mastery';},
    search(query){const q=query.toLocaleLowerCase('ru'),active=visibleTechs();return [...active.filter(t=>[t.title,...t.tags].join(' ').toLocaleLowerCase('ru').includes(q)).map(t=>({title:t.title+' · Технология',hash:routeFor(t.id)})),...catalog.courses.filter(c=>(adminMode||c.published)&&active.some(t=>t.id===c.technologyId)&&[c.title,c.description].join(' ').toLocaleLowerCase('ru').includes(q)).map(c=>({title:c.title+' · '+catalog.technologies.find(t=>t.id===c.technologyId).title,hash:routeFor(c.technologyId,c.branch,c.id)}))].slice(0,15);},
    // Integration seam for a future lesson player; progress is separate from catalogue data.
    setCourseProgress(id,lessons){const course=catalog.courses.find(c=>c.id===id);if(!course||!Number.isFinite(lessons))return false;if(course.curriculum){const count=Math.min(course.lessonCount,Math.max(0,Math.round(lessons))),data=CourseLearning.session(id,course.curriculum),attempts=new Map(data.attempts);course.curriculum.lessons.forEach((lesson,index)=>lesson.steps.forEach(step=>attempts.set(JSON.stringify([lesson.id,step.id]),{completed:index<count,answers:[],sort:null,result:null})));try{CourseLearning.save(id,{...data,attempts:[...attempts]},CourseContent.revisions(course.curriculum));render();return true;}catch{return false;}}
      const next={...progress,[id]:Math.min(course.lessonCount,Math.max(0,Math.round(lessons)))};try{localStorage.setItem('indieforge.mastery.progress',JSON.stringify(next));progress=next;render();return true;}catch{return false;}}
  };
  document.querySelectorAll('[data-open-mastery]').forEach(button=>button.addEventListener('click',()=>{window.MasteryApp.open();document.querySelector('.sidebar').classList.remove('open');document.querySelector('.mobile-menu').setAttribute('aria-expanded','false');}));
  render();
})();

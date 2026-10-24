const {test,expect}=require('@playwright/test');
const route=(id='godot-core-1',branch='core',tech='godot')=>`/#/mastery/${tech}/${branch}/${id}`;
const frame=page=>page.frameLocator('#courseWorkspace');
const catalogue=page=>page.evaluate(()=>MasteryCatalog.snapshot());
async function admin(page){await page.locator('[data-mode=admin]').click();}
async function openEditor(page,id='godot-core-1',branch='core',tech='godot'){
 await page.goto(route(id,branch,tech));await admin(page);await page.locator('.m-course-start a').filter({hasText:'Редактировать уроки'}).click();await expect(frame(page).locator('#editor')).toBeVisible();
}
async function quizFixture(page) {
 await page.goto('/#/mastery');
 await page.evaluate(()=>{
  const c=MasteryCatalog.snapshot().courses.find(c=>c.id==='godot-applied-1');
  MasteryCatalog.saveCourse({...c,curriculum:{title:c.title,activeId:'first',modules:[{id:'intro',title:'Вводный модуль',lessonIds:['first'],expanded:true}],lessons:[{id:'first',title:'Урок с заданием',steps:[{id:'note',type:'note',html:'<h2>Материал урока</h2><p>Прочитайте до конца, затем выполните задание.</p>'},{id:'quiz',type:'single',question:'Какой ответ верный?',correctExplanation:'Именно этот вариант.',incorrectExplanation:'Попробуйте другой вариант.',options:[{text:'Да',correct:true},{text:'Нет',correct:false}]}]}]}});
 });
 await page.goto(route('godot-applied-1','applied'));await page.locator('[data-action=enrol]').click();await expect(frame(page).locator('#stepTabs button')).toHaveCount(2);
}
async function readNote(page) {
 const content=frame(page).locator('#previewFrame');
 await expect.poll(()=>content.evaluate(el=>el.contentDocument?.readyState==='complete'&&!!el.contentDocument?.body?.textContent.trim())).toBe(true);
 await content.evaluate(el=>el.scrollIntoView({block:'end'}));
 const rect=await content.boundingBox();
 await page.mouse.move(rect.x+30,Math.min(page.viewportSize().height-40,rect.y+rect.height-30));await page.mouse.wheel(0,500);
 await expect(frame(page).locator('#stepTabs .active')).toHaveClass(/completed/);
}

test('course promotion follows Stepik sections, presents real modules and enrols into local lessons',async({page})=>{
 await page.goto(route());
 for(const title of ['Чему вы научитесь','О курсе','Для кого этот курс','Начальные требования','Как проходит обучение','Содержание курса'])await expect(page.locator('#masteryPage').getByRole('heading',{name:title,exact:true})).toBeVisible();
 await expect(page.locator('.m-program-module')).toHaveCount(2);await expect(page.locator('.m-program-module li')).toHaveCount(3);
 await page.locator('[data-promo-section=course-program]').click();await expect(page).toHaveURL(/godot-core-1$/);
 await page.locator('[data-action=enrol]').click();await expect(page).toHaveURL(/godot-core-1\/learn$/);
 await expect(frame(page).locator('#studentCourseTitle')).toHaveText('Godot с нуля');
 await expect(frame(page).locator('[data-author-only]:visible')).toHaveCount(0);
 await expect(frame(page).locator('#editor')).not.toBeVisible();
 expect(await page.evaluate(()=>CourseLearning.enrolled('godot-core-1'))).toBe(true);
 expect(await page.evaluate(()=>localStorage.getItem('kursograf.course-editor.v1'))).toBeNull();
 await page.locator('.m-player-context>a').click();await expect(page.locator('[data-action=enrol]')).toHaveText('Продолжить обучение');
});

test('editor saves pending HTML before mode and route changes, isolates courses and starts new curricula blank',async({page})=>{
 await openEditor(page);await frame(page).locator('#tabSource').click();
 const html='<h2>Авторский материал</h2>\n<p>Текст первого курса.</p>';
 await frame(page).locator('#sourceEditor').fill(html);await page.locator('[data-mode=student]').click();
 await expect(frame(page).frameLocator('#previewFrame').locator('h2')).toHaveText('Авторский материал');
 await page.reload();await expect(frame(page).frameLocator('#previewFrame').locator('h2')).toHaveText('Авторский материал');
 await openEditor(page,'blender-core-1','core','blender');
 await expect(frame(page).locator('#courseTitle')).toHaveValue('Blender с нуля');await expect(frame(page).locator('#editor')).not.toContainText('Авторский материал');
 await expect(frame(page).locator('.module-lesson-row')).toHaveCount(1);
 await frame(page).locator('#tabSource').click();await frame(page).locator('#sourceEditor').fill('<h2>Другой курс</h2><p>Текст Blender.</p>');
 await page.locator('.m-player-context>a').click();
 const data=await catalogue(page);expect(data.courses.find(c=>c.id==='godot-core-1').curriculum.lessons[0].steps[0].html).toContain('Авторский материал');expect(data.courses.find(c=>c.id==='blender-core-1').curriculum.lessons[0].steps[0].html).toContain('Текст Blender');
 await expect(page.locator('.m-program-module li')).toHaveCount(1);
});

test('course description edits retain authored lessons and catalogue JSON exports the curriculum',async({page})=>{
 await page.goto(route());await admin(page);
 await page.locator('.m-admin-banner [data-card-action=edit]').click();
 const form=page.locator('#masteryEditForm');
 await form.locator('[name=about]').fill('Подробное описание автора.');await form.locator('[name=audience]').fill('Для начинающих разработчиков.');await form.locator('[name=requirements]').fill('Установите Godot 4.');await form.locator('[name=learningFormat]').fill('Читайте уроки и решайте задания.');await form.locator('[name=author]').fill('Автор курса');
 await expect(form.locator('[name=lessonCount]')).toHaveAttribute('readonly','');
 await form.locator('button[type=submit]').click();await page.locator('[data-admin=close]').click();
 await expect(page.locator('#course-about')).toContainText('Подробное описание автора.');await expect(page.locator('.m-course-author strong')).toHaveText('Автор курса');await expect(page.locator('.m-program-module li')).toHaveCount(3);
 await page.locator('[data-action=manage]').click();const downloading=page.waitForEvent('download');await page.locator('[data-admin=export]').click();const download=await downloading;
 const fs=require('node:fs/promises'),data=JSON.parse(await fs.readFile(await download.path(),'utf8')),course=data.courses.find(c=>c.id==='godot-core-1');expect(course.curriculum.lessons).toHaveLength(3);expect(course.about).toBe('Подробное описание автора.');
 const bad=structuredClone(data);bad.courses.find(c=>c.id==='godot-core-1').curriculum.modules[0].lessonIds.push('unknown');
 await page.locator('#masteryImport').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(bad))});await expect(page.locator('#masteryManagerMessage')).toContainText('Урок должен принадлежать');
 expect((await catalogue(page)).courses.find(c=>c.id==='godot-core-1').curriculum.lessons).toHaveLength(3);
});

test('reading and quiz attempts persist separately; completed lessons update the catalogue and content edits reset only affected steps',async({page})=>{
 await quizFixture(page);const before=(await catalogue(page)).courses.find(c=>c.id==='godot-applied-1').curriculum;
 await expect(frame(page).locator('#courseProgressLabel')).toHaveText('Пройдено 0 из 2 шагов');await readNote(page);
 await frame(page).locator('#nextStep').click();await frame(page).locator('[data-choice="1"]').check();await frame(page).locator('[data-check]').click();await expect(frame(page).locator('#stepResult')).toHaveText('Попробуйте другой вариант.');
 await page.reload();await expect(frame(page).locator('#stepResult')).toHaveText('Попробуйте другой вариант.');await expect(frame(page).locator('[data-choice="1"]')).toBeChecked();
 await frame(page).locator('[data-choice="0"]').check();await frame(page).locator('[data-check]').click();await expect(frame(page).locator('#stepResult')).toHaveText('Именно этот вариант.');await expect(frame(page).locator('.lesson-count')).toHaveClass(/completed/);
 await page.reload();await expect(frame(page).locator('#courseProgressLabel')).toHaveText('Пройдено 2 из 2 шагов');
 expect((await catalogue(page)).courses.find(c=>c.id==='godot-applied-1').curriculum).toEqual(before);
 await page.locator('.m-player-context>a').click();await expect(page.locator('.m-promo-progress')).toContainText('Пройдено 2 из 2 шагов');await expect(page.locator('.m-program-module .m-lesson-done')).toHaveCount(1);
 await page.evaluate(()=>{const c=MasteryCatalog.snapshot().courses.find(c=>c.id==='godot-applied-1');c.curriculum.lessons[0].steps[1].question='Обновлённый вопрос';MasteryCatalog.saveCourse(c);});
 await page.locator('[data-action=enrol]').click();await expect(frame(page).locator('#courseProgressLabel')).toHaveText('Пройдено 1 из 2 шагов');await expect(frame(page).locator('#stepResult')).toBeEmpty();
});

test('programme links open the selected lesson and resume it; hidden courses remain absent from direct lesson routes',async({page})=>{
 await page.goto(route());await page.locator('.m-program-module a').filter({hasText:'Сцены и узлы'}).click();await expect(page).toHaveURL(/learn\/scenes$/);await expect(frame(page).locator('#lessonHeading')).toHaveText('Сцены и узлы');
 await page.locator('.m-player-context>a').click();await page.locator('[data-action=enrol]').click();await expect(frame(page).locator('#lessonHeading')).toHaveText('Сцены и узлы');
 await page.goto(route()+'/learn/welcome');await expect(frame(page).locator('#lessonHeading')).toHaveText('Введение в Godot 4');await frame(page).locator('#nextStep').click();await expect(page).toHaveURL(/learn\/scenes$/);await page.reload();await expect(frame(page).locator('#lessonHeading')).toHaveText('Сцены и узлы');
 await page.goto('/#/mastery');await page.evaluate(()=>{const c=MasteryCatalog.snapshot().courses.find(c=>c.id==='godot-core-1');MasteryCatalog.saveCourse({...c,published:false});});
 await page.goto(route()+'/learn/welcome');await expect(page.locator('#masteryPage h1')).toHaveText('Ветка не найдена');await expect(page.locator('#courseWorkspace')).toHaveCount(0);
 await admin(page);await expect(frame(page).locator('#editor')).toBeVisible();
});

test('unsaved edits stay in the editor if browser storage fails while switching to student view',async({page})=>{
 await openEditor(page);const before=(await catalogue(page)).courses.find(c=>c.id==='godot-core-1').curriculum;
 await frame(page).locator('#tabSource').click();await frame(page).locator('#sourceEditor').fill('<h2>Несохранённый текст</h2>');
 await page.evaluate(()=>{window.originalSetItem=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw Error('quota');};});
 await page.locator('[data-mode=student]').click();await expect(page.locator('[data-mode=admin]')).toHaveAttribute('aria-pressed','true');await expect(frame(page).locator('#saveState')).toContainText('Ошибка сохранения');await expect(frame(page).locator('#sourceEditor')).toHaveValue('<h2>Несохранённый текст</h2>');expect((await catalogue(page)).courses.find(c=>c.id==='godot-core-1').curriculum).toEqual(before);
 await page.evaluate(()=>Storage.prototype.setItem=window.originalSetItem);await page.locator('[data-mode=student]').click();await expect(frame(page).frameLocator('#previewFrame').locator('h2')).toHaveText('Несохранённый текст');
});

test('core courses support grid/list persistence and new promotion and lesson views fit desktop and mobile',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 await page.goto('/#/mastery/godot/core');await page.locator('[data-layout=list]').click();await expect(page.locator('.m-learning-path')).toHaveClass(/m-list/);await expect(page.locator('.m-path-card')).toHaveCount(13);await page.reload();await expect(page.locator('[data-layout=list]')).toHaveAttribute('aria-pressed','true');
 await page.locator('[data-layout=grid]').click();await expect(page.locator('.m-learning-path')).not.toHaveClass(/m-list/);
 for(const learner of [true,false]){
  for(const url of ['/\u0023/mastery/godot/core',route(),route()+'/learn']){
   await page.goto(url);if(!learner)await admin(page);
   if(url.endsWith('/learn'))await expect(frame(page).locator('#stepTabs button').first()).toBeVisible();
   for(const width of [1672,1366,1024,768,390,360]){
    await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth),url+' '+width).toBeLessThanOrEqual(width);
    if(url.endsWith('/learn'))expect(await frame(page).locator('html').evaluate(el=>el.scrollWidth)).toBeLessThanOrEqual(width);
   }
  }
 }
 await page.locator('[data-mode=student]').click();await frame(page).locator('#menuToggle').click();await expect(frame(page).locator('#sidebar')).toHaveClass(/open/);await frame(page).locator('[data-lesson-id="scenes"] .lesson-item').click();await expect(frame(page).locator('#sidebar')).not.toHaveClass(/open/);
 expect(errors).toEqual([]);
});

test('imported lesson HTML is sanitized by the migrated editor before learner display',async({page})=>{
 await page.goto('/#/mastery');
 await page.evaluate(()=>{const c=MasteryCatalog.snapshot().courses.find(c=>c.id==='godot-applied-1');MasteryCatalog.saveCourse({...c,curriculum:{title:c.title,modules:[{id:'safe',title:'Безопасный модуль',lessonIds:['safe-lesson']}],lessons:[{id:'safe-lesson',title:'Импортированный урок',steps:[{id:'safe-note',type:'note',html:'<h2 onclick="top.injected=true">Текст урока</h2><script>top.injected=true</script><iframe srcdoc="bad"></iframe><a href="javascript:alert(1)">Ссылка</a>'}]}]}});});
 await page.goto(route('godot-applied-1','applied'));await page.locator('[data-action=enrol]').click();
 const note=frame(page).frameLocator('#previewFrame');await expect(note.locator('h2')).toHaveText('Текст урока');await expect(note.locator('h2')).not.toHaveAttribute('onclick');await expect(note.locator('script,iframe')).toHaveCount(0);await expect(note.locator('a')).not.toHaveAttribute('href',/javascript:/);expect(await page.evaluate(()=>window.injected)).toBeUndefined();
});

test('migrated editor creates modules, lessons and quiz steps and saves their structure in the selected course',async({page})=>{
 await openEditor(page,'blender-core-1','core','blender');const f=frame(page);
 await f.locator('#addModule').click();await f.locator('#structureTitle').fill('Практика Blender');await f.locator('#structureForm button[type=submit]').click();
 const module=f.locator('.course-module').last();await expect(module.locator('.module-toggle')).toContainText('Практика Blender');await module.locator('.module-add-lesson').click();
 await f.locator('.lesson-item.active + .lesson-more').click();await f.locator('#structureTitle').fill('Первое задание');await f.locator('#structureForm button[type=submit]').click();
 await f.locator('#addStepInline').click();await f.locator('[data-new=single]').click();
 await f.locator('#stepQuizPanel [data-field=question]').fill('Выберите правильный ответ.');await f.locator('#stepQuizPanel [data-option="0"]').fill('Верно');await f.locator('#stepQuizPanel [data-option="1"]').fill('Неверно');await f.locator('#stepQuizPanel [data-field=correctExplanation]').fill('Отличный результат.');
 await page.locator('[data-mode=student]').click();await expect(f.locator('#lessonHeading')).toHaveText('Первое задание');await expect(f.locator('#stepTabs button')).toHaveCount(2);await f.locator('[data-choice="0"]').check();await f.locator('[data-check]').click();await expect(f.locator('#stepResult')).toHaveText('Отличный результат.');
 const course=(await catalogue(page)).courses.find(c=>c.id==='blender-core-1');expect(course.curriculum.modules).toHaveLength(2);expect(course.lessonCount).toBe(2);expect(course.curriculum.lessons[1].steps[1].type).toBe('single');
 await page.reload();await expect(f.locator('#stepResult')).toHaveText('Отличный результат.');
});

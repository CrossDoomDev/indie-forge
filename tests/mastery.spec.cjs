const {test,expect}=require('@playwright/test');
const fs=require('node:fs/promises');

test('home mastery preview follows published catalogue order, hides drafts and opens technology pages',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.home-mastery-summary')).toHaveText('13 технологий · 85 курсов');
 await expect(page.locator('.home-tech')).toHaveCount(3);
 await page.locator('.home-tech').first().click();await expect(page).toHaveURL(/#\/mastery\/godot$/);
 await Promise.all([page.waitForURL(url=>!url.hash),page.locator('.sidebar a[href="./"]').click()]);
 await page.evaluate(()=>{
  localStorage.setItem('indieforge.mastery.admin','true');
  const data=MasteryCatalog.snapshot();
  MasteryCatalog.saveTechnology({...data.technologies.find(t=>t.id==='godot'),published:false});
  MasteryCatalog.saveTechnology({...data.technologies.find(t=>t.id==='blender'),order:0});
  MasteryCatalog.saveCourse({...data.courses.find(c=>c.id==='gamemaker-core-1'),published:false});
 });
 await page.reload();
 await expect(page.locator('.home-mastery-summary')).toHaveText('12 технологий · 59 курсов');
 await expect(page.locator('.home-tech').first()).toHaveAttribute('href','#/mastery/blender');
 await expect(page.locator('.home-tech[href="#/mastery/godot"]')).toHaveCount(0);
 await page.locator('.mastery-panel .text-link').click();await expect(page).toHaveURL(/#\/mastery$/);
 await Promise.all([page.waitForURL(url=>!url.hash),page.locator('.sidebar a[href="./"]').click()]);
 await page.evaluate(()=>{for(const t of MasteryCatalog.snapshot().technologies)MasteryCatalog.saveTechnology({...t,published:false});});
 await expect(page.locator('.home-mastery-summary')).toHaveText('0 технологий · 0 курсов');
 await expect(page.locator('.home-tech')).toHaveCount(0);await expect(page.locator('.home-mastery-empty')).toBeVisible();
});
const catalogue=page=>page.evaluate(()=>window.MasteryCatalog.snapshot());
async function manager(page,tab='courses'){
 await page.locator('[data-mode=admin]').click();
 await page.locator('[data-action=manage]').click();
 await page.locator(`[data-admin-tab="${tab}"]`).click();
}
async function addTechnology(page,title){
 await page.locator('[data-admin=new]').click();
 await page.locator('#masteryEditForm [name=title]').fill(title);
 await page.locator('#masteryEditForm [name=description]').fill('Технология, добавленная вручную.');
 await page.locator('#masteryEditForm [name=about]').fill('Подробное описание технологии.\n\nВторой абзац автора.');
 await page.locator('#masteryEditForm [name=published]').check();
 await page.locator('#masteryEditForm button[type=submit]').click();
 await expect(page.locator('#masteryManagerMessage')).toHaveText('Изменения сохранены.');
 return (await catalogue(page)).technologies.find(t=>t.title===title).id;
}
async function addCourse(page,title,technologyId,branch){
 await page.locator('[data-admin=new]').click();
 const form=page.locator('#masteryEditForm');
 await form.locator('[name=title]').fill(title);
 await form.locator('[name=technologyId]').selectOption(technologyId);
 await form.locator('[name=branch]').selectOption(branch);
 await form.locator('[name=description]').fill('Описание курса из формы.');
 await form.locator('[name=lessonCount]').fill('7');
 await form.locator('[name=durationMinutes]').fill('125');
 await form.locator('[name=outcomes]').fill('Первый навык\nВторой навык');
 await form.locator('[name=url]').fill('https://example.com/my-course');
 await form.locator('[name=published]').check();
 await form.locator('button[type=submit]').click();
 await expect(page.locator('#masteryManagerMessage')).toHaveText('Изменения сохранены.');
 return (await catalogue(page)).courses.find(c=>c.title===title).id;
}

test('home entry opens technology catalogue; Blender and Aseprite are separate branches',async({page})=>{
 await page.goto('/');
 await page.locator('.sidebar [data-open-mastery]').click();
 await expect(page.locator('#masteryPage h1')).toHaveText('Древо мастерства');
 await expect(page.locator('.m-tech-card')).toHaveCount(13);
 for(const id of ['blender','aseprite']){
  const card=page.locator(`[data-technology="${id}"]`);
  await expect(card.locator('a')).toHaveCount(1);
  await expect(card.locator('a.m-card-title,.m-card-arrow')).toHaveCount(0);
  await card.locator('.m-tech-link').click();
  await expect(page.locator('.m-branch-card')).toHaveCount(0);
  await expect(page.locator('.m-start-learning')).toHaveText('Начать изучать');
  await expect(page).toHaveURL(new RegExp('#/mastery/'+id+'$'));
  await page.locator('.m-start-learning').click();
  await expect(page).toHaveURL(new RegExp('#/mastery/'+id+'/core$'));
  await expect(page.locator('.m-branch-tabs a')).toHaveCount(2);
  await page.locator('.m-branch-tabs a').nth(1).click();
  await expect(page.locator('.m-course-card')).toHaveCount(2);
  await page.goto('/#/mastery');
 }
 await expect(page.locator('.sidebar [data-open-mastery]')).toHaveAttribute('aria-current','page');
 await page.locator('.sidebar a[href="./"]').click();
 await expect(page.locator('.dashboard')).toBeVisible();
 await expect(page.locator('#masteryPage')).toBeHidden();
});

test('grid/list switch persists; search, category, level and sort filter actual records',async({page})=>{
 await page.goto('/#/mastery');
 await page.locator('[data-layout=list]').click();
 await expect(page.locator('#masteryResults')).toHaveClass(/m-list/);
 await page.reload();
 await expect(page.locator('[data-layout=list]')).toHaveAttribute('aria-pressed','true');
 await page.locator('[data-filter=category]').selectOption('art');
 await expect(page.locator('[data-technology=godot]')).toHaveCount(0);
 await expect(page.locator('[data-technology=blender]')).toHaveCount(1);
 await page.locator('[data-filter=query]').fill('aseprite');
 await expect(page.locator('.m-tech-card')).toHaveCount(1);
 await page.locator('[data-filter=query]').fill('несуществующая технология');
 await expect(page.locator('.m-empty h2')).toHaveText('Ничего не найдено');
 await page.locator('.m-empty [data-action=reset-filters]').click();
 await page.locator('[data-filter=level]').selectOption('advanced');
 await expect(page.locator('.m-tech-card')).toHaveCount(1);
 await expect(page.locator('[data-technology=godot]')).toHaveCount(1);
 await page.locator('[data-action=reset-filters]').click();
 await page.locator('[data-filter=sort]').selectOption('title');
 const titles=await page.locator('.m-card-title').allTextContents();
 expect(titles).toEqual([...titles].sort((a,b)=>a.localeCompare(b,'ru')));
});

test('Godot branches derive counts and ordered learning path from the catalogue',async({page})=>{
 await page.goto('/#/mastery/godot');
 await page.locator('.m-start-learning').click();
 await expect(page.locator('.m-path-stats strong').first()).toHaveText('13 курсов');
 await expect(page.locator('.m-path-card')).toHaveCount(13);
 await expect(page.locator('[data-course=godot-core-1] a')).toHaveCount(1);
 await expect(page.locator('.m-card-arrow')).toHaveCount(0);
 await expect(page.locator('.m-path-card .m-card-title').first()).toHaveText('Godot с нуля');
 await expect(page.locator('.m-path-card .m-card-title').last()).toHaveText('Дипломный проект');
 await page.evaluate(()=>window.MasteryApp.setCourseProgress('godot-core-1',12));
 await expect(page.locator('.m-progress-copy h2')).toHaveText('1 из 13 курсов завершено');
 await page.reload();
 await expect(page.locator('[data-course=godot-core-1]')).toHaveClass(/m-course-complete/);
 await page.locator('.m-branch-tabs a').nth(1).click();
 await expect(page.locator('.m-course-card')).toHaveCount(12);
 await page.locator('[data-filter=category]').selectOption('UI');
 await expect(page.locator('.m-course-card')).toHaveCount(3);
 await page.locator('[data-filter=query]').fill('слотов');
 await expect(page.locator('.m-course-card')).toHaveCount(1);
 await expect(page.locator('.m-course-card a')).toHaveCount(1);
 await expect(page.locator('.m-card-arrow')).toHaveCount(0);
 await page.locator('.m-course-copy>p').click();
 await expect(page.locator('#masteryPage h1')).toHaveText('Инвентарь');
 await expect(page.locator('.m-curriculum-empty')).toContainText('Уроки курса ещё готовятся');
 await page.locator('[data-action=plan]').click();
 await expect(page.locator('[data-action=plan]')).toHaveText('В плане · убрать');
 await page.reload();
 await expect(page.locator('[data-action=plan]')).toHaveText('В плане · убрать');
});

test('global search routes to technologies and courses and still finds homepage projects',async({page})=>{
 await page.goto('/');
 await page.keyboard.press('Control+k');
 await page.locator('#search').fill('Blender');
 await page.locator('.search-results button').filter({hasText:'Blender · Технология'}).click();
 await expect(page).toHaveURL(/#\/mastery\/blender$/);
 await page.locator('#search').fill('Инвентарь');
 await page.locator('.search-results button').filter({hasText:'Инвентарь · Godot'}).click();
 await expect(page.locator('#masteryPage h1')).toHaveText('Инвентарь');
 await page.locator('#search').fill('Змейка');
 await page.locator('.search-results button').click();
 await expect(page.locator('.dashboard')).toBeVisible();
 await expect(page.locator('#projects')).toHaveClass(/highlight/);
});

test('owner can add a technology and both course branches, edit classification and keep changes on reload',async({page})=>{
 await page.goto('/#/mastery');
 await manager(page,'technologies');
 const technology=await addTechnology(page,'Новый движок');
 await page.locator('[data-admin-tab=courses]').click();
 const core=await addCourse(page,'Основы нового движка',technology,'core');
 const applied=await addCourse(page,'Игра на новом движке',technology,'applied');
 await page.locator('[data-admin=close]').click();
 await page.goto('/#/mastery/'+technology);
 await expect(page.locator('.m-technology-description p')).toHaveCount(2);
 await expect(page.locator('.m-technology-description')).toContainText('Подробное описание технологии.');
 await page.locator('.m-start-learning').click();
 await expect(page.locator('.m-path-card')).toHaveCount(1);
 await page.locator('.m-branch-tabs a').nth(1).click();
 await expect(page.locator('.m-course-card')).toHaveCount(1);
 await page.reload();
 await page.goto('/#/mastery/'+technology+'/core/'+core);
 await expect(page.locator('.m-program li')).toHaveCount(2);
 await expect(page.locator('.m-course-start .m-extra-materials')).toHaveAttribute('href','https://example.com/my-course');
 await page.goto('/#/mastery/'+technology);
 await manager(page);
 await page.locator(`[data-admin=edit][data-id="${applied}"]`).click();
 await page.locator('[name=branch]').selectOption('core');
 await page.locator('[name=order]').fill('0');
 await page.locator('[name=capstone]').check();
 await page.locator('#masteryEditForm button[type=submit]').click();
 await page.locator('[data-admin=close]').click();
 await page.locator('.m-start-learning').click();
 await expect(page.locator('.m-path-card')).toHaveCount(2);
 await page.locator('.m-branch-tabs a').nth(1).click();
 await expect(page.locator('.m-course-card')).toHaveCount(0);
 await page.goto('/#/mastery/'+technology+'/core');
 await expect(page.locator('.m-path-card .m-card-title').first()).toHaveText('Игра на новом движке');
 await expect(page.locator('.m-capstone .m-card-title')).toHaveText('Игра на новом движке');
 await page.reload();
 await expect(page.locator('.m-capstone .m-card-title')).toHaveText('Игра на новом движке');
});

test('JSON export/import is portable, rejects unsafe or dangling records atomically and protects technology relations',async({page})=>{
 await page.goto('/#/mastery');
 await manager(page);
 const downloadPromise=page.waitForEvent('download');await page.locator('[data-admin=export]').click();
 const download=await downloadPromise;
 const exported=JSON.parse(await fs.readFile(await download.path(),'utf8'));
 expect(exported.technologies.find(t=>t.id==='aseprite')).toBeTruthy();
 expect(exported.technologies.find(t=>t.id==='rpgmaker').about).toContain('RPG Maker');
 expect(exported.courses.find(c=>c.id==='godot-core-1').branch).toBe('core');
 const before=await catalogue(page);
 const bad=structuredClone(exported);bad.courses[0].url='javascript:alert(1)';
 await page.locator('#masteryImport').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(bad))});
 await expect(page.locator('#masteryManagerMessage')).toContainText('HTTP и HTTPS');
 expect(await catalogue(page)).toEqual(before);
 bad.courses[0].url='';bad.courses[0].technologyId='missing';
 await page.locator('#masteryImport').setInputFiles({name:'dangling.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(bad))});
 await expect(page.locator('#masteryManagerMessage')).toContainText('не найдена технология');
 expect(await catalogue(page)).toEqual(before);
 exported.technologies[0].title='Godot — обновлённый';
 page.once('dialog',d=>d.accept());
 await page.locator('#masteryImport').setInputFiles({name:'catalog.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exported))});
 await expect(page.locator('#masteryManagerMessage')).toHaveText('Каталог импортирован.');
 await page.locator('[data-admin-tab=technologies]').click();
 page.once('dialog',d=>d.dismiss());
 await page.locator('[data-admin=delete][data-id=godot]').click();
 expect((await catalogue(page)).technologies.some(t=>t.id==='godot')).toBeTruthy();
 expect(await page.evaluate(()=>{try{MasteryCatalog.deleteTechnology('godot');}catch(error){return error.message;}})).toContain('Сначала перенесите');
 await page.locator('[data-admin=close]').click();
 await page.reload();
 await expect(page.locator('[data-technology=godot] .m-card-title')).toHaveText('Godot — обновлённый');
});

test('unpublished records disappear from public routes and empty branches remain useful',async({page})=>{
 await page.goto('/#/mastery/blender');
 await manager(page);
 const hiddenId=(await catalogue(page)).courses.find(c=>c.technologyId==='blender'&&c.branch==='applied').id;
 await page.locator(`[data-admin=edit][data-id="${hiddenId}"]`).click();
 await page.locator('[name=published]').uncheck();
 await page.locator('#masteryEditForm button[type=submit]').click();
 await page.locator('[data-admin=close]').click();
 await page.locator('.m-start-learning').click();
 await page.locator('.m-branch-tabs a').nth(1).click();
 await expect(page.locator('.m-course-card')).toHaveCount(2);
 await page.locator('[data-mode=student]').click();
 await expect(page.locator('.m-course-card')).toHaveCount(1);
 await page.goto('/#/mastery/blender/applied/'+hiddenId);
 await expect(page.locator('#masteryPage h1')).toHaveText('Ветка не найдена');
 await page.goto('/#/mastery');
 await manager(page,'technologies');
 const id=await addTechnology(page,'Пустая технология');
 await page.locator('[data-admin=close]').click();
 await page.goto('/#/mastery/'+id+'/applied');
 await expect(page.locator('.m-empty h2')).toHaveText('Ничего не найдено');
 await page.goto('/#/mastery/'+id+'/core');
 await expect(page.locator('.m-empty h2')).toHaveText('Путь ещё формируется');
});

test('all catalogue views, management and mobile navigation fit small screens without errors',async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 for(const route of ['/','/#/mastery','/#/mastery/godot','/#/mastery/godot/core','/#/mastery/godot/applied','/#/mastery/godot/applied/godot-applied-1']){
  await page.goto(route);
  for(const width of [1672,1366,1024,768,390,360]){
   await page.setViewportSize({width,height:900});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth),route+' '+width).toBeLessThanOrEqual(width);
  }
 }
 await page.goto('/#/mastery');
 await page.locator('[data-layout=list]').click();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
 await page.locator('.mobile-menu').click();
 await expect(page.locator('.sidebar')).toHaveClass(/open/);
 await page.locator('.sidebar [data-open-mastery]').click();
 await expect(page.locator('.sidebar')).not.toHaveClass(/open/);
 await manager(page,'technologies');
 await page.locator('[data-admin=new]').click();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
 await page.keyboard.press('Escape');
 await expect(page.locator('#masteryManager')).not.toBeVisible();
 expect(errors).toEqual([]);
});

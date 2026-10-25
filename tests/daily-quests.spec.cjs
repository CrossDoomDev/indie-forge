const {test,expect}=require('@playwright/test');
const key='indieforge.daily-quests.v1';
const quest=(page,id)=>page.locator(`[data-quest="${id}"]`);
const saved=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
const balance=page=>page.evaluate(()=>[...document.querySelectorAll('[data-balance]')].map(el=>[el.dataset.balance,Number(el.textContent.replace(/\s/g,''))]));

test('daily tasks are read-only; visiting pays once and balances persist across reloads and concurrent tabs',async({page,context})=>{
 await page.goto('/');await expect(quest(page,'visit')).toHaveClass(/is-complete/);
 await expect(page.locator('.quest input,.quest button')).toHaveCount(0);
 await quest(page,'lesson').click();await quest(page,'code').click();await quest(page,'project').click();
 for(const id of ['lesson','code','project'])await expect(quest(page,id)).not.toHaveClass(/is-complete/);
 expect(await balance(page)).toEqual([['gems',1245],['gems',1245],['xp',3345]]);
 const before=await saved(page);await page.reload();await expect(quest(page,'visit')).toHaveClass(/is-complete/);expect(await saved(page)).toEqual(before);
 const other=await context.newPage();await other.goto('/');await expect(quest(other,'visit')).toHaveClass(/is-complete/);
 await Promise.all([page,other].map(p=>p.evaluate(()=>DailyQuests.recordCodeSubmission({id:'submission',accepted:true,code:Array.from({length:20},(_,i)=>`print(${i})`).join('\n')}))));
 for(const p of [page,other]){await expect(quest(p,'code')).toHaveClass(/is-complete/);expect(await balance(p)).toEqual([['gems',1255],['gems',1255],['xp',3395]]);}
 expect(Object.keys(Object.values((await saved(page)).days)[0])).toHaveLength(2);
});

test('only completing every lesson step as a learner awards the lesson reward',async({page})=>{
 await page.goto('/#/mastery');
 await page.evaluate(()=>{
  const c=MasteryCatalog.snapshot().courses.find(c=>c.id==='godot-applied-1');
  MasteryCatalog.saveCourse({...c,curriculum:{title:c.title,modules:[{id:'m',title:'Модуль',lessonIds:['l']}],lessons:[{id:'l',title:'Урок',steps:[{id:'a',type:'single',question:'Первый вопрос',options:[{text:'Да',correct:true},{text:'Нет',correct:false}]},{id:'b',type:'single',question:'Второй вопрос',options:[{text:'Да',correct:true},{text:'Нет',correct:false}]}]}]}});
 });
 await page.goto('/#/mastery/godot/applied/godot-applied-1');await page.locator('[data-mode=admin]').click();await page.locator('.m-course-start a').filter({hasText:'Редактировать уроки'}).click();
 const frame=page.frameLocator('#courseWorkspace');await expect(frame.getByRole('region',{name:'Настройки задания'})).toBeVisible();
 expect(Object.keys(Object.values((await saved(page)).days)[0])).toEqual(['visit']);
 await page.locator('[data-mode=student]').click();await expect(frame.locator('[data-choice="0"]')).toBeVisible();
 expect(Object.keys(Object.values((await saved(page)).days)[0])).toEqual(['visit']);
 await frame.locator('[data-choice="0"]').check();await frame.locator('[data-check]').click();await expect(frame.locator('#stepTabs .active')).toHaveClass(/completed/);
 expect(Object.keys(Object.values((await saved(page)).days)[0])).toEqual(['visit']);
 await frame.locator('#nextStep').click();await frame.locator('[data-choice="1"]').check();await frame.locator('[data-check]').click();
 expect(Object.keys(Object.values((await saved(page)).days)[0])).toEqual(['visit']);
 await frame.locator('[data-choice="0"]').check();await frame.locator('[data-check]').click();
 await expect.poll(async()=>Object.keys(Object.values((await saved(page)).days)[0]).sort()).toEqual(['lesson','visit']);
 expect(await balance(page)).toEqual([['gems',1255],['gems',1255],['xp',3395]]);
 const receipt=await saved(page);await page.reload();await expect(frame.locator('.lesson-count')).toHaveClass(/completed/);
 await frame.locator('[data-check]').click();expect(await saved(page)).toEqual(receipt);
 await page.goto('/');await expect(quest(page,'lesson')).toHaveClass(/is-complete/);
 await expect(quest(page,'project')).not.toHaveClass(/is-complete/);
});

test('activity integrations require successful code or a changed project and use individual rewards',async({page})=>{
 await page.goto('/');await expect(quest(page,'visit')).toHaveClass(/is-complete/);
 await page.locator('.project-card').first().click();await expect(quest(page,'project')).not.toHaveClass(/is-complete/);
 await page.evaluate(async()=>{
  await DailyQuests.recordCodeSubmission({id:'short',accepted:true,code:'print(1)\n'.repeat(19)+'\n\n'});
  await DailyQuests.recordCodeSubmission({id:'failed',accepted:false,code:'print(1)\n'.repeat(20)});
  await DailyQuests.recordProjectSave({id:'project',previous:'same',content:'same'});
  await DailyQuests.recordProjectSave({id:'project',previous:'old',content:' '});
 });
 for(const id of ['code','project'])await expect(quest(page,id)).not.toHaveClass(/is-complete/);
 await page.evaluate(async()=>{
  await DailyQuests.recordCodeSubmission({id:'ok',accepted:true,code:'print(1)\r\n'.repeat(20)});
  await DailyQuests.recordProjectSave({id:'p',previous:'old',content:'updated'});
  await DailyQuests.recordProjectSave({id:'p',previous:'updated',content:'more changes'});
 });
 await expect(quest(page,'code')).toHaveClass(/is-complete/);await expect(quest(page,'project')).toHaveClass(/is-complete/);
 expect(await balance(page)).toEqual([['gems',1270],['gems',1270],['xp',3470]]);
 await page.reload();await expect(quest(page,'project')).toHaveClass(/is-complete/);expect(await balance(page)).toEqual([['gems',1270],['gems',1270],['xp',3470]]);
 for(const width of [1672,1366,768,390,360]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);}
});

test.describe('local midnight',()=>{
 test.use({timezoneId:'Asia/Yakutsk'});
 test('tasks reset at local midnight; earned balances remain and levels update in all locations',async({page})=>{
  await page.clock.install({time:new Date('2026-10-25T14:59:00Z')});await page.goto('/');await expect(quest(page,'visit')).toHaveClass(/is-complete/);
  await expect(page.locator('[data-quest-reset]')).toHaveText('Обновятся через 0 ч. 1 мин.');
  const earn=()=>page.evaluate(async()=>{
   await DailyQuests.recordLessonCompletion('c',[],['l']);
   await DailyQuests.recordCodeSubmission({id:'code',accepted:true,code:'print(1)\n'.repeat(20)});
   await DailyQuests.recordProjectSave({id:'p',previous:'old',content:'new'});
  });
  await earn();expect(await balance(page)).toEqual([['gems',1280],['gems',1280],['xp',3520]]);
  await page.clock.runFor(60000);await expect(quest(page,'lesson')).not.toHaveClass(/is-complete/);
  await expect(quest(page,'visit')).toHaveClass(/is-complete/);await expect(page.locator('[data-quest-reset]')).toHaveText('Обновятся через 24 ч. 0 мин.');
  expect(Object.keys((await saved(page)).days)).toEqual(['2026-10-25','2026-10-26']);
  await page.evaluate(()=>DailyQuests.recordLessonCompletion('c',['l'],['l']));await expect(quest(page,'lesson')).not.toHaveClass(/is-complete/);
  await earn();expect(await balance(page)).toEqual([['gems',1320],['gems',1320],['xp',3720]]);
  for(const el of await page.locator('[data-player-level]').all())await expect(el).toHaveText('7');
  await expect(page.locator('.xp-progress')).toHaveAttribute('aria-valuenow','120');await expect(page.locator('.xp-progress small')).toHaveText('120 / 600 XP');
  await page.locator('.profile-button').click();await expect(page.locator('[data-profile-progress]')).toHaveText('Уровень 7 · 120 / 600 XP');
 });
});

test('storage failure cannot display or duplicate unpersisted rewards; pending activity can be retried',async({page})=>{
 await page.goto('/');await expect(quest(page,'visit')).toHaveClass(/is-complete/);const before=await saved(page);
 await page.evaluate(async()=>{
  window.restoreDailyStorage=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){if(key==='indieforge.daily-quests.v1')throw Error('quota');return window.restoreDailyStorage.call(this,key,value);};
  await DailyQuests.recordLessonCompletion('course',[],['lesson']);
 });
 await expect(quest(page,'lesson')).not.toHaveClass(/is-complete/);await expect(page.locator('#questStorageStatus')).toBeVisible();expect(await saved(page)).toEqual(before);
 await page.evaluate(async()=>{Storage.prototype.setItem=window.restoreDailyStorage;await DailyQuests.refresh();});
 await expect(quest(page,'lesson')).toHaveClass(/is-complete/);await expect(page.locator('#questStorageStatus')).toBeHidden();
 expect(await balance(page)).toEqual([['gems',1255],['gems',1255],['xp',3395]]);
});

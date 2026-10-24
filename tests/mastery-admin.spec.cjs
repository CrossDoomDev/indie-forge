const {test,expect}=require('@playwright/test');
const snapshot=page=>page.evaluate(()=>MasteryCatalog.snapshot());
const ids=(page,collection)=>page.locator(`[data-reorder-id][data-collection=${collection}]`).evaluateAll(nodes=>nodes.map(node=>node.dataset.reorderId));
async function start(page,route='/#/mastery') {await page.goto(route);await page.locator('[data-mode=admin]').click();}
async function action(page,id,action) {
 const card=page.locator(`[data-reorder-id="${id}"]`);
 await card.locator('summary').click();await card.locator(`[data-card-action=${action}]`).click();
}
async function drag(page,sourceId,targetId) {
 const source=page.locator(`[data-drag-id="${sourceId}"]`),target=page.locator(`[data-reorder-id="${targetId}"]`);
 const placement=await source.evaluate((handle,targetId)=>{const siblings=[...handle.closest('[data-reorder-id]').parentElement.children];return siblings.indexOf(handle.closest('[data-reorder-id]'))<siblings.findIndex(el=>el.dataset.reorderId===targetId)?.75:.25;},targetId);
 await source.evaluate(el=>el.scrollIntoView({block:'center'}));const from=await source.boundingBox();
 const x=from.x+from.width/2,y=from.y+from.height/2;
 await page.mouse.move(x,y);await page.mouse.down();
 // Start native dragging before bringing a distant card into the viewport.
 await page.mouse.move(x-12,y,{steps:3});
 await target.scrollIntoViewIfNeeded();const to=await target.boundingBox();
 const vertical=await target.evaluate(el=>el.parentElement.classList.contains('m-list')||getComputedStyle(el.parentElement).gridTemplateColumns.split(' ').length===1);
 const dropX=to.x+to.width*(vertical ? 0.5 : placement),dropY=to.y+to.height*(vertical ? placement : 0.5);
 await page.mouse.move(dropX,dropY,{steps:8});
 await page.mouse.move(dropX+1,dropY+1);await page.mouse.up();
}
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jB1sAAAAASUVORK5CYII=','base64');

test('technologies use one whole-card link in grid and list, with keyboard navigation',async({page})=>{
 await page.goto('/#/mastery');
 for(const layout of ['grid','list']) {
  await page.locator(`[data-layout=${layout}]`).click();
  const card=page.locator('[data-technology=blender]');
  await expect(card.locator('a')).toHaveCount(1);
  await expect(card.locator('a.m-card-title,.m-card-arrow,button,summary')).toHaveCount(0);
  await expect(card.locator('h2')).toHaveText('Blender');
  await card.locator('.m-tech-copy>p').click();
  await expect(page).toHaveURL(/#\/mastery\/blender$/);
  await page.goto('/#/mastery');
 }
 await page.locator('[data-technology=aseprite] .m-tech-link').focus();await page.keyboard.press('Enter');
 await expect(page).toHaveURL(/#\/mastery\/aseprite$/);
});

test('native drag and keyboard reorder technologies and both course branches independently and persist',async({page})=>{
 await start(page);
 const before=await snapshot(page);
 await drag(page,'godot','gamemaker');
 expect((await ids(page,'technologies')).slice(0,2)).toEqual(['gamemaker','godot']);
 expect((await snapshot(page)).courses).toEqual(before.courses);
 await page.reload();expect((await ids(page,'technologies')).slice(0,2)).toEqual(['gamemaker','godot']);
 await page.locator('[data-layout=list]').click();
 await drag(page,'godot','gamemaker');
 expect((await ids(page,'technologies')).slice(0,2)).toEqual(['godot','gamemaker']);
 await page.locator('[data-filter=sort]').selectOption('title');
 await expect(page.locator('[data-drag-id=godot]')).toBeDisabled();
 await expect(page.locator('.m-reorder-note')).toContainText('Порядок автора');
 await page.locator('[data-filter=sort]').selectOption('recommended');
 await page.locator('[data-drag-id=godot]').focus();await page.keyboard.press('Alt+ArrowDown');
 expect((await ids(page,'technologies')).slice(0,2)).toEqual(['gamemaker','godot']);
 await page.goto('/#/mastery/godot/core');
 const appliedBefore=(await snapshot(page)).courses.filter(c=>c.branch==='applied');
 await drag(page,'godot-core-1','godot-core-2');
 expect((await ids(page,'courses')).slice(0,2)).toEqual(['godot-core-2','godot-core-1']);
 expect((await snapshot(page)).courses.filter(c=>c.branch==='applied')).toEqual(appliedBefore);
 await page.goto('/#/mastery/godot/applied');
 await drag(page,'godot-applied-1','godot-applied-2');
 expect((await ids(page,'courses')).slice(0,2)).toEqual(['godot-applied-2','godot-applied-1']);
 await page.reload();expect((await ids(page,'courses')).slice(0,2)).toEqual(['godot-applied-2','godot-applied-1']);
 // An invalid scope or a storage error must never partially reorder the catalogue.
 expect(await page.evaluate(()=>{
  const before=JSON.stringify(MasteryCatalog.snapshot());let rejected=false;
  try{MasteryCatalog.moveCourse('godot-core-1','godot-applied-1');}catch{rejected=true;}
  const original=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw Error('quota');};let failed=false;
  try{MasteryCatalog.moveTechnology('godot','aseprite');}catch{failed=true;}finally{Storage.prototype.setItem=original;}
  return rejected&&failed&&JSON.stringify(MasteryCatalog.snapshot())===before;
 })).toBe(true);
});

test('hidden drafts remain editable for administrator and vanish from student cards, search and direct routes',async({page})=>{
 await start(page,'/#/mastery/godot/applied');
 await action(page,'godot-applied-1','visibility');
 await expect(page).toHaveURL(/#\/mastery\/godot\/applied$/);
 const card=page.locator('[data-course=godot-applied-1]');
 await expect(card).toHaveClass(/m-hidden-card/);await expect(card.locator('.m-status')).toContainText('Скрыто · черновик');
 await card.locator('.m-card-title').click();
 await expect(page.locator('#masteryPage h1')).toHaveText('Платформер на Godot');
 await page.locator('[data-mode=student]').click();
 await expect(page.locator('#masteryPage h1')).toHaveText('Ветка не найдена');
 await expect(page.locator('[data-action=manage],.m-card-admin')).toHaveCount(0);
 expect(await page.evaluate(()=>MasteryApp.search('Платформер на Godot'))).toEqual([]);
 await page.goto('/#/mastery/godot/applied');await expect(page.locator('.m-course-card')).toHaveCount(11);
 await page.locator('[data-mode=admin]').click();await expect(page.locator('.m-course-card')).toHaveCount(12);
 await page.goto('/#/mastery');await action(page,'blender','visibility');
 await expect(page.locator('[data-technology=blender] .m-status')).toContainText('Скрыто');
 await page.locator('[data-technology=blender] .m-tech-link').click();
 await page.locator('.m-core').click();await expect(page.locator('.m-status').first()).toContainText('Скрыто');
 await expect(page.locator('.m-course-card .m-status').first()).toContainText('Скрыто вместе с технологией');
 await page.locator('[data-mode=student]').click();await expect(page.locator('#masteryPage h1')).toHaveText('Ветка не найдена');
 expect(await page.evaluate(()=>MasteryApp.search('Blender'))).toEqual([]);
 await page.goto('/#/mastery');await expect(page.locator('[data-technology=blender]')).toHaveCount(0);
 await page.locator('[data-mode=admin]').click();await action(page,'blender','visibility');
 await expect(page.locator('[data-technology=blender] .m-status')).toHaveText('Опубликовано');
 await page.locator('[data-mode=student]').click();await expect(page.locator('[data-technology=blender]')).toHaveCount(1);
});

test('inline editors change descriptions, cover and icons, accept image files and retain media through JSON',async({page})=>{
 await start(page);await action(page,'blender','edit');
 const form=page.locator('#masteryEditForm');
 await form.locator('[name=title]').fill('Blender: 3D-мастерская');
 await form.locator('[name=description]').fill('Описание, изменённое автором.');
 await form.locator('[name=icon]').selectOption('godot');
 await form.locator('[data-media-upload=image]').setInputFiles({name:'cover.png',mimeType:'image/png',buffer:png});
 await expect(page.locator('#masteryManagerMessage')).toContainText('Изображение выбрано');
 await form.locator('[data-media-upload=iconUrl]').setInputFiles({name:'icon.png',mimeType:'image/png',buffer:png});
 await expect(form.locator('[name=iconUrl]')).toHaveValue(/^data:image\/png;base64,/);
 const image=await form.locator('[name=image]').inputValue();
 await form.locator('[data-media-upload=image]').setInputFiles({name:'large.png',mimeType:'image/png',buffer:Buffer.alloc(410*1024)});
 await expect(page.locator('#masteryManagerMessage')).toContainText('до 400 КБ');
 await expect(form.locator('[name=image]')).toHaveValue(image);
 await form.locator('button[type=submit]').click();await page.locator('[data-admin=close]').click();
 const card=page.locator('[data-technology=blender]');
 await expect(card.locator('.m-card-title')).toHaveText('Blender: 3D-мастерская');
 await expect(card.locator('.m-tech-copy>p')).toHaveText('Описание, изменённое автором.');
 await expect(card.locator('.m-tech-art img')).toHaveAttribute('src',image);
 await expect(card.locator('.m-custom-icon')).toHaveAttribute('src',/^data:image\/png;base64,/);
 await page.reload();await expect(card.locator('.m-tech-art img')).toHaveAttribute('src',image);
 await page.goto('/#/mastery/godot/applied');await action(page,'godot-applied-1','edit');
 await form.locator('[name=icon]').selectOption('blender');await form.locator('[name=image]').fill('assets/mastery/blender.svg');
 await form.locator('button[type=submit]').click();await page.locator('[data-admin=close]').click();
 await expect(page.locator('[data-course=godot-applied-1] .m-course-logo .m-brand-icon')).toHaveAttribute('style',/logo-blender/);
 await expect(page.locator('[data-course=godot-applied-1] .m-course-art img')).toHaveAttribute('src','assets/mastery/blender.svg');
 const exportData=await snapshot(page);expect(exportData.technologies.find(t=>t.id==='blender').image).toBe(image);
 expect(await page.evaluate(data=>{try{MasteryCatalog.validate(data);return true;}catch{return false;}},exportData)).toBe(true);
});

test('new records begin as drafts; deleting a technology confirms and removes all its courses atomically',async({page})=>{
 await start(page);await page.locator('[data-action=add-record]').click();
 await expect(page.locator('[name=published]')).not.toBeChecked();
 await page.locator('[name=title]').fill('Временная технология');await page.locator('#masteryEditForm button[type=submit]').click();
 await page.locator('[data-admin=close]').click();
 const temp=(await snapshot(page)).technologies.find(t=>t.title==='Временная технология');
 await expect(page.locator(`[data-technology=${temp.id}] .m-status`)).toContainText('Скрыто');
 await page.goto('/#/mastery/'+temp.id+'/applied');await page.locator('[data-action=add-record]').click();
 await expect(page.locator('[name=branch]')).toHaveValue('applied');await expect(page.locator('[name=published]')).not.toBeChecked();
 await page.locator('[name=title]').fill('Черновик курса');await page.locator('#masteryEditForm button[type=submit]').click();await page.locator('[data-admin=close]').click();
 const child=(await snapshot(page)).courses.find(c=>c.technologyId===temp.id);
 page.once('dialog',dialog=>dialog.dismiss());await action(page,child.id,'delete');
 expect((await snapshot(page)).courses.some(c=>c.id===child.id)).toBeTruthy();
 await page.goto('/#/mastery');
 page.once('dialog',dialog=>{expect(dialog.message()).toContain('все её курсы (1)');dialog.dismiss();});await action(page,temp.id,'delete');
 expect((await snapshot(page)).technologies.some(t=>t.id===temp.id)).toBeTruthy();
 page.once('dialog',dialog=>dialog.accept());await action(page,temp.id,'delete');
 expect((await snapshot(page)).technologies.some(t=>t.id===temp.id)).toBeFalsy();
 expect((await snapshot(page)).courses.some(c=>c.technologyId===temp.id)).toBeFalsy();
 expect((await snapshot(page)).courses.some(c=>c.id==='godot-core-1')).toBeTruthy();
 await page.reload();await expect(page.locator(`[data-technology=${temp.id}]`)).toHaveCount(0);
});

test('touch dragging reorders list cards on a phone without opening a technology',async({page,context})=>{
 await page.setViewportSize({width:390,height:1000});
 await start(page);await page.locator('[data-layout=list]').click();
 await page.locator('[data-technology=godot]').evaluate(el=>{el.scrollIntoView({block:'start'});window.scrollBy(0,-120);});
 const source=await page.locator('[data-drag-id=godot]').boundingBox(),target=await page.locator('[data-technology=gamemaker]').boundingBox();
 const cdp=await context.newCDPSession(page);
 const from={x:source.x+source.width/2,y:source.y+source.height/2},to={x:target.x+target.width/2,y:target.y+target.height*.75};
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[from]});
 for(let step=1;step<=12;step++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:from.x+(to.x-from.x)*step/12,y:from.y+(to.y-from.y)*step/12}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 expect((await ids(page,'technologies')).slice(0,2)).toEqual(['gamemaker','godot']);
 await expect(page).toHaveURL(/#\/mastery$/);
});

test('administrator views and menus fit desktop and phone widths without browser errors',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 await start(page);
 for(const route of ['/#/mastery','/#/mastery/godot/core','/#/mastery/godot/applied']) {
  await page.goto(route);
  for(const width of [1672,1366,1024,768,390,360]) {
   await page.setViewportSize({width,height:900});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth),route+' '+width).toBeLessThanOrEqual(width);
  }
  const first=page.locator('[data-reorder-id]').first();await first.locator('summary').click();
  const menu=await first.locator('.m-card-menu-items').boundingBox();expect(menu.x).toBeGreaterThanOrEqual(0);expect(menu.x+menu.width).toBeLessThanOrEqual(360);
  await first.locator('[data-card-action=edit]').click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
  await expect(page.locator('[data-media-upload=image]')).toHaveCount(1);await page.keyboard.press('Escape');
 }
 expect(errors).toEqual([]);
});

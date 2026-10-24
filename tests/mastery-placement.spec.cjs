const {test,expect}=require('@playwright/test');
const snapshot=page=>page.evaluate(()=>MasteryCatalog.snapshot());
const order=page=>page.locator('#masteryResults,.m-learning-path').evaluate(el=>[...el.children].filter(node=>!node.classList.contains('m-drag-source')).map(node=>node.classList.contains('m-sort-placeholder')?'slot':node.dataset.reorderId));
async function start(page,route='/#/mastery') {await page.setViewportSize({width:1672,height:1000});await page.goto(route);await page.locator('[data-mode=admin]').click();}
async function pickUp(page,id) {
 const handle=page.locator(`[data-drag-id="${id}"]`);await handle.evaluate(el=>el.scrollIntoView({block:'center'}));
 const rect=await handle.boundingBox(),x=rect.x+rect.width/2,y=rect.y+rect.height/2;
 await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x-12,y,{steps:3});
 await expect(page.locator('.m-sort-placeholder')).toHaveCount(1);
}
async function moveTo(page,x,y) {await page.mouse.move(x,y,{steps:8});await page.mouse.move(x+1,y);}
async function edit(page,id) {const card=page.locator(`[data-reorder-id="${id}"]`);await card.locator('summary').click();await card.locator('[data-card-action=edit]').click();}
async function png(page,width,height) {
 const data=await page.evaluate(({width,height})=>{const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;return canvas.toDataURL('image/png');},{width,height});
 return {name:'cover.png',mimeType:'image/png',buffer:Buffer.from(data.split(',')[1],'base64')};
}

test('grid cards make room while held, accept the gap between cards and commit only on release',async({page})=>{
 await start(page);const before=await snapshot(page);
 const originalX=await page.locator('[data-technology=gamemaker]').evaluate(el=>el.offsetLeft);
 await pickUp(page,'godot');
 const left=await page.locator('[data-technology=rpgmaker]').boundingBox(),right=await page.locator('[data-technology=blender]').boundingBox();
 await moveTo(page,(left.x+left.width+right.x)/2,left.y+100);
 await expect.poll(()=>order(page)).toEqual(['gamemaker','rpgmaker','slot','blender','aseprite','unity','web','csharp','pixelart','audio','tools','design','ui']);
 expect(await page.locator('[data-technology=gamemaker]').evaluate(el=>el.offsetLeft)).toBeLessThan(originalX);
 expect(await snapshot(page)).toEqual(before);
 await page.mouse.up();
 await expect(page.locator('.m-sort-placeholder,.m-drag-ghost,.m-drag-source')).toHaveCount(0);
 expect((await order(page)).slice(0,4)).toEqual(['gamemaker','rpgmaker','godot','blender']);
 await page.reload();expect((await order(page)).slice(0,4)).toEqual(['gamemaker','rpgmaker','godot','blender']);
});

test('list previews support before and after slots; escape and dropping outside cancel without changing saved order',async({page})=>{
 await start(page,'/#/mastery/godot/applied');await page.locator('[data-layout=list]').click();
 const before=await snapshot(page);
 await pickUp(page,'godot-applied-1');
 const target=page.locator('[data-course=godot-applied-3]');await target.scrollIntoViewIfNeeded();let rect=await target.boundingBox();
 await moveTo(page,rect.x+rect.width/2,rect.y+rect.height*.8);
 expect((await order(page)).slice(0,3)).toEqual(['godot-applied-2','godot-applied-3','slot']);
 await page.keyboard.press('Escape');await page.mouse.up();
 await expect(page.locator('.m-sort-placeholder')).toHaveCount(0);expect(await snapshot(page)).toEqual(before);
 expect((await order(page)).slice(0,3)).toEqual(['godot-applied-1','godot-applied-2','godot-applied-3']);
 await pickUp(page,'godot-applied-1');await moveTo(page,500,35);await page.mouse.up();
 await expect(page.locator('.m-sort-placeholder')).toHaveCount(0);expect(await snapshot(page)).toEqual(before);
 // Moving the third card into the upper half of the first puts it before that card.
 await pickUp(page,'godot-applied-3');
 const first=page.locator('[data-course=godot-applied-1]');await first.scrollIntoViewIfNeeded();rect=await first.boundingBox();
 await moveTo(page,rect.x+rect.width/2,rect.y+rect.height*.2);await page.mouse.up();
 expect((await order(page)).slice(0,3)).toEqual(['godot-applied-3','godot-applied-1','godot-applied-2']);
});

test('filtered and capstone previews preserve other records and restore the layout when saving fails',async({page})=>{
 await start(page);await page.locator('[data-filter=category]').selectOption('art');
 const before=await snapshot(page),others=before.technologies.filter(t=>t.category!=='art').map(t=>t.id);
 await pickUp(page,'aseprite');const target=await page.locator('[data-technology=blender]').boundingBox();
 await moveTo(page,target.x+30,target.y+80);await page.mouse.up();
 expect((await order(page)).slice(0,2)).toEqual(['aseprite','blender']);
 const after=await snapshot(page);expect([...after.technologies].sort((a,b)=>a.order-b.order).filter(t=>t.category!=='art').map(t=>t.id)).toEqual(others);
 await page.goto('/#/mastery/godot/core');const coreBefore=await snapshot(page);
 await pickUp(page,'godot-core-13');
 expect(await page.locator('.m-sort-placeholder').evaluate(el=>getComputedStyle(el).gridColumn)).toBe('1 / -1');
 const first=page.locator('[data-course=godot-core-1]');await first.scrollIntoViewIfNeeded();const rect=await first.boundingBox();
 await moveTo(page,rect.x+10,rect.y+70);
 await page.evaluate(()=>{window.originalStorageSet=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw Error('quota');};});
 await page.mouse.up();
 await expect(page.locator('.toast')).toContainText('Браузер не смог сохранить');
 expect(await snapshot(page)).toEqual(coreBefore);
 await expect(page.locator('.m-sort-placeholder,.m-drag-source,.m-drag-ghost')).toHaveCount(0);
 await page.evaluate(()=>Storage.prototype.setItem=window.originalStorageSet);
});

test('image panels show recommended and selected dimensions, report ratio differences, and keep covers uncropped',async({page})=>{
 await start(page);await edit(page,'blender');
 const form=page.locator('#masteryEditForm');
 await expect(page.locator('#mastery-image-guide')).toContainText('1200 × 600 px');await expect(page.locator('#mastery-image-guide')).toContainText('2:1');
 await expect(page.locator('#mastery-iconUrl-guide')).toContainText('256 × 256 px');
 await expect(page.locator('[data-media-size=image]')).toContainText('Векторное изображение масштабируется без потери чёткости.');
 await expect(page.locator('[data-media-size=image]')).not.toContainText('Размер меньше рекомендуемого');
 await form.locator('[data-media-upload=image]').setInputFiles(await png(page,1200,600));
 await expect(page.locator('[data-media-size=image]')).toContainText('Выбрано: 1200 × 600 px. Пропорции подходят.');
 await form.locator('[data-media-upload=image]').setInputFiles(await png(page,800,800));
 await expect(page.locator('[data-media-size=image]')).toContainText('800 × 800 px. Пропорции отличаются от 2:1');
 await form.locator('[data-clear-media=image]').click();await expect(page.locator('[data-media-size=image]')).toHaveText('Изображение не выбрано.');
 await form.locator('[data-media-upload=iconUrl]').setInputFiles(await png(page,256,256));await expect(page.locator('[data-media-size=iconUrl]')).toContainText('256 × 256 px. Пропорции подходят.');
 await page.keyboard.press('Escape');await page.goto('/#/mastery/godot/applied');await edit(page,'godot-applied-1');
 await expect(page.locator('#mastery-image-guide')).toContainText('1200 × 675 px');await expect(page.locator('#mastery-image-guide')).toContainText('16:9');
 await form.locator('[data-media-upload=image]').setInputFiles(await png(page,1200,675));await expect(page.locator('[data-media-size=image]')).toContainText('1200 × 675 px. Пропорции подходят.');
 await form.locator('button[type=submit]').click();await page.locator('[data-admin=close]').click();
 for(const route of ['/#/mastery','/#/mastery/godot/core','/#/mastery/godot/applied']) {
  await page.goto(route);
  for(const width of [1672,390]) {
   await page.setViewportSize({width,height:1000});
   for(const img of await page.locator('.m-tech-art>img,.m-course-art>img').all())expect(await img.evaluate(el=>getComputedStyle(el).objectFit)).toBe('contain');
  }
 }
});

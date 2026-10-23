const {chromium}=require('@playwright/test');
const fs=require('node:fs');
(async()=>{
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1586,height:902},deviceScaleFactor:1});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
await page.goto('http://127.0.0.1:5173',{waitUntil:'networkidle'});
await page.evaluate(()=>document.fonts.ready);
await page.screenshot({path:'verification/desktop.png',fullPage:true});
console.log(JSON.stringify(await page.evaluate(()=>({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,images:[...document.images].every(i=>i.complete&&i.naturalWidth>0),panels:[...document.querySelectorAll('.panel,.welcome')].map(e=>({name:e.querySelector('h1,h2')?.textContent,rect:{x:e.offsetLeft,y:e.offsetTop,w:e.offsetWidth,h:e.offsetHeight}}))})),null,2));
await page.keyboard.press('Control+k');
if(!await page.locator('#search').evaluate(e=>document.activeElement===e))throw Error('Search shortcut failed');
await page.locator('#search').fill('Змейка');
if(await page.locator('.search-results button').count()!==1)throw Error('Search result missing');
await page.locator('.search-results button').click();
await page.keyboard.press('Escape');
await page.locator('.quest input').nth(1).check();
if(!await page.locator('.quest input').nth(1).isChecked())throw Error('Checkbox failed');
await page.locator('.notification-button').click();
if(!await page.locator('.notification-popover').isVisible())throw Error('Notification failed');
await page.keyboard.press('Escape');
await page.locator('.continue-button').click();
if(!await page.locator('.toast').isVisible())throw Error('Future section feedback failed');
await page.keyboard.press('Escape');
for(const width of [1366,1024,768,390,360]){
await page.setViewportSize({width,height:900});
await page.screenshot({path:'verification/viewport-'+width+'.png',fullPage:true});
const overflow=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
if(overflow.scroll>width)throw Error('Horizontal overflow: '+JSON.stringify(overflow));
}
await page.locator('.mobile-menu').click();
if(!await page.locator('.sidebar').evaluate(e=>e.classList.contains('open')))throw Error('Mobile menu failed');
await page.screenshot({path:'verification/mobile-menu.png'});
await browser.close();
if(errors.length)throw Error(errors.join('\n'));
console.log('PASS: images, desktop/mobile layout, search, shortcuts, tasks, notifications, navigation feedback and mobile menu. No browser errors.');
})().catch(e=>{console.error(e);process.exit(1);});


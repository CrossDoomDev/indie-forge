"use strict";
// Portable editor projects shared by catalogue imports and the embedded lesson workspace.
window.CourseContent=(()=>{
 const text=(v,fallback='',limit=20000)=>String(v??fallback).slice(0,limit);
 function normalize(raw) {
  if(raw==null)return null;
  if(!raw||typeof raw!=='object'||!Array.isArray(raw.lessons)||!raw.lessons.length||raw.lessons.length>300||!Array.isArray(raw.modules)||raw.modules.length>100)throw Error('Программа курса должна содержать до 100 модулей и от 1 до 300 уроков.');
  if(JSON.stringify(raw).length>3*1024*1024)throw Error('Материалы одного курса превышают 3 МБ.');
  const ids=new Set();
  const lessons=raw.lessons.map((lesson,i)=>{
   if(!lesson||typeof lesson!=='object')throw Error('Некорректный урок.');
   const id=text(lesson.id||'lesson-'+i,'',90);if(ids.has(id))throw Error('Повторяется ID урока: '+id);ids.add(id);
   const steps=Array.isArray(lesson.steps)&&lesson.steps.length?lesson.steps:[{id:id+'-note',type:'note',html:lesson.html||'<p></p>'}];
   if(steps.length>150)throw Error('В уроке допускается до 150 шагов.');
   const stepIds=new Set();
   const normalized=steps.map(step=>{const next=window.CourseModel.normalizeStep(step,value=>String(value||''));if(stepIds.has(next.id))throw Error('Повторяется ID шага.');stepIds.add(next.id);return next;});
   return {id,title:text(lesson.title,'Новый урок',160),html:text(lesson.html,'',3*1024*1024),steps:normalized,activeStepId:normalized.some(s=>s.id===lesson.activeStepId)?lesson.activeStepId:normalized[0].id};
  });
  const moduleIds=new Set(),used=new Set();
  const modules=raw.modules.map((module,i)=>{
   if(!module||typeof module!=='object'||!Array.isArray(module.lessonIds))throw Error('Некорректный модуль.');
   const id=text(module.id||'module-'+i,'',90);if(moduleIds.has(id))throw Error('Повторяется ID модуля.');moduleIds.add(id);
   const lessonIds=module.lessonIds.map(id=>{if(!ids.has(id)||used.has(id))throw Error('Урок должен принадлежать ровно одному модулю.');used.add(id);return id;});
   return {id,title:text(module.title,'Новый модуль',160),lessonIds,expanded:module.expanded!==false};
  });
  if(!modules.length)modules.push({id:'module-1',title:'Первый модуль',lessonIds:[],expanded:true});
  lessons.forEach(lesson=>{if(!used.has(lesson.id))modules[0].lessonIds.push(lesson.id);});
  return {version:3,title:text(raw.title,'Мой курс',160),markdown:raw.markdown!==false,activeId:ids.has(raw.activeId)?raw.activeId:lessons[0].id,modules,lessons};
 }
 function blank(title) {
  const step={...window.CourseModel.createStep('note'),html:'<p></p>'};
  return normalize({title,modules:[{id:'module-1',title:'Первый модуль',lessonIds:['lesson-1'],expanded:true}],lessons:[{id:'lesson-1',title:'Первый урок',steps:[step]}]});
 }
 function fingerprint(value) {
  const raw=JSON.stringify(value);let a=2166136261,b=5381;
  for(let i=0;i<raw.length;i++){a=Math.imul(a^raw.charCodeAt(i),16777619);b=Math.imul(b,33)^raw.charCodeAt(i);}
  return (a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0')+':'+raw.length;
 }
 function revisions(project) {
  const result={};
  for(const lesson of project?.lessons||[])for(const step of lesson.steps)result[JSON.stringify([lesson.id,step.id])]=fingerprint(step);
  return result;
 }
 return {normalize,blank,revisions};
})();

"use strict";
window.CourseLearning=(()=>{
 const KEY='indieforge.mastery.enrolments.v1';
 const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
 const sessionKey=id=>'indieforge.mastery.attempts.'+id+'.v1';
 function enrolments(){const data=read(KEY,{});return data&&typeof data==='object'&&!Array.isArray(data)?data:{};}
 function enrolled(id){return Object.hasOwn(enrolments(),id);}
 function enrol(id){const data=enrolments();if(Object.hasOwn(data,id))return;data[id]={enrolledAt:new Date().toISOString()};localStorage.setItem(KEY,JSON.stringify(data));}
 function session(id,project) {
  const raw=read(sessionKey(id),{}),revisions=CourseContent.revisions(project),attempts=[];
  for(const pair of Array.isArray(raw.attempts)?raw.attempts:[]) {
   if(!Array.isArray(pair)||pair.length!==2)continue;
   const [key,attempt]=pair;
   if(Object.hasOwn(revisions,key)&&raw.revisions?.[key]===revisions[key]&&attempt&&typeof attempt==='object')attempts.push([key,attempt]);
  }
  const activeId=project?.lessons.some(l=>l.id===raw.activeId)?raw.activeId:project?.activeId;
  return {attempts,activeId,activeSteps:raw.activeSteps&&typeof raw.activeSteps==='object'?raw.activeSteps:{}};
 }
 function save(id,data,revisions) {
  const attempts=(Array.isArray(data.attempts)?data.attempts:[]).filter(pair=>Array.isArray(pair)&&Object.hasOwn(revisions,pair[0])&&pair[1]&&typeof pair[1]==='object').slice(0,45000).map(([key,attempt])=>{const {signature,...rest}=attempt;return [key,rest];});
  localStorage.setItem(sessionKey(id),JSON.stringify({attempts,revisions,activeId:String(data.activeId||''),activeSteps:data.activeSteps||{}}));
 }
 function progress(course) {
  const project=course.curriculum;if(!project)return {lessons:0,steps:0,totalSteps:0};
  const attempts=new Map(session(course.id,project).attempts),revisions=CourseContent.revisions(project);
  const complete=(lesson,step)=>!!attempts.get(JSON.stringify([lesson.id,step.id]))?.completed&&Object.hasOwn(revisions,JSON.stringify([lesson.id,step.id]));
  const completedLessonIds=project.lessons.filter(l=>l.steps.every(s=>complete(l,s))).map(l=>l.id);
  return {completedLessonIds,lessons:completedLessonIds.length,steps:project.lessons.reduce((sum,l)=>sum+l.steps.filter(s=>complete(l,s)).length,0),totalSteps:project.lessons.reduce((sum,l)=>sum+l.steps.length,0)};
 }
 return {enrolled,enrol,session,save,progress};
})();

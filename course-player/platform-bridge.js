"use strict";
// The editor is hosted locally, with its storage and view bound to one platform course.
window.PlatformCourse=(()=>{
 let context;
 try{if(parent===window)throw Error();context=parent.CourseWorkspace.connect(window);}catch{location.replace('../#/mastery');return {redirecting:true};}
 return {
  mode:context.mode,attempts:context.attempts,
  loadProject:()=>structuredClone(context.project),
  saveProject:project=>parent.CourseWorkspace.saveProject(window,structuredClone(project)),
  saveSession:data=>parent.CourseWorkspace.saveSession(window,structuredClone(data))
 };
})();

#!/usr/bin/env node
'use strict';
// Publish a browser-exported catalogue as the shared seed, after full validation.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {webcrypto}=require('node:crypto');
const root=path.resolve(__dirname,'..');
const args=process.argv.slice(2),check=args.includes('--check'),file=args.find(arg=>arg!=='--check');
if(!file){console.error('Usage: node scripts/import-mastery-catalog.cjs [--check] path/to/mastery-catalog.json');process.exit(1);}
try{
 const raw=fs.readFileSync(path.resolve(file),'utf8');
 if(Buffer.byteLength(raw)>4*1024*1024)throw Error('Catalogue exceeds 4 MB.');
 const sandbox={window:{},localStorage:{getItem:()=>null},structuredClone,TextEncoder,crypto:webcrypto};
 vm.createContext(sandbox);
 vm.runInContext(fs.readFileSync(path.join(root,'mastery-data.js'),'utf8'),sandbox);
 vm.runInContext(fs.readFileSync(path.join(root,'course-player/course-model.js'),'utf8'),sandbox);
 vm.runInContext(fs.readFileSync(path.join(root,'course-content.js'),'utf8'),sandbox);
 vm.runInContext(fs.readFileSync(path.join(root,'mastery-catalog.js'),'utf8'),sandbox);
 const data=sandbox.window.MasteryCatalog.validate(JSON.parse(raw));
 if(!check)fs.writeFileSync(path.join(root,'mastery-data.js'),'// Shared catalogue seed. Edit this file or use scripts/import-mastery-catalog.cjs.\nwindow.MASTERY_SEED = '+JSON.stringify(data,null,2)+';\n');
 console.log((check?'Valid catalogue':'Shared catalogue updated')+': '+data.technologies.length+' technologies, '+data.courses.length+' courses.');
}catch(error){console.error('Catalogue was not changed: '+error.message);process.exit(1);}

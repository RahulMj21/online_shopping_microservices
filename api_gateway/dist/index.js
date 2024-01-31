"use strict";var h=Object.create;var p=Object.defineProperty;var f=Object.getOwnPropertyDescriptor;var g=Object.getOwnPropertyNames;var u=Object.getPrototypeOf,$=Object.prototype.hasOwnProperty;var y=(t,o,r,l)=>{if(o&&typeof o=="object"||typeof o=="function")for(let a of g(o))!$.call(t,a)&&a!==r&&p(t,a,{get:()=>o[a],enumerable:!(l=f(o,a))||l.enumerable});return t};var c=(t,o,r)=>(r=t!=null?h(u(t)):{},y(o||!t||!t.__esModule?p(r,"default",{value:t,enumerable:!0}):r,t));var i=c(require("express")),m=c(require("express-http-proxy"));var e=require("winston"),{combine:Y,timestamp:b,label:w,printf:x,colorize:A}=e.format,H=x(({level:t,message:o,label:r,timestamp:l})=>`[${l}] ${r} ${t}: ${o}`),n=(0,e.createLogger)({format:Y(w({label:"\u{1F680}"}),A(),b({format:"DD-MM-YYYY HH:mm:ssA Z"}),H),transports:[new e.transports.Console]});var s=(0,i.default)();s.use((t,o,r)=>{n.info(`${t.method} ==> ${t.path}`),r()});s.get("/healthcheck",(t,o)=>o.status(200).json({status:"OK",message:"Hello from API Gateway"}));s.all("/customer/*",(0,m.default)("http://localhost:8001"));s.all("/product/*",(0,m.default)("http://localhost:8002"));s.all("/shopping/*",(0,m.default)("http://localhost:8003"));s.listen(8e3,()=>n.info("API Gateway running on PORT 8000"));

"use strict";var g=Object.create;var l=Object.defineProperty;var c=Object.getOwnPropertyDescriptor;var h=Object.getOwnPropertyNames;var m=Object.getPrototypeOf,u=Object.prototype.hasOwnProperty;var f=(t,o,s,r)=>{if(o&&typeof o=="object"||typeof o=="function")for(let e of h(o))!u.call(t,e)&&e!==s&&l(t,e,{get:()=>o[e],enumerable:!(r=c(o,e))||r.enumerable});return t};var n=(t,o,s)=>(s=t!=null?g(m(t)):{},f(o||!t||!t.__esModule?l(s,"default",{value:t,enumerable:!0}):s,t));var i=n(require("express")),a=n(require("express-http-proxy")),p=(0,i.default)();p.get("/",(t,o)=>o.status(200).json({status:"OK",message:"Hello from API Gateway"}));p.get("/api/customer/*",(0,a.default)("http://localhost:8001"));p.get("/api/product/*",(0,a.default)("http://localhost:8002"));p.get("/api/shopping/*",(0,a.default)("http://localhost:8003"));p.listen(8e3,()=>console.log("API Gateway is running on PORT 8000"));

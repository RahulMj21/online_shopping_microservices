"use strict";var ut=Object.create;var H=Object.defineProperty;var it=Object.getOwnPropertyDescriptor;var ct=Object.getOwnPropertyNames;var dt=Object.getPrototypeOf,pt=Object.prototype.hasOwnProperty;var Rt=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of ct(t))!pt.call(e,o)&&o!==r&&H(e,o,{get:()=>t[o],enumerable:!(a=it(t,o))||a.enumerable});return e};var f=(e,t,r)=>(r=e!=null?ut(dt(e)):{},Rt(t||!e||!e.__esModule?H(r,"default",{value:e,enumerable:!0}):r,e));var n=(e,t,r)=>new Promise((a,o)=>{var u=p=>{try{d(r.next(p))}catch(_){o(_)}},i=p=>{try{d(r.throw(p))}catch(_){o(_)}},d=p=>p.done?a(p.value):Promise.resolve(p.value).then(u,i);d((r=r.apply(e,t)).next())});var rt=f(require("cookie-parser")),C=f(require("express")),et=f(require("helmet")),ot=f(require("cors"));var s={OK:200,CREATED:201,BAD_REQUEST:400,UNAUTHORIZED:401,CONFLICT:409,MISSING_CREDS:422,SERVER_ERROR:500};var M=require("express"),k=(0,M.Router)();k.get("/healthcheck",(e,t)=>t.status(s.OK).json({status:"OK",message:"healthy"}));var D=k;var T=f(require("dotenv"));if(process.env.NODE_ENV!=="prod"){let e=`./.env.${process.env.NODE_ENV}`;T.default.config({path:e})}else T.default.config();var mt={PORT:process.env.PORT||8e3,DB_URL:process.env.DB_URL,TOKEN_SECRET:process.env.TOKEN_SECRET,API_GATEWAY_URL:process.env.API_GATEWAY_URL},h=mt;var g=require("winston");var P=class extends Error{constructor(t,r,a,o,u,i){super(a),Object.setPrototypeOf(this,new.target.prototype),this.name=t,this.statusCode=r,this.description=a,this.isOperational=o,this.errorStack=u,this.loggingErrorResponse=i,Error.captureStackTrace(this)}},c=class extends P{constructor(t,r=s.SERVER_ERROR,a="internal server error",o){super(t,r,a,o)}};var{combine:Y,timestamp:J,label:W,printf:lt,colorize:$}=g.format,K=lt(({level:e,message:t,label:r,timestamp:a})=>`[${a}] ${r} ${e}: ${t}`),l=(0,g.createLogger)({format:Y(W({label:"\u{1F680}"}),$(),J({format:"DD-MM-YYYY HH:mm:ssA Z"}),K),transports:[new g.transports.Console]}),Et=(0,g.createLogger)({format:Y(W({label:"\u{1F680}"}),$(),J({format:"DD-MM-YYYY HH:mm:ssA Z"}),K),transports:[new g.transports.Console,new g.transports.File({filename:"app_error.log"})]}),I=class{constructor(){this.logError=t=>n(this,null,function*(){return console.log("==================== Start Error Logger ==============="),Et.log({private:!0,level:"error",message:`${new Date} - ${JSON.stringify(t)}`}),console.log("==================== End Error Logger ==============="),!1});this.isTrustError=t=>t instanceof P?t.isOperational:!1}};var z=f(require("mongoose"));var ft=()=>n(void 0,null,function*(){try{yield z.default.connect(h.DB_URL),l.info("DB Connected...")}catch(e){l.error(`Failed to Connect DB : ${e}`)}}),N=ft;var A=f(require("mongoose")),gt=A.default.Schema,yt=new gt({name:{type:String,required:!0},type:{type:String,required:!0},banner:{type:String,required:!0},suplier:{type:String,required:!0},description:{type:String,required:!0},unit:{type:Number,required:!0},price:{type:Number,required:!0},available:{type:Boolean,required:!0}},{timestamps:!0,toJSON:{transform(e,t){delete t.__v}}}),O=A.default.model("product",yt);var b=class{createProduct(_){return n(this,arguments,function*({name:t,type:r,unit:a,price:o,banner:u,suplier:i,available:d,description:p}){try{return yield O.create({name:t,type:r,unit:a,price:o,banner:u,suplier:i,available:d,description:p})}catch(v){throw new c("API ERROR",s.SERVER_ERROR,"unable to create product")}})}products(){return n(this,null,function*(){try{return yield O.find()}catch(t){throw new c("API ERROR",s.SERVER_ERROR,"unable to find products")}})}findById(t){return n(this,null,function*(){try{return yield O.findById(t)}catch(r){throw new c("API ERROR",s.SERVER_ERROR,"unable to find product")}})}findByCategory(t){return n(this,null,function*(){try{return yield O.find({type:t})}catch(r){throw new c("API ERROR",s.SERVER_ERROR,"unable to find products")}})}findSelectedProducts(t){return n(this,null,function*(){try{return yield O.find().where("_id").in(t).exec()}catch(r){throw new c("API ERROR",s.SERVER_ERROR,"unable to find products")}})}},F=b;var B=f(require("axios")),Q=f(require("jsonwebtoken"));var Z=e=>{try{let t=e.get("Authorization");if(!t)return!1;let r=Q.default.verify(t.split(" ")[1],h.TOKEN_SECRET);return e.user=r,!0}catch(t){return l.error("Error :",JSON.stringify(t)),!1}},S=e=>{if(e)return{data:e};throw new Error("Data Not found!")},x=e=>n(void 0,null,function*(){try{return yield B.default.post("http://localhost:8001/customer/app-events",{payload:e}),!0}catch(t){return!1}}),q=e=>n(void 0,null,function*(){try{return yield B.default.post("http://localhost:8003/shopping/app-events",{payload:e}),!0}catch(t){return!1}});var j=class{constructor(){this.repository=new F}createProduct(t){return n(this,null,function*(){try{let r=yield this.repository.createProduct(t);return S(r)}catch(r){throw new c("Failed to create product",s.SERVER_ERROR,JSON.stringify(r))}})}getProducts(){return n(this,null,function*(){try{let t=yield this.repository.products(),r={};return t.forEach(({type:a})=>{r[a]=a}),S({products:t,categories:Object.keys(r)})}catch(t){throw new c("Failed to get products",s.SERVER_ERROR,JSON.stringify(t))}})}getProductDetails(t){return n(this,null,function*(){try{let r=yield this.repository.findById(t);return S(r)}catch(r){throw new c("Failed to get product",s.SERVER_ERROR,JSON.stringify(r))}})}getProductsByCategory(t){return n(this,null,function*(){try{let r=yield this.repository.findByCategory(t);return S(r)}catch(r){throw new c("Failed to get products",s.SERVER_ERROR,JSON.stringify(r))}})}getProductsByIds(t){return n(this,null,function*(){try{let r=yield this.repository.findSelectedProducts(t);return S(r)}catch(r){throw new c("Failed to get products",s.SERVER_ERROR,JSON.stringify(r))}})}getProductPayload(u){return n(this,arguments,function*({customerId:t,productId:r,qty:a,event:o}){let{data:i}=yield this.getProductDetails(r);return i?S({event:o,data:{customerId:t,product:i,qty:a}}):!1})}},G=j;var ht=e=>(t,r,a)=>Promise.resolve(e(t,r,a)).catch(a),R=ht;var V=class{constructor(){this.create=R((t,r,a)=>n(this,null,function*(){let{name:o,desc:u,type:i,unit:d,price:p,available:_,suplier:v,banner:nt}=t.body,{data:at}=yield this.service.createProduct({name:o,type:i,unit:d,price:p,banner:nt,suplier:v,available:_,description:u});return r.status(s.CREATED).json(at)}));this.getByCategory=R((t,r,a)=>n(this,null,function*(){let o=t.params.type,{data:u}=yield this.service.getProductsByCategory(o);return r.status(s.CREATED).json(u)}));this.getById=R((t,r,a)=>n(this,null,function*(){let o=t.params.id,{data:u}=yield this.service.getProductDetails(o);return r.status(s.CREATED).json(u)}));this.getByIds=R((t,r,a)=>n(this,null,function*(){let{ids:o}=yield t.body,{data:u}=yield this.service.getProductsByIds(o);return r.status(s.CREATED).json(u)}));this.addToWishlist=R((t,r,a)=>n(this,null,function*(){if(t.user){let o=yield this.service.getProductPayload({customerId:t.user._id,productId:t.body._id,event:"ADD_TO_WISHLIST"});if(o){let{data:u}=o;return x(u),r.status(s.CREATED).json(u.data.product)}else return r.status(s.SERVER_ERROR).json({status:"ERROR"})}return r.status(s.SERVER_ERROR).json({status:"ERROR"})}));this.removeFromWishlist=R((t,r,a)=>n(this,null,function*(){if(t.user){let o=yield this.service.getProductPayload({customerId:t.user._id,productId:t.params.id,event:"REMOVE_FROM_WISHLIST"});if(o){let{data:u}=o;return x(u),r.status(s.CREATED).json(u.data.product)}else return r.status(s.SERVER_ERROR).json({status:"ERROR"})}return r.status(s.SERVER_ERROR).json({status:"ERROR"})}));this.addToCart=R((t,r,a)=>n(this,null,function*(){if(t.user){let{_id:o,qty:u}=t.body,i=yield this.service.getProductPayload({customerId:t.user._id,productId:o,qty:u,event:"ADD_TO_CART"});if(i){let{data:d}=i;return x(d),q(d),r.status(s.CREATED).json({product:d.data.product,unit:d.data.qty})}else return r.status(s.SERVER_ERROR).json({status:"ERROR"})}return r.status(s.SERVER_ERROR).json({status:"ERROR"})}));this.removeFromCart=R((t,r,a)=>n(this,null,function*(){if(t.user){let{qty:o}=t.body,u=yield this.service.getProductPayload({customerId:t.user._id,productId:t.params.id,qty:o,event:"REMOVE_FROM_CART"});if(u){let{data:i}=u;return x(i),q(i),r.status(s.CREATED).json({product:i.data.product,unit:i.data.qty})}else return r.status(s.SERVER_ERROR).json({status:"ERROR"})}return r.status(s.SERVER_ERROR).json({status:"ERROR"})}));this.getAllProducts=R((t,r,a)=>n(this,null,function*(){let{data:o}=yield this.service.getProducts();return r.status(s.CREATED).json(o)}));this.events=R((t,r,a)=>n(this,null,function*(){if(!t.body.payload)return r.status(s.BAD_REQUEST).json({status:"ERROR"});let{payload:o}=t.body;return l.info("===========Product Service Received Event==========="),r.status(s.CREATED).json(o)}));this.service=new G}},L=V;var Ot=(e,t,r)=>n(void 0,null,function*(){if(Z(e))r();else return t.status(s.UNAUTHORIZED).json({status:"ERROR",message:"unauthorized user"})}),w=Ot;var X=require("express"),m=(0,X.Router)(),E=new L;m.post("/create",E.create);m.post("/ids",E.getByIds);m.put("/wishlist",w,E.addToWishlist);m.delete("/wishlist/:id",w,E.removeFromWishlist);m.put("/cart",w,E.addToCart);m.delete("/cart/:id",w,E.removeFromCart);m.get("/all",E.getAllProducts);m.get("/category/:type",E.getByCategory);m.get("/:id",E.getById);m.post("/app-events",E.events);var U=m;var St=(e,t,r,a)=>n(void 0,null,function*(){let o=new I;if(process.on("uncaughtException",u=>{throw console.log(u,"UNHANDLED"),u}),process.on("uncaughtException",u=>{o.logError(u),o.isTrustError(e)}),e){if(yield o.logError(e),o.isTrustError(e)){if(e.errorStack){let u=e.errorStack;return r.status(e.statusCode).json({message:u})}return r.status(e.statusCode).json({message:e.message})}return r.status(e.statusCode).json({message:e.message})}a()}),tt=St;var y=(0,C.default)();y.use((0,ot.default)());y.use(C.default.json({limit:"1mb"}));y.use(C.default.urlencoded({extended:!0,limit:"1mb"}));y.use((0,rt.default)());y.use((0,et.default)());y.use("/product",D);y.use("/product",U);y.use(tt);var st=y;var _t=()=>{N(),st.listen(h.PORT,()=>{l.info(`product service running on PORT: ${h.PORT}`)}).on("error",()=>{l.error("Failed to start server"),process.exit()})};_t();

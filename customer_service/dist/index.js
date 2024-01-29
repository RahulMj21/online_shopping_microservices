"use strict";var mt=Object.create;var H=Object.defineProperty;var lt=Object.getOwnPropertyDescriptor;var ft=Object.getOwnPropertyNames;var gt=Object.getPrototypeOf,Et=Object.prototype.hasOwnProperty;var yt=(s,t,e,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of ft(t))!Et.call(s,o)&&o!==e&&H(s,o,{get:()=>t[o],enumerable:!(r=lt(t,o))||r.enumerable});return s};var l=(s,t,e)=>(e=s!=null?mt(gt(s)):{},yt(t||!s||!s.__esModule?H(e,"default",{value:s,enumerable:!0}):e,s));var a=(s,t,e)=>new Promise((r,o)=>{var n=d=>{try{c(e.next(d))}catch(m){o(m)}},u=d=>{try{c(e.throw(d))}catch(m){o(m)}},c=d=>d.done?r(d.value):Promise.resolve(d.value).then(n,u);c((e=e.apply(s,t)).next())});var it=l(require("cookie-parser")),N=l(require("express")),ut=l(require("helmet")),ct=l(require("cors"));var i={OK:200,CREATED:201,BAD_REQUEST:400,UNAUTHORIZED:401,CONFLICT:409,MISSING_CREDS:422,SERVER_ERROR:500};var $=require("express"),W=(0,$.Router)();W.get("/healthcheck",(s,t)=>t.status(i.OK).json({status:"OK",message:"healthy"}));var b=W;var A=l(require("dotenv"));if(process.env.NODE_ENV!=="prod"){let s=`./.env.${process.env.NODE_ENV}`;A.default.config({path:s})}else A.default.config();var ht={PORT:process.env.PORT||8001,DB_URL:process.env.DB_URL,TOKEN_SECRET:process.env.TOKEN_SECRET||""},h=ht;var y=require("winston");var _=class extends Error{constructor(t,e,r,o,n,u){super(r),Object.setPrototypeOf(this,new.target.prototype),this.name=t,this.statusCode=e,this.description=r,this.isOperational=o,this.errorStack=n,this.loggingErrorResponse=u,Error.captureStackTrace(this)}},p=class extends _{constructor(t,e=i.SERVER_ERROR,r="internal server error",o){super(t,e,r,o)}};var{combine:Y,timestamp:z,label:Q,printf:wt,colorize:Z}=y.format,G=wt(({level:s,message:t,label:e,timestamp:r})=>`[${r}] ${e} ${s}: ${t}`),R=(0,y.createLogger)({format:Y(Q({label:"\u{1F680}"}),Z(),z({format:"DD-MM-YYYY HH:mm:ssA Z"}),G),transports:[new y.transports.Console]}),St=(0,y.createLogger)({format:Y(Q({label:"\u{1F680}"}),Z(),z({format:"DD-MM-YYYY HH:mm:ssA Z"}),G),transports:[new y.transports.Console,new y.transports.File({filename:"app_error.log"})]}),T=class{constructor(){this.logError=t=>a(this,null,function*(){return console.log("==================== Start Error Logger ==============="),St.log({private:!0,level:"error",message:`${new Date} - ${JSON.stringify(t)}`}),console.log("==================== End Error Logger ==============="),!1});this.isTrustError=t=>t instanceof _?t.isOperational:!1}};var X=l(require("mongoose"));var Ot=()=>a(void 0,null,function*(){try{yield X.default.connect(h.DB_URL),R.info("DB Connected...")}catch(s){R.error(`Failed to Connect DB : ${s}`)}}),D=Ot;var v=l(require("mongoose")),It=v.default.Schema,_t=new It({street:{type:String,required:!0},postalCode:{type:String,required:!0},city:{type:String,required:!0},country:{type:String,required:!0}},{toJSON:{transform(s,t){delete t.__v}}}),P=v.default.model("address",_t);var V=l(require("mongoose")),tt=V.default.Schema,Ct=new tt({email:{type:String,required:!0},password:{type:String,required:!0},phone:{type:String,required:!0},address:[{type:tt.Types.ObjectId,ref:"address",required:!0}],wishlist:[{_id:{type:String,required:!0},name:{type:String},banner:{type:String},price:{type:Number},description:{type:String},available:{type:Boolean}}],orders:[{_id:{type:String,required:!0},amount:{type:String},date:{type:Date,default:new Date().toISOString()}}],cart:[{product:{_id:{type:String,required:!0},name:{type:String},banner:{type:String},price:{type:Number}},unit:{type:Number,required:!0}}]},{timestamps:!0,toJSON:{transform(s,t){delete t.password,delete t.__v}}}),f=V.default.model("customer",Ct);var F=class{createCustomer(o){return a(this,arguments,function*({email:t,password:e,phone:r}){try{return yield f.create({email:t,password:e,phone:r,address:[]})}catch(n){throw new p("API ERROR",i.SERVER_ERROR,"unable to add customer")}})}createAddress(u){return a(this,arguments,function*({customerId:t,city:e,postalCode:r,street:o,country:n}){try{let c=yield f.findById(t);if(c){let d=yield P.create({city:e,postalCode:r,street:o,country:n});c.address.push(d),yield c.save()}return c}catch(c){throw new p("API ERROR",i.SERVER_ERROR,"unable to add address")}})}findCustomer(t){return a(this,null,function*(){try{return yield f.findOne({email:t})}catch(e){throw new p("API ERROR",i.SERVER_ERROR,"unable to find customer")}})}findCustomerById(t){return a(this,null,function*(){try{return yield f.findById(t).populate("address")}catch(e){throw new p("API ERROR",i.SERVER_ERROR,"unable to find customer")}})}wishlist(t){return a(this,null,function*(){try{let e=yield f.findById(t).populate("wishlist");return e==null?void 0:e.wishlist}catch(e){throw new p("API ERROR",i.SERVER_ERROR,"unable to find customer")}})}addWishlistItem(t,e){return a(this,null,function*(){try{let r=yield f.findById(t).populate("wishlist");if(r){let n=r.wishlist;if(n.length>0){let u=!1;n.map((c,d)=>{String(c._id)===String(e._id)&&(n.splice(d,1),u=!0)}),u||n.push(e)}else n.push(e);r.wishlist=n}let o=yield r==null?void 0:r.save();return o==null?void 0:o.wishlist}catch(r){throw new p("API ERROR",i.SERVER_ERROR,"unable to add to wishlist")}})}addCartItem(n){return a(this,arguments,function*({customerId:t,qty:e,product:r,isRemove:o}){try{let u=yield f.findById(t).populate("cart");if(u){let d={product:r,unit:e},m=u.cart;if(m.length>0){let x=!1;m.map((K,pt)=>{let Rt=K.product;String(Rt._id)===String(r._id)&&(x=!0,o?m.splice(pt,1):K.unit=e)}),x||m.push(d)}else m.push(d);u.cart=m}let c=yield u==null?void 0:u.save();return c==null?void 0:c.cart}catch(u){throw new p("API ERROR",i.SERVER_ERROR,"unable to add to cart")}})}addOrderToProfile(t,e){return a(this,null,function*(){try{let r=yield f.findById(t).populate("orders");return r&&(r.orders||(r.orders=[]),r.orders.push(e),r.cart=[]),yield r==null?void 0:r.save()}catch(r){throw new p("API ERROR",i.SERVER_ERROR,"unable to add order to profile")}})}},q=F;var B=l(require("argon2")),U=l(require("jsonwebtoken"));var et=s=>a(void 0,null,function*(){return yield B.default.hash(s)}),rt=(s,t)=>a(void 0,null,function*(){return yield B.default.verify(s,t)}),j=s=>U.default.sign(s,h.TOKEN_SECRET,{expiresIn:"30d"}),st=s=>{try{let t=s.get("Authorization");if(!t)return!1;let e=U.default.verify(t.split(" ")[1],h.TOKEN_SECRET);return s.user=e,!0}catch(t){return R.error("Error :",JSON.stringify(t)),!1}},g=s=>{if(s)return{data:s};throw new Error("Data Not found!")};var L=class{constructor(){this.repository=new q}signIn(r){return a(this,arguments,function*({email:t,password:e}){try{let o=yield this.repository.findCustomer(t);if(o){if(yield rt(o.password,e)){let{email:u,phone:c,_id:d}=o,x=j({email:u,phone:c,_id:d});return g({id:o._id,token:x})}return g(null)}}catch(o){throw new p("failed to sign in",i.SERVER_ERROR,JSON.stringify(o))}})}signUp(o){return a(this,arguments,function*({email:t,phone:e,password:r}){try{let n=yield et(r),u=yield this.repository.createCustomer({email:t,phone:e,password:n}),c={email:t,phone:e,_id:u==null?void 0:u._id},d=j(c);return g({id:u._id,token:d})}catch(n){throw new p("failed to sign up",i.SERVER_ERROR,JSON.stringify(n))}})}addNewAddress(t){return a(this,null,function*(){try{let e=yield this.repository.createAddress(t);return g(e)}catch(e){throw new p("failed to add new address",i.SERVER_ERROR,JSON.stringify(e))}})}getProfile(t){return a(this,null,function*(){try{let e=yield this.repository.findCustomerById(t);return g(e)}catch(e){throw new p("failed to get customer profile",i.SERVER_ERROR,JSON.stringify(e))}})}getWishlist(t){return a(this,null,function*(){try{let e=yield this.repository.wishlist(t);return g(e)}catch(e){throw new p("failed to get customer wishlist",i.SERVER_ERROR,JSON.stringify(e))}})}addToWishlist(t,e){return a(this,null,function*(){try{let r=yield this.repository.addWishlistItem(t,e);return g(r)}catch(r){throw new p("failed to add item in customer wishlist",i.SERVER_ERROR,JSON.stringify(r))}})}manageCart(t){return a(this,null,function*(){try{let e=yield this.repository.addCartItem(t);return g(e)}catch(e){throw new p("failed to update cart",i.SERVER_ERROR,JSON.stringify(e))}})}manageOrder(t,e){return a(this,null,function*(){try{let r=yield this.repository.addOrderToProfile(t,e);return g(r)}catch(r){throw new p("failed to update order",i.SERVER_ERROR,JSON.stringify(r))}})}subscribeEvents(u){return a(this,arguments,function*({data:{customerId:t,order:e,qty:r,product:o},event:n}){switch(n){case"ADD_TO_WISHLIST":case"REMOVE_FROM_WISHLIST":t&&o&&this.addToWishlist(t,o);break;case"ADD_TO_CART":t&&o&&r&&this.manageCart({customerId:t,product:o,qty:r,isRemove:!1});break;case"REMOVE_FROM_CART":t&&o&&r&&this.manageCart({customerId:t,product:o,qty:r,isRemove:!0});break;case"CREATE_ORDER":t&&e&&this.manageOrder(t,e);break;case"TEST":R.info("======TEST_EVENT_RECEIVED=====");break;default:break}})}},ot=L;var xt=s=>(t,e,r)=>Promise.resolve(s(t,e,r)).catch(r),w=xt;var O=new ot,k=class{constructor(){this.signup=w((t,e,r)=>a(this,null,function*(){let{email:o,password:n,phone:u}=t.body,{data:c}=yield O.signUp({email:o,phone:u,password:n});return e.status(i.CREATED).json(c)}));this.login=w((t,e,r)=>a(this,null,function*(){let{email:o,password:n}=t.body,u=yield O.signIn({email:o,password:n});return e.status(i.OK).json(u==null?void 0:u.data)}));this.address=w((t,e,r)=>a(this,null,function*(){if(t.user){let{_id:o}=t.user,{street:n,postalCode:u,city:c,country:d}=t.body,{data:m}=yield O.addNewAddress({customerId:o,city:c,street:n,country:d,postalCode:u});return e.status(i.OK).json(m)}return e.status(i.SERVER_ERROR).json({status:"ERROR"})}));this.profile=w((t,e,r)=>a(this,null,function*(){if(t.user){let{_id:o}=t.user,{data:n}=yield O.getProfile(o);return e.status(i.OK).json(n)}return e.status(i.SERVER_ERROR).json({status:"ERROR"})}));this.shoppingDetails=w((t,e,r)=>a(this,null,function*(){if(t.user){let{_id:o}=t.user,{data:n}=yield O.getProfile(o);return e.status(i.OK).json(n)}return e.status(i.SERVER_ERROR).json({status:"ERROR"})}));this.wishlist=w((t,e,r)=>a(this,null,function*(){if(t.user){let{_id:o}=t.user,{data:n}=yield O.getWishlist(o);return e.status(i.OK).json(n)}return e.status(i.SERVER_ERROR).json({status:"ERROR"})}));this.events=w((t,e,r)=>a(this,null,function*(){if(!t.body.payload)return e.status(i.BAD_REQUEST).json({status:"ERROR"});let o=t.body.payload;return O.subscribeEvents(o),R.info("======CUSTOMER SERVICE RECEIVED EVENT====="),e.status(i.OK).json(o)}))}},M=k;var Tt=(s,t,e)=>a(void 0,null,function*(){if(st(s))e();else return t.status(i.UNAUTHORIZED).json({status:"ERROR",message:"unauthorized user"})}),C=Tt;var nt=require("express"),S=(0,nt.Router)(),I=new M;S.post("/signup",I.signup);S.post("/login",I.login);S.post("/address",C,I.address);S.get("/profile",C,I.profile);S.get("/shopping-details",C,I.shoppingDetails);S.get("/wishlist",C,I.wishlist);S.post("/app-events",I.events);var J=S;var Nt=(s,t,e,r)=>a(void 0,null,function*(){let o=new T;if(process.on("uncaughtException",n=>{throw console.log(n,"UNHANDLED"),n}),process.on("uncaughtException",n=>{o.logError(n),o.isTrustError(s)}),s){if(yield o.logError(s),o.isTrustError(s)){if(s.errorStack){let n=s.errorStack;return e.status(s.statusCode).json({message:n})}return e.status(s.statusCode).json({message:s.message})}return e.status(s.statusCode).json({message:s.message})}r()}),at=Nt;var E=(0,N.default)();E.use((0,ct.default)());E.use(N.default.json({limit:"1mb"}));E.use(N.default.urlencoded({extended:!0,limit:"1mb"}));E.use((0,it.default)());E.use((0,ut.default)());E.use((s,t,e)=>{R.info(`${s.method} => ${s.path}`),e()});E.use("/api/customer",b);E.use("/api/customer",J);E.use(at);var dt=E;var bt=()=>{D(),dt.listen(h.PORT,()=>{R.info(`customer service is running on PORT: ${h.PORT}`)}).on("error",()=>{R.error("Failed to start server"),process.exit()})};bt();

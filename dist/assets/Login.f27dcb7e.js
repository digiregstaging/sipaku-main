import{r as b,_ as A,u as D,a as I,o as p,c as u,b as s,w as T,d as m,n as C,t as N,e as f,f as h,v as g,g as V,p as B,h as P}from"./index.214eebfd.js";import{_ as E,a as w,e as O}from"./encryption.fb6bb8c3.js";const o=b({isShowAlert:!1,alertText:null,colorClass:""});function y(a,c){o.isShowAlert=!0,o.alertText=a,o.colorClass=c}const r=a=>(B("data-v-0d7e3f77"),a=a(),P(),a),J={class:"text-center wrapper-login"},K={class:"form-signin w-100 m-auto"},M=["onSubmit"],U=r(()=>s("img",{class:"mb-4",src:E,alt:"",width:"72",height:"72"},null,-1)),$=r(()=>s("h1",{class:"h3 mb-3 fw-normal"},"Pemetaan 360 Kumuh DKI",-1)),j={class:"form-floating"},q=r(()=>s("label",{for:"email"},"Email address",-1)),F={class:"form-floating"},R=r(()=>s("label",{for:"password"},"Password",-1)),G=["disabled"],H={key:0},Q=r(()=>s("i",{class:"fa-solid fa-sync fa-spin"},null,-1)),W=[Q],X=r(()=>s("p",{class:"mt-5 mb-3 text-muted"},"\xA9 2023",-1)),Y={__name:"Login",setup(a){const c=D(),n=I(!1),t=b({email:null,password:null});async function v(i){const{id:e,role:l,tokens:S,username:k}=i,_=JSON.parse(S.replace(/'/g,'"')).access;try{const d=await w({method:"get",url:`https://backend.observer.xyz/organization_users/?user=${e}`,headers:{Authorization:`Bearer ${_}`}}),{results:z}=d.data,L={id:e,role:l,accessToken:_,username:k,organization:z[0].organization};sessionStorage.setItem("userData",O(JSON.stringify(L)))}catch(d){console.log(d)}}async function x(){if(t.email===null||t.password===null){y("All Field cannot empty!","alert-danger");return}const i={email:t.email,password:t.password};n.value=!0;try{const e=await w.post("https://backend.observer.xyz/auth/login/",i);v(e.data),c.push({path:"map-viewer",query:{project:"919c733f-62fb-4564-871b-c20635fc827a",year:"2023"}}),n.value=!1}catch{y("Email or Password not correct","alert-danger"),t.password=null,n.value=!1}}return(i,e)=>(p(),u("div",J,[s("main",K,[s("form",{onSubmit:T(x,["prevent"])},[U,$,m(o).isShowAlert?(p(),u("div",{key:0,style:{padding:"8px 16px"},class:C(["text-start alert",m(o).colorClass]),role:"alert"},N(m(o).alertText),3)):f("",!0),s("div",j,[h(s("input",{type:"email","onUpdate:modelValue":e[0]||(e[0]=l=>t.email=l),class:"form-control",id:"email",placeholder:"name@example.com"},null,512),[[g,t.email]]),q]),s("div",F,[h(s("input",{type:"password","onUpdate:modelValue":e[1]||(e[1]=l=>t.password=l),class:"form-control",id:"password",placeholder:"Password"},null,512),[[g,t.password]]),R]),s("button",{class:"w-100 btn btn-lg btn-primary",type:"submit",disabled:n.value},[n.value?(p(),u("span",H,W)):f("",!0),V(" Login ")],8,G),X],40,M)])]))}},es=A(Y,[["__scopeId","data-v-0d7e3f77"]]);export{es as default};
import{f as l,h as u,x as _,o as d,c as f,a as e,j as m,k as p,v as b,G as v,s as x,t as y,_ as h}from"./index.4ddf9c97.js";const o=t=>(x("data-v-b709f259"),t=t(),y(),t),g=o(()=>e("h1",{class:"text-4xl text-center mt-10 title_color"}," Envoyer une notification ",-1)),S={class:"text-center mt-20 justify-center flex flex-vertical"},k=["onSubmit"],w={class:"input_container"},E=o(()=>e("label",{for:"message",class:"block mb-2 text-sm font-medium text-gray-900"},"Intitul\xE9 de la notification",-1)),I=o(()=>e("button",{class:"submit_btn",type:"submit"},"Envoyer",-1)),N=l({__name:"Notification",setup(t){const a=u(),s=_(""),i=async()=>{try{await v.post("admin/notifications",{message:s.value}),s.value="",a.success("Notification envoy\xE9e")}catch{a.error("Une erreur est survenue")}};return(c,n)=>(d(),f("div",null,[g,e("section",S,[e("form",{onSubmit:m(i,["prevent"])},[e("div",w,[E,p(e("input",{"onUpdate:modelValue":n[0]||(n[0]=r=>s.value=r),type:"text",id:"message",class:"block w-full p-4 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 placeholder-gray-400 focus:border-blue-500",required:""},null,512),[[b,s.value]])]),I],40,k)])]))}});const j=h(N,[["__scopeId","data-v-b709f259"]]);export{j as default};

import{f as U,i as Y,o as m,c as v,a as e,k as g,v as A,_ as V,g as O,H as le,h as z,y as L,m as M,n as q,F as C,z as w,D as re,q as F,p as E,s as T,t as H,x as y,J as Z,K as ee,A as k,u as de,I as _e,L as K,b as B}from"./index.95d509c3.js";const me={class:"editable-room"},fe={class:"fields"},ve=["for"],pe=["id"],he=["for"],xe=["id"],be={class:"actions"},ge=U({__name:"EditableRoom",props:{initialRoom:null,updateRoom:null,deleteRoom:null},setup(l){const n=Y(l.initialRoom);return(s,a)=>(m(),v("div",me,[e("div",fe,[e("div",null,[e("label",{for:`name-${n.id}`},"Nom",8,ve),g(e("input",{"onUpdate:modelValue":a[0]||(a[0]=r=>n.name=r),type:"text",id:`name-${n.id}`,minLength:"2",maxlength:"50"},null,8,pe),[[A,n.name]])]),e("div",null,[e("label",{for:`limit-${n.id}`},"Limite",8,he),g(e("input",{"onUpdate:modelValue":a[1]||(a[1]=r=>n.limit=r),type:"number",id:`limit-${n.id}`,min:"2",max:"50"},null,8,xe),[[A,n.limit]])])]),e("div",be,[e("button",{onClick:a[2]||(a[2]=r=>l.updateRoom(n)),type:"button",class:"update"}," Modifier "),e("button",{onClick:a[3]||(a[3]=r=>l.deleteRoom(n.id)),class:"delete"},"Supprimer")])]))}});const ye=V(ge,[["__scopeId","data-v-f75abde5"]]),J=l=>(T("data-v-a0dbce1d"),l=l(),H(),l),ke={id:"room"},$e=J(()=>e("h2",{class:"text-2xl sub_title"},"Ajouter un salon de discussion : ",-1)),Re={id:"new-room",class:"flex flex-col ml-10"},Se={class:"row"},Ce={class:"mt-5"},Ee=J(()=>e("div",{class:"flex justify-center"},[e("hr",{class:"w-1/2"})],-1)),Ie=J(()=>e("h2",{class:"text-2xl sub_title"},"Liste des salons de discussion : ",-1)),we={id:"rooms"},Ae=U({__name:"Room",setup(l){const h=O(),n=h.socket,s=h.adminSocket,a=le(),r=z(),f=L(()=>a.rooms),p={name:"",limit:50},i=Y({...p});function b(){s.emit("room:create",i)}function R(_){s.emit("room:update",_)}function S(_){s.emit("room:delete",+_)}function j(_){s.emit("room:restore",+_)}return M(()=>{n.emit("rooms"),n.on("rooms",({data:_,errors:c})=>{if(c){for(const d of c)r.error(d.message);return}a.updateRooms(_.rooms)}),s.on("room:created",({data:_,errors:c})=>{if(c){for(const d of c)r.error(d.message);return}a.setRoom(_.room),r.success("Room created"),Object.assign(i,p)}),s.on("room:updated",({data:_,errors:c})=>{if(c){for(const d of c)r.error(d.message);return}a.updateRoom(_.room),r.success("Room updated")}),s.on("room:deleted",({data:_,errors:c})=>{if(c){for(const d of c)r.error(d.message);return}a.deleteRoom(_.id),r.success("Salon supprim\xE9, cliquez ici pour annuler",{timeout:6e3,onClick(){j(_.id)}})}),s.on("room:restored",({data:_,errors:c})=>{if(c){for(const d of c)r.error(d.message);return}a.setRoom(_.room)})}),q(()=>{n.off("rooms"),s.off("room:created"),s.off("room:updated"),s.off("room:deleted")}),(_,c)=>(m(),v("section",ke,[$e,e("div",Re,[e("div",Se,[g(e("input",{type:"text","onUpdate:modelValue":c[0]||(c[0]=d=>i.name=d),placeholder:"Nom du salon",minlength:"2",maxlength:"50"},null,512),[[A,i.name]])]),e("div",Ce,[g(e("input",{type:"number","onUpdate:modelValue":c[1]||(c[1]=d=>i.limit=d),min:"2",max:"50",class:"mr-5"},null,512),[[A,i.limit]]),e("button",{type:"button",onClick:b},"Cr\xE9er")])]),Ee,Ie,e("div",we,[(m(!0),v(C,null,w(E(f),d=>(m(),v(C,{key:d==null?void 0:d.id},[d?(m(),re(ye,{key:0,"initial-room":d,updateRoom:R,deleteRoom:S},null,8,["initial-room"])):F("",!0)],64))),128))])]))}});const Ue=V(Ae,[["__scopeId","data-v-a0dbce1d"]]);function te(l){return l.reduce((h,n)=>(h[n]=n,h),Object.create(null))}const oe=["online","idle","dnd","invisible"];te(oe);const Ve={online:"En ligne",idle:"Absent",dnd:"Ne pas d\xE9ranger",invisible:"Invisible"},je=l=>(T("data-v-a72a37cf"),l=l(),H(),l),Ne={id:"status"},Pe=je(()=>e("label",{for:"status-select"},"Status",-1)),De=["value"],Ke=U({__name:"Status",setup(l){var r;const h=O(),n=z(),s=y((r=h.user)==null?void 0:r.status),a=h.adminSocket;return Z(s,f=>{f&&a.emit("admin:status:update",f)}),M(()=>{a.on("admin:status:updated",({data:f,errors:p})=>{if(p){for(const i of p)n.error(i.message);return}h.setStatus(f.status),n.success("Status updated")})}),q(()=>{a.off("admin:status:updated")}),(f,p)=>(m(),v("section",Ne,[Pe,s.value?g((m(),v("select",{key:0,"onUpdate:modelValue":p[0]||(p[0]=i=>s.value=i),id:"status-select"},[(m(!0),v(C,null,w(E(oe),i=>(m(),v("option",{key:i,value:i},k(E(Ve)[i]),9,De))),128))],512)),[[ee,s.value]]):F("",!0)]))}});const Be=V(Ke,[["__scopeId","data-v-a72a37cf"]]),Le=["pending","accepted","refused"],Oe=te(Le),I=l=>(T("data-v-eccaaea5"),l=l(),H(),l),ze={id:"contact"},Me=I(()=>e("h2",{class:"text-2xl sub_title"},"Demande de contacts : ",-1)),qe={id:"header"},Fe={id:"filter"},Te=["value"],He=["disabled"],Je=I(()=>e("hr",null,null,-1)),Ge={key:0,id:"contacts"},Qe=["onClick"],We={class:"key"},Xe={id:"order"},Ye=I(()=>e("th",null,"Actions",-1)),Ze={key:0,id:"actions"},et=["onClick"],tt=["onClick"],ot={key:1,class:"treated"},st=I(()=>e("span",null,"Demande d\xE9j\xE0 trait\xE9e",-1)),nt=[st],at={id:"pagination"},it=["disabled"],ct={id:"pages"},ut=I(()=>e("span",null,"/",-1)),lt=["disabled"],rt={key:0,id:"count"},dt={key:1},_t=I(()=>e("p",null,"Personne n'a besoin d'aide !",-1)),mt=[_t],ft=U({__name:"Contact",setup(l){const h=O(),n=z(),s=h.adminSocket,a=y({}),r=y(0),f=y({key:"email",search:""}),p=y("status"),i=y("asc"),b=y(1),R=y(1),S=y(!1),j=de(),_=L(()=>!a.value||!f.value.key?null:Object.values(a.value).filter(o=>{if(N(f.value.key)){const u=o[f.value.key];return new RegExp(f.value.search,"i").test(u)}if(P(f.value.key)){const u=o.user[f.value.key];return new RegExp(f.value.search,"i").test(u)}})),c=L(()=>_.value?_.value.slice().sort((o,u)=>{if(N(p.value)){const t={pending:0,accepted:1,refused:2},x=t[o[p.value]]-t[u[p.value]];return i.value==="asc"?x:-x}if(P(p.value)){const t=o.user[p.value].localeCompare(u.user[p.value]);return i.value==="asc"?t:-t}return 0}):null);Z(b,o=>s.emit("contacts",+o),{immediate:!0}),M(()=>{s.on("contacts",({data:o,errors:u})=>{if(u){for(const x of u)n.error(x.message);return}const t=o.contacts.reduce((x,$)=>({...x,[$.id]:$}),Object.create(null));a.value=t,r.value=o.count,R.value=o.maxPage,S.value=!1}),s.on("contact:accepted",({data:o,errors:u})=>{if(u){for(const ue of u)n.error(ue.message);return}const{conversation:t,contact:x}=o,{status:$,id:D}=x,X=a.value[D];X&&(X.status=$),n.success("Demande accept\xE9, cliquez ici pour aller \xE0 la conversation",{onClick:()=>j.push({name:"conversation",params:{conversationId:t.id}})})}),s.on("contact:refused",({data:o,errors:u})=>{if(u){for(const D of u)n.error(D.message);return}if(!a.value)return;const{status:t,id:x}=o.contact,$=a.value[x];$&&($.status=t)}),s.on("contact:created",({errors:o})=>{if(o){for(const u of o)n.error(u.message);return}S.value=!0})}),q(()=>{s.off("contacts"),s.off("contact:accepted"),s.off("contact:refused"),s.off("contact:created")});function d(o){s.emit("contact:accept",+o)}function se(o){s.emit("contact:refuse",+o)}function ne(){s.emit("contacts",+b.value)}function ae(){b.value>1&&b.value--}function ie(){b.value<R.value&&b.value++}function ce(o){if(o===p.value)return i.value=i.value==="asc"?"desc":"asc";(N(o)||P(o))&&(i.value="asc",p.value=o)}const G=["status"],Q=["username","email"],W=[...Q,...G];function N(o){return G.includes(o)}function P(o){return Q.includes(o)}return(o,u)=>(m(),v("section",ze,[Me,e("div",qe,[e("div",Fe,[g(e("select",{"onUpdate:modelValue":u[0]||(u[0]=t=>f.value.key=t)},[(m(),v(C,null,w(W,t=>e("option",{key:t,value:t},k(t),9,Te)),64))],512),[[ee,f.value.key]]),g(e("input",{"onUpdate:modelValue":u[1]||(u[1]=t=>f.value.search=t),type:"text",placeholder:"\xE9l\xE9ment \xE0 filtrer"},null,512),[[A,f.value.search]]),e("button",{onClick:ne,id:"refresh",disabled:!S.value,class:_e({highlighted:S.value})}," Rafra\xEEchir ",10,He)])]),Je,E(c)?(m(),v("div",Ge,[e("table",null,[e("thead",null,[e("tr",null,[(m(),v(C,null,w(W,t=>e("th",{key:t,onClick:x=>ce(t)},[e("div",We,[e("span",null,k(t),1),g(e("span",Xe,[g(e("span",null,"\u2191",512),[[K,i.value==="asc"]]),g(e("span",null,"\u2193",512),[[K,i.value==="desc"]])],512),[[K,t===p.value]])])],8,Qe)),64)),Ye])]),e("tbody",null,[(m(!0),v(C,null,w(E(c),t=>(m(),v("tr",{key:t.id},[e("td",null,k(t.user.username),1),e("td",null,k(t.user.email),1),e("td",null,k(t.status),1),e("td",null,[t.status===E(Oe).pending?(m(),v("div",Ze,[e("button",{onClick:x=>d(t.id),id:"accept"}," Accepter ",8,et),e("button",{onClick:x=>se(t.id),id:"refuse"}," Refuser ",8,tt)])):(m(),v("div",ot,nt))])]))),128))])]),e("div",at,[e("button",{onClick:ae,disabled:b.value===1}," Pr\xE9c\xE9dent ",8,it),e("div",ct,[e("span",null,k(b.value),1),ut,e("span",null,k(R.value),1)]),e("button",{onClick:ie,disabled:b.value===R.value}," Suivant ",8,lt)]),r.value?(m(),v("div",rt,[e("span",null,k(r.value)+" contacts",1)])):F("",!0)])):(m(),v("div",dt,mt))]))}});const vt=V(ft,[["__scopeId","data-v-eccaaea5"]]),pt={id:"admin"},ht=U({__name:"Admin",setup(l){return(h,n)=>(m(),v("section",pt,[B(Be),B(vt),B(Ue)]))}});const bt=V(ht,[["__scopeId","data-v-978bf54d"]]);export{bt as default};
import{f as M,o as r,c as i,a as o,A as p,q as S,l as T,h as B,g as N,y as h,x as A,m as K,C as F,n as R,r as U,b as j,w as q,d as z,p as v,F as H,z as Z,D as G,k as J,v as O,E as P,s as Q,t as W,_ as X}from"./index.95d509c3.js";import{d as I}from"./dayjs.min.203e8904.js";const Y={class:"message"},ee={class:"message__content"},se={class:"message__meta"},te={class:"message__meta__user"},oe={key:0,class:"message__meta__date"},ne=M({__name:"ConversationMessage",props:{message:null},setup(n){const u=l=>{const _=new Date(l),g=_.getHours(),m=_.getMinutes(),d=e=>e<10?"0"+e:e;return`${d(g)}:${d(m)}`};return(l,_)=>(r(),i("li",Y,[o("div",ee,p(n.message.content),1),o("div",se,[o("span",te,p(n.message.author.username),1),n.message.createdAt?(r(),i("span",oe,p(u(n.message.createdAt)),1)):S("",!0)])]))}});const $=n=>(Q("data-v-d21bd85b"),n=n(),W(),n),ae={class:"main-container wacky-tile"},re={id:"conversation",class:"community"},ce={key:0,class:"messages"},ie={key:1,class:"no-messages"},de=$(()=>o("p",null,"Il n'y a pas de messages",-1)),ue=[de],le={key:2,class:"board"},_e=["onKeyup"],me={key:3,class:"ended"},ve=$(()=>o("p",null,"La conversation est termin\xE9",-1)),ge=[ve],fe=M({__name:"Conversation",props:{conversationId:null},setup(n){const{conversationId:u}=n,l=T(),_=B(),g=N(),m=h(()=>l.conversations[u]),d=A(""),e=g.socket,V=g.adminSocket,C=A(null),b=h(()=>{var s;return((s=m.value)==null?void 0:s.endedAt)===null}),D=h(()=>b.value&&g.isAdmin),E=h(()=>{var s;return((s=m.value)==null?void 0:s.messages)||[]}),x=h(()=>E.value.slice().sort((s,t)=>I(s.createdAt).isAfter(I(t.createdAt))?1:-1)),w=async()=>{!d.value||(e.emit("conversation:message:send",+u,d.value),d.value="")};K(()=>{var s;(s=C.value)==null||s.scrollIntoView({block:"end"}),e.emit("conversation",+u),e.on("conversation",({data:t,errors:a})=>{if(a){for(const c of a)_.error(c.message);return}l.updateConversation(t.conversation)}),e.on("conversation:message:received",async({data:t,errors:a})=>{var c,f;if(a){for(const k of a)_.error(k.message);return}l.addMessage(u,t.message),t.message.author.id===((c=g.user)==null?void 0:c.id)&&(await F(),(f=C.value)==null||f.scrollIntoView({block:"end"}))}),e.on("conversation:ended",({data:t,errors:a})=>{if(a){for(const c of a)_.error(c.message);return}return l.updateConversation(t.conversation)})}),R(()=>{e.off("conversation"),e.off("conversation:message:received"),e.off("conversation:ended")});function L(){V.emit("conversation:end",+u)}return(s,t)=>{var c,f,k;const a=U("RouterLink");return r(),i("div",ae,[o("section",re,[o("header",null,[j(a,{to:"/conversations",class:"back"},{default:q(()=>[z("\u1438")]),_:1}),o("h3",null,p((c=v(m))==null?void 0:c.receiver.username)+" "+p((f=v(m))!=null&&f.receiver.isAdmin?"(Conseiller)":""),1),v(D)&&!((k=v(m))!=null&&k.receiver.isAdmin)?(r(),i("button",{key:0,onClick:L}," Terminer ")):S("",!0)]),v(x).length?(r(),i("ul",ce,[(r(!0),i(H,null,Z(v(x),y=>(r(),G(ne,{key:y.id,message:y},null,8,["message"]))),128)),o("div",{ref_key:"bottom",ref:C,class:"bottom"},null,512)])):(r(),i("div",ie,ue)),v(b)?(r(),i("div",le,[J(o("input",{type:"text","onUpdate:modelValue":t[0]||(t[0]=y=>d.value=y),onKeyup:P(w,["enter"]),autofocus:"",maxlength:"255",minlength:"1"},null,40,_e),[[O,d.value,void 0,{trim:!0}]]),o("button",{onClick:w},"Envoyer")])):(r(),i("div",me,ge))])])}}});const ke=X(fe,[["__scopeId","data-v-d21bd85b"]]);export{ke as default};
import{f as k,l as x,g as y,h as g,u as E,m as b,n as S,r as w,o as i,c as u,a as s,b as d,w as l,d as _,p as m,q as f,s as A,t as I,_ as V}from"./index.4ddf9c97.js";const p=a=>(A("data-v-d660ebce"),a=a(),I(),a),N={class:"main-container wacky-tile"},B={id:"community",class:"community"},R=p(()=>s("header",null,[s("h3",null,"Communaut\xE9")],-1)),j=p(()=>s("span",null,"Contacter un conseiller",-1)),q=[j],L={key:1},T=k({__name:"Community",setup(a){const v=x(),r=y(),o=r.socket,n=g(),h=E();b(()=>{o.on("contact:created",({errors:e})=>{if(e){for(const t of e)n.error(t.message);return}n.success("Demande envoy\xE9e, un conseiller va vous contacter")}),o.on("contact:pending",({errors:e})=>{if(e){for(const t of e)n.error(t.message);return}n.info("Vous \xEAtes d\xE9j\xE0 en attente d'un conseiller")}),o.on("contact:accepted",({data:e,errors:t})=>{if(t){for(const c of t)n.error(c.message);return}n.success("Un conseiller \xE0 accepter votre demande, cliquez ici pour rejoindre la conversation",{onClick:()=>{h.push({name:"conversation",params:{conversationId:e.conversation.id}})}}),v.setConversation(e.conversation)}),o.on("contact:refused",({errors:e})=>{if(e){for(const t of e)n.error(t.message);return}n.warning("Aucun conseiller ne peut vous contacter pour le moment")})}),S(()=>{o.off("conversations"),o.off("contact:created"),o.off("contact:pending"),o.off("contact:accepted"),o.off("contact:refused")});function C(){o.emit("contact:create")}return(e,t)=>{const c=w("RouterLink");return i(),u("div",N,[s("section",B,[R,s("ul",null,[s("li",null,[d(c,{to:"rooms"},{default:l(()=>[_("Salons de discussion")]),_:1})]),s("li",null,[d(c,{to:"conversations"},{default:l(()=>[_("Conversations")]),_:1})]),m(r).isAdmin?f("",!0):(i(),u("li",{key:0,onClick:C},q)),m(r).isAdmin?f("",!0):(i(),u("li",L,[d(c,{to:"chatbot"},{default:l(()=>[_("Wacky bot")]),_:1})]))])])])}}});const z=V(T,[["__scopeId","data-v-d660ebce"]]);export{z as default};

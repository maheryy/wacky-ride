import{f,H as k,h as y,y as R,g as C,m as S,r as g,o as c,c as d,a,b as _,w as i,d as l,p,F as v,z as x,A as I,q as w,s as N,t as V,_ as b}from"./index.95d509c3.js";const B=s=>(N("data-v-6ca3da19"),s=s(),V(),s),L={class:"main-container wacky-tile"},A={id:"rooms",class:"community"},F=B(()=>a("h3",null,"Salons de discussion",-1)),T=f({__name:"ChatRooms",setup(s){const o=k(),m=y(),h=R(()=>Object.keys(o.rooms).length>0),r=C().socket;return S(()=>{r.emit("rooms"),r.on("rooms",({data:u,errors:n})=>{if(n){for(const t of n)m.error(t.message);return}o.updateRooms(u.rooms)})}),(u,n)=>{const t=g("RouterLink");return c(),d("div",L,[a("section",A,[a("header",null,[_(t,{to:"/community",class:"back"},{default:i(()=>[l("\u1438")]),_:1}),F]),a("ul",null,[p(h)?(c(!0),d(v,{key:0},x(p(o).rooms,e=>(c(),d("li",{key:e==null?void 0:e.id},[_(t,{to:{name:"room",params:{roomId:e==null?void 0:e.id}}},{default:i(()=>[l(I(e==null?void 0:e.name),1)]),_:2},1032,["to"])]))),128)):w("",!0)])])])}}});const z=b(T,[["__scopeId","data-v-6ca3da19"]]);export{z as default};

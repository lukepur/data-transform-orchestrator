webpackJsonp([1],{103:function(t,e){},109:function(t,e,r){var n=r(11)(r(53),r(115),null,null,null);t.exports=n.exports},110:function(t,e,r){var n=r(11)(r(54),r(116),null,null,null);t.exports=n.exports},111:function(t,e,r){var n=r(11)(r(55),r(114),null,null,null);t.exports=n.exports},112:function(t,e,r){var n=r(11)(r(56),r(113),null,null,null);t.exports=n.exports},113:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"control-group"},[r("label",[t._v(t._s(t.label))]),t._v(" "),r("input",{staticClass:"form-control",attrs:{type:"text"},domProps:{value:t.value},on:{change:function(e){return t.update(e.target.value)}}})])},staticRenderFns:[]}},114:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"container"},[r("div",{staticClass:"row"},[r("div",{staticClass:"col-sm-12"},[r("div",{staticClass:"form-group row"},[r("label",{staticClass:"col-3 col-form-label",attrs:{for:"orchestration-selector"}},[t._v("Select Orchestration")]),t._v(" "),r("div",{staticClass:"col-9"},[r("select",{directives:[{name:"model",rawName:"v-model",value:t.selectedOrchestrationIndex,expression:"selectedOrchestrationIndex"}],staticClass:"form-control",attrs:{id:"orchestration-selector"},on:{change:function(e){var r=Array.prototype.filter.call(e.target.options,function(t){return t.selected}).map(function(t){return"_value"in t?t._value:t.value});t.selectedOrchestrationIndex=e.target.multiple?r:r[0]}}},[r("option",{attrs:{selected:"",disabled:"",value:"-1"}},[t._v("Select an item")]),t._v(" "),t._l(t.orchestrations,function(e,n){return r("option",{domProps:{value:n}},[t._v(t._s(e.meta().name))])})],2)])])])]),t._v(" "),r("div",{staticClass:"row"},[t._m(0),t._v(" "),r("div",{staticClass:"col-12"},[r("div",t._l(t.userInputs,function(e,n){return r(t.componentEditorForType(t.userInputConstraints[n].type),{key:n,tag:"Component",attrs:{value:t.get(t.inputData,e.target.path),label:e.source.path,update:function(r){return t.update(e.source.path,r)}}})}))])]),t._v(" "),r("div",{staticClass:"row"},[r("div",{staticClass:"col-12"},[t._v("\n      INPUT: "+t._s(t.inputData)+"\n    ")])]),t._v(" "),r("div",{staticClass:"row"},[r("div",{staticClass:"col-12"},[t._v("\n      OUTPUT: "+t._s(t.output)+"\n    ")])])])},staticRenderFns:[function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"col-12"},[r("h4",[t._v("Inputs")])])}]}},115:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"control-group"},[r("label",[t._v(t._s(t.label))]),t._v(" "),r("textarea",{staticClass:"form-control",domProps:{value:t.stringifyValue},on:{change:t.updateJson}})])},staticRenderFns:[]}},116:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"control-group"},[r("label",[t._v(t._s(t.label))]),t._v(" "),r("input",{staticClass:"form-control",attrs:{type:"number"},domProps:{value:t.value},on:{change:function(e){return t.update(+e.target.value)}}})])},staticRenderFns:[]}},117:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{attrs:{id:"app"}},[r("router-view")],1)},staticRenderFns:[]}},44:function(t,e,r){"use strict";var n=r(31),a=r(118),i=r(111),o=r.n(i);n.a.use(a.a),e.a=new a.a({routes:[{path:"/run",name:"OrchestrationRunner",component:o.a},{path:"/",redirect:{name:"OrchestrationRunner"}}]})},45:function(t,e,r){function n(t){r(103)}var a=r(11)(r(52),r(117),n,null,null);t.exports=a.exports},47:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=r(31),a=r(45),i=r.n(a),o=r(44);n.a.config.productionTip=!1,new n.a({el:"#app",router:o.a,render:function(t){return t(i.a)}})},48:function(t,e,r){var n=r(102),a=r(7),i=a.assign,o=r(50),s=r(51);t.exports=new n({nodes:[i({},o,{id:"pickField"}),i({},s,{id:"ema"})],links:[{source:{nodeId:"userInput",path:"priceArray"},target:{nodeId:"pickField",path:"haystack"}},{source:{nodeId:"userInput",path:"priceField"},target:{nodeId:"pickField",path:"prop"}},{source:{nodeId:"pickField",path:"output"},target:{nodeId:"ema",path:"target"}},{source:{nodeId:"userInput",path:"periods"},target:{nodeId:"ema",path:"periods"}},{source:{nodeId:"ema",path:"output"},target:{nodeId:"userOutput",path:"output"}}],meta:{name:"EMA for field"}})},49:function(t,e,r){"use strict";var n=r(48),a=r.n(n);e.a=[a.a]},50:function(t,e,r){var n=r(42),a=[{id:"haystack",type:"array",required:!0,children:{type:"object",required:!0}},{id:"prop",type:"string",required:!0}],i=[{id:"output",type:"array"}],o=function(t){return t.haystack.map(function(e){return e[t.prop]})},s={name:"Array Pick"};t.exports=n(a,i,o,s)},51:function(t,e,r){var n=r(42),a=[{id:"target",type:"array",required:!0,children:{type:"number",required:!0}},{id:"periods",type:"number",required:!0}],i=[{id:"output",type:"array",children:{type:"number"}}],o=function(t){var e=t.target,r=t.periods,n=[],a=void 0;for(a=0;a<r;a+=1){if(void 0===e[a])return n;n.push(u(e.slice(0,a+1))/(a+1))}for(var i=2/(r+1);a<e.length;a+=1){var o=e[a];n.push((o-n[a-1])*i+n[a-1])}return n},s={name:"EMA"};t.exports=new n(a,i,o,s);var u=function(t){return t.reduce(function(t,e){return t+e},0)}},52:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"app"}},53:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=r(57),a=r.n(n),i=r(62),o=r.n(i);e.default={name:"json-editor",props:{label:String,value:[Object,String,Number],update:Function},computed:{stringifyValue:function(){return"object"===o()(this.value)?a()(this.value,null,2):this.value}},methods:{updateJson:function(t){var e=void 0;try{e=JSON.parse(t.target.value)}catch(t){return}this.update(e)}}}},54:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"number-editor",props:{label:String,value:[String,Number],update:Function}}},55:function(t,e,r){"use strict";function n(t,e){console.log(t,e);var n=t.split("."),a=e;return n.forEach(function(t){(a=r.i(o.find)(a,{id:t}))||(a=r.i(o.find)(a.children,{id:t}))}),a}Object.defineProperty(e,"__esModule",{value:!0});var a=r(61),i=r.n(a),o=r(7),s=(r.n(o),r(49)),u=r(109),c=r.n(u),l=r(110),d=r.n(l),p=r(112),f=r.n(p);e.default={name:"orchestration-runner",data:function(){return{orchestrations:s.a,selectedOrchestrationIndex:null,inputData:{}}},computed:{selectedOrchestration:function(){return this.orchestrations[this.selectedOrchestrationIndex]},userInputs:function(){return this.selectedOrchestration?this.selectedOrchestration.meta().links.filter(function(t){return"userInput"===t.source.nodeId}):null},userInputConstraints:function(){if(!this.userInputs)return null;var t=this.selectedOrchestration.meta(),e=t.nodes;return this.userInputs.map(function(t){var a=t.target,i=a.nodeId;return n(a.path,r.i(o.find)(e,{id:i}).meta().inputConstraints)})},output:function(){if(!this.selectedOrchestration)return null;try{return this.selectedOrchestration.run(this.inputData)}catch(t){return null}}},methods:{get:o.get,update:function(t,e){r.i(o.set)(this.inputData,t,e),this.inputData=i()({},this.inputData)},componentEditorForType:function(t){return"string"===t?"StringEditor":"number"===t?"NumberEditor":"JsonEditor"}},components:{JsonEditor:c.a,NumberEditor:d.a,StringEditor:f.a}}},56:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"number-string",props:{label:String,value:String,update:Function}}}},[47]);
//# sourceMappingURL=app.938593437e63f92ad85a.js.map
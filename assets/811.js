"use strict";(self.webpackChunksingsongsangsong=self.webpackChunksingsongsangsong||[]).push([[811],{9145:(e,t,n)=>{n.r(t)},9116:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.addFloatingButonListener=void 0;const o=n(3636),l=n(1200);n(9145);const r=[],i=(0,o.icon)(l.faChevronUp).html[0],a=(0,o.icon)(l.faHome).html[0];t.addFloatingButonListener=function(e){r.push(e)},t.default=function(e="home"){var t;const n=null!==(t=document.querySelector(".floating-btn"))&&void 0!==t?t:(()=>{const e=document.createElement("button");return e.className="floating-btn",e.addEventListener("click",(()=>r.forEach((e=>e())))),document.body.appendChild(e),e})();var o;return o=e,n.innerHTML="home"===o?a:i,e}},1631:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0});const o=n(3636),l=n(134);t.default=function(){const e=document.createElement("footer");return e.innerHTML='<p style="font-size: 11px; line-height:9px; height: 65px;">Copyright (C) 2024 Shuru<br>\n    주식회사 슈르 | 대표이사 임수빈 | 사업자등록번호 : 693-86-02236 |<br> business@shuru.co.kr | 서울특별시 가산디지털 1로 119 B동 806호\n    <br> 본 사이트는 비영리로 운영됩니다. </p>\n        <div class="icons">\n            <a class="twitter" href="https://twitter.com/messages/compose?recipient_id=1175998448841056256"></a>\n        </div>',e.querySelector("a.twitter").innerHTML=(0,o.icon)(l.faTwitter).html[0],e}},931:function(e,t,n){var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const l=o(n(5116));n(9145),t.default=function(e){var t;const n=null!==(t=document.querySelector(".floating-btn.notice"))&&void 0!==t?t:(()=>{const e=document.createElement("button");return e.className="floating-btn notice",e.innerHTML=`<div class="content"></div><div class="icon"><img src="${l.default}"></div>`,document.body.appendChild(e),e})();window.addEventListener("click",(e=>{let t=e.target;for(;null!=t;){if(t===n)return void(n.classList.contains("active")?n.classList.remove("active"):n.classList.add("active"));t=t.parentNode}n.classList.remove("active")}));const o=e=>{n.querySelector(".content").innerHTML=e};return o(e),o}},2226:function(e,t,n){var o=this&&this.__createBinding||(Object.create?function(e,t,n,o){void 0===o&&(o=n);var l=Object.getOwnPropertyDescriptor(t,n);l&&!("get"in l?!t.__esModule:l.writable||l.configurable)||(l={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,o,l)}:function(e,t,n,o){void 0===o&&(o=n),e[o]=t[n]}),l=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),r=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&o(t,e,n);return l(t,e),t},i=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(l,r){function i(e){try{c(o.next(e))}catch(t){r(t)}}function a(e){try{c(o.throw(e))}catch(t){r(t)}}function c(e){var t;e.done?l(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,a)}c((o=o.apply(e,t||[])).next())}))},a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.setupPostBoard=t.fillPlaceholderSectionInto=t.preparePlaceholderSection=void 0;const c=r(n(8284)),s=a(n(4130)),d=a(n(1631));n(6019);const u=a(n(7410)),f=a(n(4412)),p=n(3636),h=n(1200);p.library.add(h.faArrowLeft,h.faArrowRight);const v=e=>{let t=[["k",Math.pow(10,3)],["M",Math.pow(10,6)],["G",Math.pow(10,9)],["T",Math.pow(10,12)],["P",Math.pow(10,15)],["E",Math.pow(10,18)],["Z",Math.pow(10,21)],["Y",Math.pow(10,24)],["R",Math.pow(10,27)],["Q",Math.pow(10,30)]].reverse();for(let n=0;n<t.length;n++){const o=t[n];if(e>=o[1]){let t=Math.floor(e/o[1]).toString(),n=e%o[1],l=Math.max(3-t.length,0),r=n.toString().substring(0,l);return t+(""!==r?"."+r:"")+o[0]}}return e.toString()};function g(e,t=[{landscape:!0,count:1},{landscape:!1,count:8}],n=!0){e.innerHTML="",e.classList.add("post-section"),e.appendChild(document.createElement("h2"));for(let o of t){const t=document.createElement("div");t.innerHTML='<button class="floating-btn-scrollX left"><i class="fa-solid fa-arrow-left"></i></button><button class="floating-btn-scrollX right"><i class="fa-solid fa-arrow-right"></i></button>',t.querySelectorAll("button.floating-btn-scrollX").forEach((e=>{e.addEventListener("click",(()=>{e.parentElement.scrollBy({behavior:"smooth",left:(parseInt(getComputedStyle(e.parentElement.querySelector(".wrapper")).width)+16)*(e.classList.contains("left")?-1:1),top:0})}))})),t.className="post-table"+(o.landscape?" landscape":" portrait");for(let e=0;e<o.count;e++){const e=document.createElement("div");e.className="chalk-bordered "+(o.landscape?"landscape":"portrait");const n=document.createElement("a");n.href="quiz.html",o.landscape?n.className="table-cell landscape":n.className="table-cell portrait",n.draggable=!1;const l=document.createElement("div");l.className="cell-info",l.innerHTML=`<div class="title"></div><div class="popularity-and-like-button"><div class="popularity"><div class="views"><img class="icon" src="${u.default}"><span class="view-count" /></div></div><a href="#" class="like-button"><img class="icon" src="${f.default}"></a></div>`;const r=document.createElement("div");r.className="shadow";const i=document.createElement("div");i.className="wrapper "+(o.landscape?"landscape":""),i.appendChild(e),i.appendChild(r),t.appendChild(i),e.appendChild(n),n.appendChild(l)}e.appendChild(t)}n&&e.classList.add("placeholder"),e.dataset.rowInfos=JSON.stringify(t),setTimeout((()=>{p.dom.i2svg()}),500)}function m(e){var t;return i(this,void 0,void 0,(function*(){const n=yield function(e){return new Promise(((t,n)=>{const o=new Image;o.addEventListener("load",(e=>{const n=new OffscreenCanvas(o.width,o.height),l=n.getContext("2d");if(null===l)throw new Error("null canvas context");n.width=o.width,n.height=o.height,l.drawImage(o,0,0);try{t(l.getImageData(0,0,o.width,o.height))}catch(r){}})),o.src=e}))}(e);let o=[0,0,0];for(let e=0;e<n.data.length;e+=4)for(let l=0;l<3;l++)o[l]+=null!==(t=n.data[4*e+l])&&void 0!==t?t:0;return o.map((e=>Math.floor(e/Math.floor(n.data.length/4))))}))}function b(e,t,n=!1){var o,l;const r=null!==e.landscape&&void 0!==e.landscape,i=null!==e.portraits&&void 0!==e.portraits&&e.portraits.length>0,a=[];r&&a.push({landscape:!0,count:1}),i&&a.push({landscape:!1,count:e.portraits.length}),g(t,a,!1);const c=e=>{e.classList.add("liked"),setTimeout((()=>{e.classList.remove("liked")}),200)};if(null===e.title||void 0===e.title||0===e.title.trim().length?(t.querySelector("h2").textContent="도전! 고인물 테스트",t.querySelector("h2").style.marginTop="-32px"):t.querySelector("h2").textContent=e.title,r){const l=t.querySelector(".table-cell.landscape");l.style.backgroundImage=`url("${e.landscape.imgUrl}")`,m(e.landscape.imgUrl).then((([e,t,n])=>{l.style.setProperty("--representing-color",`${e}, ${t}, ${n}`)})),l.href=e.landscape.href,l.dataset.id=e.landscape.id.toString(),null===(o=l.querySelector(".like-button"))||void 0===o||o.addEventListener("click",(t=>{t.preventDefault(),s.default.like(e.landscape.id).then((()=>{c(l.querySelector(".like-button"))}))})),l.querySelector(".cell-info .title").innerHTML=e.landscape.title,n?l.classList.add("no-cell-popularity-info"):l.querySelector(".cell-info .view-count").innerHTML=v(e.landscape.views).toString()}if(i){const o=[...t.querySelectorAll(".table-cell.portrait")];for(const t of o){const o=e.portraits.shift();if(void 0===o)break;t.href=o.href,t.dataset.id=o.id.toString(),t.style.setProperty("--background-img",`url("${o.imgUrl}")`),t.classList.add("lazy-bg"),o.nerdTest||t.classList.add("non-nerd-test"),t.querySelector(".cell-info .title").innerHTML=o.title,null===(l=t.querySelector(".like-button"))||void 0===l||l.addEventListener("click",(e=>{e.preventDefault(),s.default.like(o.id).then((()=>{c(t.querySelector(".like-button"))}))})),n?t.classList.add("no-cell-popularity-info"):t.querySelector(".cell-info .view-count").innerHTML=v(o.views).toString(),t.classList.add("filled")}o.filter((e=>!e.classList.contains("filled"))).forEach((e=>{var t;return null===(t=e.parentNode)||void 0===t?void 0:t.removeChild(e)}));const r=new IntersectionObserver((e=>{e.filter((e=>e.intersectionRatio>0)).map((e=>e.target)).filter((e=>e.classList.contains("lazy-bg"))).forEach((e=>{e.classList.remove("lazy-bg"),e.style.backgroundImage=e.style.getPropertyValue("--background-img"),m(/url\("(.+)"\)/.exec(e.style.backgroundImage)[1]).then((([t,n,o])=>{e.style.setProperty("--representing-color",`${t}, ${n}, ${o}`)}))}))}),{rootMargin:"10% 10% 10% 10%"});for(const e of[...t.querySelectorAll(".lazy-bg")])r.observe(e)}let d=new IntersectionObserver((function(e){const t=e.filter((e=>e.intersectionRatio>0)).map((e=>e.target.dataset.id));for(const n of t)u.includes(n)||s.default.hit(n);u=t}));for(const s of[...t.querySelectorAll(".table-cell")])d.observe(s);let u=[]}t.preparePlaceholderSection=g,t.fillPlaceholderSectionInto=b;class y extends c.ScrollbarPlugin{transformDelta(e,t){return"touchend"!==t.type?e:{x:e.x*this.options.speed,y:e.y*this.options.speed}}}y.pluginName="mobile",y.defaultOptions={speed:.5},c.default.use(y),t.setupPostBoard=function(e,t){let n=!1;const o=document.createElement("div");o.style.height="100vh",e.appendChild(o);const l=c.default.init(o,{alwaysShowTracks:!1,damping:.27,plugins:{mobile:{speed:.2}}});l.track.yAxis.element.remove();const r=l.contentEl;function i(e){if(null===e||n)return n=!0,[...r.querySelectorAll("section.placeholder")].forEach((e=>{var t;return null===(t=e.parentNode)||void 0===t?void 0:t.removeChild(e)})),null===r.querySelector("footer")&&r.appendChild((0,d.default)());b(e,function(e=!0){a();const t=r.querySelector("section.placeholder");e&&t.classList.remove("placeholder");return a(),t}())}function a(){let e=[...r.querySelectorAll("section.placeholder")].length;if(e>=2||n)return;const t=2-e;for(let n=0;n<t;n++){var o=document.createElement("section");return g(o),void r.appendChild(o)}}!function e(){n||t().then(i).then(e)}()}},6019:function(e,t,n){var o=this&&this.__createBinding||(Object.create?function(e,t,n,o){void 0===o&&(o=n);var l=Object.getOwnPropertyDescriptor(t,n);l&&!("get"in l?!t.__esModule:l.writable||l.configurable)||(l={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,o,l)}:function(e,t,n,o){void 0===o&&(o=n),e[o]=t[n]}),l=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),r=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&o(t,e,n);return l(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.ScrollLockPlugin=void 0;const i=r(n(8284));class a extends i.ScrollbarPlugin{transformDelta(e){return{x:this.options.x_locked?0:e.x,y:this.options.y_locked?0:e.y}}}t.ScrollLockPlugin=a,a.pluginName="scroll-lock",a.defaultOptions={x_locked:!1,y_locked:!1},i.default.use(a)},5116:(e,t,n)=>{e.exports=n.p+"67a2c0459297a37d6d8c.svg"},7410:(e,t,n)=>{e.exports=n.p+"3fd011cb75dcf1c62a7d.svg"},4412:(e,t,n)=>{e.exports=n.p+"69049553335ec0c185d1.svg"}}]);
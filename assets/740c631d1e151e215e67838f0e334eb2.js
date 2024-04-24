(()=>{"use strict";var e,t={9145:(e,t,n)=>{n.r(t)},6793:(e,t,n)=>{n.r(t)},9116:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.addFloatingButonListener=void 0;const o=n(3636),r=n(1200);n(9145);const l=[],i=(0,o.icon)(r.faChevronUp).html[0],a=(0,o.icon)(r.faHome).html[0];t.addFloatingButonListener=function(e){l.push(e)},t.default=function(e="home"){var t;const n=null!==(t=document.querySelector(".floating-btn"))&&void 0!==t?t:(()=>{const e=document.createElement("button");return e.className="floating-btn",e.addEventListener("click",(()=>l.forEach((e=>e())))),document.body.appendChild(e),e})();var o;return o=e,n.innerHTML="home"===o?a:i,e}},931:function(e,t,n){var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const r=o(n(5116));n(9145),t.default=function(e){var t;const n=null!==(t=document.querySelector(".floating-btn.notice"))&&void 0!==t?t:(()=>{const e=document.createElement("button");return e.className="floating-btn notice",e.innerHTML=`<div class="content"></div><div class="icon"><img src="${r.default}"></div>`,document.body.appendChild(e),e})();window.addEventListener("click",(e=>{let t=e.target;for(;null!=t;){if(t===n)return void(n.classList.contains("active")?n.classList.remove("active"):n.classList.add("active"));t=t.parentNode}n.classList.remove("active")}));const o=e=>{n.querySelector(".content").innerHTML=e};return o(e),o}},59:function(e,t,n){var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),n(6793);const r=n(3039),l=o(n(2161)),i=o(n(3981)),a=n(3636),c=n(1200),s=o(n(4130)),d=n(9111),u=n(9116),f=o(n(931));(0,r.InitTopNav)(!1),(0,f.default)('5월 5일 23시 59분까지 1등을 유지하신 분께,  "당신의 최애 장르 공식 굿즈 10만 원 상당"을 이벤트 선물로 드립니다!'),(0,u.addFloatingButonListener)((()=>location.href="/")),document.querySelector(".pushpin img").src=l.default,document.querySelector("img.h1-border").src=i.default,a.library.add(c.faSearch),a.dom.i2svg({node:document.querySelector(".paper .search-icon")});let m=[],v=[];const p=["first","second","third"];let h="";const g=e=>{const t=m.indexOf(e);(0===t?[t,t+1,t+2]:t===m.length-1?[t-2,t-1,t]:[t-1,t,t+1]).map((e=>{const n=e===t;for(;e<0;)e+=m.length;return e%=m.length,{label:m[e],active:n}})).forEach(((e,t)=>{const n=document.querySelector(`nav.categories button:nth-child(${t+1})`);n.textContent=e.label,n.dataset.label=e.label,e.active?null==n||n.classList.add("active"):null==n||n.classList.remove("active")}))},y=(e,t)=>{var n;const o=document.createElement("tbody"),r=v.filter((t=>!e||`${t.nickname}#${t.hashtag}`.includes(e)));if(0==r.length){const e=document.querySelector(".rankings tbody");for(;null==e?void 0:e.firstChild;)e.removeChild(e.firstChild)}r.map(((e,t)=>{const n=document.createElement("tr"),o=t+1,r=p[t];return r&&n.classList.add(r),n.innerHTML=`<td class="ranking">${1==o||2==o||3==o?"":t+1}</td><td class="nickname">${(0,d.encode)(e.nickname)}#${e.hashtag}</td><td class="score">${e.score}</td>`,n})).forEach(((e,t,n)=>{const r=document.createElement("tr");r.className="padding",o.appendChild(e),t!==n.length-1&&o.appendChild(r)})),(t||r.length>0)&&(null===(n=document.querySelector("table.rankings"))||void 0===n||n.replaceChild(o,document.querySelector("table.rankings tbody")))};function b(e){const t=document.querySelector(".rankings tbody"),n=null==t?void 0:t.querySelectorAll("tr");null!==t&&null!=n&&(t.style.display="display-none",n.forEach((t=>{var n;const o=null===(n=t.querySelector(".nickname"))||void 0===n?void 0:n.textContent;null!=o&&(o.includes(e)?(t.style.display="",t.nextElementSibling&&(t.nextElementSibling.style.display="")):(t.style.display="none",t.nextElementSibling&&(t.nextElementSibling.style.display="none")))})),t.style.display="")}s.default.getRankings().then((e=>{var t;const n=Object.keys(e);m=[n[0],n[2],n[1]],[...document.querySelectorAll("nav.categories")].forEach((t=>{t.addEventListener("mousedown",(t=>{const n=t.target.dataset.label;g(n),v=e[n],y(void 0,!0),b(h)}))})),null===(t=document.querySelector(".search input"))||void 0===t||t.addEventListener("input",(e=>{h=e.target.value,b(h)})),g(m[0]),v=e[m[0]],y(void 0,!0)}))},3039:function(e,t,n){var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.InitTopBottomAnimation=t.initClipPathBugfix=t.InitTopNav=t.SetCustomGoBackHandler=t.SetCustomRankingHandler=void 0;const r=n(3636),l=n(1200),i=o(n(1051));n(3751);const a=o(n(8284)),c=o(n(5467));let s=null,d=null;function u(e){let t=!1,n=!0;[...document.querySelectorAll(".column")].forEach((function(o){var r,l=0;null===(r=a.default.get(o.querySelector("[data-scrollbar]")))||void 0===r||r.addListener((o=>{var r=o.offset.y;if(n)return n=!1,void(l=r<=0?0:r);r>l+15?t||(e.style.transform="translateX(-50%) translateY(-30%)",t=!0):r<l-15&&t&&(e.style.transform="translateX(-50%) translateY(0%)",t=!1),t?e.classList.add("is-hidden"):e.classList.remove("is-hidden"),l=r<=0?0:r}))}))}function f(){var e;null===(e=document.querySelector("nav"))||void 0===e||e.classList.remove("no-js")}t.SetCustomRankingHandler=function(e){s=e},t.SetCustomGoBackHandler=function(e){d=e},t.InitTopNav=function(e=!1){var t,n,o;const a=document.getElementById("topFixedBar");if(r.library.add(l.faMagnifyingGlass,l.faChevronLeft),r.dom.i2svg({node:a}),[...document.querySelectorAll(".ranking-icon")].forEach((e=>e.src=c.default)),null===(t=a.querySelector(".ranking-icon"))||void 0===t||t.addEventListener("click",(e=>{if(e.preventDefault(),null!==s)return s();location.href="/rankings.html"})),null===(n=a.querySelector(".search-icon"))||void 0===n||n.addEventListener("click",(e=>{e.preventDefault(),location.href="/search.html"})),null===(o=a.querySelector(".go-back"))||void 0===o||o.addEventListener("click",(e=>{if(e.preventDefault(),null!==d)return d();location.href="/index.html"})),a.addEventListener("click",(e=>{if("none"===a.style.pointerEvents)return;let t=e.target,n=!1;for(;null!==t;){if(t.nodeType===t.ELEMENT_NODE&&("NAV"===t.nodeName||"BUTTON"===t.nodeName)){n=!0;break}t=t.parentElement}if(!n){a.style.pointerEvents="none";let t=document.elementFromPoint(e.x,e.y);null!==t&&"click"in t&&t.click(),a.style.pointerEvents=""}})),null==a.querySelector(".search-icon"))return;const f=(0,i.default)(a.querySelector(".search-icon"),{content:"내 장르 찾기!",placement:"left"});"/"===location.pathname&&setTimeout((()=>{f.show(),setTimeout((()=>{f.hide()}),800)}),100),e&&u(a)},t.initClipPathBugfix=function(e){const t=()=>{const n=document.querySelector(".main-container");if(null===n)return window.requestAnimationFrame(t);const o=e.querySelector("nav"),r=document.documentElement.scrollTop+o.getBoundingClientRect().height+25;n.style.clipPath=`xywh(0px ${r}px 200% 200%)`,window.requestAnimationFrame(t)};window.requestAnimationFrame(t)},t.InitTopBottomAnimation=u,document.addEventListener("DOMContentLoaded",(()=>{setTimeout((()=>{f()}),500)})),setTimeout((()=>{f()}),6e3)},5116:(e,t,n)=>{e.exports=n.p+"67a2c0459297a37d6d8c.svg"},2161:(e,t,n)=>{e.exports=n.p+"587d65112b64c0b26826.png"},5467:(e,t,n)=>{e.exports=n.p+"2bb1ee5b7bfabea91204.svg"},3981:(e,t,n)=>{e.exports=n.p+"c868e7bd40659a5a2cbd.svg"}},n={};function o(e){var r=n[e];if(void 0!==r)return r.exports;var l=n[e]={exports:{}};return t[e].call(l.exports,l,l.exports,o),l.exports}o.m=t,e=[],o.O=(t,n,r,l)=>{if(!n){var i=1/0;for(d=0;d<e.length;d++){for(var[n,r,l]=e[d],a=!0,c=0;c<n.length;c++)(!1&l||i>=l)&&Object.keys(o.O).every((e=>o.O[e](n[c])))?n.splice(c--,1):(a=!1,l<i&&(i=l));if(a){e.splice(d--,1);var s=r();void 0!==s&&(t=s)}}return t}l=l||0;for(var d=e.length;d>0&&e[d-1][2]>l;d--)e[d]=e[d-1];e[d]=[n,r,l]},o.d=(e,t)=>{for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;o.g.importScripts&&(e=o.g.location+"");var t=o.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");if(n.length)for(var r=n.length-1;r>-1&&!e;)e=n[r--].src}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),o.p=e})(),(()=>{var e={153:0};o.O.j=t=>0===e[t];var t=(t,n)=>{var r,l,[i,a,c]=n,s=0;if(i.some((t=>0!==e[t]))){for(r in a)o.o(a,r)&&(o.m[r]=a[r]);if(c)var d=c(o)}for(t&&t(n);s<i.length;s++)l=i[s],o.o(e,l)&&e[l]&&e[l][0](),e[l]=0;return o.O(d)},n=self.webpackChunksingsongsangsong=self.webpackChunksingsongsangsong||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var r=o.O(void 0,[803,630,111,130],(()=>o(59)));r=o.O(r)})();
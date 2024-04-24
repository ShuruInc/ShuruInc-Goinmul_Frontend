"use strict";(self.webpackChunksingsongsangsong=self.webpackChunksingsongsangsong||[]).push([[636],{4268:(e,t,n)=>{n.r(t)},9196:function(e,t,n){var s=this&&this.__awaiter||function(e,t,n,s){return new(n||(n=Promise))((function(i,o){function a(e){try{l(s.next(e))}catch(t){o(t)}}function r(e){try{l(s.throw(e))}catch(t){o(t)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,r)}l((s=s.apply(e,t||[])).next())}))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.QuizSession=void 0;const o=n(1752),a=i(n(4285)),r=new(n(7091).Api)({baseUrl:o.backendUrl});t.QuizSession=class{constructor(e){this.sessionId="",this.sessionId=e,this.stopwatch=new a.default(e),this.stopwatch.start(),this.posted=!1,this.sentEmail=!1}getStopWatch(){return this.stopwatch}static hasSession(e){return null!==localStorage.getItem(`session-${e}`)}getLocalSession(){var e;return JSON.parse(null!==(e=localStorage.getItem(`session-${this.sessionId}`))&&void 0!==e?e:"{}")}saveLocalSession(e){localStorage.setItem(`session-${this.sessionId}`,JSON.stringify(e))}problems(){var e;return JSON.parse(null!==(e=localStorage.getItem(`problems-${this.getLocalSession().quizId}`))&&void 0!==e?e:"[]")}getProblems(){return this.problems()}ended(){return this.getLocalSession().problemIndex>=this.problems().length||this.getLocalSession().nerdTest&&this.stopwatch.elapsed()>=6e4||o.nerdTestExitFeatureEnabled&&this.getLocalSession().forcedEnded}forcedEnd(){this.saveLocalSession(Object.assign(Object.assign({},this.getLocalSession()),{forcedEnded:!0}))}sessionInfo(){return s(this,void 0,void 0,(function*(){return{isNerdTest:this.getLocalSession().nerdTest,totalProblemCount:this.getLocalSession().nerdTest?void 0:this.problems().length,quizId:this.getLocalSession().quizId,title:this.getLocalSession().title,category:this.getLocalSession().category}}))}firstCategory(){var e;return s(this,void 0,void 0,(function*(){const t=this.getLocalSession().quizId,n=yield r.getArticle(parseInt(t)),s=this.getLocalSession().nerdTest?this.getLocalSession().category:null===(e=n.data.result)||void 0===e?void 0:e.parentCategoryNm,i=(yield r.getFirstCategories()).data.result.find((e=>e.categoryNm===s)).id;return{name:s,id:i}}))}currentProblem(){return s(this,void 0,void 0,(function*(){return this.ended()?null:Object.assign(Object.assign({},this.problems()[this.getLocalSession().problemIndex]),{index:this.getLocalSession().problemIndex+1})}))}submit(e,t){return s(this,void 0,void 0,(function*(){let n=(yield r.getAnswers((yield this.currentProblem()).id,{answer:e,problemType:t?"SUBJECTIVE":"MULTIPLE_CHOICE"})).data.result,s=this.getLocalSession().problemIndex+1,i=this.getLocalSession().points+(n.correct?10:0);return this.saveLocalSession(Object.assign(Object.assign({},this.getLocalSession()),{problemIndex:s,points:i})),n}))}submitEmail(e){return s(this,void 0,void 0,(function*(){yield r.saveTempEmail({email:e}),this.sentEmail=!0}))}postRank(){return s(this,void 0,void 0,(function*(){const e=this.getLocalSession();if(e.postedRank)return;const t=yield r.postRank({articleId:parseInt(e.quizId),articleType:e.nerdTest?"NERD":"NORMAL",score:e.points}),n=this.getLocalSession().nerdTest?t.data.result.score:this.getLocalSession().points;this.saveLocalSession(Object.assign(Object.assign({},e),{postedRank:!0,hashtag:t.data.result.nicknameHashtag,ranking:{comment:t.data.result.comment,percentage:t.data.result.percentile,rank:t.data.result.rank},points:n}))}))}getImageLinks(){return s(this,void 0,void 0,(function*(){return this.problems().filter((e=>"image"===e.figureType)).map((e=>e.figure))}))}result(){var e;return s(this,void 0,void 0,(function*(){return this.ended()?(this.posted||(yield this.postRank(),this.posted=!0),Object.assign({points:this.getLocalSession().points,title:this.getLocalSession().title,quizId:this.getLocalSession().quizId,category:this.getLocalSession().category,comment:null!==(e=this.getLocalSession().ranking.comment)&&void 0!==e?e:""},this.getLocalSession().nerdTest?{ranking:this.getLocalSession().ranking.rank,hashtag:this.getLocalSession().hashtag,nickname:this.getLocalSession().nickname}:{percentage:this.getLocalSession().ranking.percentage})):null}))}getSessionId(){return this.sessionId}getSentEmail(){return this.sentEmail}}},1039:function(e,t,n){var s=this&&this.__awaiter||function(e,t,n,s){return new(n||(n=Promise))((function(i,o){function a(e){try{l(s.next(e))}catch(t){o(t)}}function r(e){try{l(s.throw(e))}catch(t){o(t)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,r)}l((s=s.apply(e,t||[])).next())}))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=i(n(8492));t.default=function(e,t=o.default){return s(this,void 0,void 0,(function*(){let n=Math.max(e.width,e.height),s=(n-e.width)/2,i=(n-e.height)/2;const o=new Image;o.src=t;const a="undefined"==typeof OffscreenCanvas?(()=>{const e=document.createElement("canvas");return e.width=n,e.height=n,e})():new OffscreenCanvas(n,n),r=a.getContext("2d");if(r.drawImage(o,0,0,n,n),r.drawImage(e,s,i),"convertToBlob"in a)return yield a.convertToBlob({type:"image/png"});if("toBlob"in a)return yield new Promise(((e,t)=>{a.toBlob((n=>{null===n?t():e(n)}),"image/png",1)}));throw new Error}))}},4285:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0});t.default=class{constructor(e){this.id=e}getInternalState(){var e;return JSON.parse(null!==(e=localStorage.getItem(`stopwatch-${this.id}`))&&void 0!==e?e:"{}")}setInternalState(e){localStorage.setItem(`stopwatch-${this.id}`,JSON.stringify(e))}start(){void 0===this.getInternalState().startedAt&&this.setInternalState(Object.assign(Object.assign({},this.getInternalState()),{startedAt:Date.now()}))}pause(){this.setInternalState(Object.assign(Object.assign({},this.getInternalState()),{pausedAt:Date.now()}))}resume(){var e;let t=this.getInternalState();void 0!==t.pausedAt&&(t.negativeDelta=(null!==(e=t.negativeDelta)&&void 0!==e?e:0)+(Date.now()-t.pausedAt),delete t.pausedAt,this.setInternalState(t))}stop(){this.setInternalState(Object.assign(Object.assign({},this.getInternalState()),{stoppedAt:Date.now()}))}elapsed(){var e,t,n,s;const i=this.getInternalState(),o=Date.now();return(null!==(t=null!==(e=i.stoppedAt)&&void 0!==e?e:i.pausedAt)&&void 0!==t?t:o)-(null!==(n=i.startedAt)&&void 0!==n?n:o)-(null!==(s=i.negativeDelta)&&void 0!==s?s:0)}}},3039:function(e,t,n){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.InitTopBottomAnimation=t.initClipPathBugfix=t.InitTopNav=t.SetCustomGoBackHandler=t.SetCustomRankingHandler=void 0;const i=n(3636),o=n(1200),a=s(n(1051));n(3751);const r=s(n(8284)),l=s(n(5467));let c=null,d=null;function u(e){let t=!1,n=!0;[...document.querySelectorAll(".column")].forEach((function(s){var i,o=0;null===(i=r.default.get(s.querySelector("[data-scrollbar]")))||void 0===i||i.addListener((s=>{var i=s.offset.y;if(n)return n=!1,void(o=i<=0?0:i);i>o+15?t||(e.style.transform="translateX(-50%) translateY(-30%)",t=!0):i<o-15&&t&&(e.style.transform="translateX(-50%) translateY(0%)",t=!1),t?e.classList.add("is-hidden"):e.classList.remove("is-hidden"),o=i<=0?0:i}))}))}function h(){var e;null===(e=document.querySelector("nav"))||void 0===e||e.classList.remove("no-js")}t.SetCustomRankingHandler=function(e){c=e},t.SetCustomGoBackHandler=function(e){d=e},t.InitTopNav=function(e=!1){var t,n,s;const r=document.getElementById("topFixedBar");if(i.library.add(o.faMagnifyingGlass,o.faChevronLeft),i.dom.i2svg({node:r}),[...document.querySelectorAll(".ranking-icon")].forEach((e=>e.src=l.default)),null===(t=r.querySelector(".ranking-icon"))||void 0===t||t.addEventListener("click",(e=>{if(e.preventDefault(),null!==c)return c();location.href="/rankings.html"})),null===(n=r.querySelector(".search-icon"))||void 0===n||n.addEventListener("click",(e=>{e.preventDefault(),location.href="/search.html"})),null===(s=r.querySelector(".go-back"))||void 0===s||s.addEventListener("click",(e=>{if(e.preventDefault(),null!==d)return d();location.href="/index.html"})),r.addEventListener("click",(e=>{if("none"===r.style.pointerEvents)return;let t=e.target,n=!1;for(;null!==t;){if(t.nodeType===t.ELEMENT_NODE&&("NAV"===t.nodeName||"BUTTON"===t.nodeName)){n=!0;break}t=t.parentElement}if(!n){r.style.pointerEvents="none";let t=document.elementFromPoint(e.x,e.y);null!==t&&"click"in t&&t.click(),r.style.pointerEvents=""}})),null==r.querySelector(".search-icon"))return;const h=(0,a.default)(r.querySelector(".search-icon"),{content:"내 장르 찾기!",placement:"left"});"/"===location.pathname&&setTimeout((()=>{h.show(),setTimeout((()=>{h.hide()}),800)}),100),e&&u(r)},t.initClipPathBugfix=function(e){const t=()=>{const n=document.querySelector(".main-container");if(null===n)return window.requestAnimationFrame(t);const s=e.querySelector("nav"),i=document.documentElement.scrollTop+s.getBoundingClientRect().height+25;n.style.clipPath=`xywh(0px ${i}px 200% 200%)`,window.requestAnimationFrame(t)};window.requestAnimationFrame(t)},t.InitTopBottomAnimation=u,document.addEventListener("DOMContentLoaded",(()=>{setTimeout((()=>{h()}),500)})),setTimeout((()=>{h()}),6e3)},3964:(e,t,n)=>{e.exports=n.p+"8a2096fdfbd41e606bed.svg"},8492:(e,t,n)=>{e.exports=n.p+"693063f3d37ce88eead6.jpg"},5467:(e,t,n)=>{e.exports=n.p+"2bb1ee5b7bfabea91204.svg"}}]);
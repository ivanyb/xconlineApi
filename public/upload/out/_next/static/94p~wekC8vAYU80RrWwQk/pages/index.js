(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{109:function(t,e,r){t.exports=r(211)},110:function(t,e,r){t.exports=r(38)},12:function(t,e,r){t.exports=r(68)},207:function(t,e,r){__NEXT_REGISTER_PAGE("/",function(){return t.exports=r(208),{page:t.exports.default}})},208:function(t,e,r){"use strict";r.r(e),r.d(e,"default",function(){return w});var n=r(12),o=r.n(n),i=r(0),a=r.n(i),s=(r(209),r(109)),u=r.n(s),f=r(110),c=r.n(f),l=r(51);function p(t){return(p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function h(t,e,r,n,o,i,a){try{var s=t[i](a),u=s.value}catch(t){return void r(t)}s.done?e(u):Promise.resolve(u).then(n,o)}function d(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function y(t){return(y=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function b(t,e){return(b=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function m(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function v(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}var w=function(t){function e(){var t,r,n,o;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e);for(var i=arguments.length,a=new Array(i),s=0;s<i;s++)a[s]=arguments[s];return n=this,o=(t=y(e)).call.apply(t,[this].concat(a)),r=!o||"object"!==p(o)&&"function"!=typeof o?m(n):o,v(m(m(r)),"state",{cateList:r.props.cateList1.catelist}),v(m(m(r)),"getdata",function(){fetch("http://157.122.54.189:9092/nc/course/home/getcourselist").then(function(t){return t.json()}).then(function(t){r.setState({cateList:t.message.types})})}),r}var r,n,i,s,f;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&b(t,e)}(e,a.a.Component),r=e,n=[{key:"componentWillMount",value:function(){}},{key:"render",value:function(){return a.a.createElement("div",null,a.a.createElement("button",{onClick:function(){c.a.push({pathname:"/lesson/lessonlist",query:{cateid:41}})}},"点击进入课程列表"),a.a.createElement(u.a,{prefetch:!0,href:{pathname:"/lesson/lessonlist",query:{cateid:40}}},a.a.createElement("div",null,a.a.createElement("a",{style:{fontSize:20},href:"javascript:void(0)"},"点击进入课程列表"))),a.a.createElement("span",{onClick:this.getdata},"点击更新分类数据"),a.a.createElement("ul",null,this.state.cateList.length>0?this.state.cateList.map(function(t,e){return a.a.createElement("li",{key:e},a.a.createElement("a",{href:"javascript:void(0)"},t.id,"-",t.title," "))}):a.a.createElement("li",null,"没有数据")))}}],i=[{key:"getInitialProps",value:(s=o.a.mark(function t(e){var r;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.req,e.store,e.ctx,t.next=3,Object(l.a)();case 3:return r=t.sent,t.abrupt("return",{cateList1:r.message});case 5:case"end":return t.stop()}},t,this)}),f=function(){var t=this,e=arguments;return new Promise(function(r,n){var o=s.apply(t,e);function i(t){h(o,r,n,i,a,"next",t)}function a(t){h(o,r,n,i,a,"throw",t)}i(void 0)})},function(t){return f.apply(this,arguments)})}],n&&d(r.prototype,n),i&&d(r,i),e}()},209:function(t,e,r){r(210),t.exports=self.fetch.bind(self)},210:function(t,e,r){"use strict";r.r(e),r.d(e,"Headers",function(){return f}),r.d(e,"Request",function(){return b}),r.d(e,"Response",function(){return v}),r.d(e,"DOMException",function(){return E}),r.d(e,"fetch",function(){return _});var n={searchParams:"URLSearchParams"in self,iterable:"Symbol"in self&&"iterator"in Symbol,blob:"FileReader"in self&&"Blob"in self&&function(){try{return new Blob,!0}catch(t){return!1}}(),formData:"FormData"in self,arrayBuffer:"ArrayBuffer"in self};if(n.arrayBuffer)var o=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],i=ArrayBuffer.isView||function(t){return t&&o.indexOf(Object.prototype.toString.call(t))>-1};function a(t){if("string"!=typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(t))throw new TypeError("Invalid character in header field name");return t.toLowerCase()}function s(t){return"string"!=typeof t&&(t=String(t)),t}function u(t){var e={next:function(){var e=t.shift();return{done:void 0===e,value:e}}};return n.iterable&&(e[Symbol.iterator]=function(){return e}),e}function f(t){this.map={},t instanceof f?t.forEach(function(t,e){this.append(e,t)},this):Array.isArray(t)?t.forEach(function(t){this.append(t[0],t[1])},this):t&&Object.getOwnPropertyNames(t).forEach(function(e){this.append(e,t[e])},this)}function c(t){if(t.bodyUsed)return Promise.reject(new TypeError("Already read"));t.bodyUsed=!0}function l(t){return new Promise(function(e,r){t.onload=function(){e(t.result)},t.onerror=function(){r(t.error)}})}function p(t){var e=new FileReader,r=l(e);return e.readAsArrayBuffer(t),r}function h(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function d(){return this.bodyUsed=!1,this._initBody=function(t){var e;this._bodyInit=t,t?"string"==typeof t?this._bodyText=t:n.blob&&Blob.prototype.isPrototypeOf(t)?this._bodyBlob=t:n.formData&&FormData.prototype.isPrototypeOf(t)?this._bodyFormData=t:n.searchParams&&URLSearchParams.prototype.isPrototypeOf(t)?this._bodyText=t.toString():n.arrayBuffer&&n.blob&&((e=t)&&DataView.prototype.isPrototypeOf(e))?(this._bodyArrayBuffer=h(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):n.arrayBuffer&&(ArrayBuffer.prototype.isPrototypeOf(t)||i(t))?this._bodyArrayBuffer=h(t):this._bodyText=t=Object.prototype.toString.call(t):this._bodyText="",this.headers.get("content-type")||("string"==typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):n.searchParams&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},n.blob&&(this.blob=function(){var t=c(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?c(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(p)}),this.text=function(){var t,e,r,n=c(this);if(n)return n;if(this._bodyBlob)return t=this._bodyBlob,e=new FileReader,r=l(e),e.readAsText(t),r;if(this._bodyArrayBuffer)return Promise.resolve(function(t){for(var e=new Uint8Array(t),r=new Array(e.length),n=0;n<e.length;n++)r[n]=String.fromCharCode(e[n]);return r.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},n.formData&&(this.formData=function(){return this.text().then(m)}),this.json=function(){return this.text().then(JSON.parse)},this}f.prototype.append=function(t,e){t=a(t),e=s(e);var r=this.map[t];this.map[t]=r?r+", "+e:e},f.prototype.delete=function(t){delete this.map[a(t)]},f.prototype.get=function(t){return t=a(t),this.has(t)?this.map[t]:null},f.prototype.has=function(t){return this.map.hasOwnProperty(a(t))},f.prototype.set=function(t,e){this.map[a(t)]=s(e)},f.prototype.forEach=function(t,e){for(var r in this.map)this.map.hasOwnProperty(r)&&t.call(e,this.map[r],r,this)},f.prototype.keys=function(){var t=[];return this.forEach(function(e,r){t.push(r)}),u(t)},f.prototype.values=function(){var t=[];return this.forEach(function(e){t.push(e)}),u(t)},f.prototype.entries=function(){var t=[];return this.forEach(function(e,r){t.push([r,e])}),u(t)},n.iterable&&(f.prototype[Symbol.iterator]=f.prototype.entries);var y=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];function b(t,e){var r,n,o=(e=e||{}).body;if(t instanceof b){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new f(t.headers)),this.method=t.method,this.mode=t.mode,this.signal=t.signal,o||null==t._bodyInit||(o=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"same-origin",!e.headers&&this.headers||(this.headers=new f(e.headers)),this.method=(r=e.method||this.method||"GET",n=r.toUpperCase(),y.indexOf(n)>-1?n:r),this.mode=e.mode||this.mode||null,this.signal=e.signal||this.signal,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&o)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(o)}function m(t){var e=new FormData;return t.trim().split("&").forEach(function(t){if(t){var r=t.split("="),n=r.shift().replace(/\+/g," "),o=r.join("=").replace(/\+/g," ");e.append(decodeURIComponent(n),decodeURIComponent(o))}}),e}function v(t,e){e||(e={}),this.type="default",this.status=void 0===e.status?200:e.status,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in e?e.statusText:"OK",this.headers=new f(e.headers),this.url=e.url||"",this._initBody(t)}b.prototype.clone=function(){return new b(this,{body:this._bodyInit})},d.call(b.prototype),d.call(v.prototype),v.prototype.clone=function(){return new v(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new f(this.headers),url:this.url})},v.error=function(){var t=new v(null,{status:0,statusText:""});return t.type="error",t};var w=[301,302,303,307,308];v.redirect=function(t,e){if(-1===w.indexOf(e))throw new RangeError("Invalid status code");return new v(null,{status:e,headers:{location:t}})};var E=self.DOMException;try{new E}catch(t){(E=function(t,e){this.message=t,this.name=e;var r=Error(t);this.stack=r.stack}).prototype=Object.create(Error.prototype),E.prototype.constructor=E}function _(t,e){return new Promise(function(r,o){var i=new b(t,e);if(i.signal&&i.signal.aborted)return o(new E("Aborted","AbortError"));var a=new XMLHttpRequest;function s(){a.abort()}a.onload=function(){var t,e,n={status:a.status,statusText:a.statusText,headers:(t=a.getAllResponseHeaders()||"",e=new f,t.replace(/\r?\n[\t ]+/g," ").split(/\r?\n/).forEach(function(t){var r=t.split(":"),n=r.shift().trim();if(n){var o=r.join(":").trim();e.append(n,o)}}),e)};n.url="responseURL"in a?a.responseURL:n.headers.get("X-Request-URL");var o="response"in a?a.response:a.responseText;r(new v(o,n))},a.onerror=function(){o(new TypeError("Network request failed"))},a.ontimeout=function(){o(new TypeError("Network request failed"))},a.onabort=function(){o(new E("Aborted","AbortError"))},a.open(i.method,i.url,!0),"include"===i.credentials?a.withCredentials=!0:"omit"===i.credentials&&(a.withCredentials=!1),"responseType"in a&&n.blob&&(a.responseType="blob"),i.headers.forEach(function(t,e){a.setRequestHeader(e,t)}),i.signal&&(i.signal.addEventListener("abort",s),a.onreadystatechange=function(){4===a.readyState&&i.signal.removeEventListener("abort",s)}),a.send(void 0===i._bodyInit?null:i._bodyInit)})}_.polyfill=!0,self.fetch||(self.fetch=_,self.Headers=f,self.Request=b,self.Response=v)},211:function(t,e,r){"use strict";var n=r(20),o=r(4);Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=o(r(212)),a=o(r(48)),s=o(r(7)),u=o(r(8)),f=o(r(17)),c=o(r(18)),l=o(r(19)),p=o(r(50)),h=o(r(14)),d=r(107),y=n(r(0)),b=(o(r(30)),n(r(38))),m=r(25);var v=function(t){function e(){var t,r,n,o,i,u;(0,s.default)(this,e);for(var l=arguments.length,y=new Array(l),v=0;v<l;v++)y[v]=arguments[v];return r=(0,f.default)(this,(t=(0,c.default)(e)).call.apply(t,[this].concat(y))),(0,h.default)((0,p.default)((0,p.default)(r)),"formatUrls",(n=function(t,e){return{href:t&&"object"===(0,a.default)(t)?(0,d.format)(t):t,as:e&&"object"===(0,a.default)(e)?(0,d.format)(e):e}},o=null,i=null,u=null,function(t,e){if(t===o&&e===i)return u;var r=n(t,e);return o=t,i=e,u=r,r})),(0,h.default)((0,p.default)((0,p.default)(r)),"linkClicked",function(t){var e=t.currentTarget,n=e.nodeName,o=e.target;if("A"!==n||!(o&&"_self"!==o||t.metaKey||t.ctrlKey||t.shiftKey||t.nativeEvent&&2===t.nativeEvent.which)){var i=r.formatUrls(r.props.href,r.props.as),a=i.href,s=i.as;if(function(t){var e=(0,d.parse)(t,!1,!0),r=(0,d.parse)((0,m.getLocationOrigin)(),!1,!0);return!e.host||e.protocol===r.protocol&&e.host===r.host}(a)){var u=window.location.pathname;a=(0,d.resolve)(u,a),s=s?(0,d.resolve)(u,s):a,t.preventDefault();var f=r.props.scroll;null==f&&(f=s.indexOf("#")<0);var c=r.props.replace?"replace":"push";b.default[c](a,s,{shallow:r.props.shallow}).then(function(t){t&&f&&(window.scrollTo(0,0),document.body.focus())}).catch(function(t){r.props.onError&&r.props.onError(t)})}}}),r}return(0,l.default)(e,t),(0,u.default)(e,[{key:"componentDidMount",value:function(){this.prefetch()}},{key:"componentDidUpdate",value:function(t){(0,i.default)(this.props.href)!==(0,i.default)(t.href)&&this.prefetch()}},{key:"prefetch",value:function(){if(this.props.prefetch&&"undefined"!=typeof window){var t=window.location.pathname,e=this.formatUrls(this.props.href,this.props.as).href,r=(0,d.resolve)(t,e);b.default.prefetch(r)}}},{key:"render",value:function(){var t=this,e=this.props.children,r=this.formatUrls(this.props.href,this.props.as),n=r.href,o=r.as;"string"==typeof e&&(e=y.default.createElement("a",null,e));var i=y.Children.only(e),a={onClick:function(e){i.props&&"function"==typeof i.props.onClick&&i.props.onClick(e),e.defaultPrevented||t.linkClicked(e)}};return!this.props.passHref&&("a"!==i.type||"href"in i.props)||(a.href=o||n),a.href&&"undefined"!=typeof __NEXT_DATA__&&__NEXT_DATA__.nextExport&&(a.href=(0,b._rewriteUrlForNextExport)(a.href)),y.default.cloneElement(i,a)}}]),e}(y.Component);e.default=v},212:function(t,e,r){t.exports=r(213)},213:function(t,e,r){var n=r(1),o=n.JSON||(n.JSON={stringify:JSON.stringify});t.exports=function(t){return o.stringify.apply(o,arguments)}},51:function(t,e,r){"use strict";r.d(e,"a",function(){return a});var n=r(12),o=r.n(n);function i(t,e,r,n,o,i,a){try{var s=t[i](a),u=s.value}catch(t){return void r(t)}s.done?e(u):Promise.resolve(u).then(n,o)}function a(){return s.apply(this,arguments)}function s(){var t;return t=o.a.mark(function t(){var e;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch("http://157.122.54.189:9092/nc/course/home/gettopdata").then(function(t){return t.json()});case 2:return e=t.sent,t.abrupt("return",e);case 4:case"end":return t.stop()}},t,this)}),(s=function(){var e=this,r=arguments;return new Promise(function(n,o){var a=t.apply(e,r);function s(t){i(a,n,o,s,u,"next",t)}function u(t){i(a,n,o,s,u,"throw",t)}s(void 0)})}).apply(this,arguments)}}},[[207,1,0]]]);
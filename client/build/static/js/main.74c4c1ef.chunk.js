(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{17:function(e,t,n){e.exports=n(28)},27:function(e,t,n){},28:function(e,t,n){"use strict";n.r(t);var a,r=n(0),i=n.n(r),c=n(15),o=n.n(c),s=n(6),u=n(8),l=n(1),m=function(e){var t=Object(l.f)(),n=Object(l.g)(),a=n.sessionID,r=n.videoUrl,c=function(e){var t=e.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/);return!(!t||11!==t[7].length)&&t[7]};return i.a.createElement("div",null,function(){var n=decodeURIComponent(r),i=c(n);i&&(e.session(i,a,!0),t.push("/watch/leader"))}())},d=(n(27),function(e){var t=Object(r.useState)(e.videoID),n=Object(s.a)(t,2),c=n[0],o=n[1],u=Object(r.useState)({currentTime:0,shouldPause:!1,timestamp:0}),l=Object(s.a)(u,2),m=l[0],d=l[1],v=Object(r.useRef)(),f=function(){a=new window.YT.Player("player",{videoId:c,playerVars:{mute:e.leader?0:1},events:{onReady:w,onStateChange:h}})};Object(r.useEffect)((function(){if(e.socket.addEventListener("message",(function(e){var t=JSON.parse(e.data);"sync"===t.event&&p(t),"join"===t.event&&(!function(e){o(e.videoID)}(t),null!=t.latestEvent&&d({currentTime:t.latestEvent.currentTime,shouldPause:"pause"===t.latestEvent.action,timestamp:t.latestEvent.timestamp}))})),null!==c)if(window.YT)f();else{var t=document.createElement("script");t.src="https://www.youtube.com/iframe_api",window.onYouTubeIframeAPIReady=f;var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n)}}));var p=function(e){if(null!=a&&null!=a.getPlayerState){var t=a.getPlayerState();"currenttime"!==e.action||2!==t&&-1!==t?"pause"===e.action&&2!==t&&b():(v.current={currentTime:e.currentTime,timestamp:e.timestamp},g())}},w=function(e){if(0===m.timestamp)return e.target.playVideo(),void(v.current={timestamp:Date.now(),currentTime:null!=e.target.getCurrentTime?e.target.getCurrentTime():0});v.current={timestamp:m.timestamp,currentTime:m.currentTime},e.target.playVideo(),m.shouldPause&&e.target.pauseVideo()},h=function(e){return O(e.data)},b=function(){return a.pauseVideo()},g=function(){return a.playVideo()},E=function(){var e,t=a.getCurrentTime();if(null!=v.current){var n=(Date.now()-v.current.timestamp)/1e3,r=v.current.currentTime+n;Math.abs(r-t)>.1&&(t=v.current.currentTime+n,e=t,a.seekTo(e,!0))}return JSON.stringify({event:"sync",action:"currenttime",videoID:c,currentTime:t,timestamp:Date.now()})},O=function(t){1===t?e.socket.send(E()):2===t&&function(){var t=Date.now(),n=a.getCurrentTime();v.current=null,e.socket.send(JSON.stringify({event:"sync",action:"pause",currentTime:n,timestamp:t}))}()};return i.a.createElement("div",{className:"video"},i.a.createElement("div",{id:"player"},i.a.createElement("h3",null,"Loading...")))}),v=function(e){var t=Object(l.f)(),n=window.location.protocol.startsWith("https:"),a="".concat(n?"wss":"ws","://").concat(window.location.hostname,":").concat(window.location.port,"/"),c=new WebSocket(a),o=e.sessionID,s=Object(l.g)().sessionID;return o||(o=s),Object(r.useEffect)((function(){c.onopen=function(){c.send(JSON.stringify({event:"session",action:e.action,sessionID:o,videoID:e.videoID}))}})),"leader"!==s||e.leader||t.push("/"),i.a.createElement(d,{videoID:e.videoID,leader:e.leader,sessionID:o,socket:c})};var f=function(){var e=Object(r.useState)(!1),t=Object(s.a)(e,2),n=t[0],a=t[1],c=Object(r.useState)(null),o=Object(s.a)(c,2),d=o[0],f=o[1],p=Object(r.useState)(null),w=Object(s.a)(p,2),h=w[0],b=w[1],g=Object(r.useState)("join"),E=Object(s.a)(g,2),O=E[0],y=E[1],j=function(e,t,n){b(e),f(t),a(n),y("create")};return i.a.createElement(u.a,null,i.a.createElement("div",{className:"skewed"}),i.a.createElement("div",{className:"container"},i.a.createElement("main",{className:"content"},i.a.createElement(l.c,null,i.a.createElement(l.a,{path:"/start/:sessionID/:videoUrl",render:function(){return i.a.createElement(m,{session:j})}}),i.a.createElement(l.a,{path:"/watch/:sessionID",render:function(){return i.a.createElement(v,{leader:n,sessionID:d,videoID:h,action:O})}})))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(f,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[17,1,2]]]);
//# sourceMappingURL=main.74c4c1ef.chunk.js.map
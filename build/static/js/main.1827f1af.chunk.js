(this["webpackJsonpmeme-world"]=this["webpackJsonpmeme-world"]||[]).push([[0],{1109:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(15),s=n.n(o),c=(n(54),n(37)),l=n(38),u=n(48),i=n(45),m=(n(55),n(1117)),d=n(1113),f=n(1116),p=n(46),h=n(1118),v=n(1114),g=n(1115),w=n(39),E=n(47),y=n(17),b=function(){},I=function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];y.b[e].apply(y.b,n)},U=function(e,t){return{success:function(t,n){return e(t)},err:function(e){t&&t(e)}}},N=function(e,t,n){var a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:b,r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:b,o=arguments.length>5&&void 0!==arguments[5]?arguments[5]:{},s=arguments.length>6?arguments[6]:void 0,c=arguments.length>7?arguments[7]:void 0,l=0,u="Something went wrong",i={method:t,credentials:"same-origin",headers:Object(E.a)({Accept:"application/json","Content-Type":"application/json"},o)};n&&(i.body=JSON.stringify(n)),fetch(e,i).then((function(e){return l=e.status,u=e.statusText||u,404===l&&(u="Not Found"),e.json()})).then((function(n){l>=200&&l<400?a(n,l):401===l?(console.error(t+" UNAUTH "+l+": "+e),(c||r)(n,l)):(console.error(t+" ERROR "+l+": "+e),(s||r)(n,l))})).catch((function(n){console.error(t+" FATAL "+l+": "+e,l,u,n),(s||r)({errors:{base:[u]}},l)}))},k=function(e){return new Promise((function(t,n){var a=U(t,n),r=a.success,o=a.err;!function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];N.apply(void 0,[e,"GET",void 0].concat(n))}(e,r,o)}))},P=function(e,t){return new Promise((function(n,a){var r=U(n,a),o=r.success,s=r.err;!function(e,t){for(var n=arguments.length,a=new Array(n>2?n-2:0),r=2;r<n;r++)a[r-2]=arguments[r];N.apply(void 0,[e,"POST",t].concat(a))}(e,t,o,s)}))},O="".concat("/api","/user"),C="".concat("/api","/post"),S="".concat("/api","/status"),A="".concat("/api","/home"),j="".concat("/api","/follow"),R="".concat("/api","/unfollow"),T="".concat("/api","/followers"),x="".concat("/api","/following"),M=function(e){Object(u.a)(n,e);var t=Object(i.a)(n);function n(){var e;Object(c.a)(this,n);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).state={currentUser:{},feed:[],posts:[],following:[],followers:[]},e}return Object(l.a)(n,[{key:"componentDidMount",value:function(){var e,t=this;(e={name:w.name.firstName()},P(O,e)).then((function(e){t.setState({currentUser:e},(function(){t.updatePages(t.state.currentUser.userId)}))}))}},{key:"updatePages",value:function(e){var t=this;(function(e){return k(S+"?id="+e)})(e).then((function(n){(function(e){return k(A+"?id="+e)})(e).then((function(a){(function(e){return k(T+"?id="+e)})(e).then((function(r){(function(e){return k(x+"?id="+e)})(e).then((function(e){t.setState({posts:n,feed:a,followers:e,following:r})}))}))}))}))}},{key:"newPost",value:function(e){return r.a.createElement(m.a,{className:"my-2 mx-auto",style:{width:"18rem"}},r.a.createElement(m.a.Header,null,"Meme Author - @",e.login),r.a.createElement(m.a.Img,{variant:"top",src:"https://picsum.photos/200"}),r.a.createElement(m.a.Body,null,r.a.createElement(m.a.Text,null,e.message,r.a.createElement("br",null),"Posted On: ",e.posted),r.a.createElement(d.a,{variant:"success"},r.a.createElement("span",{className:"fa fa-thumbs-up"}),r.a.createElement("br",null),e.upVote)," ",r.a.createElement(d.a,{variant:"danger"},r.a.createElement("span",{className:"fa fa-thumbs-down"}),r.a.createElement("br",null),e.dVote)))}},{key:"userCard",value:function(e,t){return r.a.createElement(m.a,{className:"my-2 mx-auto",style:{width:"18rem"}},r.a.createElement(m.a.Body,null,r.a.createElement("div",{class:"row"},r.a.createElement("div",{class:"col-lg-12"},r.a.createElement("span",{class:"one"},e.name)))))}},{key:"handleSubmit",value:function(e){var t,n=this;e.preventDefault(),(t={userId:this.state.currentUser.userId,message:e.target.elements.description.value},P(C,t)).then((function(e){I("success",e.message),n.updatePages(n.state.currentUser.userId)}))}},{key:"sendRequest",value:function(e){var t,n=this;e.preventDefault(),(t={uId:this.state.currentUser.userId,uId2:parseInt(e.target.elements.user.value)},P(j,t)).then((function(e){I("success",e.message),n.updatePages(n.state.currentUser.userId)}))}},{key:"sendUnfollow",value:function(e,t){var n=this,a={uId:this.state.currentUser.userId,uId2:e};if("Unfollow"===t){var r=a.uId;a.uId=a.uId2,a.uId2=r}(function(e){return P(R,e)})(a).then((function(e){I("success",e.message),n.updatePages(n.state.currentUser.userId)}))}},{key:"render",value:function(){var e=this;return r.a.createElement("div",null,r.a.createElement(f.a,{bg:"dark",variant:"dark"},r.a.createElement(f.a.Brand,{href:"#home"},"Welcome to MemeWorld, ",this.state.currentUser.name,":",this.state.currentUser.logindId," : ",this.state.currentUser.userId),r.a.createElement(p.a,{className:"mr-auto"}),r.a.createElement(d.a,{onClick:function(){return e.updatePages(e.state.currentUser.userId)},variant:"outline-success"},"Refresh")),r.a.createElement("div",{className:"row pt-2 container"},r.a.createElement("div",{className:"col-sm-9"},r.a.createElement(h.a,{defaultActiveKey:"feed"},r.a.createElement(v.a,{eventKey:"feed",title:"News Feed"},r.a.createElement("div",{className:"row mt-1"},r.a.createElement("div",{className:"col-sm-12"},r.a.createElement(g.a,{className:"form-inline",onSubmit:function(t){return e.handleSubmit(t)}},r.a.createElement(g.a.Group,null,r.a.createElement(g.a.Control,{type:"text",placeholder:"Meme Description",name:"description",required:!0})),"\xa0\xa0",r.a.createElement(d.a,{variant:"warning",type:"submit"},"Post Meme")))),this.state.feed.map((function(t){return e.newPost(t)}))),r.a.createElement(v.a,{eventKey:"posts",title:"My Posts"},this.state.posts.map((function(t){return e.newPost(t)}))),r.a.createElement(v.a,{eventKey:"following",title:"Following"},this.state.followers.map((function(t){return e.userCard(t,"Unfollow")}))),r.a.createElement(v.a,{eventKey:"followers",title:"Followers"},this.state.following.map((function(t){return e.userCard(t,"Remove")}))))),r.a.createElement("div",{className:"col-sm-3"},r.a.createElement(g.a,{className:"form",onSubmit:function(t){return e.sendRequest(t)}},r.a.createElement(g.a.Group,null,r.a.createElement(g.a.Control,{type:"text",placeholder:"Enter user id",name:"user",required:!0})),"\xa0\xa0",r.a.createElement(d.a,{variant:"secondary",type:"submit"},"Sent Follow Request")))))}}]),n}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n(1106),n(1107),n(1108);s.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(M,null),r.a.createElement(y.a,{position:"top-right",autoClose:5e3,hideProgressBar:!1,newestOnTop:!1,closeOnClick:!0,pauseOnVisibilityChange:!0,draggable:!1,pauseOnHover:!0})),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},49:function(e,t,n){e.exports=n(1109)},54:function(e,t,n){},55:function(e,t,n){}},[[49,1,2]]]);
//# sourceMappingURL=main.1827f1af.chunk.js.map
var savedApp = [
	{
		appId : 3,
		name : "豆瓣FM",
		iconurl : "../resources/images/doubanFm.png"
	},
	{
		appId : 4,
		name : "Code Editor",
		iconurl : "../resources/images/codeEditor.png"
	},
	{
		appId : 1,
		name : "File System",
		iconurl : "../resources/images/fileSystem.png"
	},
	{
		appId : 2,
		name : "Process Viewer",
		iconurl : "../resources/images/process.png"
	}
];		

var config = (function(){
	return {
		isMobile : (function(){  
           var userAgentInfo = navigator.userAgent;  
           var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
           var flag = false;  
           for (var v = 0; v < Agents.length; v++) {  
               if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = true; break; }  
           }  
           return flag;
		}())
	}
}());

/* goal Var */
var TRANSITION = 'transition',
	TRANSFORM = 'transform',
	TRANSITION_END = 'transitionend',
	TRANSFORM_CSS = 'transform',
	TRANSITION_CSS = 'transition';

if(typeof document.body.style.webkitTransform !== undefined){
	TRANSITION = 'webkitTransition',
	TRANSFORM = 'webkitTransform',
	TRANSITION_END = 'webkitTransitionEnd',
	TRANSFORM_CSS = '-webkit-transform',
	TRANSITION_CSS = '-webkit-transition';
}

var TAD = (config.isMobile)? "touchstart" : "click";	
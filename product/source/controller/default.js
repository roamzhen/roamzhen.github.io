var savedApp = [
	{
		name : "roam"
		
	},
	{
		name : "roam a long roam"
	},
	{
		name : "roam"
	},{
		name : "roam"
	},
	{
		name : "roam a long roam"
	},
	{
		name : "roam a long roam"
	},
	{
		name : "roam"
	},{
		name : "roam"
	},
	{
		name : "roam a long roam"
	},
	{
		name : "roam a long roam"
	},
	{
		name : "roam"
	},{
		name : "roam"
	},
	{
		name : "roam a long roam"
	},
	{
		name : "roam a long roam"
	},
	{
		name : "roam"
	},{
		name : "roam"
	},
	{
		name : "roam a long roam"
	},
	{
		name : "roam a long roam"
	},
	{
		name : "roam"
	},{
		name : "roam"
	},
	{
		name : "roam a long roam"
	},
	{
		name : "roam a long roam"
	},
	{
		name : "roam"
	},{
		name : "roam"
	},
	{
		name : "roam a long roam"
	},
	{
		name : "roam a long roam"
	},
	{
		name : "roam"
	},{
		name : "roam"
	},
	{
		name : "roam a long roam"
	},
	{
		name : "roam a long roam"
	},
	{
		name : "roam"
	},{
		name : "roam"
	},
	{
		name : "roam a long roam"
	},
	{
		name : "roam a long roam"
	},
	{
		name : "roam"
	},{
		name : "roam"
	},
	{
		name : "roam a long roam"
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
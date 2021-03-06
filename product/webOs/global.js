var savedApp = [
	{
		appId : 1,
		name : "File System",
		iconurl : "../resources/images/fileSystem.png",
		templateId : "template-fileSystem",
		callback : fileSystemCallback
	},
	{
		appId : 2,
		name : "Process Viewer",
		iconurl : "../resources/images/process.png",
		templateId : "template-process",
		callback : processCallback
	},
	{
		appId : 3,
		name : "豆瓣FM",
		iconurl : "../resources/images/doubanFm.png",
		templateId : "template-doubanFm",
		callback : doubanFmCallback
	},
	{
		appId : 4,
		name : "Code Editor",
		iconurl : "../resources/images/codeEditor.png",
		templateId : "template-codeEditor",
		callback : codeEditorCallback
	}
];		

var mlocalstore = {
	name : "File System",
	type : 0,
	child : [
		{
			name : "File List",
			type : 1,
			child: [
				{
					name : "File 2",
					type : 2
				},
				{
					name : "File 3",
					type : 2
				},
				{
					name : "File List 2",
					type : 1,
					child : [
						{
							name : "File 4",
							type : 2
						}
					]
				}
			]
		},
		{
			name : "File 1",
			type : 2
		}
	]
};

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
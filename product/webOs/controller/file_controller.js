
var fs = (function(){
	
	var fsWrap = $(".g-fs-bg");
	
	function FileSystem(){
		this.source = null;
	}
	
	FileSystem.prototype.init = function(){
		fsWrap = $(".g-fs-bg");
		this.source = new FileObject(mlocalstore);
		
		this.source.show();
	}
	
	function FileObject(obj,father){
		
		this.father = null;
		
		if(arguments.length===2){
			this.father = father;
		}
		
		this.name = obj.name;
		this.type = obj.type;
		this.child = null;
		this.node = (obj.type===0)?null:itemNodeTemplate(this);
		this.page = pageNodeTemplate(this);
		
		
		if(obj.child&&obj.child.length!=0){
			this.child = new Array();
		}
		
		for(var i=0;obj.child&&i<obj.child.length;i++){
			this.child.push(new FileObject(obj.child[i],this));
		}
		
	}
	
	function itemNodeTemplate(obj){
		var dom = document.createElement("div");
		
		dom.className = "g-fs-item";
		
		dom.innerHTML = "<p class='g-fs-item-name'>"+obj.name+"</p>";
		
		if(obj.type===1)
			dom.innerHTML += "<img class='g-fs-item-rc' src='../resources/images/right-icon.png' />";
		
		dom.addEventListener(TAD,function(){
			obj.show();
		});
		
		return dom;
	}
	
	function addNodeTemplate(obj){
		var dom = document.createElement("div");
		
		dom.className = "g-fs-addItem";
		
		dom.innerHTML = "<p class='g-fs-item-name'>Add File / Add FileList</p>";
		
		dom.addEventListener(TAD,function(){
			var tmpWrap = obj.page.querySelector(".g-fs-content");
			
			var newFile = new FileObject({
					name : "New File",
					type : 2
				});
			
			obj.child.push(newFile);
			
			tmpDom = newFile.node;
			
			tmpWrap.insertBefore(tmpDom,tmpWrap.lastChild);
		});
		
		return dom;
	}
	
	function pageNodeTemplate(obj){
		var dom = document.createElement("div");
		dom.className = "m-fs-slide";
		
		var backBtnHTML = "";
				
		if(obj.father!=null){
			backBtnHTML = "<img class='u-fs-backBtn' src='../resources/images/left-icon.png' />";
		}
		
		dom.innerHTML = 
			"<div class='g-fs-title-wrap'>"+
				backBtnHTML+
				"<p class='m-fs-title'>"+obj.name+"</p>"+
			"</div>"+
			"<div class='g-fs-content-wrap'>"+
				"<div class='g-fs-content'>"+
					
				"</div>"+
			"</div>";
		
		if(obj.father!=null){
			dom.querySelector(".u-fs-backBtn").addEventListener(TAD,function(){
				obj.father.show();
			});
		}
		
		
		return dom;
	}
	
	FileObject.prototype.show = function(){
		fsWrap.innerHTML = null;
		fsWrap.appendChild(this.page);
		
		var contentWrap = this.page.querySelector(".g-fs-content");
		
		contentWrap.innerHTML = "";
		
		for(var i =0;this.child&&i<this.child.length;i++){
			contentWrap.appendChild(this.child[i].node);
		}
		
		contentWrap.appendChild(addNodeTemplate(this));
		
		
	}
	
	
	
	return new FileSystem();
}());




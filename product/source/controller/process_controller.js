
var Process = (function(){
	
	function Process(){
		this.root = $(".main-screen");
		
		this.list = new Array();

	};
	
	Process.prototype.getLength = function(){
		return this.list.length;
	}
	
	Process.prototype.create = function(){
		
	}
	
	Process.prototype.enProcess = function(obj){
		
		this.list.push(obj);
	}
	
	Process.prototype.getList = function(){
		return this.list;
	}
	
	
	return Process;
}());

var Process = (function(){
	
	function Process(){
		this.root = $(".main-screen");
		
		this.processes = new Array();

	};
	
	Process.prototype.getLength = function(){
		return this.processes.length;
	}
	
	Process.prototype.create = function(){
		
	}
	
	Process.prototype.enProcess = function(obj){
		
		this.processes.push(obj);
	}
	
	
	return Process;
}());

var process = new Process();

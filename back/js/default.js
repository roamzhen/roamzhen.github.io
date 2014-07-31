function GetClass(className){
	return getElementsByClassName(className)
} 

var $c= function(array){
	var nArray = [];
	for (var i=0;i<array.length;i++) nArray.push(array[i]);
	return nArray;
}; 

Array.prototype.each=function(func){
	for(var i=0,l=this.length;i<l;i++) {func(this[i],i);};}; 
	var getElementsByClassName=function(cn){ 
		var hasClass=function(w,Name){ 
			var hasClass = false; 
			w.className.split(' ').each(function(s){ 
			if (s == Name) hasClass = true; 
		}); 
		return hasClass; 
	}; 
	var elems =document.getElementsByTagName("*")||document.all; 
	var elemList = []; 
	$c(elems).each(function(e){ 
	if(hasClass(e,cn)){elemList.push(e);} 
	}) 
	return $c(elemList); 
};

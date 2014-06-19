/* removePre() */
function removePre(e) { 
	e.preventDefault(); 
}

/* GetClass */
function GetClass(className){
	return getElementsByClassName(className);
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
/* end GetClass */

/* check null */
function checkNull(){
	var inputArr = GetClass("input-right");

	if(inputArr[0].value!=""||inputArr[1].value!=""||inputArr[2].value!=""||inputArr[3].value!=""||inputArr[4].value!="")
		showPop(1);
	else
		location.href = "index.html";
}

/* end check null */

/* submit loading */
function submitLoading(obj){
	if(obj.timer!=null)
		return false;

	var i=0;
	var popImg = document.getElementById("pop-img");
	var popWords = document.getElementById("pop-words");

	var j=0;

	obj.timer = setInterval(function(){
		obj.innerHTML += ".";
		i++;
		if(i>3){
			obj.innerHTML = obj.innerHTML.substring(0,obj.innerHTML.length-4);
			i=0;

			if(j>5){
				clearInterval(obj.timer);
				obj.timer=null;
				showPop(2);
				setTimeout("hidePop(2)",3000);
			}
		}

		j++;

	},300);


}
/* end submit loading */

/* show and hide */
function showPop(type){
    var overlay = document.getElementById("overlay");
    var popMessage = document.getElementById("pop-message");
    var popStatus = document.getElementById("pop-status");

    switch(type){
        //message
        case 1:
            overlay.style.display = "block";
            popMessage.style.display = "block";
            popStatus.style.display = "none";
            break;
        //status
        case 2:
            overlay.style.display = "block";
            popMessage.style.display = "none";
            popStatus.style.display = "block";
            break;
        default:
            break;
    }

    document.body.addEventListener('touchmove', removePre, false);

}

function hidePop(type){
    var overlay = document.getElementById("overlay");
    var popMessage = document.getElementById("pop-message");
    var popStatus = document.getElementById("pop-status");

    overlay.style.display = "none";
    popMessage.style.display = "none";

    switch(type){
        //message
        case 1:
            overlay.style.display = "none";
            popMessage.style.display = "none";
            break;
        //status
        case 2:
            overlay.style.display = "none";
            popStatus.style.display = "none";
            break;
        default:
            break;
    }

    document.body.removeEventListener('touchmove', removePre, false);

}

/* end show and hide */

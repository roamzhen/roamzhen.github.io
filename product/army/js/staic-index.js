(function(){

var query = function(selector){
  return document.querySelector(selector);
};
var winH = document.documentElement.scrollHeight;
var translateArry = [
  0,
  2.25,6.1,
  5.18,3.14,
  3.08,2.15,3.04,
  2.53,3.66,2.13,
  2.97,5.3,
  2.56,2.05,1.9,1.8,
  2.41,4.92,
  2.24,3.05,3.15,
  2.72,2.55,3.15,
  2.45,2.99,2.89,
  2.56,5.69,
  5.61,3.13,
  5.05,3.15,
  2.89,5.33
];
var translateY = 0;
var $scroller = $('.scroller');

var stepNum = 2;


var handler = function(event){
  switch(event['type']){
    case 'swipeup':
      if(stepNum < translateArry.length + 1){
        $('.step'+stepNum).addClass('animated');

        translateY = translateArry[stepNum-1] + translateY;
        $scroller.css('-webkit-transform','translateY(-'+ translateY +'rem)');
        stepNum++;
      }
      break;
    case 'swipedown':
      if(stepNum-1 >= 2){
        stepNum--;

        translateY = translateY - translateArry[stepNum-1];
        $scroller.css('-webkit-transform','translateY(-'+ translateY +'rem)');
        break;
      }
  }
}
var gest = new mo.Gesture($scroller[0]).addGesture('swipeup swipedown', handler);


}());
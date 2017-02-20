(function(global){

  threeApp.init();

  var router = {
    index: 0
  }

  var nextBtn = document.querySelector('.next-btn');

  var 
    transitionWrapper = document.querySelector('.transition-wrapper'),
    awardWrapper = document.querySelector('.award-wrapper'),
    personSingle = document.querySelector('.person-single'),
    personTen = document.querySelector('.person-ten'),
    transitionWords = document.querySelector('.transition-words');


  nextBtn.addEventListener('click', function(e){
    btnRouter(router.index);
  });

  function btnRouter(index) {

    switch(index) {
      case 0:
        transitionWrapper.classList.add('exit');

        setTimeout(function(){
          transitionWrapper.classList.remove('show');
          transitionWrapper.classList.remove('exit');

          transitionWords.src = '../img/transition_words2.png';

          awardWrapper.classList.add('show-fs');
          awardWrapper.classList.add('show');

        }, 400);
        router.index++;
        break;
      case 1:
        awardWrapper.classList.add('exit');

        threeApp.start();

        awardWrapper.timer = setTimeout(function() {
          awardWrapper.classList.remove('show');
          awardWrapper.classList.remove('exit');
          awardWrapper.classList.remove('show-fs');

          router.index++;
        }, 350);

        break;
      case 2:
        threeApp.stop(function(){
          personTen.classList.add('show');
          router.index++;
        });
        break;
      case 3:
        personTen.classList.add('exit');

        personTen.timer = setTimeout(function() {
          personTen.classList.remove('show');
          personTen.classList.remove('exit');

          awardWrapper.classList.add('show-rmw');
          awardWrapper.classList.add('show');

          router.index++;
        }, 350);

        break;
      case 4:
        awardWrapper.classList.add('exit');

        threeApp.start();

        awardWrapper.timer = setTimeout(function() {
          awardWrapper.classList.remove('show');
          awardWrapper.classList.remove('exit');
          awardWrapper.classList.remove('show-rmw');

          router.index++;
        }, 350);

        break;
      case 5:
        threeApp.stop(function(){
          personTen.classList.add('show');
          router.index++;
        });
        break;
      case 6:
        personTen.classList.add('exit');

        personTen.timer = setTimeout(function() {
          personTen.classList.remove('show');
          personTen.classList.remove('exit');

          awardWrapper.classList.add('show-dj');
          awardWrapper.classList.add('show');

          router.index++;
        }, 350);
        break;
      case 7:
        awardWrapper.classList.add('exit');

        threeApp.start();

        awardWrapper.timer = setTimeout(function() {
          awardWrapper.classList.remove('show');
          awardWrapper.classList.remove('exit');
          awardWrapper.classList.remove('show-dj');

          router.index++;
        }, 350);

        break;
      case 8:
        threeApp.stop(function(){
          personTen.classList.add('show');
          router.index ++;
        });
        break;
      case 9:
        personTen.classList.add('exit');

        personTen.timer = setTimeout(function() {
          personTen.classList.remove('show');
          personTen.classList.remove('exit');

          transitionWrapper.classList.add('show');

          router.index++;
        }, 350);
        break;
      case 10:
        transitionWrapper.classList.add('exit');

        setTimeout(function(){
          transitionWrapper.classList.remove('show');
          transitionWrapper.classList.remove('exit');

          transitionWords.src = '../img/transition_words3.png';

          awardWrapper.classList.add('show-travel');
          awardWrapper.classList.add('show');

        }, 400);
        router.index++;
        break;
      case 11:
        awardWrapper.classList.add('exit');

        threeApp.start();

        awardWrapper.timer = setTimeout(function() {
          awardWrapper.classList.remove('show');
          awardWrapper.classList.remove('exit');
          awardWrapper.classList.remove('show-travel');

          router.index++;
        }, 350);
        break;
      case 12:
        threeApp.stop(function(){
          personSingle.classList.add('show');
          router.index++;
        });
        break;
      case 13:
        personSingle.classList.add('exit');

        personSingle.timer = setTimeout(function() {
          personSingle.classList.remove('show');
          personSingle.classList.remove('exit');

          transitionWrapper.classList.add('show');

          router.index++;
        }, 350);
        break;
      case 14:
        transitionWrapper.classList.add('exit');

        setTimeout(function(){
          transitionWrapper.classList.remove('show');
          transitionWrapper.classList.remove('exit');

          transitionWords.src = '../img/transition_words4.png';

          awardWrapper.classList.add('show-cash');
          awardWrapper.classList.add('show');

        }, 400);
        router.index++;
        break;
      case 15:
        awardWrapper.classList.add('exit');

        threeApp.start();

        awardWrapper.timer = setTimeout(function() {
          awardWrapper.classList.remove('show');
          awardWrapper.classList.remove('exit');
          awardWrapper.classList.remove('show-cash');

          router.index++;
        }, 350);
        break;
      case 16:
        threeApp.stop(function(){
          personSingle.classList.add('show');
          router.index++;
        });
        break;
      case 17:
        personSingle.classList.add('exit');

        personSingle.timer = setTimeout(function() {
          personSingle.classList.remove('show');
          personSingle.classList.remove('exit');

          transitionWrapper.classList.add('show');

          router.index++;
        }, 350);
        break;
      case 18:
        transitionWrapper.classList.add('exit');

        setTimeout(function(){
          transitionWrapper.classList.remove('show');
          transitionWrapper.classList.remove('exit');

          awardWrapper.classList.add('show-car');
          awardWrapper.classList.add('show');

        }, 400);
        router.index++;
        break;
      case 19:
        awardWrapper.classList.add('exit');

        threeApp.start();

        awardWrapper.timer = setTimeout(function() {
          awardWrapper.classList.remove('show');
          awardWrapper.classList.remove('exit');
          awardWrapper.classList.remove('show-car');

          router.index++;
        }, 350);
        break;
      case 20:
        threeApp.stop(function(){
          personSingle.classList.add('show');
          router.index++;
        });
        break;
    }
  }

}(this));
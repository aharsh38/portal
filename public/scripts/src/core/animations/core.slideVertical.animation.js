(function() {

    angular.module('fct.core')
      .animation('.slide-vertical', slideVertical);

    slideVertical.$inject = ['TweenMax'];

    function slideVertical(TweenMax) {
        return {
            addClass: addHideClass,
            removeClass: removeHideClass
        };
    }

    function addHideClass(element, className, done) {
      if (className == 'ng-hide') {
        // var timeline = new TimelineMax();
        TweenMax.set(element,{height:"auto", opacity:0});
        TweenMax.from(element, 0.3, {opacity: 1, ease: Power0.easeNone});
        TweenMax.to(element, 0.4, {height:0, ease:  Power2.easeOut, onComplete: done}).delay(0.25);
      }
      else {
        done();
      }

    }

    function removeHideClass(element, className, done) {
      if (className == 'ng-hide') {
        element.removeClass('ng-hide');
        TweenMax.set(element,{height:"auto", opacity:0});
        TweenMax.from(element, 0.4, {height:0, ease: Power2.easeIn});
        TweenMax.to(element, 0.3, {opacity: 1, ease: Power2.easeIn, onComplete:done}).delay(0.35);
      }
      else {
        done();
      }
    }
})();

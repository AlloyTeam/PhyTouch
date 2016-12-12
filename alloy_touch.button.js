; (function () {

    function addClass(element, className) {
   
            if (element.classList) {
                element.classList.add(className);
            } else {
                element.className += ' ' + className;
            }
      
    }

    function removeClass(element, className) {
  
            if (element.classList) {
                element.classList.remove(className);
            } else {
                element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            }
     
    }


    AlloyTouch.Button = function (selector, tap, active) {

        var element = typeof selector === "string" ? document.querySelector(selector) : selector;
        new AlloyTouch({
            touch: selector,
            touchStart: function (evt, value) {
                addClass(element, active);
            },
            touchMove: function (evt, value) {
                removeClass(element, active);
            },
            touchEnd: function (evt, value) {
                removeClass(element, active);
            },
            touchCancel: function () {
                removeClass(element, active);
            },
            tap: tap

        })
    }
})();


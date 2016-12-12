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

        var option = {
            touch: selector,
            tap: tap,
            preventDefault: false
        };

        if (active !== undefined) {
            option.touchStart = function (evt, value) {
                addClass(element, active);
            };
            touchMove = function (evt, value) {
                removeClass(element, active);
            };
            option.touchEnd = function (evt, value) {
                removeClass(element, active);
            };
            option.touchCancel = function () {
                removeClass(element, active);
            };
        }

        new AlloyTouch(option)
    }
})();


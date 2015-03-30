//Based on Julien Wajsberg's jquery trap-input https://github.com/julienw/jquery-trap-input
(function(){

    'use strict';

    angular.module('yourApp').factory('trap', ['$timeout', function($timeout){

        function onTab(container, elt, goReverse) {
            var $getFocus = getFocusableElementsInModal(container),
                curElt = elt,
                index, nextIndex, prevIndex, lastIndex;

            var focusableArray = [];
            
            //create an array out of the list of focusable elements in the modal
            for(var key in $getFocus){
                if($getFocus.hasOwnProperty(key)){
                  if(parseInt(key, 10) !== NaN){
                    focusableArray.push($getFocus[key]);
                  }
                }
            }
            
            while(elt === elt.ownerDocument.activeElement){

                if(focusableArray.length === 1){ //if the array of elements to tab through is only 1, then just return, all the stuff below just screws things up
                    return true;
                }
                else {
                
                    focusableArray.forEach(function(v, k){
                        if(v == curElt){
                            index = k;
                        }
                    });
                    
                    nextIndex = index + 1;
                    prevIndex = index - 1;
                    lastIndex = $getFocus.length - 1;

                    switch(index) {
                        case -1:
                            return false;
                        case 0:
                            prevIndex = lastIndex;
                            break;
                        case lastIndex:
                            nextIndex = 0;
                            break;
                    }
                                    
                    if (goReverse) {
                        nextIndex = prevIndex;
                    }
                    
                    curElt = focusableArray[nextIndex];
                    try {
                        curElt.focus();
                    } catch(e) {
                    }
                }
            }

            return true;        
        }

        function keepSpecialTabindex(currentEl) {
            return currentEl.tabIndex > 0;
        }

        function keepNormalTabindex(currentEl) {
            return !currentEl.tabIndex; // true if no tabIndex or tabIndex == 0
        }

        function sortFocusable(a, b) {
            return (a.t - b.t) || (a.i - b.i);
        }

        function getFocusableElementsInModal(modal) {
            var $modal = modal;
            var result = [],
                cnt = 0;

            fixIndexSelector.enable && fixIndexSelector.enable();

            var normalFocusable = $modal.querySelectorAll('button, a, link, [draggable=true], [contenteditable=true], [tabindex="0"], input, textarea, select');
            for (var i = 0; i < normalFocusable.length; i++) {
                if(keepNormalTabindex(normalFocusable[i])){
                    result.push({
                        v: normalFocusable[i], // value
                        t: 0, // tabIndex
                        i: cnt++ // index for stable sort
                    });  
                }
            }

            var specialFocusable = $modal.querySelectorAll('[tabindex]');
            for (var i = 0; i < specialFocusable.length; i++) {
                if(keepSpecialTabindex(specialFocusable[i])){
                    result.push({
                        v: specialFocusable[i], // value
                        t: specialFocusable[i].tabIndex, // tabIndex
                        i: cnt++ // index for stable sort
                    });  
                }
            }

            fixIndexSelector.disable && fixIndexSelector.disable();
            
            var sortResult = result.sort(sortFocusable);
            var mappedResult = sortResult.map(function(val) {
                return val.v;
            });   
            
            return mappedResult;
            
        }

        var fixIndexSelector = {};

        return function(element){
            $timeout(function(){//wait until DOM is loaded (or at least the next $digest cycle...ish)
                element.querySelector('button, a, link, [draggable=true], [contenteditable=true], [tabindex], input, textarea, select').focus(); //focus on first element in modal

                element.onkeydown=function(e){
                    if (e.keyCode === 9) {
                        var goReverse = !!(e.shiftKey);
                        if (onTab(this, e.target, goReverse)) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }
                };
            },0);
            
            return element;
        };         
             
	}]);
}());
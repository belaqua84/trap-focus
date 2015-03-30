# trap-focus
Angular factory that traps keyboard focus in a modal window.

Demo: [plnkr](http://plnkr.co/edit/f3V7fU?p=preview)

##Usage
First, bring the script into your index page:

`<script scr="trapFactory.js"></script>`

Then Dependency Inject 'trap' into any controller or directive or wherever you want to use it:

myApp.controller('NoMoonController', ['$scope', 'trap', function($scope, trap) {...}]);

To use, invoke trap with the element that you want to have as the trapper as an arguement:

```
var modalWinodw = document.getElementById('modal');
trap(modalWindow);
```
 
When trap is invoked the first focusable element inside will automatically be focused on.  Once that happens, the user won't be able to focus on anything outside (via keyboard) until the trap window is closed/hidden.  I'd recommend using ng-if to hide the modal when not in use.

###TODO

Right now focusing on the first focusable element inside happens automatically, but ideally I want to provide that as an option.  For accessibility purposes when you open a modal window you should automatically focus on the first focusable element in the modal.  When you close the modal window you should return focus to the same element that the user was on before the modal was opened.  The plan is to include that functionality as an option.

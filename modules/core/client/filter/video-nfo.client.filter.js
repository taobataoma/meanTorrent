(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('core')
    .filter('videoNfo', videoNfo);

  function videoNfo() {
    return function (nfo) {
      if(nfo){
        return nfo.replace(/\n/g, '<br />');
      }else{
        return '';
      }
    };
  }
}());

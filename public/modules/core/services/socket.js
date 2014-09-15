'use strict';

//socket factory that provides the socket service
angular.module('core').factory( 'socketFactory', 
   function(socketFactory) {
      return socketFactory();
   });
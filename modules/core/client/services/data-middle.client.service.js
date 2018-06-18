(function () {
  'use strict';

  angular
    .module('core')
    .factory('MiddleDataServices', MiddleDataServices);

  function MiddleDataServices() {
    var middleData = [];

    var service = {
      setData: setData,
      getData: getData
    };

    return service;

    function setData(dataName, data) {
      middleData[dataName] = data;
    }

    function getData(dataName) {
      return middleData[dataName];
    }
  }
}());

(function () {
  'use strict';

  angular
    .module('medals.services')
    .factory('MedalsInfoServices', MedalsInfoServices);

  MedalsInfoServices.$inject = ['MeanTorrentConfig', 'SafeColorsServices', '$filter'];

  function MedalsInfoServices(MeanTorrentConfig, SafeColorsServices, $filter) {
    var medalsConfig = MeanTorrentConfig.meanTorrentConfig.medals;

    var service = {
      getMedalsAll: getMedalsAll,
      getMedalsSystemHelp: getMedalsSystemHelp,
      getMedalsAdminHelp: getMedalsAdminHelp,
      getMedalsSelfHelp: getMedalsSelfHelp,
      mergeMedalsProperty: mergeMedalsProperty,
      getMedal: getMedal
    };

    return service;

    function getMedalsAll() {
      var medals = $filter('where')(medalsConfig.type, {enable: true});

      return {
        items: fillMedalsProperty(medals),
        types: $filter('groupBy')(medals, 'cats')
      };
    }

    function getMedalsSystemHelp() {
      var medals = $filter('where')(medalsConfig.type, {enable: true, passHelp: 'sys'});

      return {
        items: fillMedalsProperty(medals),
        types: $filter('groupBy')(medals, 'cats')
      };
    }

    function getMedalsAdminHelp() {
      var medals = $filter('where')(medalsConfig.type, {enable: true, passHelp: 'admin'});

      return {
        items: fillMedalsProperty(medals),
        types: $filter('groupBy')(medals, 'cats')
      };
    }

    function getMedalsSelfHelp() {
      var medals = $filter('where')(medalsConfig.type, {enable: true, passHelp: 'self'});

      return {
        items: fillMedalsProperty(medals),
        types: $filter('groupBy')(medals, 'cats')
      };
    }

    function getMedal(mName) {
      var medal = $filter('where')(medalsConfig.type, {enable: true, name: mName});
      medal = fillMedalsProperty(medal);
      return medal[0];
    }

    function mergeMedalsProperty(mds) {
      var medals = $filter('where')(medalsConfig.type, {enable: true});
      var arr = [];
      mds.forEach(function (m) {
        if (m.name) {
          arr.push(m);
        } else {
          var im = medals.find(function (item) {
            return item.name === m.medalName;
          });
          if (im) {
            arr.push(Object.assign(m, im));
          }
        }
      });
      arr = fillMedalsProperty(arr);

      return arr;
    }

    /**
     * fillMedalsProperty
     * @param mds
     * @returns {*}
     */
    function fillMedalsProperty(mds) {
      angular.forEach(mds, function (m) {
        m.bgColor = SafeColorsServices.getSafeColor();
        switch (m.cats) {
          case 'workers':
            m.iconTop = '1.15em';
            m.iconSize = '0.35em';
            m.textFooterBottom = '0.65em';
            m.textFooterSize = '0.2em';
            break;
          case 'users':
            m.iconTop = '1.4em';
            m.iconSize = '0.35em';
            m.textFooterBottom = '0.5em';
            m.textFooterSize = '0.2em';
            break;
          case 'vip':
            m.textHeaderTop = '1.02em';
            m.textHeaderSize = '0.4em';
            m.textFooterBottom = '0.9em';
            m.textFooterSize = '0.2em';
            break;
          case 'commemorative':
            m.textHeaderTop = '1em';
            m.textHeaderSize = '0.5em';
            m.textFooterBottom = '0.5em';
            m.textFooterSize = '0.2em';
            break;
          case 'events':
            m.textHeaderTop = '1.8em';
            m.textHeaderSize = '0.25em';
            m.textFooterBottom = '0.5em';
            m.textFooterSize = '0.2em';
            break;
          default:
            m.iconTop = '1.15em';
            m.iconSize = '0.35em';
            m.textFooterBottom = '0.65em';
            m.textFooterSize = '0.2em';
        }
      });
      return mds;
    }
  }
}());

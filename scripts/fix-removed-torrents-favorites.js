'use strict';
// Set the Node ENV
process.env.NODE_ENV = 'development';

var mongoose = require('mongoose'),
  chalk = require('chalk'),
  config = require('../config/config'),
  mg = require('../config/lib/mongoose');

var traceConfig = config.meanTorrentConfig.trace;

mg.loadModels();

mg.connect(function (db) {

  var Trace = mongoose.model('Trace');
  var Favorite = mongoose.model('Favorite');

  Trace.find({'content.action': traceConfig.action.adminTorrentDelete.name})
    .exec(function (err, traces) {
      if (err) {
        throw err;
      }
      var processedCount = 0,
        errorCount = 0;
      if (!traces.length) {
        return reportAndExit(processedCount, errorCount);
      }
      traces.forEach(removeFavorites);

      function removeFavorites(trace) {
        var torrent = trace.content.torrent;
        Favorite.remove({
          torrent
        }).exec(function (err, result) {
          processedCount++;
          if (err) {
            errorCount++;
          }
          console.log(chalk.yellow(`Removed favorites count is ${result.deletedCount}`));
          if (processedCount === traces.length) {
            return reportAndExit(processedCount, errorCount);
          }
        });
      }

      // report the processing results and exit
      function reportAndExit(processedCount, errorCount) {
        var successCount = processedCount - errorCount;

        console.log();

        if (processedCount === 0) {
          console.log(chalk.yellow('No adminTorrentDelete traces were found.'));
        } else {
          var alert;
          if (!errorCount) {
            alert = chalk.green;
          } else if ((successCount / processedCount) < 0.8) {
            alert = chalk.red;
          } else {
            alert = chalk.yellow;
          }

          console.log(alert('Remove ' + successCount + ' of ' + processedCount + ' traces successfully.'));
        }

        process.exit(0);
      }
    });

});

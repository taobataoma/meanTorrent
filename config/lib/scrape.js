var path = require('path'),
  bencoding = require('bencoding'),
  common = require(path.resolve('./config/lib/common')),
  request = require('request'),
  URL = require('url');

/**
 * doScrape
 * @param t - torrent object
 */
module.exports.doScrape = function (t, cb) {
  var scrapeInfo = [];

  var regex = new RegExp('announce', 'g');
  console.log('torrent_announce = ' + t.torrent_announce);
  console.log('info_hash = ' + t.info_hash);

  var url = URL.parse(t.torrent_announce);
  var protocol = url.protocol;
  var hostname = url.hostname;
  var port = url.port;
  var path = url.pathname;
  var npath = '';

  var i = path.indexOf('announce');
  if (i >= 0) {
    var j = path.indexOf('/', i);
    if (j >= 0) {
      path = path.slice(0, j);
    }
    npath = path.replace(regex, 'scrape');
  } else {
    npath = '/scrape';
  }

  var scrapeUrl = protocol + '//' + hostname;
  scrapeUrl += port ? ':' + port : '';
  scrapeUrl += npath;

  scrapeUrl += '?info_hash=' + escape(common.hexToBinary(t.info_hash));
  //scrapeUrl += '&info_hash=' + common.hexToBinary('5c610cb1882f13699215c8c448a2f1502e98a28e');
  console.log('-= scrape =- ' + scrapeUrl);

  request(scrapeUrl, {encoding: null}, function (error, response, body) {
    //console.log('error:', error);
    //console.log('statusCode:', response && response.statusCode);
    //console.log('body:', body);
    if (error) {
      //console.log('-= scrape error =- ' + scrapeUrl);
      if (cb) cb(error, null);
    } else if (response) {
      if (response.statusCode === 200) {
        var data = new Buffer(body);
        var result = bencoding.decode(data);

        //console.log(result);
        //console.log(result.toJSON());
        //console.log(result.vals[0]);
        result.keys.forEach(function (k1, idx1) {
          //console.log(k1.toString('utf8').toUpperCase() + ' - ' + idx1 + ' - ' + result.vals[idx1]);
          if (k1.toString('utf8').toUpperCase() === 'FAILURE REASON') {
            //console.log('-= scrape error =- ' + result.vals[idx1].toString('utf8'));
            if (cb) cb(result.vals[idx1].toString('utf8'), null);
          } else if (k1.toString('utf8').toUpperCase() === 'FILES') {
            var val = result.vals[idx1];
            val.keys.forEach(function (k2, idx2) {
              //console.log(k2.toString('hex'));
              //console.log(val.vals[idx2].toJSON());

              scrapeInfo.push({
                info_hash: k2.toString('hex'),
                data: val.vals[idx2].toJSON()
              });

            });
            //console.log(scrapeInfo);
            if (scrapeInfo.length > 0) {
              scrapeInfo.forEach(function (s) {
                console.log(s);
                if (s.info_hash === t.info_hash) {
                  t.update({
                    torrent_seeds: s.data.complete,
                    torrent_finished: s.data.downloaded,
                    torrent_leechers: s.data.incomplete
                  }).exec();
                }
              });
              if (cb) cb(null, scrapeInfo);
            } else {
              if (cb) cb('422 result is empty', null);
            }
          }
        });
      } else if (response.statusCode === 403) {
        if (cb) cb('403 Forbidden', null);
      }
    }
  });
};

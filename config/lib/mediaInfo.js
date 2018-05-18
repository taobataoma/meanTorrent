'use strict';

var logger = require('./logger');

/**
 * getMediaInfo
 * @param nfo
 * @returns {{}}
 */
module.exports.getMediaInfo = function (nfo) {
  var minfo = {};

  /**
   * general
   */
  var gInfo = getGeneralInfoContent();
  if (gInfo) {
    minfo = getGeneralFileSize(gInfo, minfo);
    minfo = getGeneralDuration(gInfo, minfo);
    minfo = getGeneralOverallBitRate(gInfo, minfo);
  }

  /**
   * video
   */
  var vInfo = getVideoInfoContent();
  if (vInfo) {
    minfo = getVideoFormat(vInfo, minfo);
    minfo = getVideoDuration(vInfo, minfo);
    minfo = getVideoBitRate(vInfo, minfo);
    minfo = getVideoWidth(vInfo, minfo);
    minfo = getVideoHeight(vInfo, minfo);
    minfo = getVideoFrameRateMode(vInfo, minfo);
    minfo = getVideoFrameRate(vInfo, minfo);
    minfo = getVideoBitDepth(vInfo, minfo);
    minfo = getVideoStreamSize(vInfo, minfo);
    minfo = getVideoWritingLibrary(vInfo, minfo);
  }

  /**
   * audio
   */
  var aInfo = getAudioInfoContent();
  if (aInfo) {
    minfo = getAudioFormat(aInfo, minfo);
    minfo = getAudioBitRateMode(aInfo, minfo);
    minfo = getAudioBitRate(aInfo, minfo);
    minfo = getAudioChannel(aInfo, minfo);
    minfo = getAudioLanguage(aInfo, minfo);
  }

  /**
   * text
   */
  var tInfo = getTextInfoContent();
  if (tInfo) {
    minfo = getTextLanguage(tInfo, minfo);
  }

  /**
   * get simple format media info
   */
  if (!gInfo && !vInfo && !aInfo && !tInfo) {
    minfo = getSimpleGeneralFileSize(nfo, minfo);
    minfo = getSimpleGeneralDuration(nfo, minfo);
    minfo = getSimpleGeneralRuntime(nfo, minfo);
    minfo = getSimpleVideoBitRate(nfo, minfo);
    minfo = getSimpleVideoFrameRate(nfo, minfo);
    minfo = getSimpleVideoResolution(nfo, minfo);
    minfo = getSimpleAudioInfo(nfo, minfo);
    minfo = getSimpleTextInfo(nfo, minfo);

    minfo = getSimpleGeneralReleaseSize(nfo, minfo);
    minfo = getSimpleVideoCodec(nfo, minfo);
    minfo = getSimpleAudioCodec(nfo, minfo);
  }

  return minfo;


  /**********************************************************************************
   * get general value
   **********************************************************************************/
  function getGeneralInfoContent() {
    var reg = /general[\r\n][\s\S]*?[\r\n][\r\n]|general[\r\n][\s\S]*/gi;
    var res = nfo.match(reg);
    return res || undefined;
  }

  function getGeneralFileSize(gInfo, minfo) {
    var reg = /file\s*size\s*:[^\r\n]+/gi;
    var res = gInfo[0].match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('general')) {
        minfo.general = {};
      }
      minfo.general.fileSize = str.trim();
    }
    return minfo;
  }

  function getGeneralDuration(gInfo, minfo) {
    var reg = /duration\s*:[^\r\n]+/gi;
    var res = gInfo[0].match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('general')) {
        minfo.general = {};
      }
      minfo.general.duration = str.trim();
    }
    return minfo;
  }

  function getGeneralOverallBitRate(gInfo, minfo) {
    var reg = /overall\s*bit\s*rate\s*:[^\r\n]+/gi;
    var res = gInfo[0].match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('general')) {
        minfo.general = {};
      }
      minfo.general.overallBitRate = str.trim();
    }
    return minfo;
  }

  /**********************************************************************************
   * get video value
   **********************************************************************************/
  function getVideoInfoContent() {
    var reg = /video[\s*\#\d]*[\r\n][\s\S]*?[\r\n][\r\n]|video[\s*\#\d]*[\r\n][\s\S]*/gi;
    var res = nfo.match(reg);
    return res || undefined;
  }

  function getVideoFormat(vInfo, minfo) {
    var reg = /format\s*:[^\r\n]+/gi;
    var res = vInfo[0].match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('video')) {
        minfo.video = {};
      }
      minfo.video.format = str.trim();
    }
    return minfo;
  }

  function getVideoDuration(vInfo, minfo) {
    var reg = /duration\s*:[^\r\n]+/gi;
    var res = vInfo[0].match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('video')) {
        minfo.video = {};
      }
      minfo.video.duration = str.trim();
    }
    return minfo;
  }

  function getVideoBitRate(vInfo, minfo) {
    var reg = /bit\s*rate\s*:[^\r\n]+/gi;
    var res = vInfo[0].match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('video')) {
        minfo.video = {};
      }
      minfo.video.bitRate = str.trim();
    }
    return minfo;
  }

  function getVideoWidth(vInfo, minfo) {
    var reg = /width\s*:[^\r\n]+/gi;
    var res = vInfo[0].match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('video')) {
        minfo.video = {};
      }
      minfo.video.width = str.trim();
    }
    return minfo;
  }

  function getVideoHeight(vInfo, minfo) {
    var reg = /height\s*:[^\r\n]+/gi;
    var res = vInfo[0].match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('video')) {
        minfo.video = {};
      }
      minfo.video.height = str.trim();
    }
    return minfo;
  }

  function getVideoFrameRateMode(vInfo, minfo) {
    var reg = /frame\s*rate\s*mode\s*:[^\r\n]+/gi;
    var res = vInfo[0].match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('video')) {
        minfo.video = {};
      }
      minfo.video.frameRateMode = str.trim();
    }
    return minfo;
  }

  function getVideoFrameRate(vInfo, minfo) {
    var reg = /frame\s*rate\s*:[^\r\n]+/gi;
    var res = vInfo[0].match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('video')) {
        minfo.video = {};
      }
      minfo.video.frameRate = str.trim();
    }
    return minfo;
  }

  function getVideoBitDepth(vInfo, minfo) {
    var reg = /bit\s*depth\s*:[^\r\n]+/gi;
    var res = vInfo[0].match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('video')) {
        minfo.video = {};
      }
      minfo.video.bitDepth = str.trim();
    }
    return minfo;
  }

  function getVideoStreamSize(vInfo, minfo) {
    var reg = /stream\s*size\s*:[^\r\n]+/gi;
    var res = vInfo[0].match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('video')) {
        minfo.video = {};
      }
      minfo.video.streamSize = str.trim();
    }
    return minfo;
  }

  function getVideoWritingLibrary(vInfo, minfo) {
    var reg = /writing\s*library\s*:[^\r\n]+/gi;
    var res = vInfo[0].match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('video')) {
        minfo.video = {};
      }
      minfo.video.writingLibrary = str.trim();
    }
    return minfo;
  }

  /**********************************************************************************
   * get audio value
   **********************************************************************************/
  function getAudioInfoContent() {
    var reg = /audio[\s*\#\d]*[\r\n][\s\S]*?[\r\n][\r\n]|audio[\s*\#\d]*[\r\n][\s\S]*/gi;
    var res = nfo.match(reg);
    return res || undefined;
  }

  function getAudioFormat(aInfo, minfo) {
    var reg = /format\s*:[^\r\n]+/gi;
    var res = aInfo[0].match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('audio')) {
        minfo.audio = {};
      }
      minfo.audio.format = str.trim();
    }
    return minfo;
  }

  function getAudioBitRateMode(aInfo, minfo) {
    var reg = /bit\s*rate\s*mode\s*:[^\r\n]+/gi;
    var res = aInfo[0].match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('audio')) {
        minfo.audio = {};
      }
      minfo.audio.bitRateMode = str.trim();
    }
    return minfo;
  }

  function getAudioBitRate(aInfo, minfo) {
    var reg = /bit\s*rate\s*:[^\r\n]+/gi;
    var res = aInfo[0].match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('audio')) {
        minfo.audio = {};
      }
      minfo.audio.bitRate = str.trim();
    }
    return minfo;
  }

  function getAudioChannel(aInfo, minfo) {
    var reg = /channel\(s\)\s*:[^\r\n]+/gi;
    var res = aInfo[0].match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('audio')) {
        minfo.audio = {};
      }
      minfo.audio.channel = str.trim();
    } else {
      reg = /channel\s*count\s*:[^\r\n]+/gi;
      res = aInfo[0].match(reg);
      str = res ? res[0] : undefined;
      if (str) {
        str = str.replace(/^[^\:]+.\s*/, '');
        if (!minfo.hasOwnProperty('audio')) {
          minfo.audio = {};
        }
        minfo.audio.channel = str.trim();
      }
    }
    return minfo;
  }

  function getAudioLanguage(aInfo, minfo) {
    aInfo.forEach(function (vi) {
      var reg = /language\s*:[^\r\n]+/gi;
      var res = vi.match(reg);
      var str = res ? res[0] : undefined;
      if (str) {
        str = str.replace(/^[^\:]+.\s*/, '');
        if (!minfo.hasOwnProperty('audio')) {
          minfo.audio = {};
        }
        if (!minfo.audio.hasOwnProperty('language')) {
          minfo.audio.language = [];
        }
        if (!minfo.audio.language.includes(str)) {
          minfo.audio.language.push(str.trim());
        }
      }
    });
    return minfo;
  }

  /**********************************************************************************
   * get text value
   **********************************************************************************/
  function getTextInfoContent() {
    var reg = /text[\s*\#\d]*[\r\n][\s\S]*?[\r\n][\r\n]|text[\s*\#\d]*[\r\n][\s\S]*/gi;
    var res = nfo.match(reg);
    return res || undefined;
  }

  function getTextLanguage(tInfo, minfo) {
    tInfo.forEach(function (vi) {
      var reg = /language\s*:[^\r\n]+/gi;
      var res = vi.match(reg);
      var str = res ? res[0] : undefined;
      if (str) {
        str = str.replace(/^[^\:]+.\s*/, '');
        if (!minfo.hasOwnProperty('text')) {
          minfo.text = {};
        }
        if (!minfo.text.hasOwnProperty('language')) {
          minfo.text.language = [];
        }
        if (!minfo.text.language.includes(str)) {
          minfo.text.language.push(str.trim());
        }
      }
    });
    return minfo;
  }

  /**********************************************************************************
   * get simple value
   **********************************************************************************/
  function getSimpleGeneralFileSize(gInfo, minfo) {
    var reg = /file[\s|\.]*size[\s|\.]*:[^\r\n]+/gi;
    var res = gInfo.match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('general')) {
        minfo.general = {};
      }
      minfo.general.fileSize = str.trim();
    }
    return minfo;
  }

  function getSimpleGeneralDuration(gInfo, minfo) {
    var reg = /duration[\s|\.]*:[^\r\n]+/gi;
    var res = gInfo.match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('general')) {
        minfo.general = {};
      }
      minfo.general.duration = str.trim();
    }
    return minfo;
  }

  function getSimpleGeneralRuntime(gInfo, minfo) {
    var reg = /run[\s|\.]*time[\s|\.]*:[^\r\n]+/gi;
    var res = gInfo.match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('general')) {
        minfo.general = {};
      }
      minfo.general.runtime = str.trim();
    }
    return minfo;
  }

  function getSimpleVideoBitRate(gInfo, minfo) {
    var reg = /(video)*[\s|\.]*bit[\s|\.]*rate[\s|\.]*:[^\r\n]+/gi;
    var res = gInfo.match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('video')) {
        minfo.video = {};
      }
      minfo.video.bitRate = str.trim();
    }
    return minfo;
  }

  function getSimpleVideoFrameRate(gInfo, minfo) {
    var reg = /frame[\s|\.]*rate[\s|\.]*:[^\r\n]+/gi;
    var res = gInfo.match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('video')) {
        minfo.video = {};
      }
      minfo.video.frameRate = str.trim();
    }
    return minfo;
  }

  function getSimpleVideoResolution(gInfo, minfo) {
    var reg = /resolution[\s|\.]*:[^\r\n]+/gi;
    var res = gInfo.match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('video')) {
        minfo.video = {};
      }
      minfo.video.resolution = str.trim();
    }
    return minfo;
  }

  function getSimpleAudioInfo(gInfo, minfo) {
    var reg = /audio\s*\#*\d*[\s|\.]*:[^\r\n]+/gi;
    var res = gInfo.match(reg);
    if (res) {
      res.forEach(function (ai) {
        var str = ai.replace(/^[^\:]+.\s*/, '');
        if (!minfo.hasOwnProperty('audio')) {
          minfo.audio = {};
        }
        if (!minfo.audio.hasOwnProperty('info')) {
          minfo.audio.info = [];
        }
        minfo.audio.info.push(str.trim());
      });
    }
    return minfo;
  }

  function getSimpleTextInfo(gInfo, minfo) {
    var reg = /subtitles*[\s|\.]*:[^\r\n]+/gi;
    var res = gInfo.match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      if (!minfo.hasOwnProperty('text')) {
        minfo.text = {};
      }
      if (!minfo.text.hasOwnProperty('language')) {
        minfo.text.language = [];
      }

      str = str.replace(/^[^\:]+.\s*/, '');
      if (!str.match(/\(|\)/)) {
        var stlist = str.split(/\/|\,/);
        stlist.forEach(function (st) {
          minfo.text.language.push(st.trim());
        });
      } else {
        // some value is "S_TEXT/ASS(chs/cht)", then do not split
        minfo.text.language.push(str.trim());
      }
    } else {
      reg = /subtitles\d[\s|\.]*:[^\r\n]+/gi;
      res = gInfo.match(reg);
      if (res) {
        res.forEach(function (st) {
          st = st.replace(/^[^\:]+.\s*/, '');
          if (!minfo.hasOwnProperty('text')) {
            minfo.text = {};
          }
          if (!minfo.text.hasOwnProperty('language')) {
            minfo.text.language = [];
          }
          minfo.text.language.push(st.trim());
        });
      }
    }
    return minfo;
  }

  //format start of  .plot
  function getSimpleGeneralReleaseSize(gInfo, minfo) {
    var reg = /release[\s|\.]*size[\s|\.]*:[^\r\n]+/gi;
    var res = gInfo.match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('general')) {
        minfo.general = {};
      }
      minfo.general.fileSize = str.trim();
    }
    return minfo;
  }

  function getSimpleVideoCodec(gInfo, minfo) {
    var reg = /video[\s|\.]*codec[\s|\.]*:[^\r\n]+/gi;
    var res = gInfo.match(reg);
    var str = res ? res[0] : undefined;
    if (str) {
      str = str.replace(/^[^\:]+.\s*/, '');
      if (!minfo.hasOwnProperty('video')) {
        minfo.video = {};
      }
      minfo.video.codec = str.trim();
    }
    return minfo;
  }

  function getSimpleAudioCodec(gInfo, minfo) {
    var reg = /audio[\s|\.]*codec[\s|\.]*:[^\r\n]+/gi;
    var res = gInfo.match(reg);
    if (res) {
      res.forEach(function (ac) {
        var str = ac.replace(/^[^\:]+.\s*/, '');
        if (!minfo.hasOwnProperty('audio')) {
          minfo.audio = {};
        }
        if (!minfo.audio.hasOwnProperty('codec')) {
          minfo.audio.codec = [];
        }
        minfo.audio.codec.push(str.trim());
      });
    }
    return minfo;
  }

};

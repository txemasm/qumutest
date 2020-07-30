(function() {
  var action, label, videoInfo, imPercents;

  window.widgets.forEach(function(widget) {
    var api = widget.api;
    api.init(function(err) {
      if (err) {
        return;
      }

      api.get('kulus', function(kulus) {
        videoInfo = kulus[0];
      });

      initQumu(videoInfo);

      api.bind('load', function() {
        action = 'qumu media begin';
        pushToDataLayer(action, label);
      });

      api.bind('play', function() {
        action = 'qumu media play';
        if (videoInfo.IMCurrentTime > 500) {
          pushToDataLayer(action, label);
        }
      });

      api.bind('pause', function() {
        action = 'qumu media pause';
        var timeToFinish = videoInfo.duration - videoInfo.IMCurrentTime;
        if (timeToFinish > 500) {
          pushToDataLayer(action, label);
        }
      });

      api.bind('ended', function() {
        action = 'qumu media complete';
        pushToDataLayer(action, label);
      });

      api.bind('unload', function() {
        var time = formatTime(videoInfo.IMCurrentTime);
        action = 'qumu ' + time + ' minutes watching';
        pushToDataLayer(action, label);
      });

      api.bind('timeupdate', function(currentTime) {
        var time = parseInt(currentTime);
        videoInfo.IMCurrentTime = currentTime;
        if (videoInfo.isLiveStream != true) {
          if (imPercents.quarter.hit && (time > imPercents.quarter.value && time < imPercents.half.value)) {
            imPercents.quarter.hit = false;
            action = 'qumu 25% milestone passed';
            pushToDataLayer(action, label);
          }
          if (imPercents.half.hit && (time > imPercents.half.value && time < imPercents.toQuarter.value)) {
            imPercents.half.hit = false;
            action = 'qumu 50% milestone passed';
            pushToDataLayer(action, label);
          }
          if (imPercents.toQuarter.hit && (time > imPercents.toQuarter.value && time < imPercents.total.value)) {
            imPercents.toQuarter.hit = false;
            action = 'qumu 75% milestone passed';
            pushToDataLayer(action, label);
          }
        } else {
          var remainder = time % 60000;
          if (time > 500 && remainder < 250) {
            var formattedTime = formatTime(videoInfo.IMCurrentTime);
            action = 'qumu ' + formattedTime + ' minutes watching';
		        pushToDataLayer(action, label);
          }
        }
      })
    });
  });

  function initQumu(videoInfo) {
    calculatePercents();
    videoInfo.initTime = 0;
    videoInfo.isLiveStream = isLiveStream();
    var formattedTime = formatTime(videoInfo.duration);
    label = isLiveStream() ? videoInfo.guid + ' | ' + videoInfo.title : videoInfo.guid + ' | ' + videoInfo.title + ' | ' + formattedTime;
  }

  function calculatePercents() {
    var durationMs = videoInfo.duration;
    var quarterMs = durationMs * 0.25;
    var halfMs = durationMs * 0.5;
    var toQuarterMs = durationMs * 0.75;
    var totalMs = durationMs;
    imPercents = {
      'quarter': {
        value: quarterMs,
        hit: true
      },
      'half': {
        value: halfMs,
        hit: true
      },
      'toQuarter': {
        value: toQuarterMs,
        hit: true
      },
      'total': {
        value: totalMs,
        hit: true
      }
    }
  }

  function isLiveStream() {
    if (jQuery("div [guid=" + videoInfo.guid + "]").closest("#live-stream").length > 0) {
      return true;
    }
    return false;
  }

  function formatTime(ms) {
    var seconds = ms / 1000;
    var hours = parseInt(seconds / 3600);
    hours = ("0" + hours).slice(-2);
    seconds = seconds % 3600;
    var minutes = parseInt(seconds / 60);
    minutes = ("0" + minutes).slice(-2);
    seconds = seconds % 60;
    seconds = seconds.toFixed();
    seconds = ("0" + seconds).slice(-2);
    return (hours + ':' + minutes + ':' + seconds);
  }

  function pushToDataLayer(action,label) {
    window.dataLayer.push({
      event: 'videoEvent',
      videoAction: action,
      videoLabel: label
    });
  }
})();
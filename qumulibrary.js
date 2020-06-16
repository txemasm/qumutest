(function() {
  var action, label;

  function isLiveStream() {
    if (jQuery("div [guid=" + window.IM_QUMU.guid + "]").closest("#live-stream").length > 0) {
      return true;
    }
    return false;
  }

  function calculatePercents() {
    var durationMs = window.IM_QUMU.duration;
    var quarterMs = durationMs * 0.25;
    var halfMs = durationMs * 0.5;
    var toQuarterMs = durationMs * 0.75;
    var totalMs = durationMs;
    window.IM_QUMU.impercents = {
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
    };
  }
  window.widgets.forEach(function(widget) {
    var api = widget.api;
    api.init(function(err) {
      if (err) {
        return;
      }

      function initQumu(kulu) {
        window.IM_QUMU = kulu;
        window.IM_QUMU.initTime = 0;
        window.IM_QUMU.isLiveStream = isLiveStream();
        var formattedTime = formatTime(window.IM_QUMU.duration);
        label = isLiveStream() ? window.IM_QUMU.guid + ' | ' + window.IM_QUMU.title : window.IM_QUMU.guid + ' | ' + window.IM_QUMU.title + ' | ' + formattedTime;
      }
      api.bind('load', function(kulu) {
        initQumu(kulu);
        calculatePercents();
        action = 'QUMU Media Begin';
        pushToDataLayer(action, label);
      });
      api.bind('play', function(kulu) {
        action = 'QUMU Media Play';
        if (window.IM_QUMU.IMCurrentTime > 500) {
        	pushToDataLayer(action, label);
        }
      });
      api.bind('pause', function(kulu) {
        action = 'QUMU Media Pause';
        pushToDataLayer(action, label);
      });
      api.bind('ended', function(kulu) {
        action = 'QUMU Media Complete';
        pushToDataLayer(action, label);
      });
      api.bind('unload', function() {
        var time = formatTime(window.IM_QUMU.IMCurrentTime);
        action = 'QUMU ' + time + ' Minutes Watching';
        pushToDataLayer(action, label);
      });
      api.bind('timeupdate', function(currentTime) {
        var time = parseInt(currentTime);
        window.IM_QUMU.IMCurrentTime = currentTime;
        if (window.IM_QUMU.isLiveStream != true) {
          var quarterPercent = true;
          var halfPercent = true;
          var toQuartePercent = true;
          var total = true;
          var percents = window.IM_QUMU.impercents;
          if (window.IM_QUMU && window.IM_QUMU.impercents) {
            if (percents.quarter.hit && (time > percents.quarter.value && time < percents.half.value)) {
              percents.quarter.hit = false;
              action = 'QUMU 25% Milestones Passed';
			pushToDataLayer(action, label);
            }
            if (percents.half.hit && (time > percents.half.value && time < percents.toQuarter.value)) {
              percents.half.hit = false;
              action = 'QUMU 50% Milestones Passed';
        		pushToDataLayer(action, label);
            }
            if (percents.toQuarter.hit && (time > percents.toQuarter.value && time < percents.total.value)) {
              percents.toQuarter.hit = false;
              action = 'QUMU 75% Milestones Passed';
			pushToDataLayer(action, label);
            }
          }
        } else {
          var remainder = time % 60000;
          if (time > 500 && remainder < 250) {
            var formattedTime = formatTime(window.IM_QUMU.IMCurrentTime);
            action = 'QUMU ' + formattedTime + ' Minutes Watching';
		  pushToDataLayer(action, label);
          }
        }
      })
    });
  });
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
      event: 'analyticsEvent',
        eventData: {
          category: 'Engagement',
          action: action,
          label: label
        }
    });
  }
})();

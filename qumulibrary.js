(function() {
  var action, label, videoInfo, imPercents;

  function isLiveStream() {
    //if (jQuery("div [guid=" + window.IM_QUMU.guid + "]").closest("#live-stream").length > 0) {
    if (jQuery("div [guid=" + videoInfo.guid + "]").closest("#live-stream").length > 0) {
      return true;
    }
    return false;
  }

  function calculatePercents() {
    //var durationMs = window.IM_QUMU.duration;
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
    /*window.IM_QUMU.impercents = {
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
    };*/
  }
  window.widgets.forEach(function(widget) {
    var api = widget.api;
    //var widgetLoaded = widget;
    //var guid = jQuery(widgetLoaded).find('div[guid]').attr('guid');
    api.init(function(err) {
      if (err) {
        return;
      }
      api.get('kulus', function(kulus) {
        videoInfo = kulus[0];
      });
      initQumu(videoInfo);  
      api.bind('load', function() {
        //initQumu(kulu);
        //calculatePercents();
        action = 'QUMU Media Begin';
        pushToDataLayer(action, label);
      });
      api.bind('play', function() {
        //checkInitialization();
        action = 'QUMU Media Play';
        //if (window.IM_QUMU.IMCurrentTime > 500) {
        if (videoInfo.IMCurrentTime > 500) {
          pushToDataLayer(action, label);
        }
      });
      api.bind('pause', function() {
        //checkInitialization();
        action = 'QUMU Media Pause';
        pushToDataLayer(action, label);
      });
      api.bind('ended', function() {
        //checkInitialization();
        action = 'QUMU Media Complete';
        pushToDataLayer(action, label);
      });
      api.bind('unload', function() {
        //checkInitialization();
        //var time = formatTime(window.IM_QUMU.IMCurrentTime);
        var time = formatTime(videoInfo.IMCurrentTime);
        action = 'QUMU ' + time + ' Minutes Watching';
        pushToDataLayer(action, label);
      });
      api.bind('timeupdate', function(currentTime) {
        //checkInitialization();
        var time = parseInt(currentTime);
        //window.IM_QUMU.IMCurrentTime = currentTime;
        videoInfo.IMCurrentTime = currentTime;
        //if (window.IM_QUMU.isLiveStream != true) {
        if (videoInfo.isLiveStream != true) {
          var quarterPercent = true;
          var halfPercent = true;
          var toQuartePercent = true;
          var total = true;
          //var percents = window.IM_QUMU.impercents;
          //if (window.IM_QUMU && window.IM_QUMU.impercents) {
          
            //if (percents.quarter.hit && (time > percents.quarter.value && time < percents.half.value)) {
            if (imPercents.quarter.hit && (time > imPercents.quarter.value && time < imPercents.half.value)) {
              //percents.quarter.hit = false;
              imPercents.quarter.hit = false;
              action = 'QUMU 25% Milestones Passed';
			        pushToDataLayer(action, label);
            }
            //if (percents.half.hit && (time > percents.half.value && time < percents.toQuarter.value)) {
            if (imPercents.half.hit && (time > imPercents.half.value && time < imPercents.toQuarter.value)) {
              //percents.half.hit = false;
              imPercents.half.hit = false;
              action = 'QUMU 50% Milestones Passed';
        		  pushToDataLayer(action, label);
            }
            //if (percents.toQuarter.hit && (time > percents.toQuarter.value && time < percents.total.value)) {
            if (imPercents.toQuarter.hit && (time > imPercents.toQuarter.value && time < imPercents.total.value)) {
              //percents.toQuarter.hit = false;
              imPercents.toQuarter.hit = false;
              action = 'QUMU 75% Milestones Passed';
			        pushToDataLayer(action, label);
            }
          //}
        } else {
          var remainder = time % 60000;
          if (time > 500 && remainder < 250) {
            //var formattedTime = formatTime(window.IM_QUMU.IMCurrentTime);
            var formattedTime = formatTime(videoInfo.IMCurrentTime);
            action = 'QUMU ' + formattedTime + ' Minutes Watching';
		        pushToDataLayer(action, label);
          }
        }
      })
    });
    
    /*function checkInitialization() {
        if (!window.IM_QUMU) {
            api.get('kulus', function(kulus) {
                initQumu(kulus[0]); 
            });
        }
    }*/
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
  function initQumu(videoInfo) {
    //window.IM_QUMU = kulu;
    //window.IM_QUMU.initTime = 0;
    calculatePercents();
    videoInfo.initTime = 0;
    //window.IM_QUMU.isLiveStream = isLiveStream();
    videoInfo.isLiveStream = isLiveStream();
    //var formattedTime = formatTime(window.IM_QUMU.duration);
    var formattedTime = formatTime(videoInfo.duration);
    //label = isLiveStream() ? window.IM_QUMU.guid + ' | ' + window.IM_QUMU.title : window.IM_QUMU.guid + ' | ' + window.IM_QUMU.title + ' | ' + formattedTime;
    label = isLiveStream() ? videoInfo.guid + ' | ' + videoInfo.title : videoInfo.guid + ' | ' + videoInfo.title + ' | ' + formattedTime;
  }
})();
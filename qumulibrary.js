(function () {
  function qumuTagging() {
      if(window.jQuery) {
          clearInterval(qumuTimer);
          consoleDebugger('start tagging');
          var action, label, videoInfo, videos = {};
          var ACTIONS = {
              'play': 'play',
              'pause': 'pause',
              'begin': 'begin',
              'ended': 'complete',
              'milestone_passed': 'milestone passed',
              'minutes_watching': 'minutes watching',
              'qumu': 'qumu',
              'media': 'media'
          }
          var DEBUGGER = {
              'bind': ' event binded for video: ',
              'push': ' event pushed to dataLayer for video: ',
              'bind_push': ' event binded and pushed to dataLayer for video: '
          }

          window.widgets.forEach(function (widget) {
              var api = widget.api;
              api.init(function (err) {
                  if (err) {
                      return;
                  }

                  api.get('kulus', function (kulus) {
                      videoInfo = kulus[0];
                      initVideosQumu(videoInfo);
                  });

                  api.bind('load', function () {
                      getCurrentVideo();
                      action = getAction('load');
                      pushToDataLayer(action, label);
                      consoleDebugger('load' + DEBUGGER.bind_push + videoInfo.guid);
                  });

                  api.bind('play', function () {
                      getCurrentVideo();
                      action = getAction('play');
                      consoleDebugger('play' + DEBUGGER.bind + videoInfo.guid);
                      if (videoInfo.currentTime > 500 || !videoInfo.vod) {
                          pushToDataLayer(action, label);
                          consoleDebugger('play' + DEBUGGER.push + videoInfo.guid);
                      }
                  });

                  api.bind('pause', function () {
                      getCurrentVideo();
                      action = getAction('pause');
                      consoleDebugger('pause' + DEBUGGER.bind + videoInfo.guid);
                      var timeToFinish = videoInfo.duration - videoInfo.currentTime;
                      if (timeToFinish > 500 || !videoInfo.vod) {
                          pushToDataLayer(action, label);
                          consoleDebugger('pause' + DEBUGGER.push + videoInfo.guid);
                      }
                  });

                  api.bind('ended', function () {
                      getCurrentVideo();
                      action = getAction('ended');
                      pushToDataLayer(action, label);
                      consoleDebugger('ended' + DEBUGGER.bind_push + videoInfo.guid);
                  });

                  api.bind('unload', function () {
                      getCurrentVideo();
                      var time = formatTime(videoInfo.currentTime);
                      action = getAction('unload', time);
                      pushToDataLayer(action, label);
                      consoleDebugger('unload' + DEBUGGER.bind_push + videoInfo.guid);
                  });

                  api.bind('timeupdate', function (currentTime) {
                      getCurrentVideo();
                      var time = parseInt(currentTime);
                      videoInfo.currentTime = currentTime;
                      var percents = videos[videoInfo.guid].percents;
                      if (videoInfo.vod) {
                          if (percents.quarter.hit && (time > percents.quarter.value && time < percents.half.value)) {
                              percents.quarter.hit = false;
                              action = getAction('timeupdate', '25%');
                              pushToDataLayer(action, label);
                              consoleDebugger('25%' + DEBUGGER.push + videoInfo.guid);
                          }
                          if (percents.half.hit && (time > percents.half.value && time < percents.toQuarter.value)) {
                              percents.half.hit = false;
                              action = getAction('timeupdate', '50%');
                              pushToDataLayer(action, label);
                              consoleDebugger('50%' + DEBUGGER.push + videoInfo.guid);
                          }
                          if (percents.toQuarter.hit && (time > percents.toQuarter.value && time < percents.total.value)) {
                              percents.toQuarter.hit = false;
                              action = getAction('timeupdate', '75%');
                              pushToDataLayer(action, label);
                              consoleDebugger('75%' + DEBUGGER.push + videoInfo.guid);
                          }
                      } else {
                          var remainder = time % 60000;
                          if (time > 500 && remainder < 250) {
                              var formattedTime = formatTime(videoInfo.currentTime);
                              action = getAction('unload', formattedTime);
                              pushToDataLayer(action, label);
                              consoleDebugger('75%' + DEBUGGER.push + videoInfo.guid);
                          }
                      }
                  });
                  function getCurrentVideo() {
                      api.get('kulus', function (kulus) {
                          videoInfo = videos[kulus[0].guid];
                      });
                  }
              });
          });

          consoleDebugger(videos);

          function initVideosQumu(video) {
              videos[video.guid] = video;
              videos[video.guid].percents = calculatePercentsVideo(video);
              var formattedTime = formatTime(videoInfo.duration);
              videos[video.guid].label = videos[video.guid].vod ? video.guid + ' | ' + video.title + ' | ' + formattedTime : video.guid + ' | ' + video.title;
          }

          function calculatePercentsVideo(video) {
              var durationMs = video.duration;
              var quarterMs = durationMs * 0.25;
              var halfMs = durationMs * 0.5;
              var toQuarterMs = durationMs * 0.75;
              var totalMs = durationMs;
              var percents = {
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
              return percents;
          }

          function getAction(action, time) {
              var names = {
                  'load': ACTIONS.media + ' ' + ACTIONS['begin'],
                  'play': ACTIONS.media + ' ' + ACTIONS['play'],
                  'pause': ACTIONS.media + ' ' + ACTIONS['pause'],
                  'ended': ACTIONS.media + ' ' + ACTIONS['ended'],
                  'unload': ACTIONS.media + ' ' + time + ' ' + ACTIONS['minutes_watching'],
                  'timeupdate': ACTIONS.media + ' ' + time + ' ' + ACTIONS['milestone_passed']
              };
              return ACTIONS.qumu + ' ' + names[action];
          };

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

          function pushToDataLayer(action, label) {
              window.dataLayer.push({
                  event: 'videoEvent',
                  videoAction: action,
                  videoLabel: label || videoInfo.label
              });
          }
      } else {
          tryCounter++;
          consoleDebugger('jQuery not loaded in page. try: ' + tryCounter);
          if (tryCounter >= 10) {
              clearInterval(qumuTimer);
              consoleDebugger('stop qumu tagging');
          }
      }
  }
  function consoleDebugger(message) {
    if(sessionStorage.getItem('imDebug')){
        console.log('%c 🎥 Qumu ', 'background: #0077C8; color: #FFFFFF; font-weight: bold; font-size: 12px; padding: 2px; vertical-align: middle', message);
    }
  }
  if (typeof (window.batQumuTracking) === 'undefined') {
    var qumuTimer = setInterval(qumuTagging, 500);
    var tryCounter = 0
    window.batQumuTracking = true;
  } else {
    consoleDebugger('tracking library loaded');
  }
})();
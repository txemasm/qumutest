
(function (window) {

  function initTracking() {
    function _getDeviceType() {
      return window.DEVICE_TYPE === 'IsDesktop' ? 'web' : 'mobile';
    }
    function _setEventData(category, action, label) {
      return {
        'category': category,
        'action': action,
        'label': label
      }
    }
    function _setContextData() {
      var platform = getDeviceType();
      return {
        'platform': platform,
        'country': 'mt'
      }
    }
    function _setPageData(currentStep) {
      var pageTitle = {
        '1': 'datos_personales',
        '2': 'datos_contacto',
        '3': 'datos_acceso'
      }
      if (currentStep) {
        return {
          'origin': undefined,
          'filter': undefined,
          'isTagged': undefined,
          'section': 'usuario',
          'pageType': 'registro',
          'pageTitle': pageTitle[currentStep]
        }
      } else {
        return {
          'origin': undefined,
          'filter': undefined,
          'isTagged': undefined,
          'section': undefined,
          'pageType': undefined,
          'pageTitle': undefined
        }
      }
    }
    function _setDepositData() {
      return {
        'isQuickdeposit': undefined,
        'paymentType': undefined,
        'firstDeposit': undefined
      }
    }

    function _setTicketData() {
      return {
        'betType': undefined,
        'amount': undefined
      }
    }

    function _setEcommerce() {
      return undefined;
    }
    function _setUserData() {
      var userInfo = window.UserInfo.current;
      if (userInfo != undefined) {
        var userStatus = [];
        if (user.IsAccountVerified === 1) {
          userStatus.push('verificado');
        } else {
          userStatus.push('no_verificado');
        }
        if (user.IsSelfExcluded === 1) {
          userStatus.push('autoexcluido');
        }
        return {
          'isLogged': 'si',
          'balance': userInfo.TotalBalance,
          'gender': undefined,
          'age': undefined,
          'province': undefined,
          'status': userStatus.join('|'),
          'id': userInfo.userId,
          'balanceEnough': undefined,
          'coupon': undefined,
          'openBets': undefined
        }
      } else {
        return {
          'isLogged': 'no'
        }
      }
    }
    function sendPageview(currentStep) {
      window.dataLayer.push({
        'event': 'imPageview',
        'context': _setContextData(),
        'user': _setUserData(),
        'page': _setPageData(currentStep),
        'deposit': _setDepositData(),
        'ticket': _setTicketData(),
        'ecommerce': _setEcommerce()
      });
    }
    function sendAnalyticsEvent() {
      window.dataLayer.push({
        'event': 'imAnalyticsEvent',
        'eventData': _setEventData(),
        'context': _setContextData(),
        'user': _setUserData(),
        'page': _setPageData(),
        'deposit': _setDepositData(),
        'ticket': _setTicketData(),
        'ecommerce': _setEcommerce()
      });
    }
    


    var commonTracking = {
      sendPageview: sendPageview ,
      sendAnalyticsEvent: sendAnalyticsEvent
    }
    return commonTracking;
  }

  if (typeof (window.batTracking) === 'undefined') {
    window.batTracking = initTracking();
  }

})(window);












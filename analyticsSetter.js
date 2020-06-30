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
      var platform = _getDeviceType();
      return {
        'platform': platform,
        'country': 'mt'
      }
    }
    function _setPageData(section, pageType, pageTitle) {
      return {
        'origin': undefined,
        'filter': undefined,
        'isTagged': undefined,
        'section': section,
        'pageType': pageType,
        'pageTitle': pageTitle
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

    function _getUserId(userInfo) {
      var userInfo = userInfo || window.UserInfo.current || {};
      return userInfo.userId;
    }

    function _getUserStatus(userInfo) {
      var userInfo = userInfo || window.UserInfo.current || {};
      var userStatus = [];
      if (userInfo.IsAccountVerified === 1) {
        userStatus.push('verificado');
      } else {
        userStatus.push('no_verificado');
      }
      if (userInfo.IsSelfExcluded === 1) {
        userStatus.push('autoexcluido');
      }
      return userStatus.join('|');
    }

    function _getUserLogged(userInfo) {
      var userInfo = userInfo || window.UserInfo.current;
      if (userInfo) {
        return 'si'
      }
      return 'no';
    }
    function _getUserBalance(userInfo) {
      var userInfo = userInfo || window.UserInfo.current || {};
      return userInfo.TotalBalance;
    }

    function _setUserData() {
      var userInfo = window.UserInfo.current;
      return {
        'isLogged': _getUserLogged(userInfo),
        'balance': _getUserBalance(userInfo),
        'gender': undefined,
        'age': undefined,
        'province': undefined,
        'status': _getUserStatus(userInfo),
        'id': _getUserId(userInfo),
        'balanceEnough': undefined,
        'coupon': undefined,
        'openBets': undefined
      }
    }
    function sendPageview(section, pageType, pageTitle) {
      window.dataLayer.push({
        'event': 'imPageview',
        'context': _setContextData(),
        'user': _setUserData(),
        'page': _setPageData(section, pageType, pageTitle),
        'deposit': _setDepositData(),
        'ticket': _setTicketData(),
        'ecommerce': undefined
      });
    }
    function sendEcommercePageview() {
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

    function sendAnalyticsEvent(category, action, label) {
      window.dataLayer.push({
        'event': 'imAnalyticsEvent',
        'eventData': _setEventData(category, action, label),
        'context': _setContextData(),
        'user': _setUserData(),
        'page': _setPageData(),
        'deposit': _setDepositData(),
        'ticket': _setTicketData(),
        'ecommerce': undefined
      });
    }
    function sendEcommerceEvent() {
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

    function getPageTitles() {
      return {
        DATOS_PERSONALES: 'datos_personales',
        DATOS_CONTACTO: 'datos_contacto',
        DATOS_ACCESO: 'datos_acceso'
      }
    }
    function getPageTypes() {
      return {
        REGISTRO: 'registro'
      }
    }
    function getPageSections() {
      return {
        USUARIO: 'usuario'
      }
    }

    var commonTracking = {
      sendPageview: sendPageview,
      sendAnalyticsEvent: sendAnalyticsEvent,
      sendEcommercePageview: sendEcommercePageview,
      sendEcommerceEvent: sendEcommerceEvent,
      PAGETITLE: getPageTitles(),
      PAGETYPE: getPageTypes(),
      SECTION: getPageSections()
    }
    return commonTracking;
  }

  if (typeof (window.batTag) === 'undefined') {
    window.batTag = initTracking();
  }

})(window);
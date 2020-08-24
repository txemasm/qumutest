(function (window) {

  function initTracking() {
    var PAGETITLES = {
      DATOS_PERSONALES: 'datos_personales',
      DATOS_CONTACTO: 'datos_contacto',
      DATOS_ACCESO: 'datos_acceso',
      VERIFICAR_IDENTIDAD: 'verificar_identidad',
      CONFIRMACION: 'confirmacion'
    };
    var PAGETYPES = {
      REGISTRO: 'registro',
      MENU_DEPOSITAR: 'menu/depositar'
    };
    var SECTIONS = {
      USUARIO: 'usuario'
    };
    var CATEGORIES = {
      REGISTRO_PASO: 'registro_paso',
      REGISTRO_PASO1: 'registro_paso1',
      REGISTRO_PASO2: 'registro_paso2',
      REGISTRO_PASO3: 'registro_paso3'
    };
    var ACTIONS = {
      ATRAS: 'atras',
      SIGUIENTE: 'siguiente',
      ERROR_REGISTRO: 'error_registro',
      ERROR_SERVIDOR: 'error_servidor',
      REGISTRATE: 'registrate'
    };
    var LABELS = {
      PASO: 'paso',
      PASO_1: 'paso_1',
      PASO_2: 'paso_2',
      PASO_3: 'paso_3'
    };

    //Se sobrescribe la función para añadir nuestra llamada de analítica. 
    try {
      RegistrationGoogleAnalyticsHelper.prototype.registrationError = function (n, t) {
        timeControl && timeControl.initialized ? this.processRegistrationEvent(RegistrationGoogleAnalyticsHelperConsts.RegErrorEvent, n) : window.RegistrationGoogleAnalyticsQueue.push({
          eventName: RegistrationGoogleAnalyticsHelperConsts.RegErrorEvent,
          stepIndex: n,
          errorKey: t
        })
        sendErrorFormRegister(n, t)
      }
    }
    catch(e) {
      //console.log("No está definida");
    }


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
        'type': pageType,
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
      if (userInfo.IsSelfExcluded === 1) {
        return 'autoexcluido';
      }
      if (userInfo.IsAccountVerified === 1) {
        return 'verificado';
      } else {
        return 'no_verificado';
      }

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
        'event_data': _setEventData(category, action, label),
        'context': _setContextData(),
        'user': _setUserData(),
        'deposit': _setDepositData(),
        'ticket': _setTicketData(),
        'ecommerce': undefined
      });
    }
    function sendEcommerceEvent() {
      window.dataLayer.push({
        'event': 'imAnalyticsEvent',
        'event_data': _setEventData(),
        'context': _setContextData(),
        'user': _setUserData(),
        'page': _setPageData(),
        'deposit': _setDepositData(),
        'ticket': _setTicketData(),
        'ecommerce': _setEcommerce()
      });
    }

    function sendRegistrationPageview(currentStep) {
      var registrationPageTitle = {
        '1': PAGETITLES.DATOS_PERSONALES,
        '2': PAGETITLES.DATOS_CONTACTO,
        '3': PAGETITLES.DATOS_ACCESO
      };
      var section = SECTIONS.USUARIO;
      var pageType = PAGETYPES.REGISTRO;
      var pageTitle = registrationPageTitle[currentStep];

      sendPageview(section, pageType, pageTitle);
    }

    function sendDepositPage(){
      if(window.UserInfo.current) {
        var section = SECTIONS.USUARIO;
        var pageType = PAGETYPES.MENU_DEPOSITAR;
        sendPageview(section, pageType);
      }
    }

    function sendErrorFormRegister(step, errorKey) {
      var category = CATEGORIES.REGISTRO_PASO + step;
      var action = ACTIONS.ERROR_REGISTRO;
      var label = errorKey;
      sendAnalyticsEvent(category, action, label);
    }
    var commonTracking = {
      sendPageview: sendPageview,
      sendAnalyticsEvent: sendAnalyticsEvent,
      sendEcommercePageview: sendEcommercePageview,
      sendEcommerceEvent: sendEcommerceEvent,
      sendRegistrationPageview: sendRegistrationPageview,
      sendErrorFormRegister: sendErrorFormRegister,
      sendDepositPage:sendDepositPage,
      PAGETITLE: PAGETITLES,
      PAGETYPE: PAGETYPES,
      SECTION: SECTIONS,
      CONSTANTS: {
        PAGETITLE: PAGETITLES,
        PAGETYPE: PAGETYPES,
        SECTION: SECTIONS,
        ACTION: ACTIONS,
        CATEGORY: CATEGORIES,
        LABEL: LABELS
      },
      batVersion: '1.0.0'
    }
    return commonTracking;
  }

  if (typeof (window.batTag) === 'undefined') {
    window.batTag = initTracking();
  }

})(window);
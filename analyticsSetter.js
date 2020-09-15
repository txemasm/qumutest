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
      HEADER: 'header',
      REGISTRO_PASO: 'registro_paso',
      REGISTRO_PASO1: 'registro_paso1',
      REGISTRO_PASO2: 'registro_paso2',
      REGISTRO_PASO3: 'registro_paso3',
      LOGIN: 'login'
    };
    var ACTIONS = {
      ATRAS: 'atras',
      SIGUIENTE: 'siguiente',
      ERROR_REGISTRO: 'error_registro',
      ERROR_SERVIDOR: 'error_servidor',
      REGISTRATE: 'registrate',
      IR_REGISTRO: 'ir_registro',
      IR_LOGIN: 'ir_login',
      IR_DEPOSITO: 'ir_deposito'

    };
    var LABELS = {
      PASO: 'paso',
      PASO_1: 'paso_1',
      PASO_2: 'paso_2',
      PASO_3: 'paso_3'
    };

    //Se sobrescriben las funciones para adaptarlas a nuestra analítica. 
    try {
      RegistrationGoogleAnalyticsHelper.prototype.registrationError = function (n, t) {
        timeControl && timeControl.initialized ? this.processRegistrationEvent(RegistrationGoogleAnalyticsHelperConsts.RegErrorEvent, n) : window.RegistrationGoogleAnalyticsQueue.push({
          eventName: RegistrationGoogleAnalyticsHelperConsts.RegErrorEvent,
          stepIndex: n,
          errorKey: t
        })
        sendErrorFormRegister(n, t)
      }
      window.GoogleAnalyticsHelper = function () {
        function i(n) {
          return n + " Step Form"
        }
        function r(i, r) {
          t(i, r, n.Loaded)
        }
        function u(i, r) {
          t(i, r, n.Complete)
        }
        function f(i) {
          t(i, i, n.Verified)
        }
        function t(n, t, r) {
          console.log('length of steps: ' + n); //steps
          console.log('value of current step: ' + t);
          console.log('value of type: ' + r);
          var u = i(n);
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "registrationStep" + r,
            eventCategory: "Registration",
            eventAction: 'step_' + t,
            eventLabel: r,
            eventValue: "" + t,
            stepsLength: n
          })
        }
        var n = {
          Loaded: "Loaded",
          Complete: "Complete",
          Verified: "Verified"
        };
        return window.dataLayer = window.dataLayer || [],
        {
          sendStepLoadedEvent: r,
          sendStepCompletedEvent: u,
          sendStepVerifiedEvent: f,
          overwrited: true
        }
      }();

    }
    catch (e) {
      //console.log("No está definida");
    }


    function _addHeaderEventListeners() {
      if (document.querySelector("#hr-mid-Top_ResponsiveHeader_16020")) {
        clearInterval(checkHeader);
        var joinNowHeaderButton, loginHeaderButtonMobile, listenerAction;
        if (window.DEVICE_TYPE === 'mobile') {
          joinNowHeaderButton = document.querySelector("#hr-top-Top_ResponsiveHeader_19160-page-header-right5");
          loginHeaderButtonMobile = document.querySelector("#hr-top-Top_ResponsiveHeader_19160-page-header-right4");
          listenerAction = 'mouseup touchend';
        } else {
          joinNowHeaderButton = document.querySelector("#hr-mid-Top_ResponsiveHeader_16020-page-header-right1");
          loginHeaderButton = document.querySelector("#hr-mid-Top_ResponsiveHeader_16020-page-header-right2");
          listenerAction = 'mouseup';
        }

        /*JOIN NOW BUTTON*/
        if (joinNowHeaderButton) {
          joinNowHeaderButton.addEventListener(listenerAction, function (e) {
            var category = batTag.CONSTANTS.CATEGORY.HEADER;
            var action = batTag.CONSTANTS.ACTION.IR_REGISTRO;
            batTag.sendAnalyticsEvent(category, action);
          });
        }

        /*LOGIN BUTTON*/
        if (loginHeaderButton) {
          loginHeaderButton.addEventListener(listenerAction, function (e) {
            var category = batTag.CONSTANTS.CATEGORY.HEADER;
            var action = batTag.CONSTANTS.ACTION.IR_LOGIN;
            batTag.sendAnalyticsEvent(category, action);
          });
        }

        /*DEPOSIT BUTTON*/
        var depositHeaderButton = document.getElementsByClassName('page-header-deposit-button')[0];
        if (depositHeaderButton) {
          depositHeaderButton.addEventListener(listenerAction, function (e) {
            var category = batTag.CONSTANTS.CATEGORY.HEADER;
            var action = batTag.CONSTANTS.ACTION.IR_DEPOSITO;
            batTag.sendAnalyticsEvent(category, action);
          });
        }
      }
  }
  var checkHeader = setInterval(_addHeaderEventListeners, 1000);

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
      '3': PAGETITLES.DATOS_ACCESO,
      '4': PAGETITLES.VERIFICAR_IDENTIDAD,
      '5': PAGETITLES.CONFIRMACION
    };
    var section = SECTIONS.USUARIO;
    var pageType = PAGETYPES.REGISTRO;
    var pageTitle = registrationPageTitle[currentStep];

    sendPageview(section, pageType, pageTitle);
  }

  function sendDepositPage() {
    if (window.UserInfo.current) {
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
    sendDepositPage: sendDepositPage,
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

}) (window);
function setEventData(category, action, label) {
	return {
      'category': category,
      'action': action,
      'label': label
    }
}

function setContextData() {
  var platform = window.DEVICE_TYPE === 'IsDesktop' ? 'web' : 'mobile';
	return {
        'platform': platform,
        'country': 'mt'
	}
}

function setUserData() {
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

function setPageData(currentStep) {
	var pageTitle = {
		'1': 'datos_personales',
		'2': 'datos_contacto',
		'3': 'datos_acceso'
	}
	if (currentStep) {
			'origin': undefined, 
			'filter': undefined, 
			'isTagged': undefined, 
			'section': 'usuario', 
			'pageType': 'registro', 
			'pageTitle': pageTitle[currentStep]
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

function setDepositData() {
	return {
        'isQuickdeposit': undefined,
        'paymentType': undefined,
        'firstDeposit': undefined
	}
}

function setTicketData() {
	return {
        'betType': undefined,
        'amount': undefined
    }
}

function setEcommerce() {
	return undefined;
}

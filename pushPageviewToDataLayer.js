function pushPageviewToDataLayer(currentStep) {
  window.dataLayer.push({
    'event': 'imPageview',
    'context': setContextData(),
    'user': setUserData(), 
    'page': setPageData(currentStep), 
    'deposit': setDepositData(), 
    'ticket': setTicketData(),
    'ecommerce': setEcommerce()
    });
 }

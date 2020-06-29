function pushPageviewToDataLayer() {
  window.dataLayer.push({
    event: 'imPageview',
    context: setContextData(),
    user: setUserData(), 
	  page: setPageData(), 
	  deposit: setDepositData(), 
	  ticket: setTicketData(),
	  ecommerce: setEcommerce()
    });
 }

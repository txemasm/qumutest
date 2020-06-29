function pushEventToDataLayer() {
    window.dataLayer.push({
    	event: 'imAnalyticsEvent',
      	eventData: setEventData(),
        context: setContextData(),
    	user: setUserData(), 
		page: setPageData(), 
		deposit: setDepositData(), 
		ticket: setTicketData(),
		ecommerce: setEcommerce()
    });
 }

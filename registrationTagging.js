function registrationTagging() {
    var currentStep = document.querySelector('.stepwise-registration').getAttribute('data-current-step');
    pushPageviewToDataLayer(currentStep);
 };

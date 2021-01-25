function registrationPageviewTagging() {
    var currentStep = document.querySelector('.stepwise-registration').getAttribute('data-current-step');
    var registrationPageTitle = {
        '1': 'DATOS_PERSONALES',
        '2': 'DATOS_CONTACTO',
        '3': 'DATOS_ACCESO'
    }
    
    var section = batTag.SECTION.USUARIO;
    var pageType = batTag.PAGETYPE.REGISTRO;
    var pageTitle = batTag.PAGETITLES[registrationPageTitle[currentStep]];

    batTag.sendPageview(section, pageType, pageTitle);
}

function registrationEventTagging() {
    var nextStepButton = document.querySelectorAll("input[data-uat='registration-next-button']");
    var progressTabs = document.getElementsByClassName('stepwise-registration__tab');
    var action, label;
    clickerFn = function() {
        var currentStep = document.querySelector('.stepwise-registration').getAttribute('data-current-step');
        if (RegistrationUtils.getStepWithError() != currentStep) {
            action = 'siguiente';
            label = 'paso_' + (currentStep + 1);
        } else {
            action = 'error_registro';
            label = 'error';
        }
        batTag.sendAnalyticsEvent('registro_paso' + currentStep, action, label);
    }
    clickerProgressTabsFn = function() {
        var currentStep = document.querySelector('.stepwise-registration').getAttribute('data-current-step');
        var clickedStep = this.getAttribute('data-step');
        console.log(this.getAttribute('data-step'));
        if (RegistrationUtils.getStepWithError() != currentStep && clickedStep < currentStep) {
            action = 'atrás';
            label = 'paso_' + clickedStep;
            batTag.sendAnalyticsEvent('registro_paso' + currentStep, action, label);
        } else if (RegistrationUtils.getStepWithError() != currentStep && clickedStep > currentStep){
            action = 'siguiente';
            label = 'paso_' + clickedStep;
            batTag.sendAnalyticsEvent('registro_paso' + currentStep, action, label);
        }
    }
    for (var i=0; i < nextStepButton.length; i++) {
        nextStepButton.item(i).onclick = clickerFn;
    }
    for (var i=0; i < progressTabs.length; i++) {
        progressTabs.item(i).onclick = clickerProgressTabsFn;
    }
}
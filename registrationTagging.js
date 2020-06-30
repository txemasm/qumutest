var currentStep = document.querySelector('.stepwise-registration').getAttribute('data-current-step');

function registrationTagging() {
    var section = batTag.SECTION.USUARIO;
    var pageType = batTag.PAGETYPE.REGISTRO;
    var pageTitle = batTag.PAGETITLE[currentStep];

    batTag.sendPageview(section, pageType, pageTitle);
}

function registrationEventTagging() {
    var nextStepButton = document.querySelectorAll("input[data-uat='registration-next-button']");
    clickerFn = function() {
        batTag.sendAnalyticsEvent('registro_paso' + currentStep, 'siguiente', 'paso_' + currentStep);
    }
    for (var i=0; i < nextStepButton.length; i++) {
        nextStepButton.item(i).onclick = clickerFn;
    }
}

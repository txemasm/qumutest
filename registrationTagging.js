function registrationTagging() {
    var currentStep = document.querySelector('.stepwise-registration').getAttribute('data-current-step');
    pushPageviewToDataLayer(currentStep);
}

function registrationEventTagging() {
    var currentStep = document.querySelector('.stepwise-registration').getAttribute('data-current-step');
    var nextStepButton = document.querySelectorAll("input[data-uat='registration-next-button']");
    clickerFn = function() {
        pushEventToDataLayer(currentStep);
    }
    for (var i=0; i < nextStepButton.length; i++) {
        nextStepButton.item(i).onclick = clickerFn;
    }
}

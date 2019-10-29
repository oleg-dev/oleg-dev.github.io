window.addEventListener('load', function () {

    var form = document.querySelector('form');
    var preloader = document.querySelector('.preloader-wrapper');
    var submitButton = form.querySelector('#submitFormData');
    var firstName = form.querySelector('input[name="firstName"]');
    var lastName = form.querySelector('input[name="lastName"]');
    var email = form.querySelector('input[name="Email"]');
    var emailConfirmation = form.querySelector('input[name="Email confirmation"]');
    var country = form.querySelector('select[name="Country"]');
    var successMessage = document.querySelector('p.status-message.success');
    var failureMessage = document.querySelector('p.status-message.failure');
    var notRespond = document.querySelector('p.status-message.not-respond');
    var userRegisteredMessage = document.querySelector('p.status-message.user-registered');
    var inputsText = form.querySelectorAll('input[type=text]');
    var xhr = new XMLHttpRequest();

    // Fix for IE

    (function () {
        if ( typeof window.CustomEvent === "function" ) return false; //If not IE
        function CustomEvent ( event, params ) {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            var evt = document.createEvent( 'CustomEvent' );
            evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
            return evt;
        }
        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
    })();

    firstName.addEventListener('change', validateFirstName);
    lastName.addEventListener('change', validateLastName);
    country.addEventListener('change', validateCountry);
    email.addEventListener('change', checkConfirmation);
    email.addEventListener('change', validateEmail);
    emailConfirmation.addEventListener('change', checkConfirmation);
    submitButton.addEventListener('click', submitForm);

    var eventTimeout = new Event("timeout", {
        cancelable: true
    });
    var isValidFirstName = false,
        isValidLaststName = false,
        isValidEmail = false,
        isConfirmedEmail = false,
        isValidCountry = false;

    function submitForm(event) {

        validateFirstName();
        validateLastName();
        checkConfirmation();
        validateEmail();
        validateCountry();

        if (!failureMessage.classList.contains('hidden')) {
            failureMessage.classList.add('hidden');
        }

        if(!isValidFirstName || !isValidLaststName || !isValidEmail || !isValidCountry || !isConfirmedEmail) {
            return
        }

        var data = {
            "email": email.value,
            "lastname": lastName.value,
            "firstname": firstName.value,
            "country": country.value,
            "eventdefkey": "APIEvent-8d1e2422-6b64-bbad-bd71-5851485ae044"
        };

        xhr.withCredentials = false;

        form.classList.add('hidden');
        preloader.classList.remove('hidden');

        xhr.open("POST", "https://webinar-custom-activity.herokuapp.com/fireevent");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.setRequestHeader("Access-Control-Max-Age", "3600");
        xhr.setRequestHeader("Accept", "*/*");
        xhr.setRequestHeader("Access-Control-Allow-Origin", "gzip, deflate");
        xhr.send(JSON.stringify(data));
        xhr.addEventListener("readystatechange", handleResponse);
        xhr.addEventListener('timeout',handleTimeout);

        setTimeout(function(){
            xhr.removeEventListener("readystatechange",handleResponse);
            xhr.abort();
            xhr.dispatchEvent(eventTimeout);
        },20000)

    }

    function checkConfirmation() {

        if (email.value != emailConfirmation.value || emailConfirmation.value=='') {
            emailConfirmation.style.border = '1px solid red';
            isConfirmedEmail=false;
        } else {
            isConfirmedEmail=true;
            removeStyleProperty(email, 'border');
            removeStyleProperty(emailConfirmation, 'border');
        }

    }

    function removeStyleProperty(elem, property) {
        if (elem.style.removeProperty) {
            elem.style.removeProperty(property);
        } else {
            elem.style.removeAttribute(property);
        }
    }

    function handleResponse() {

        if (this.readyState === 4) {

            switch (JSON.parse(this.responseText).status){

                case 404:
                    disableTimeout();
                    failureMessage.classList.remove('hidden');
                    break;
                case 400:
                    disableTimeout();
                    userRegisteredMessage.classList.remove('hidden');
                    break;
                case 201:
                    disableTimeout();
                    successMessage.classList.remove('hidden');
                    break;
            }

        }
    }

    function handleTimeout() {
        preloader.classList.add('hidden');
        notRespond.classList.remove('hidden');
    }

    function validateFirstName(){
        if ( firstName.value.trim().length < 1 || firstName.value.length > 256) {
            firstName.style.border = '1px solid red';
            isValidFirstName=false;
        } else {
            isValidFirstName = true;
            firstName.style.border = '1px solid #2573BA';
        }
    }

    function validateLastName(){
        if ( lastName.value.trim().length < 1 || lastName.value.length > 256) {
            lastName.style.border = '1px solid red';
            isValidLaststName=false;
        } else {
            isValidLaststName=true;
            lastName.style.border = '1px solid #2573BA';
        }
    }

    function validateCountry(){

        if (country.value == 0) {
            country.style.border = '1px solid red';
            isValidCountry=false;
        } else {
            isValidCountry=true;
            country.style.border = '1px solid #2573BA';
        }
    }

    function validateEmail() {
        var regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var validEmail = regEx.test(email.value);
        if (!validEmail) {
            email.style.border = '1px solid red';
            email.style.border = '1px solid red';
            isValidEmail=false;
        } else {
            isValidEmail=true;
            email.style.border = '1px solid #2573BA';
        }
    }

    function disableTimeout() {
        xhr.removeEventListener("timeout",handleTimeout);
        preloader.classList.add('hidden');
    }
});
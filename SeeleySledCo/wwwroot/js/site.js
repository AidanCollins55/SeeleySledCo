// ========================================
// MOBILE NAVIGATION
// ========================================

(function () {
    var toggle = document.getElementById('nav-toggle');
    var links = document.getElementById('nav-links');

    if (!toggle || !links) return;

    function closeMenu() {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
    }

    function openMenu() {
        links.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Close menu');
    }

    toggle.addEventListener('click', function () {
        if (links.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 760) {
            closeMenu();
        }
    });
})();


// ========================================
// TRIP INQUIRY / PRICE ESTIMATOR
// ========================================

(function () {
    var form = document.getElementById('inquiry-form');

    if (!form) return;

    var success = document.getElementById('form-success');
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var GUIDE_RATES = {
        'Full-Day Private Guide': {
            1: 600,
            2: 700,
            3: 750,
            4: 800,
            5: 875,
            6: 900
        },
        'Half-Day Private Guide': {
            1: 450,
            2: 500,
            3: 600,
            4: 700,
            5: 875,
            6: 1050
        }
    };

    function formatGuideFee(trip, riders) {
        var table = GUIDE_RATES[trip];

        if (!table) return null;

        riders = Math.max(
            1,
            Math.min(6, parseInt(riders, 10) || 1)
        );

        var total = table[riders];
        var pp = Math.round(total / riders);

        return {
            riders: riders,
            total: total,
            pp: pp
        };
    }


    // ========================================
    // UPDATE PRICE ESTIMATE
    // ========================================

    function updatePriceEstimate() {
        var box = document.getElementById('price-estimate');
        var totalEl = document.getElementById('price-estimate-total');
        var ppEl = document.getElementById('price-estimate-pp');

        if (!box) return;

        var trip = form.trip.value;
        var ridersRaw = parseInt(form.riders.value, 10) || 1;

        var result = formatGuideFee(trip, ridersRaw);

        if (!result) {
            box.hidden = true;
            return;
        }

        box.hidden = false;

        if (ridersRaw > 6) {

            totalEl.textContent =
                'Contact us — 6+ riders needs a 2nd guide';

            ppEl.textContent = '—';

        } else if (result.riders === 1) {

            totalEl.textContent =
                '$' + result.total.toLocaleString();

            ppEl.textContent =
                '$' + result.total.toLocaleString() + ' / person';

        } else {

            totalEl.textContent =
                '$' + result.total.toLocaleString() + ' total';

            ppEl.textContent =
                '$' + result.pp.toLocaleString() + ' / person';
        }
    }


    form.trip.addEventListener(
        'change',
        updatePriceEstimate
    );

    form.riders.addEventListener(
        'input',
        updatePriceEstimate
    );

    updatePriceEstimate();


    // ========================================
    // FORM VALIDATION
    // ========================================

    function setError(input, errEl, show) {

        if (show) {

            input.setAttribute(
                'aria-invalid',
                'true'
            );

            errEl.classList.add('show');

        } else {

            input.removeAttribute(
                'aria-invalid'
            );

            errEl.classList.remove('show');
        }
    }


    function validate() {

        var ok = true;

        var name =
            form.name.value.trim();

        var phone =
            form.phone.value.trim();

        var email =
            form.email.value.trim();


        var nameBad =
            name.length === 0;

        setError(
            form.name,
            document.getElementById('err-name'),
            nameBad
        );

        if (nameBad) ok = false;


        var phoneBad =
            phone.length < 7;

        setError(
            form.phone,
            document.getElementById('err-phone'),
            phoneBad
        );

        if (phoneBad) ok = false;


        var emailBad =
            email.length === 0 ||
            !emailPattern.test(email);

        setError(
            form.email,
            document.getElementById('err-email'),
            emailBad
        );

        if (emailBad) ok = false;


        return ok;
    }


    ['name', 'phone', 'email'].forEach(
        function (fieldName) {

            form[fieldName].addEventListener(
                'input',
                function () {

                    if (
                        form[fieldName]
                            .getAttribute('aria-invalid')
                        === 'true'
                    ) {
                        validate();
                    }

                }
            );

        }
    );


    // ========================================
    // FORM SUBMISSION
    // ========================================

    form.addEventListener(
        'submit',
        function (e) {

            e.preventDefault();

            success.classList.remove('show');


            if (!validate()) {

                var firstInvalid =
                    form.querySelector(
                        '[aria-invalid="true"]'
                    );

                if (firstInvalid) {
                    firstInvalid.focus();
                }

                return;
            }


            var name =
                form.name.value.trim();

            var phone =
                form.phone.value.trim();

            var email =
                form.email.value.trim();

            var trip =
                form.trip.value;

            var date =
                form.date.value.trim();

            var days =
                form.days.value.trim();

            var riders =
                form.riders.value.trim();

            var experience =
                form.experience.value;

            var rental =
                form.rental.value;

            var message =
                form.message.value.trim();


            var subject =
                encodeURIComponent(
                    'Trip Request from ' +
                    (name || 'your website') +
                    ' - ' +
                    trip
                );


            var priceResult =
                formatGuideFee(
                    trip,
                    riders
                );


            var priceLine =
                'Estimated Guide Fee: contact for a quote';


            if (priceResult) {

                if (
                    parseInt(riders, 10) > 6
                ) {

                    priceLine =
                        'Estimated Guide Fee: 6+ riders, needs a 2nd guide, contact for a quote';

                } else if (
                    priceResult.riders === 1
                ) {

                    priceLine =
                        'Estimated Guide Fee: $' +
                        priceResult.total +
                        ' (guide fee only, sled rental not included)';

                } else {

                    priceLine =
                        'Estimated Guide Fee: $' +
                        priceResult.total +
                        ' total / $' +
                        priceResult.pp +
                        ' per person (guide fee only, sled rental not included)';
                }
            }


            var bodyLines = [

                'TRIP REQUEST',

                'Name: ' + name,

                'Phone: ' + phone,

                'Email: ' + email,

                'Trip Type: ' + trip,

                priceLine,

                'Requested Date: ' +
                (date || 'not specified'),

                'Number of Days: ' +
                days,

                'Number of Riders: ' +
                riders,

                'Riding Experience: ' +
                experience,

                'Rental Needed: ' +
                rental,

                '',

                'Special Requests:',

                message
            ];


            var body =
                encodeURIComponent(
                    bodyLines.join('\n')
                );


            success.classList.add('show');


            window.location.href =
                'mailto:seeleysledco@gmail.com' +
                '?subject=' +
                subject +
                '&body=' +
                body;
        }
    );

})();
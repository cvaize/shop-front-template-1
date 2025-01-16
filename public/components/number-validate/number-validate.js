'use strict';
;(function () {
    'use strict';

    let numElements = document.querySelectorAll('.js-number-validate');

    for (let i = 0; i < numElements.length; i++) {
        let numElement = numElements[i];
        numElement.addEventListener('change', validate);
        numElement.addEventListener('input', validate);
        numElement.addEventListener('keyup', validate);
        numElement.addEventListener('paste', validate);
    }

    function validate() {
        if (this.min) this.value = Math.max(parseInt(this.min), parseInt(this.value) || 0);
        if (this.max) this.value = Math.min(parseInt(this.max), parseInt(this.value) || 0);
    }
})();
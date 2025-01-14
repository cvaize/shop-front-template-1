'use strict';
;(function () {
    'use strict';

    let pageElement;

    function handleReadyFancybox() {
        if(window.Fancybox) {
            document.removeEventListener('Fancybox:Ready', handleReadyFancybox);
            if (!pageElement) return;
            pageElement.classList.add('shop-support__fancybox--loaded');
            window.Fancybox.bind("[data-fancybox='article']");
        }
    }


    function destroy() {
        document.removeEventListener('Fancybox:Ready', handleReadyFancybox);
    }

    function init() {
        destroy();
        pageElement = document.querySelector('.shop-support');

        if (!pageElement) return;

        document.addEventListener('Fancybox:Ready', handleReadyFancybox);
        handleReadyFancybox();
    }

    init();
})();
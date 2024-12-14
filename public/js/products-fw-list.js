'use strict';
(function () {
    'use strict';

    function handleSubmitFavorite(event) {
        event.preventDefault();
        let btn = event.target.querySelector('.shop-products-fw-list-item-favorite-btn');
        btn.classList.add('shop-loading');
        setTimeout(function () {
            let isActive = btn.classList.contains('shop-active');
            btn.classList.remove('shop-loading');
            if (isActive) {
                btn.classList.remove('shop-active');
            } else {
                btn.classList.add('shop-active');
            }
        }, 1000);
    }

    function destroy() {
        let favoriteForms = document.querySelectorAll('.shop-products-fw-list-item-favorite');
        for (let i = 0; i < favoriteForms.length; i++) {
            favoriteForms[i].removeEventListener('submit', handleSubmitFavorite);
        }
    }

    function init() {
        destroy();
        let favoriteForms = document.querySelectorAll('.shop-products-fw-list-item-favorite');
        for (let i = 0; i < favoriteForms.length; i++) {
            favoriteForms[i].addEventListener('submit', handleSubmitFavorite);
        }
    }
    init();
})();
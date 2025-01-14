'use strict';
(function () {
    'use strict';

    let sliders = [];

    function off(eventName, elements, handler) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].removeEventListener(eventName, handler);
        }
    }

    function on(eventName, elements, handler) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].addEventListener(eventName, handler);
        }
    }

    function handleSubmitFavorite(event) {
        event.preventDefault();
        let btn = event.target.querySelector('.shop-products__item__favorite__btn');
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

    function handleSlidesInView(api) {
        let slider = api.customData;
        let index = slider.api.selectedScrollSnap();
        for (let i = 0; i < slider.controlsNode.children.length; i++) {
            if (i === index) {
                slider.controlsNode.children[i].classList.add('shop-active');
            } else {
                slider.controlsNode.children[i].classList.remove('shop-active');
            }
        }
    }

    function handleReadySlider() {
        if (window.EmblaCarousel) {
            off('EmblaCarousel:Ready', [document], handleReadySlider);
            const sliderNodes = document.querySelectorAll('.shop-products__item');
            for (let i = 0; i < sliderNodes.length; i++) {
                const sliderNode = sliderNodes[i];
                const viewportNode = sliderNode.querySelector('.shop-products__item__images__viewport');
                const containerNode = sliderNode.querySelector('.shop-products__item__images__pictures');
                const controlsNode = sliderNode.querySelector('.shop-products__item__images__controls');
                let slider = {sliderNode}
                if (viewportNode) {
                    slider.viewportNode = viewportNode;
                    slider.containerNode = containerNode;
                    slider.controlsNode = controlsNode;
                    slider.length = containerNode.children.length;
                    slider.api = window.EmblaCarousel(viewportNode, {
                        loop: true,
                        breakpoints: {
                            '(min-width: 992px)': {
                                active: false
                            },
                            '(max-width: 991px)': {
                                active: true
                            }
                        }
                    });
                    slider.api.off('slidesInView', handleSlidesInView);
                    slider.api.on('slidesInView', handleSlidesInView);
                    slider.api.customData = slider;
                }
                if (slider.api) sliders.push(slider);
            }
        }
    }

    function destroy() {
        let favoriteForms = document.querySelectorAll('.shop-products__item__favorite');
        for (let i = 0; i < favoriteForms.length; i++) {
            favoriteForms[i].removeEventListener('submit', handleSubmitFavorite);
        }
        off('EmblaCarousel:Ready', [document], handleReadySlider);
        for (let i = 0; i < sliders.length; i++) {
            sliders[i].api.destroy();
        }
        sliders = [];
    }

    function init() {
        destroy();
        let favoriteForms = document.querySelectorAll('.shop-products__item__favorite');
        for (let i = 0; i < favoriteForms.length; i++) {
            favoriteForms[i].addEventListener('submit', handleSubmitFavorite);
        }
        on('EmblaCarousel:Ready', [document], handleReadySlider);
        handleReadySlider();
    }

    init();
})();
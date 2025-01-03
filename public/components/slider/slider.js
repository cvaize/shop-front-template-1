'use strict';
;(function () {
    'use strict';

    let sliders = [];

    function isIterable(obj) {
        if (obj == null) return false;
        return typeof obj[Symbol.iterator] === 'function';
    }

    function off(eventName, elements, handler) {
        if (!isIterable(elements)) elements = [elements];
        for (let i = 0; i < elements.length; i++) {
            elements[i].removeEventListener(eventName, handler);
        }
    }

    function on(eventName, elements, handler) {
        if (!isIterable(elements)) elements = [elements];
        for (let i = 0; i < elements.length; i++) {
            elements[i].addEventListener(eventName, handler);
        }
    }

    function handleNextSlide(e) {
        if (e.target.slider) e.target.slider.api.scrollNext();
    }

    function handlePrevSlide(e) {
        if (e.target.slider) e.target.slider.api.scrollPrev();
    }

    function handleSlidesInView(api) {
        let slider = api.customData;
        let index = slider.api.selectedScrollSnap();
        let prevIndex = index - 1;
        let nextIndex = index + 1;
        if (prevIndex < 0) prevIndex = slider.length - 1;
        if (nextIndex > (slider.length - 1)) nextIndex = 0;
        for (let j = 0; j < slider.length; j++) {
            if (prevIndex === j) {
                slider.containerNode.children[j].classList.add('shop-slider__slide--prev');
            } else if (nextIndex === j) {
                slider.containerNode.children[j].classList.add('shop-slider__slide--next');
            } else {
                slider.containerNode.children[j].classList.remove('shop-slider__slide--prev', 'shop-slider__slide--next');
            }
        }
    }

    function handleReadySlider() {
        if (window.EmblaCarousel) {
            off('EmblaCarousel:Ready', document, handleReadySlider);
            const sliderNodes = document.querySelectorAll('.shop-slider');
            for (let i = 0; i < sliderNodes.length; i++) {
                const sliderNode = sliderNodes[i];
                const viewportNode = sliderNode.querySelector('.shop-slider__viewport');
                const containerNode = sliderNode.querySelector('.shop-slider__container');
                const nextNode = sliderNode.querySelector('.shop-slider__next');
                const prevNode = sliderNode.querySelector('.shop-slider__prev');
                let slider = {sliderNode}
                sliderNode.classList.add('shop-slider--init');
                if (viewportNode) {
                    slider.viewportNode = viewportNode;
                    slider.containerNode = containerNode;
                    slider.length = containerNode.children.length;
                    slider.api = window.EmblaCarousel(viewportNode, {
                        loop: true,
                        breakpoints: {
                            '(min-width: 471px)' : {
                                watchDrag: false
                            },
                            '(max-width: 470px)' : {
                                watchDrag: true
                            }
                        }
                    });
                    slider.api.off('slidesInView', handleSlidesInView);
                    slider.api.on('slidesInView', handleSlidesInView);
                    slider.api.customData = slider;
                }
                if (nextNode) {
                    slider.nextNode = nextNode;
                    nextNode.slider = slider;
                    off('click', nextNode, handleNextSlide);
                    on('click', nextNode, handleNextSlide);
                }
                if (prevNode) {
                    slider.prevNode = prevNode;
                    prevNode.slider = slider;
                    off('click', prevNode, handlePrevSlide);
                    on('click', prevNode, handlePrevSlide);
                }
                if (slider.api) sliders.push(slider);
            }
        }
    }

    function destroy() {
        off('EmblaCarousel:Ready', document, handleReadySlider);
        for (let i = 0; i < sliders.length; i++) {
            sliders[i].api.destroy();
        }
        sliders = [];
    }

    function init() {
        destroy();
        on('EmblaCarousel:Ready', document, handleReadySlider);
        handleReadySlider();
    }

    init();
})();
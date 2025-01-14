'use strict';
;(function () {
    'use strict';

    let pageElement;
    let thumbs;
    let images;
    let topBtn;
    let bottomBtn;
    let scrollElement;
    let scrollViewer;
    let attributeValuesElements;
    let submitBtn;
    let imagesSlider;
    let imagesSliderEmblaApi;
    let comparisonForm;
    let favoriteForm;

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

    function switchThumbnail(target) {
        let elements = target.closest('.shop-product__images__thumbs__scroll__viewer').children;

        for (let i = 0; i < elements.length; i++) {
            if (elements[i] === target && images[i]) {
                elements[i].classList.add('shop-active');
                images[i].classList.add('shop-active');
            } else {
                elements[i].classList.remove('shop-active');
                images[i].classList.remove('shop-active');
            }
        }
    }

    function handleClickThumb(event) {
        event.preventDefault();

        requestAnimationFrame(function () {
            let target = event.target.classList.contains('shop-product__images__thumb') ?
                event.target :
                event.target.closest('.shop-product__images__thumb');

            switchThumbnail(target);
        });
    }

    function handleClickTopBtn(event) {
        event.preventDefault();
        const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if (width >= 1400) {
            let value = scrollElement.scrollTop - 300;
            if (value < 50) value = 0;
            scrollElement.scrollTo({
                top: value,
                behavior: "smooth",
            });
        } else {
            let value = scrollElement.scrollLeft - 150;
            if (value < 50) value = 0;
            scrollElement.scrollTo({
                left: value,
                behavior: "smooth",
            });
        }
    }

    function handleClickBottomBtn(event) {
        event.preventDefault();
        const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if (width >= 1400) {
            scrollElement.scrollTo({
                top: scrollElement.scrollTop + 300,
                behavior: "smooth",
            });
        } else {
            scrollElement.scrollTo({
                left: scrollElement.scrollLeft + 150,
                behavior: "smooth",
            });
        }
    }

    function handleScrollThumbs(event) {
        event && event.preventDefault();
        requestAnimationFrame(function () {
            const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            if (width >= 1400) {
                let scrollViewerHeight = scrollViewer.getBoundingClientRect().height;
                let scrollElementHeight = scrollElement.getBoundingClientRect().height;
                let topBtnBlock = topBtn.parentNode;
                let bottomBtnBlock = bottomBtn.parentNode;

                if (scrollViewerHeight <= scrollElementHeight) {
                    topBtnBlock.style.display = 'none';
                    bottomBtnBlock.style.display = 'none';
                    return;
                }

                if (scrollElement.scrollTop > 30) {
                    if (topBtnBlock.style.display !== 'block') topBtnBlock.style.display = 'block';
                } else {
                    if (topBtnBlock.style.display !== 'none') topBtnBlock.style.display = 'none';
                }

                if (scrollElement.scrollTop > (scrollViewerHeight - scrollElementHeight)) {
                    if (bottomBtnBlock.style.display !== 'none') bottomBtnBlock.style.display = 'none';
                } else {
                    if (bottomBtnBlock.style.display !== 'block') bottomBtnBlock.style.display = 'block';
                }
            } else {
                let scrollViewerWidth = scrollViewer.getBoundingClientRect().width;
                let scrollElementWidth = scrollElement.getBoundingClientRect().width;
                let topBtnBlock = topBtn.parentNode;
                let bottomBtnBlock = bottomBtn.parentNode;

                if (scrollViewerWidth <= scrollElementWidth) {
                    topBtnBlock.style.display = 'none';
                    bottomBtnBlock.style.display = 'none';
                    return;
                }

                if (scrollElement.scrollLeft > 30) {
                    if (topBtnBlock.style.display !== 'block') topBtnBlock.style.display = 'block';
                } else {
                    if (topBtnBlock.style.display !== 'none') topBtnBlock.style.display = 'none';
                }

                if (scrollElement.scrollLeft > (scrollViewerWidth - scrollElementWidth)) {
                    if (bottomBtnBlock.style.display !== 'none') bottomBtnBlock.style.display = 'none';
                } else {
                    if (bottomBtnBlock.style.display !== 'block') bottomBtnBlock.style.display = 'block';
                }
            }
        });
    }

    function handleClickAttributeValue(event) {
        event && event.preventDefault();
        let target = event.target.classList.contains('shop-product__attribute__value') ?
            event.target :
            event.target.closest('.shop-product__attribute__value');

        if (submitBtn) submitBtn.classList.add('shop-loading');

        for (let i = 0; i < target.parentElement.children.length; i++) {
            let el = target.parentElement.children[i];
            if (el === target) {
                el.classList.add('shop-active');
            } else {
                el.classList.remove('shop-active');
            }
        }

        setTimeout(function () {
            if (submitBtn) submitBtn.classList.remove('shop-loading');
        }, 1000);
    }

    function oneMinusUpload(form) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, 1000);
        });
    }

    function submittingOneMinus(form) {
        let btn = form.querySelector('.shop-product__count__minus__submit');
        btn.classList.add('shop-loading');
    }

    function submittedOneMinus(data, form) {
        let btn = form.querySelector('.shop-product__count__minus__submit');
        btn.classList.remove('shop-loading');
    }

    function oneMinus(event) {
        event.preventDefault();
        submittingOneMinus(event.target);
        oneMinusUpload(event.target).then(function (data) {
            submittedOneMinus(data, event.target);
        }).catch(function (data) {
            submittedOneMinus(data, event.target);
        });
    }

    function onePlusUpload(form) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, 1000);
        });
    }

    function submittingOnePlus(form) {
        let btn = form.querySelector('.shop-product__count__plus__submit');
        btn.classList.add('shop-loading');
    }

    function submittedOnePlus(data, form) {
        let btn = form.querySelector('.shop-product__count__plus__submit');
        btn.classList.remove('shop-loading');
    }

    function onePlus(event) {
        event.preventDefault();
        submittingOnePlus(event.target);
        onePlusUpload(event.target).then(function (data) {
            submittedOnePlus(data, event.target);
        }).catch(function (data) {
            submittedOnePlus(data, event.target);
        });
    }

    function setCountUpload(form) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, 1000);
        });
    }

    function submittingSetCount(form) {
        let label = form.querySelector('.shop-product__count__label');
        label.classList.add('shop-loading');
    }

    function submittedSetCount(data, form) {
        let label = form.querySelector('.shop-product__count__label');
        label.classList.remove('shop-loading');
    }

    function setCount(event) {
        event.preventDefault();
        let target = event.target.tagName === 'FORM' ? event.target : event.target.closest('form');
        submittingSetCount(target);
        setCountUpload(target).then(function (data) {
            submittedSetCount(data, target);
        }).catch(function (data) {
            submittedSetCount(data, target);
        });
    }

    function handleReInitImageSlider() {
        requestAnimationFrame(initImageSlider);
    }

    function initImageSlider() {
        if (!imagesSlider) return;
        if (window.innerWidth > 470) {
            off('resize', [window], handleReInitImageSlider);
            on('resize', [window], handleReInitImageSlider);
            if (imagesSliderEmblaApi) {
                imagesSliderEmblaApi.destroy();
                imagesSliderEmblaApi = null;
            }
            return;
        }
        off('resize', [window], handleReInitImageSlider);
        if (imagesSliderEmblaApi) return;

        imagesSliderEmblaApi = window.EmblaCarousel(imagesSlider, {loop: false});
    }

    function initFancybox() {
        if (!imagesSlider || !pageElement) return;
        pageElement.classList.add('shop-product__fancybox--loaded');
        window.Fancybox.bind("[data-fancybox='product']", {
            on: {
                "Carousel.ready Carousel.change": (fancybox) => {
                    const slide = fancybox.getSlide();
                    if (scrollViewer && scrollViewer.children) {
                        let target = scrollViewer.children[slide.index];
                        target && switchThumbnail(target);
                        if (imagesSliderEmblaApi) {
                            imagesSliderEmblaApi.scrollTo(slide.index);
                        }
                    }
                },
            },
        });
    }

    function handleReadyImageSlider() {
        if (window.EmblaCarousel) {
            off('EmblaCarousel:Ready', [document], handleReadyImageSlider);
            initImageSlider();
        }
    }

    function handleReadyFancybox() {
        if (window.Fancybox) {
            off('Fancybox:Ready', [document], handleReadyFancybox);
            initFancybox();
        }
    }

    function comparisonUpload(form) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, 1000);
        });
    }

    function submittingComparison(form) {
        let btn = form.querySelector('.shop-product__comparison__btn');
        btn.classList.add('shop-loading');
    }

    function submittedComparison(data, form) {
        let btn = form.querySelector('.shop-product__comparison__btn');
        btn.classList.remove('shop-loading');
        if (btn.classList.contains('shop-active')) {
            btn.classList.remove('shop-active');
        } else {
            btn.classList.add('shop-active');
        }
    }

    function handleSubmitComparison(event) {
        event.preventDefault();
        let target = event.target.tagName === 'FORM' ? event.target : event.target.closest('form');
        submittingComparison(target);
        comparisonUpload(target).then(function (data) {
            submittedComparison(data, target);
        }).catch(function (data) {
            submittedComparison(data, target);
        });
    }

    function favoriteUpload(form) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, 1000);
        });
    }

    function submittingFavorite(form) {
        let btn = form.querySelector('.shop-product__favorite__btn');
        btn.classList.add('shop-loading');
    }

    function submittedFavorite(data, form) {
        let btn = form.querySelector('.shop-product__favorite__btn');
        btn.classList.remove('shop-loading');
        if (btn.classList.contains('shop-active')) {
            btn.classList.remove('shop-active');
        } else {
            btn.classList.add('shop-active');
        }
    }

    function handleSubmitFavorite(event) {
        event.preventDefault();
        let target = event.target.tagName === 'FORM' ? event.target : event.target.closest('form');
        submittingFavorite(target);
        favoriteUpload(target).then(function (data) {
            submittedFavorite(data, target);
        }).catch(function (data) {
            submittedFavorite(data, target);
        });
    }

    function destroy() {
        if (attributeValuesElements) off('click', attributeValuesElements, handleClickAttributeValue);
        if (thumbs) off('click', thumbs, handleClickThumb);
        if (topBtn) off('click', [topBtn], handleClickTopBtn);
        if (bottomBtn) off('click', [bottomBtn], handleClickBottomBtn);
        if (scrollElement) off('scroll', [scrollElement], handleScrollThumbs);
        off('EmblaCarousel:Ready', [document], handleReadyImageSlider);
        off('Fancybox:Ready', [document], handleReadyFancybox);

        if (comparisonForm) off('submit', [comparisonForm], handleSubmitComparison);
        if (favoriteForm) off('submit', [favoriteForm], handleSubmitFavorite);
    }

    function init() {
        destroy();
        pageElement = document.querySelector('.shop-product');

        if (!pageElement) {
            return;
        }

        thumbs = pageElement.querySelectorAll('.shop-product__images__thumb');
        images = pageElement.querySelectorAll('.shop-product__images__slider__slide');
        topBtn = pageElement.querySelector('.shop-product__images__top__btn');
        bottomBtn = pageElement.querySelector('.shop-product__images__bottom__btn');
        scrollElement = pageElement.querySelector('.shop-product__images__thumbs__scroll');
        scrollViewer = pageElement.querySelector('.shop-product__images__thumbs__scroll__viewer');
        attributeValuesElements = pageElement.querySelectorAll('.shop-product__attribute__value');
        submitBtn = pageElement.querySelector('.shop-product__submit');
        imagesSlider = pageElement.querySelector('.shop-product__images__slider');
        comparisonForm = pageElement.querySelector('.shop-product__comparison');
        favoriteForm = pageElement.querySelector('.shop-product__favorite');


        on('submit', pageElement.querySelectorAll('.shop-product__count__minus'), oneMinus);
        on('submit', pageElement.querySelectorAll('.shop-product__count__plus'), onePlus);
        on('submit', pageElement.querySelectorAll('.shop-product__count__setter'), setCount);
        on('change', pageElement.querySelectorAll('.shop-product__count__setter'), setCount);

        on('click', attributeValuesElements, handleClickAttributeValue);
        on('click', thumbs, handleClickThumb);

        on('click', [topBtn], handleClickTopBtn);
        on('click', [bottomBtn], handleClickBottomBtn);
        on('scroll', [scrollElement], handleScrollThumbs);
        handleScrollThumbs();

        on('submit', [comparisonForm], handleSubmitComparison);
        on('submit', [favoriteForm], handleSubmitFavorite);

        if (imagesSlider) {
            on('EmblaCarousel:Ready', [document], handleReadyImageSlider);
            handleReadyImageSlider();
            on('Fancybox:Ready', [document], handleReadyFancybox);
            handleReadyFancybox();
        }
    }

    init();
})();
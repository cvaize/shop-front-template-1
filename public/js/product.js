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

    function removeEventListener(eventName, elements, handler) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].removeEventListener(eventName, handler);
        }
    }

    function addEventListener(eventName, elements, handler) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].addEventListener(eventName, handler);
        }
    }

    function handleClickThumb(event) {
        event.preventDefault();

        requestAnimationFrame(function () {
            let target = event.target.classList.contains('shop-product-images-thumb') ?
                event.target :
                event.target.closest('.shop-product-images-thumb');

            let elements = target.closest('.shop-product-images-thumbs-scroll-viewer').children;

            for (let i = 0; i < elements.length; i++) {
                if (elements[i] === target && images[i]) {
                    elements[i].classList.add('shop-active');
                    images[i].classList.add('shop-active');
                } else {
                    elements[i].classList.remove('shop-active');
                    images[i].classList.remove('shop-active');
                }
            }
        });
    }

    function handleClickTopBtn(event) {
        event.preventDefault();
        scrollElement.scrollTo({
            top: scrollElement.scrollTop - 300,
            behavior: "smooth",
        });
    }

    function handleClickBottomBtn(event) {
        event.preventDefault();
        scrollElement.scrollTo({
            top: scrollElement.scrollTop + 300,
            behavior: "smooth",
        });
    }

    function handleScrollThumbs(event) {
        event && event.preventDefault();
        requestAnimationFrame(function () {
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
        });
    }

    function handleClickAttributeValue(event) {
        event && event.preventDefault();
        let target = event.target.classList.contains('shop-product-attribute-value') ?
            event.target :
            event.target.closest('.shop-product-attribute-value');

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
        let btn = form.querySelector('.shop-product-count-minus-submit');
        btn.classList.add('shop-loading');
    }

    function submittedOneMinus(data, form) {
        let btn = form.querySelector('.shop-product-count-minus-submit');
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
        let btn = form.querySelector('.shop-product-count-plus-submit');
        btn.classList.add('shop-loading');
    }

    function submittedOnePlus(data, form) {
        let btn = form.querySelector('.shop-product-count-plus-submit');
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
        let label = form.querySelector('.shop-product-count-label');
        label.classList.add('shop-loading');
    }

    function submittedSetCount(data, form) {
        let label = form.querySelector('.shop-product-count-label');
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

    function destroy() {
        if (attributeValuesElements) removeEventListener('click', attributeValuesElements, handleClickAttributeValue);
        if (thumbs) removeEventListener('click', thumbs, handleClickThumb);
        if (topBtn) topBtn.removeEventListener('click', handleClickTopBtn);
        if (bottomBtn) bottomBtn.removeEventListener('click', handleClickBottomBtn);
        if (scrollElement) scrollElement.addEventListener('scroll', handleScrollThumbs);
    }

    function init() {
        destroy();
        pageElement = document.querySelector('.shop-product');

        if (!pageElement) {
            return;
        }

        thumbs = pageElement.querySelectorAll('.shop-product-images-thumb');
        images = pageElement.querySelectorAll('.shop-product-images-full');
        topBtn = pageElement.querySelector('.shop-product-images-top-btn');
        bottomBtn = pageElement.querySelector('.shop-product-images-bottom-btn');
        scrollElement = pageElement.querySelector('.shop-product-images-thumbs-scroll');
        scrollViewer = pageElement.querySelector('.shop-product-images-thumbs-scroll-viewer');
        attributeValuesElements = pageElement.querySelectorAll('.shop-product-attribute-value');
        submitBtn = pageElement.querySelector('.shop-product-submit');
        


        addEventListener('submit', pageElement.querySelectorAll('.shop-product-count-minus'), oneMinus);
        addEventListener('submit', pageElement.querySelectorAll('.shop-product-count-plus'), onePlus);
        addEventListener('submit', pageElement.querySelectorAll('.shop-product-count-setter'), setCount);
        addEventListener('change', pageElement.querySelectorAll('.shop-product-count-setter'), setCount);

        addEventListener('click', attributeValuesElements, handleClickAttributeValue);
        addEventListener('click', thumbs, handleClickThumb);

        topBtn.addEventListener('click', handleClickTopBtn);
        bottomBtn.addEventListener('click', handleClickBottomBtn);
        scrollElement.addEventListener('scroll', handleScrollThumbs);
        handleScrollThumbs();
    }

    init();
})();
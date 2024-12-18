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
                if (topBtnBlock && topBtnBlock.style.display !== 'block') topBtnBlock.style.display = 'block';
            } else {
                if (topBtnBlock && topBtnBlock.style.display !== 'none') topBtnBlock.style.display = 'none';
            }

            if (scrollElement.scrollTop > (scrollViewerHeight - scrollElementHeight)) {
                if (bottomBtnBlock && bottomBtnBlock.style.display !== 'none') bottomBtnBlock.style.display = 'none';
            } else {
                if (bottomBtnBlock && bottomBtnBlock.style.display !== 'block') bottomBtnBlock.style.display = 'block';
            }
        });
    }

    function destroy() {
        if (thumbs) {
            for (let i = 0; i < thumbs.length; i++) {
                thumbs[i].removeEventListener('click', handleClickThumb);
            }
        }
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

        for (let i = 0; i < thumbs.length; i++) {
            thumbs[i].addEventListener('click', handleClickThumb);
        }

        topBtn.addEventListener('click', handleClickTopBtn);
        bottomBtn.addEventListener('click', handleClickBottomBtn);
        scrollElement.addEventListener('scroll', handleScrollThumbs);
        handleScrollThumbs();
    }

    init();
})();
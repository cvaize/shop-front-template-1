;(function () {

    /** @typedef {object} json
     * @property {boolean} allowedSubmit
     * @property {string} errorText
     * @property {string} couponErrorText
     * @property {number} productCount
     * @property {string} totalWeight
     * @property {object[]} totalItems
     * @property {string} totalItems.label
     * @property {string} totalItems.value
     * @property {boolean} totalItems.accent
     * @property {string} totalPrice
     * @property {object[]} items
     * @property {string} items.id
     * @property {string} items.productLink
     * @property {string} items.name
     * @property {string} items.characteristics
     * @property {object} items.picture
     * @property {string} items.picture.src
     * @property {string} items.picture.alt
     * @property {object[]} items.picture.sources
     * @property {string} items.picture.sources.srcset
     * @property {string} items.picture.sources.media
     * @property {string} items.picture.sources.type
     * @property {string} items.price
     * @property {string} items.oldPrice
     * @property {string} items.count
     * @property {string} items.minCount
     * @property {string} items.maxCount
     * @property {boolean} items.favorite
     */
    let shopCartData = window.ShopCartData;
    let cart;
    let cartSubmitBtn;
    let cartSidebarError;
    let cartSidebarTotalWeight;
    let cartSidebarBody;
    let cartSidebarTotalPriceValue;
    let cartCouponsForm;
    let cartCouponsInput;
    let cartCouponsBtn;
    let cartCouponsError;
    let cartProducts;
    let cartProductHtml;
    let cartSelectingCheckbox;

    function handleChangeAllSelecting(event) {
        let inputs = cart.querySelectorAll('.shop-cart-product-checkbox');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].checked = cartSelectingCheckbox.checked;
        }
    }

    function handleChangeSelecting(event) {
        let inputs = cart.querySelectorAll('.shop-cart-product-checkbox');
        let checked = true;
        for (let i = 0; i < inputs.length; i++) {
            if (!inputs[i].checked) {
                checked = false;
            }
        }
        cartSelectingCheckbox.checked = inputs.length > 0 && checked;
    }

    function onSelecting() {
        cartSelectingCheckbox.addEventListener('change', handleChangeAllSelecting);
        let inputs = cart.querySelectorAll('.shop-cart-product-checkbox');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('change', handleChangeSelecting);
        }
    }

    function offSelecting() {
        cartSelectingCheckbox.removeEventListener('change', handleChangeAllSelecting);
        let inputs = cart.querySelectorAll('.shop-cart-product-checkbox');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].removeEventListener('change', handleChangeSelecting);
        }
    }

    function renderSelecting() {
        handleChangeSelecting();
    }

    function renderSidebar() {
        if (cartSubmitBtn) cartSubmitBtn.disabled = !shopCartData.allowedSubmit;
        if (cartSidebarError) {
            cartSidebarError.innerText = shopCartData.errorText || '';
            cartSidebarError.style.display = shopCartData.errorText ? 'block' : 'none';
        }
        if (cartCouponsError) {
            cartCouponsError.innerText = shopCartData.couponErrorText || '';
            cartCouponsError.style.display = shopCartData.couponErrorText ? 'block' : 'none';
        }
        if (cartSidebarTotalWeight) cartSidebarTotalWeight.innerText = shopCartData.totalWeight || '';
        if (cartSidebarBody) {
            let rows = cart.querySelectorAll('.shop-cart-sidebar-row:not(.shop-cart-sidebar-row-header)');
            for (let i = 0; i < rows.length; i++) {
                rows[i].remove();
            }
            for (let i = 0; i < shopCartData.totalItems.length; i++) {
                cartSidebarBody.insertAdjacentHTML('beforeend', `
<div class="shop-cart-sidebar-row">
    <div class="shop-cart-sidebar-total-name">${shopCartData.totalItems[i].label}</div>
    <div class="shop-cart-sidebar-total-value${shopCartData.totalItems[i].accent ? ' text-danger' : ''}">${shopCartData.totalItems[i].value}</div>
</div>`)
            }
        }
        if (cartSidebarTotalPriceValue) {
            cartSidebarTotalPriceValue.innerText = shopCartData.totalPrice;
        }
    }

    function renderItems() {
        if (cartProductHtml) {
            let checkboxes = {}
            let products = cart.querySelectorAll('.shop-cart-product');

            for (let i = 0; i < products.length; i++) {
                let id = String(products[i].getAttribute('data-cart-product-id') || '').trim();
                if (id) {
                    let checkbox = products[i].querySelector('.shop-cart-product-checkbox');
                    checkboxes[id] = checkbox != null && checkbox.checked === true;
                }
            }

            let html = '';
            for (let i = 0; i < shopCartData.items.length; i++) {
                let t = shopCartData.items[i];
                let id = String(t.id || '').trim();
                let checked = checkboxes[id] === true;
                html += `
<div class="shop-cart-product" data-cart-product-id="${t.id}">
    <div class="shop-cart-product-checkbox-wrapper">
        <input class="shop-form-checkbox shop-cart-product-checkbox" type="checkbox"
               id="shop-cart-selecting-checkbox-${t.id}" hidden ${checked ? 'checked' : ''}>
        <label class="shop-form-checkbox-label" for="shop-cart-selecting-checkbox-${t.id}">
            <svg class="shop-form-checkbox-svg-icon" xmlns="http://www.w3.org/2000/svg"
                 width="24"
                 height="24" viewBox="0 0 24 24">
                <path d="M9 16.17 5.53 12.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 1 0-1.41-1.41L9 16.17z"/>
            </svg>
        </label>
    </div>
    <a href="${t.productLink}" class="shop-cart-product-image-wrapper">
        <picture class="shop-cart-product-image-picture">
${(t.picture.sources || []).reduce(function (prev, cur) {
                    return prev + `<source srcset="${cur.srcset}" media="${cur.media}" type="${cur.type}">`
                }, '')}
            <img class="shop-cart-product-image" src="${t.picture.src}" alt="${t.picture.alt}">
        </picture>
    </a>
    <div class="shop-cart-product-content-wrapper">
        <a href="${t.productLink}" class="shop-cart-product-name">
            ${t.name}
        </a>
        <div class="shop-cart-product-characteristics">
            ${t.characteristics}
        </div>
    </div>
    <div class="shop-cart-product-price-wrapper">
        <div class="shop-cart-product-prices">
            <div class="shop-cart-product-price">${t.price}</div>
            <div class="shop-cart-product-old-price" style="${t.oldPrice ? '' : 'display: none'}">${t.oldPrice}</div>
        </div>
        <div class="shop-cart-product-count-wrapper">
            <form class="shop-cart-product-count-minus-form" action="${t.minusLink}">
                <button class="shop-cart-product-count-minus-submit shop-btn" type="submit" ${t.count <= t.minCount ? 'disabled' : ''}>
                    <svg class="shop-icon-svg" xmlns="http://www.w3.org/2000/svg" width="24"
                         height="24" viewBox="0 0 24 24">
                        <path d="M18 13H6c-.55 0-1-.45-1-1s.45-1 1-1h12c.55 0 1 .45 1 1s-.45 1-1 1z"/>
                    </svg>
                </button>
            </form>
            <form class="shop-cart-product-count-count-form" action="${t.setCountLink}">
                <label class="shop-cart-product-count-count-label">
                    <input class="shop-cart-product-count-count-input" type="number" min="${t.minCount}"
                           max="${t.maxCount}" value="${t.count}">
                </label>
            </form>
            <form class="shop-cart-product-count-plus-form" action="${t.plusLink}">
                <button class="shop-cart-product-count-plus-submit shop-btn" type="submit" ${t.count >= t.maxCount ? 'disabled' : ''}>
                    <svg class="shop-icon-svg" xmlns="http://www.w3.org/2000/svg" width="24"
                         height="24" viewBox="0 0 24 24">
                        <path d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z"/>
                    </svg>
                </button>
            </form>
        </div>
    </div>
    <div class="shop-cart-product-actions">
        <form class="shop-cart-product-favorite" action="${t.favoriteLink}">
            <button class="shop-cart-product-favorite-btn shop-btn${t.favorite ? ' shop-active' : ''}"
                    type="submit">
                <svg class="shop-cart-product-favorite-icon shop-icon-svg"
                     xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                     viewBox="0 0 24 24">
                    <path d="M16.5 5c-1.54 0-3.04.99-3.56 2.36h-1.87C10.54 5.99 9.04 5 7.5 5 5.5 5 4 6.5 4 8.5c0 2.89 3.14 5.74 7.9 10.05l.1.1.1-.1C16.86 14.24 20 11.39 20 8.5c0-2-1.5-3.5-3.5-3.5z"
                          opacity=".3"/>
                    <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/>
                </svg>
            </button>
        </form>
        <form class="shop-cart-product-delete" action="${t.deleteLink}">
            <button class="shop-cart-product-delete-btn shop-btn" type="submit">
                <svg class="shop-icon-svg" xmlns="http://www.w3.org/2000/svg" width="24"
                     height="24" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
            </button>
        </form>
    </div>
</div>`;
            }

            cartProducts.innerHTML = html;
        }
    }

    function renderCart() {
        offSelecting();
        renderSidebar();
        renderItems();
        renderSelecting();
        onSelecting();
    }

    function uploadCoupon(coupon) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                if (Math.random() > 0.5) {
                    shopCartData.couponErrorText = "";
                    shopCartData.totalItems.push({label: `Купон ${coupon}`, value: '- 100 руб.', accent: true});
                    let totalPrice = 0;
                    for (let i = 0; i < shopCartData.totalItems.length; i++) {
                        let price = Number.parseInt(shopCartData.totalItems[i].value.replace(' ', ''));
                        totalPrice += price;
                    }
                    if (totalPrice < 0) {
                        totalPrice = 0;
                    }
                    shopCartData.totalPrice = `${totalPrice.toLocaleString()} руб.`;

                    resolve(shopCartData);
                } else {
                    shopCartData.couponErrorText = `Тестовая ошибка купона "${coupon}".`;
                    reject(shopCartData);
                }
            }, 3000);
        })
    }

    function submittingCoupon() {
        cartCouponsBtn.classList.add('shop-loading');
        cartCouponsBtn.disabled = true;
        cartCouponsInput.disabled = true;
    }

    function submittedCoupon(data) {
        shopCartData = data;
        cartCouponsBtn.classList.remove('shop-loading');
        cartCouponsBtn.disabled = false;
        cartCouponsInput.disabled = false;
        renderCart();
    }


    function submitCoupon(event) {
        event && event.preventDefault();

        let value = String(cartCouponsInput.value || '').trim();
        if (value) {
            submittingCoupon();
            uploadCoupon(value).then(function (data) {
                cartCouponsInput.value = '';
                submittedCoupon(data);
            }).catch(submittedCoupon);
        }
    }

    function destroy() {
        if (cartCouponsForm) {
            cartCouponsForm.removeEventListener('submit', submitCoupon);
        }
    }

    function init() {
        destroy();

        cart = document.querySelector('.shop-cart');
        if (!cart || !shopCartData) {
            return;
        }

        cartSubmitBtn = cart.querySelector('.shop-cart-sidebar-submit');
        cartSidebarError = cart.querySelector('.shop-cart-sidebar-wrapper .shop-cart-sidebar-error');
        cartSidebarTotalWeight = cart.querySelector('.shop-cart-sidebar-total-weight');
        cartSidebarBody = cart.querySelector('.shop-cart-sidebar-wrapper .shop-cart-sidebar-body');
        cartSidebarTotalPriceValue = cart.querySelector('.shop-cart-sidebar-total-price-value');
        cartCouponsForm = cart.querySelector('.shop-cart-coupons-form');
        cartCouponsInput = cart.querySelector('.shop-cart-coupons-input');
        cartCouponsBtn = cart.querySelector('.shop-cart-sidebar-coupons-submit');
        cartCouponsError = cart.querySelector('.shop-cart-sidebar-coupons-wrapper .shop-cart-sidebar-error');
        cartProducts = cart.querySelector('.shop-cart-products');
        cartSelectingCheckbox = cart.querySelector('.shop-cart-selecting-checkbox');
        let cartProduct = cart.querySelector('.shop-cart-product');
        cartProductHtml = cartProduct ? cartProduct.outerHTML : '';

        if (cartCouponsForm && cartCouponsInput && cartCouponsError) {
            cartCouponsForm.addEventListener('submit', submitCoupon);
        }

        renderCart();
    }

    init();

    // let html = document.querySelector('div.shop-cart-card').innerHTML;
    // let html_ = ''
    // for (let i = 0; i < 12; i++) {
    //     html_ += html;
    // }
    // document.querySelector('div.shop-cart-card').innerHTML = html_;

    let html = document.querySelector('.shop-products-fw-list').innerHTML;
    let html_ = ''
    for (let i = 0; i < 6; i++) {
        html_ += html;
    }
    document.querySelector('.shop-products-fw-list').innerHTML = html_;
})();
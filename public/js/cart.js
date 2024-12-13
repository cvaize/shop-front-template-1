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
    let cartH1;
    let cartHeaderProductsCount;
    let cartForm;
    let cartSubmitBtn;
    let cartRemoveSelectingBtn;
    let cartSidebarError;
    let cartSidebarTotalWeight;
    let cartSidebarBody;
    let cartSidebarTotalPriceValue;
    let cartCouponsForm;
    let cartCouponsInput;
    let cartCouponsBtn;
    let cartCouponsError;
    let cartProducts;
    let cartSelectingCheckbox;
    let cartSwitchContentIsEmptyElements;
    let cartShowIsEmptyElements;
    let cartHideIsEmptyElements;

    /**
     * Plural forms for russian words
     * @param  {Integer} count quantity for word
     * @param  {Array} words Array of words. Example: ['депутат', 'депутата', 'депутатов'], ['коментарий', 'коментария', 'комментариев']
     * @return {String}        Count + plural form for word
     */
    function pluralize(count, words) {
        let cases = [2, 0, 1, 1, 1, 2];
        return count + ' ' + words[(count % 100 > 4 && count % 100 < 20) ? 2 : cases[Math.min(count % 10, 5)]];
    }

    function handleChangeAllSelecting(event) {
        let inputs = cart.querySelectorAll('.shop-cart-item-checkbox');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].checked = cartSelectingCheckbox.checked;
        }
    }

    function handleChangeSelecting(event) {
        let inputs = cart.querySelectorAll('.shop-cart-item-checkbox');
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
        let inputs = cart.querySelectorAll('.shop-cart-item-checkbox');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('change', handleChangeSelecting);
        }
    }

    function offSelecting() {
        cartSelectingCheckbox.removeEventListener('change', handleChangeAllSelecting);
        let inputs = cart.querySelectorAll('.shop-cart-item-checkbox');
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

    function makeCartItem(t) {
        let id = String(t.id || '').trim();
        let checked = t.checked === true;
        return `
<div class="shop-cart-item" data-cart-item-id="${id}">
    <input type="hidden" form="shop-cart-form" name="items[${id}][id]" value="${id}" hidden>
    <div class="shop-cart-item-checkbox-wrapper">
        <input class="shop-form-checkbox shop-cart-item-checkbox" type="checkbox"
               id="shop-cart-selecting-checkbox-${id}" hidden ${checked ? 'checked' : ''} form="shop-cart-form" name="items[${id}][selected]" value="${id}">
        <label class="shop-form-checkbox-label" for="shop-cart-selecting-checkbox-${id}">
            <svg class="shop-form-checkbox-svg-icon" xmlns="http://www.w3.org/2000/svg"
                 width="24"
                 height="24" viewBox="0 0 24 24">
                <path d="M9 16.17 5.53 12.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 1 0-1.41-1.41L9 16.17z"/>
            </svg>
        </label>
    </div>
    <a href="${t.productLink}" class="shop-cart-item-image-wrapper">
        <picture class="shop-cart-item-image-picture">
${(t.picture.sources || []).reduce(function (prev, cur) {
            return prev + `<source srcset="${cur.srcset}" media="${cur.media}" type="${cur.type}">`
        }, '')}
            <img class="shop-cart-item-image" src="${t.picture.src}" alt="${t.picture.alt}">
        </picture>
    </a>
    <div class="shop-cart-item-content-wrapper">
        <a href="${t.productLink}" class="shop-cart-item-name">
            ${t.name}
        </a>
        <div class="shop-cart-item-characteristics">
            ${t.characteristics}
        </div>
    </div>
    <div class="shop-cart-item-price-wrapper">
        <div class="shop-cart-item-prices">
            <div class="shop-cart-item-price">${t.price}</div>
            <div class="shop-cart-item-old-price" style="${t.oldPrice ? '' : 'display: none'}">${t.oldPrice}</div>
        </div>
        <div class="shop-cart-item-count-wrapper">
            <div class="shop-cart-item-count-minus">
                <button class="shop-cart-item-count-minus-submit shop-btn" type="submit" ${Number(t.count) <= Number(t.minCount) ? 'disabled' : ''} 
                form="shop-cart-form" name="action" value="minus-${id}">
                    <svg class="shop-icon-svg" xmlns="http://www.w3.org/2000/svg" width="24"
                         height="24" viewBox="0 0 24 24">
                        <path d="M18 13H6c-.55 0-1-.45-1-1s.45-1 1-1h12c.55 0 1 .45 1 1s-.45 1-1 1z"/>
                    </svg>
                </button>
            </div>
            <form class="shop-cart-item-count-count-form" action="${t.setCountLink}">
                <label class="shop-cart-item-count-count-label">
                    <input class="shop-cart-item-count-count-input" type="number" min="${t.minCount}"
                           max="${t.maxCount}" value="${t.count}">
                </label>
            </form>
            <div class="shop-cart-item-count-plus">
                <button class="shop-cart-item-count-plus-submit shop-btn" type="submit" ${Number(t.count) >= Number(t.maxCount) ? 'disabled' : ''}
                form="shop-cart-form" name="action" value="plus-${id}">
                    <svg class="shop-icon-svg" xmlns="http://www.w3.org/2000/svg" width="24"
                         height="24" viewBox="0 0 24 24">
                        <path d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
    <div class="shop-cart-item-actions">
        <div class="shop-cart-item-favorite">
            <button class="shop-cart-item-favorite-btn shop-btn-square shop-btn${t.favorite ? ' shop-active' : ''}"
                    type="submit" form="shop-cart-form" name="action" value="favorite-${id}">
                <svg class="shop-cart-item-favorite-icon shop-icon-svg"
                     xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                     viewBox="0 0 24 24">
                    <path d="M16.5 5c-1.54 0-3.04.99-3.56 2.36h-1.87C10.54 5.99 9.04 5 7.5 5 5.5 5 4 6.5 4 8.5c0 2.89 3.14 5.74 7.9 10.05l.1.1.1-.1C16.86 14.24 20 11.39 20 8.5c0-2-1.5-3.5-3.5-3.5z"
                          opacity=".3"/>
                    <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/>
                </svg>
            </button>
        </div>
        <div class="shop-cart-item-delete">
            <button class="shop-cart-item-delete-btn shop-btn shop-btn-square" type="submit" form="shop-cart-form" name="action" value="remove-${id}">
                <svg class="shop-icon-svg" xmlns="http://www.w3.org/2000/svg" width="24"
                     height="24" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
            </button>
        </div>
    </div>
</div>`;
    }

    function renderItems() {
        if (cartHeaderProductsCount) {
            let totalCount = 0;

            for (let i = 0; i < shopCartData.items.length; i++) {
                let item = shopCartData.items[i];
                totalCount += Number(item.count);
            }

            cartHeaderProductsCount.innerText = pluralize(totalCount, ['товар', 'товара', 'товаров']);
        }
        let checkboxes = {}
        let items = cart.querySelectorAll('.shop-cart-item');

        for (let i = 0; i < items.length; i++) {
            let id = String(items[i].getAttribute('data-cart-item-id') || '').trim();
            if (id) {
                let checkbox = items[i].querySelector('.shop-cart-item-checkbox');
                checkboxes[id] = checkbox != null && checkbox.checked === true;
            }
        }

        let html = '';
        for (let i = 0; i < shopCartData.items.length; i++) {
            let t = shopCartData.items[i];

            let id = String(t.id || '').trim();
            t.checked = checkboxes[id] === true;

            html += makeCartItem(t);
        }

        cartProducts.innerHTML = html;
    }

    function renderCart() {
        offSelecting();
        renderSidebar();
        renderItems();
        renderSelecting();
        renderTexts();
        switchEmptyElements();
        onSelecting();
    }

    function renderTexts() {
        if (cartSwitchContentIsEmptyElements) {
            for (let i = 0; i < cartSwitchContentIsEmptyElements.length; i++) {
                let cartSwitchContentIsEmptyElement = cartSwitchContentIsEmptyElements[i];

                let text = shopCartData.items.length ?
                    cartSwitchContentIsEmptyElement.getAttribute('data-cart-noempty-content')
                    : cartSwitchContentIsEmptyElement.getAttribute('data-cart-empty-content');

                if (!text) text = '';

                text = text.replace(new RegExp('\n', 'igm'), '');

                cartSwitchContentIsEmptyElement.innerText = text;

                if (!text) {
                    if (cartSwitchContentIsEmptyElement.style.display !== 'none') {
                        cartSwitchContentIsEmptyElement.style.display = 'none';
                    }
                } else {
                    let display = cartSwitchContentIsEmptyElement.getAttribute('data-cart-empty-display') || 'block'
                    if (cartSwitchContentIsEmptyElement.style.display !== display) {
                        cartSwitchContentIsEmptyElement.style.display = display;
                    }
                }
            }
        }
    }

    function switchEmptyElements() {
        if (cartShowIsEmptyElements) {
            for (let i = 0; i < cartShowIsEmptyElements.length; i++) {
                let cartShowIsEmptyElement = cartShowIsEmptyElements[i];

                if (shopCartData.items.length) {
                    if (cartShowIsEmptyElement.style.display !== 'none') {
                        cartShowIsEmptyElement.style.display = 'none';
                    }
                } else {
                    let display = cartShowIsEmptyElement.getAttribute('data-cart-empty-display') || 'block'
                    if (cartShowIsEmptyElement.style.display !== display) {
                        cartShowIsEmptyElement.style.display = display;
                    }
                }
            }
        }
        if (cartHideIsEmptyElements) {
            for (let i = 0; i < cartHideIsEmptyElements.length; i++) {
                let cartHideIsEmptyElement = cartHideIsEmptyElements[i];

                if (shopCartData.items.length) {
                    let display = cartHideIsEmptyElement.getAttribute('data-cart-empty-display') || 'block'
                    if (cartHideIsEmptyElement.style.display !== display) {
                        cartHideIsEmptyElement.style.display = display;
                    }
                } else {
                    if (cartHideIsEmptyElement.style.display !== 'none') {
                        cartHideIsEmptyElement.style.display = 'none';
                    }
                }
            }
        }
    }

    function calculateTotal() {
        let totalCount = 0;
        let totalFullPrice = 0;
        let totalFullSale = 0;
        let totalWeight = 0; // 1200

        for (let i = 0; i < shopCartData.items.length; i++) {
            let item = shopCartData.items[i];
            let count = Number(item.count);
            totalCount += count;
            totalWeight += (count * Number(item.weight));
            let oldPrice = Number.parseFloat(String(item.oldPrice || item.price).replace(/[^\d.-]/g, ''));
            let price = Number.parseFloat(String(item.price).replace(/[^\d.-]/g, ''));
            let fullPrice = (oldPrice || price) * count;
            let sale = (oldPrice - price) * count;
            totalFullSale += sale;
            totalFullPrice += fullPrice;
        }
        totalWeight = (totalWeight / 1000).toFixed(2);

        shopCartData.totalWeight = `${pluralize(totalCount, ['товар', 'товара', 'товаров'])} • ${totalWeight} кг`;
        shopCartData.totalItems[0] = {
            label: `Товары (${totalCount})`,
            value: `${totalFullPrice.toLocaleString()} руб.`,
            accent: false
        };
        if (totalFullSale > 0) {
            if (shopCartData.totalItems[1].label !== 'Скидка') {
                shopCartData.totalItems.splice(1, 0, {
                    label: `Скидка`,
                    value: `- ${totalFullSale.toLocaleString()} руб.`,
                    accent: true
                });
            } else {
                shopCartData.totalItems[1] = {
                    label: `Скидка`,
                    value: `- ${totalFullSale.toLocaleString()} руб.`,
                    accent: true
                };
            }
        } else {
            if (shopCartData.totalItems[1].label === 'Скидка') {
                shopCartData.totalItems.splice(1, 1);
            }
        }


        let totalPrice = 0;
        for (let i = 0; i < shopCartData.totalItems.length; i++) {
            let price = Number.parseFloat(shopCartData.totalItems[i].value.replace(/[^\d.-]/g, ''));
            totalPrice += price;
        }
        if (totalPrice < 0) {
            totalPrice = 0;
        }
        shopCartData.totalPrice = `${totalPrice.toLocaleString()} руб.`;
    }

    function couponUpload(coupon) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                if (Math.random() > 0.5) {
                    shopCartData.couponErrorText = "";
                    shopCartData.totalItems.push({label: `Купон ${coupon}`, value: '- 100 руб.', accent: true});
                    calculateTotal();

                    resolve(shopCartData);
                } else {
                    shopCartData.couponErrorText = `Тестовая ошибка купона "${coupon}".`;
                    reject(shopCartData);
                }
            }, 1000);
        });
    }

    function selectedRemoveUpload(values) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                let selected = [];
                for (const name in values) {
                    let value = values[name];
                    if (name.includes('][selected]')) {
                        selected.push(value);
                    }
                }
                let removeItems = [];
                let items = [];
                for (let i = 0; i < shopCartData.items.length; i++) {
                    if (selected.includes(String(shopCartData.items[i].id))) {
                        removeItems.push(String(shopCartData.items[i].id));
                    } else {
                        items.push(shopCartData.items[i]);
                    }
                }
                if (Math.random() > 0.5) {
                    shopCartData.errorText = "";
                    shopCartData.items = items;
                    calculateTotal();

                    resolve(shopCartData);
                } else {
                    shopCartData.errorText = `Тестовая ошибка удаления выбранных товаров "${removeItems.join(', ')}".`;
                    reject(shopCartData);
                }
            }, 1000);
        });
    }

    function submittingCoupon() {
        cartCouponsBtn.classList.add('shop-loading');
        cartCouponsInput.disabled = true;
    }

    function submittedCoupon(data) {
        shopCartData = data;
        cartCouponsBtn.classList.remove('shop-loading');
        cartCouponsInput.disabled = false;
        renderCart();
    }


    function couponSubmit(event) {
        event && event.preventDefault();

        let value = String(cartCouponsInput.value || '').trim();
        if (value) {
            submittingCoupon();
            couponUpload(value).then(function (data) {
                cartCouponsInput.value = '';
                submittedCoupon(data);
            }).catch(submittedCoupon);
        }
    }

    function submittingSelectedRemove() {
        cartRemoveSelectingBtn.classList.add('shop-loading');
    }

    function submittedSelectedRemove(data) {
        shopCartData = data;
        cartRemoveSelectingBtn.classList.remove('shop-loading');
        renderCart();
    }

    function selectedRemove(values) {
        submittingSelectedRemove();
        selectedRemoveUpload(values).then(function (data) {
            submittedSelectedRemove(data);
        }).catch(submittedSelectedRemove);
    }

    function oneRemoveUpload(values) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                let id = values.action.split('-')[1];

                let items = [];
                for (let i = 0; i < shopCartData.items.length; i++) {
                    if (String(shopCartData.items[i].id) !== id) {
                        items.push(shopCartData.items[i]);
                    }
                }
                if (Math.random() > 0.5) {
                    shopCartData.errorText = "";
                    shopCartData.items = items;
                    calculateTotal();

                    resolve(shopCartData);
                } else {
                    shopCartData.errorText = `Тестовая ошибка удаления товара "${id}".`;
                    reject(shopCartData);
                }
            }, 1000);
        });
    }

    function submittingOneRemove(values) {
        let buttons = cart.querySelectorAll(`.shop-cart-item-delete-btn[value="${values.action}"]`);
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.add('shop-loading');
        }
    }

    function submittedOneRemove(data, values) {
        shopCartData = data;
        let buttons = cart.querySelectorAll(`.shop-cart-item-delete-btn[value="${values.action}"]`);
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('shop-loading');
        }
        renderCart();
    }

    function oneRemove(values) {
        submittingOneRemove(values);
        oneRemoveUpload(values).then(function (data) {
            submittedOneRemove(data, values);
        }).catch(function (data) {
            submittedOneRemove(data, values);
        });
    }

    function oneFavoriteUpload(values) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                let id = values.action.split('-')[1];

                for (let i = 0; i < shopCartData.items.length; i++) {
                    if (String(shopCartData.items[i].id) === id) {
                        shopCartData.items[i].favorite = !shopCartData.items[i].favorite;
                    }
                }

                resolve(shopCartData);
            }, 1000);
        });
    }

    function submittingOneFavorite(values) {
        let buttons = cart.querySelectorAll(`.shop-cart-item-favorite-btn[value="${values.action}"]`);
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.add('shop-loading');
        }
    }

    function submittedOneFavorite(data, values) {
        shopCartData = data;
        let id = values.action.split('-')[1];
        let buttons = cart.querySelectorAll(`.shop-cart-item-favorite-btn[value="${values.action}"]`);
        let item = null;

        for (let i = 0; i < shopCartData.items.length; i++) {
            if (String(shopCartData.items[i].id) === id) {
                item = shopCartData.items[i];
                break;
            }
        }

        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('shop-loading');
            if (item) {
                if (item.favorite) {
                    buttons[i].classList.add('shop-active');
                } else {
                    buttons[i].classList.remove('shop-active');
                }
            }
        }
    }

    function oneFavorite(values) {
        submittingOneFavorite(values);
        oneFavoriteUpload(values).then(function (data) {
            submittedOneFavorite(data, values);
        }).catch(function (data) {
            submittedOneFavorite(data, values);
        });
    }

    function oneMinusUpload(values) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                let id = values.action.split('-')[1];

                for (let i = 0; i < shopCartData.items.length; i++) {
                    if (String(shopCartData.items[i].id) === id) {
                        let count = Number(shopCartData.items[i].count) - 1;
                        if(count >= Number(shopCartData.items[i].minCount)){
                            shopCartData.items[i].count = String(count);
                        }
                    }
                }

                calculateTotal();
                resolve(shopCartData);
            }, 1000);
        });
    }

    function submittingOneMinus(values) {
        let buttons = cart.querySelectorAll(`.shop-cart-item-count-minus-submit[value="${values.action}"]`);
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.add('shop-loading');
        }
    }

    function submittedOneMinus(data, values) {
        shopCartData = data;
        let buttons = cart.querySelectorAll(`.shop-cart-item-count-minus-submit[value="${values.action}"]`);
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('shop-loading');
        }
        renderCart();
    }

    function oneMinus(values) {
        submittingOneMinus(values);
        oneMinusUpload(values).then(function (data) {
            submittedOneMinus(data, values);
        }).catch(function (data) {
            submittedOneMinus(data, values);
        });
    }

    function onePlusUpload(values) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                let id = values.action.split('-')[1];

                for (let i = 0; i < shopCartData.items.length; i++) {
                    if (String(shopCartData.items[i].id) === id) {
                        let count = Number(shopCartData.items[i].count) + 1;
                        if(count <= Number(shopCartData.items[i].maxCount)) {
                            shopCartData.items[i].count = String(count);
                        }
                    }
                }

                calculateTotal();
                resolve(shopCartData);
            }, 1000);
        });
    }

    function submittingOnePlus(values) {
        let buttons = cart.querySelectorAll(`.shop-cart-item-count-plus-submit[value="${values.action}"]`);
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.add('shop-loading');
        }
    }

    function submittedOnePlus(data, values) {
        shopCartData = data;
        let buttons = cart.querySelectorAll(`.shop-cart-item-count-plus-submit[value="${values.action}"]`);
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('shop-loading');
        }
        renderCart();
    }

    function onePlus(values) {
        submittingOnePlus(values);
        onePlusUpload(values).then(function (data) {
            submittedOnePlus(data, values);
        }).catch(function (data) {
            submittedOnePlus(data, values);
        });
    }

    function submitForm(event) {
        event && event.preventDefault();

        let formData = new FormData(cartForm);

        let existsRemoveSelected = false;
        let values = Object.fromEntries(formData);

        for (let pair of formData.entries()) {
            let name = pair[0];
            let value = pair[1];
            if (name.endsWith('[]')) {
                if (!Array.isArray(values[name])) {
                    values[name] = [];
                }
                // noinspection JSUnresolvedReference
                values[name].push(value);
            } else {
                values[name] = value;
            }

            if (name.includes('][selected]')) {
                existsRemoveSelected = true;
            }
        }

        let submitter = event.submitter
        if (submitter && submitter.name) {
            values[submitter.name] = submitter.value;
        }
        if (!values.action) {
            return;
        }

        if (values.action === 'remove-selected' && existsRemoveSelected) {
            selectedRemove(values);
        }

        if (values.action && values.action.startsWith('remove-')) {
            oneRemove(values);
        }

        if (values.action && values.action.startsWith('favorite-')) {
            oneFavorite(values);
        }

        if (values.action && values.action.startsWith('minus-')) {
            oneMinus(values);
        }

        if (values.action && values.action.startsWith('plus-')) {
            onePlus(values);
        }
    }

    function addTestingCartItem() {
        let id = String(Math.round(Math.random() * 10e6));
        let price = Math.round(Math.random() * 10e4);
        let oldPrice = price + Math.round(Math.random() * 10e3);
        let weight = String(Math.round(Math.random() * 10e2));
        if (Math.random() > 0.5) {
            shopCartData.items.push({
                id: id,
                productId: `${id}1`,
                productLink: './product.html',
                favoriteLink: './favorite.html',
                deleteLink: './cart.html',
                name: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusamus aliquid cupiditate dolor doloribus eius ex fugiat',
                characteristics: 'цвет белый, прозрачный; размер 44-46;',
                picture: {
                    src: './svg/300x300.svg',
                    alt: 'Product 1',
                    sources: [
                        {srcset: './svg/300x300.svg', media: '', type: 'image/svg+xml'}
                    ]
                },
                price: `${price.toLocaleString()} руб.`,
                oldPrice: '',
                weight,
                count: '1',
                minCount: '1',
                maxCount: '10',
                minusLink: '#',
                setCountLink: '#',
                plusLink: '#',
                favorite: true
            });
        } else {
            shopCartData.items.push({
                id: id,
                productId: `${id}2`,
                productLink: './product.html',
                favoriteLink: './favorite.html',
                deleteLink: './cart.html',
                name: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
                characteristics: 'цвет белый, прозрачный; размер 44-46;',
                picture: {
                    src: './svg/300x300_2.svg',
                    alt: 'Product 2',
                    sources: [
                        {srcset: './svg/300x300_2.svg', media: '', type: 'image/svg+xml'}
                    ]
                },
                price: `${price.toLocaleString()} руб.`,
                oldPrice: `${oldPrice.toLocaleString()} руб.`,
                weight,
                count: '1',
                minCount: '1',
                maxCount: '10',
                minusLink: '#',
                setCountLink: '#',
                plusLink: '#',
                favorite: false
            });
        }
        calculateTotal();
        renderCart();
    }

    function destroy() {
        if (cartCouponsForm) {
            cartCouponsForm.removeEventListener('submit', couponSubmit);
        }

        if (cartForm) {
            cartForm.removeEventListener('submit', submitForm);
        }

        if (cartH1) {
            cartH1.removeEventListener('click', addTestingCartItem);
        }
    }

    function init() {
        destroy();

        cart = document.querySelector('.shop-cart');
        if (!cart || !shopCartData) {
            return;
        }

        cartForm = cart.querySelector('.shop-cart-form');
        cartH1 = cart.querySelector('.shop-cart-header .shop-h1');
        cartHeaderProductsCount = cart.querySelector('.shop-cart-header-products-count');
        cartSubmitBtn = cart.querySelector('.shop-cart-sidebar-submit');
        cartRemoveSelectingBtn = cart.querySelector('.shop-cart-remove-selecting-submit');
        cartSidebarError = cart.querySelector('.shop-cart-sidebar-wrapper .shop-cart-sidebar-error');
        cartSidebarTotalWeight = cart.querySelector('.shop-cart-sidebar-total-weight');
        cartSidebarBody = cart.querySelector('.shop-cart-sidebar-wrapper .shop-cart-sidebar-body');
        cartSidebarTotalPriceValue = cart.querySelector('.shop-cart-sidebar-total-price-value');
        cartCouponsForm = cart.querySelector('.shop-cart-coupons-form');
        cartCouponsInput = cart.querySelector('.shop-cart-coupons-input');
        cartCouponsBtn = cart.querySelector('.shop-cart-sidebar-coupons-submit');
        cartCouponsError = cart.querySelector('.shop-cart-sidebar-coupons-wrapper .shop-cart-sidebar-error');
        cartProducts = cart.querySelector('.shop-cart-items');
        cartSelectingCheckbox = cart.querySelector('.shop-cart-selecting-checkbox');
        cartSwitchContentIsEmptyElements = cart.querySelectorAll('.shop-cart-switch-content-is-empty');
        cartShowIsEmptyElements = cart.querySelectorAll('.shop-cart-show-is-empty');
        cartHideIsEmptyElements = cart.querySelectorAll('.shop-cart-hide-is-empty');

        if (cartCouponsForm && cartCouponsInput && cartCouponsError) {
            cartCouponsForm.addEventListener('submit', couponSubmit);
        }

        if (cartForm) {
            cartForm.addEventListener('submit', submitForm);
        }

        if (cartH1) {
            cartH1.addEventListener('click', addTestingCartItem);
        }

        calculateTotal();
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
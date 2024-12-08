'use strict';

;(function () {
    'use strict';

    let comparison = null;
    let cardDrops = [];
    let clearComparisonListForm = null;
    let clearComparisonItemForms = [];
    let radioInputs = null;
    let firstNotCheckedRadioInput = null;
    let selectedRadioInput = null;
    let selectedLabel = null;
    let selectedRows = null;
    let dragAndDropCard = null;
    let dragAndDropCards = [];
    let dragAndDropStartMouseXPosition = 0;

    function preAction() {
        radioInputs = document.querySelectorAll('.shop-comparison-categories-btn-radio-input');
        firstNotCheckedRadioInput = null;
        selectedRadioInput = null;
        selectedLabel = null;
        selectedRows = null;

        for (let i = 0; i < radioInputs.length; i++) {
            let radioInput = radioInputs[i];
            if (radioInput.checked) {
                let radioInputId = radioInput.getAttribute('id');

                selectedRadioInput = radioInput;
                selectedLabel = document.querySelector(`[for="${radioInputId}"]`);
                selectedRows = document.querySelector(`[data-comparison-for="${radioInputId}"]`);
            } else if (!firstNotCheckedRadioInput) {
                firstNotCheckedRadioInput = radioInput;
            }
        }
    }

    function clearComparisonList(event) {
        event && event.preventDefault();
        preAction();
        if (firstNotCheckedRadioInput) firstNotCheckedRadioInput.checked = true;
        if (selectedRadioInput) selectedRadioInput.remove();
        if (selectedLabel) selectedLabel.remove();
        if (selectedRows) selectedRows.remove();
    }

    function removeComparisonItem(event) {
        event && event.preventDefault();
        preAction();

        let item = event.target.closest('.shop-comparison-card');
        let itemIndex = -1;
        let length = -1;

        if (item) {
            length = item.parentElement.children.length;
            if (length === 1) {
                clearComparisonList();
            } else {
                for (let i = 0; i < length; i++) {
                    if (item.parentElement.children[i] === item) {
                        itemIndex = i;
                        break;
                    }
                }
            }
        }

        if (itemIndex !== -1 && length !== -1 && selectedRows) {
            let rowsElements = selectedRows.querySelectorAll('.shop-comparison-row');

            for (let i = 0; i < rowsElements.length; i++) {
                rowsElements[i].children[itemIndex].remove();
            }

            if (selectedLabel) {
                let number = selectedLabel.querySelector('.shop-comparison-categories-btn-number');
                if (number) {
                    number.innerHTML = length - 1;
                }
            }
        }
    }

    function getMouseXPositionFromEvent(event) {
        let pageX = event.pageX;
        if (event.pageX == null && event.clientX != null) {
            let doc = document.documentElement, body = document.body;
            pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
        }
        return pageX;
    }

    // Start drag and drop card
    function cardMove(event) {
        requestAnimationFrame(function () {
            if (dragAndDropCard === null || !Number.isInteger(dragAndDropStartMouseXPosition)) {
                stopCardMove()
                return;
            }
            let positionX = (dragAndDropStartMouseXPosition - getMouseXPositionFromEvent(event)) * -1;

            dragAndDropCard.style.zIndex = '5';
            dragAndDropCard.style.transform = `translateX(${positionX}px)`;
        });
    }

    function stopCardMove() {
        document.removeEventListener('mousemove', cardMove);
        document.removeEventListener('click', stopCardMove);
        if (dragAndDropCard) {
            document.body.style.cursor = 'auto';
            for (let i = 0; i < dragAndDropCards.length; i++) {
                dragAndDropCards[i].style.zIndex = '1';
                dragAndDropCards[i].style.transform = 'translateX(0px)';
                dragAndDropCards[i].style.opacity = '1';
                dragAndDropCards[i].style.pointerEvents = 'auto';
                dragAndDropCards[i].removeEventListener('mouseenter', replaceCardsOnHover);

                let drop = dragAndDropCards[i].querySelector('.shop-comparison-card-drop');
                if (drop) {
                    drop.style.cursor = 'grab';
                }
            }
        }
        dragAndDropCard = null;
    }

    function startCardMove(event) {
        stopCardMove();
        dragAndDropCard = event.target ? event.target.closest('.shop-comparison-card') : null;
        dragAndDropCard = dragAndDropCard ? dragAndDropCard : null;
        dragAndDropStartMouseXPosition = getMouseXPositionFromEvent(event);

        if (dragAndDropCard && Number.isInteger(dragAndDropStartMouseXPosition)) {
            dragAndDropCards = dragAndDropCard.parentNode.querySelectorAll('.shop-comparison-card');

            for (let i = 0; i < dragAndDropCards.length; i++) {
                dragAndDropCards[i].style.opacity = '0.5';
                let drop = dragAndDropCards[i].querySelector('.shop-comparison-card-drop');
                if (drop) {
                    drop.style.cursor = 'grabbing';
                }
                dragAndDropCards[i].removeEventListener('mouseenter', replaceCardsOnHover);
                dragAndDropCards[i].addEventListener('mouseenter', replaceCardsOnHover);
            }

            document.body.style.cursor = 'grabbing';
            dragAndDropCard.style.opacity = '1';
            dragAndDropCard.style.pointerEvents = 'none';
            document.addEventListener('mousemove', cardMove);
            document.addEventListener('click', stopCardMove);
        }
    }

    function replaceCardsOnHover(event) {
        requestAnimationFrame(function () {
            let enterCard = event.target;
            let enterCardOrderVarName = String(enterCard.style.order)
                .replace('var(', '').replace(')', '')
                .replace(';', '').trim();
            let dragAndDropCardOrderVarName = String(dragAndDropCard.style.order)
                .replace('var(', '').replace(')', '')
                .replace(';', '').trim();

            let enterCardOrderVarValue = comparison.style.getPropertyValue(enterCardOrderVarName);
            let dragAndDropCardOrderVarValue = comparison.style.getPropertyValue(dragAndDropCardOrderVarName);

            let x = dragAndDropCard.getBoundingClientRect().left;
            comparison.style.setProperty(enterCardOrderVarName, dragAndDropCardOrderVarValue);
            comparison.style.setProperty(dragAndDropCardOrderVarName, enterCardOrderVarValue);
            dragAndDropStartMouseXPosition -= x - dragAndDropCard.getBoundingClientRect().left;
            cardMove(event);
        });
    }
    // End drag and drop card

    function destroy(){
        if (clearComparisonListForm) {
            clearComparisonListForm.removeEventListener('submit', clearComparisonList);
        }
        if (clearComparisonItemForms.length) {
            for (let i = 0; i < clearComparisonItemForms.length; i++) {
                clearComparisonItemForms[i].removeEventListener('submit', removeComparisonItem);
            }
        }
        if (cardDrops.length) {
            for (let i = 0; i < cardDrops.length; i++) {
                cardDrops[i].style.display = 'none';
                cardDrops[i].removeEventListener('mousedown', startCardMove);
                cardDrops[i].removeEventListener('mouseup', stopCardMove);
            }
        }
    }

    function init(){
        destroy();

        comparison = document.querySelector('.shop-comparison');
        if (!comparison) {
            return;
        }

        cardDrops = comparison.querySelectorAll('.shop-comparison-card-drop');
        clearComparisonListForm = comparison.querySelector('.js-clear-comparison-list-form');
        clearComparisonItemForms = comparison.querySelectorAll('.js-remove-comparison-item-form');

        if (clearComparisonListForm) {
            clearComparisonListForm.addEventListener('submit', clearComparisonList);
        }
        if (clearComparisonItemForms.length) {
            for (let i = 0; i < clearComparisonItemForms.length; i++) {
                clearComparisonItemForms[i].addEventListener('submit', removeComparisonItem);
            }
        }
        if (cardDrops.length) {
            for (let i = 0; i < cardDrops.length; i++) {
                cardDrops[i].style.display = 'block';
                cardDrops[i].addEventListener('mousedown', startCardMove);
                cardDrops[i].addEventListener('mouseup', stopCardMove);
            }
        }

        let startLength = 0;
        let rowsElems = comparison.querySelectorAll('.shop-comparison-rows');
        for (let i = 0; i < rowsElems.length; i++) {
            let cardElems = rowsElems[i].querySelectorAll('.shop-comparison-card');
            let cardElemsLength = cardElems.length;
            let rowElems = rowsElems[i].querySelectorAll('.shop-comparison-row');
            for (let j = 0; j < rowElems.length; j++) {
                let childrenElems = rowElems[j].children;
                for (let k = 0; k < childrenElems.length; k++) {
                    let index = startLength + k + 1;

                    let name = `--shop-comparison-card${index}-order`;
                    if (!comparison.style.getPropertyValue(name)) {
                        comparison.style.setProperty(name, String(index));
                    }
                    childrenElems[k].style.order = `var(${name})`;
                }
            }
            startLength += cardElemsLength;
        }
        preAction();
    }

    init();
})();
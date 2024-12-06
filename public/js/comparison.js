'use strict';

;(function () {
    'use strict';

    let radioInputs = null;
    let firstNotCheckedRadioInput = null;
    let selectedRadioInput = null;
    let selectedLabel = null;
    let selectedRows = null;

    let cardDrops = document.querySelectorAll('.shop-comparison-card-drop');
    let clearComparisonListForm = document.querySelector('.js-clear-comparison-list-form');
    let clearComparisonItemForms = document.querySelectorAll('.js-remove-comparison-item-form');

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

    function startDragAndDrop (event) {
        console.log(event)
        event.target.style.cursor = 'grabbing';

    }

    function endDragAndDrop (event) {
        console.log(event)
        event.target.style.cursor = 'grab';
    }

    if (clearComparisonListForm) clearComparisonListForm.addEventListener('submit', clearComparisonList);
    if (clearComparisonItemForms.length) {
        for (let i = 0; i < clearComparisonItemForms.length; i++) {
            clearComparisonItemForms[i].addEventListener('submit', removeComparisonItem);
        }
    }
    window.startDragAndDrop = startDragAndDrop;
    if (cardDrops.length) {
        for (let i = 0; i < cardDrops.length; i++) {
            cardDrops[i].style.display = 'block';
            cardDrops[i].addEventListener('mousedown', startDragAndDrop);
            cardDrops[i].addEventListener('mouseup', endDragAndDrop);
        }
    }
})();
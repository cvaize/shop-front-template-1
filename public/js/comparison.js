'use strict';

;(function () {
    'use strict';

    let radioInputs = null;
    let firstNotCheckedRadioInput = null;
    let selectedRadioInput = null;
    let selectedLabel = null;
    let selectedRows = null;
    let dragAndDropCard = null;
    let dragAndDropCards = [];
    let dragAndDropStartMouseXPosition = 0;

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

    function getMouseXPositionFromEvent(event) {
        let pageX = event.pageX;
        if (event.pageX == null && event.clientX != null) {
            let doc = document.documentElement, body = document.body;
            pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
        }
        return pageX;
    }

    // function getMousePositionFromEvent(event){
    //     let pageX = event.pageX;
    //     let pageY = event.pageY;
    //     if ( event.pageX == null && event.clientX != null ) {
    //         let doc = document.documentElement, body = document.body;
    //         pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
    //         pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc   && doc.clientTop  || body && body.clientTop  || 0);
    //     }
    // }

    function moveDragAndDrop(event) {
        requestAnimationFrame(function () {
            if (dragAndDropCard === null || !Number.isInteger(dragAndDropStartMouseXPosition)) {
                stopMoveDragAndDrop()
                return;
            }
            let positionX = (dragAndDropStartMouseXPosition - getMouseXPositionFromEvent(event)) * -1;

            dragAndDropCard.style.zIndex = '5';
            dragAndDropCard.style.transform = `translateX(${positionX}px)`;
        });
        // console.log(event)
    }

    function clickDragAndDrop() {
        console.log('Click')
        stopMoveDragAndDrop();
    }

    function stopMoveDragAndDrop() {
        document.removeEventListener('mousemove', moveDragAndDrop);
        document.removeEventListener('click', clickDragAndDrop);
        if (dragAndDropCard) {
            document.body.style.cursor = 'auto';
            dragAndDropCards = dragAndDropCard.parentNode.querySelectorAll('.shop-comparison-card');
            for (let i = 0; i < dragAndDropCards.length; i++) {
                dragAndDropCards[i].style.zIndex = '1';
                dragAndDropCards[i].style.transform = 'translateX(0px)';
                dragAndDropCards[i].style.opacity = '1';
                dragAndDropCards[i].style.pointerEvents = 'auto';
                let drop = dragAndDropCards[i].querySelector('.shop-comparison-card-drop');
                if (drop) {
                    drop.style.cursor = 'grab';
                }
            }
        }
        dragAndDropCard = null;
    }

    function startDragAndDrop(event) {
        stopMoveDragAndDrop();
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
            }
            document.body.style.cursor = 'grabbing';
            dragAndDropCard.style.opacity = '1';
            dragAndDropCard.style.pointerEvents = 'none';
            document.addEventListener('mousemove', moveDragAndDrop);
            document.addEventListener('click', clickDragAndDrop);
        }
        // console.log(event)
    }

    if (clearComparisonListForm) clearComparisonListForm.addEventListener('submit', clearComparisonList);
    if (clearComparisonItemForms.length) {
        for (let i = 0; i < clearComparisonItemForms.length; i++) {
            clearComparisonItemForms[i].addEventListener('submit', removeComparisonItem);
        }
    }
    if (cardDrops.length) {
        for (let i = 0; i < cardDrops.length; i++) {
            cardDrops[i].style.display = 'block';
            cardDrops[i].addEventListener('mousedown', startDragAndDrop);
            cardDrops[i].addEventListener('mouseup', stopMoveDragAndDrop);
        }
    }
})();
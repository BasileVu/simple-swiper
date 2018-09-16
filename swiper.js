// Shorthand to add multiple event listeners in an easier way.
const addEL = (el, events, callback) => events.trim().split(" ").forEach(e => el.addEventListener(e, callback));

// Shorthand to get offset to left of the page using an event
const getPageX = (event) => event.pageX || (event.touches && event.touches[0] && event.touches[0].pageX) || 0;


window.onload = () => {
    const CONTAINER_WIDTH = 242; // width of .container showing a page
    const N_PAGES = 6; // number of pages

    const content = document.querySelector(".content");
    const container = document.querySelector(".card-container");
    const leftButton = document.querySelector(".button-left");
    const rightButton = document.querySelector(".button-right");

    let index = 0;
    const maxIndex = N_PAGES - 1;
    const moveContext = {mouseDown: false, downPos: 0, curPos: 0};


    // Updates the state of the buttons
    const updateButtons = () => {
        leftButton.disabled = index <= 0;
        rightButton.disabled = index >= maxIndex;
    };

    // Updates the index of the current page and moves the content accordingly.
    const updatePosition = (curIndex) => {
        index = curIndex < 0 ? 0 : curIndex >= maxIndex ? maxIndex : curIndex;
        container.style.transform = `translateX(${-(index * CONTAINER_WIDTH)}px)`;
        updateButtons();
    };


    // Buttons navigation
    const addButtonEL = (button, indexOp) => addEL(button, "click touchstart", (e) => {
        e.preventDefault();
        updatePosition(indexOp());
    });

    addButtonEL(leftButton, () => index - 1);
    addButtonEL(rightButton, () => index + 1);

    updateButtons();


    // Drag navigation

    addEL(content, "mousedown touchstart", (e) => {
        e.preventDefault();
        moveContext.mousedown = true;
        moveContext.downPos = getPageX(e);
        content.classList.add("grabbing");
    });

    addEL(content, "mousemove touchmove", (e) => {
        e.preventDefault();
        if (!moveContext.mousedown) {
            return;
        }
        const base = index * CONTAINER_WIDTH;
        const pos = base - (getPageX(e) - moveContext.downPos);
        const limit = base + (CONTAINER_WIDTH / 3) * (pos >= 0 ? 1 : -1);

        // move to new position or limit movement if on the leftmost / rightmost side
        moveContext.curPos = (index >= maxIndex && pos > limit) || (index <= 0 && pos < limit) ? limit : pos;
        container.style.transform = `translateX(${-(moveContext.curPos)}px)`;
    });

    addEL(document.documentElement, "mouseup touchend", (e) => {
        e.preventDefault();
        if (!moveContext.mousedown) {
            return;
        }

        moveContext.mousedown = false;
        content.classList.remove("grabbing");

        // don't do anything if cursor didn't move / came back where it did a mouse down
        if (moveContext.downPos === getPageX(e)) {
            return;
        }

        // change the index on the nearest page, using the left of a page as a landmark
        const lastPos = index * CONTAINER_WIDTH;
        const middle = CONTAINER_WIDTH / 2;
        const diff = moveContext.curPos - lastPos;

        // update page accordingly
        if (diff > middle) {
            updatePosition(index + 1)
        } else if (diff < -middle) {
            updatePosition(index - 1)
        } else {
            updatePosition(index);
        }
    });
};
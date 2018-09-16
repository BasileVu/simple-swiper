window.onload = () => {
    const CONTAINER_WIDTH = 242; // width of .container showing a page
    const N_PAGES = 6; // number of pages

    const content = document.querySelector(".content");
    const container = document.querySelector(".card-container");
    const leftButton = document.querySelector(".button-left");
    const rightButton = document.querySelector(".button-right");

    let index = 0;
    const maxIndex = N_PAGES - 1;
    let mousedown = false;
    let mouseDownPos = 0;
    let curPos = 0;

    const updateButtons = () => {
        leftButton.disabled = index <= 0;
        rightButton.disabled = index >= maxIndex;
    };

    const updatePosition = (curIndex) => {
        index = curIndex < 0 ? 0 : curIndex >= maxIndex ? maxIndex : curIndex;
        container.style.transform = "translateX(-" + (index * CONTAINER_WIDTH) + "px)";
        updateButtons();
    };

    updateButtons();
    leftButton.addEventListener("click", () => updatePosition(index - 1));
    rightButton.addEventListener("click", () => updatePosition(index + 1));

    content.addEventListener("mousedown", (e) => {
        mousedown = true;
        content.classList.add("grabbing");
        mouseDownPos = e.pageX;
    });

    content.addEventListener("mousemove", (e) => {
        if (!mousedown) {
            return;
        }
        curPos = index * CONTAINER_WIDTH - (e.pageX - mouseDownPos);
        container.style.transform = "translateX(-" + curPos + "px)";
    });

    // listen to mouseup on body to trigger it if user moves the mouse outside after a click on the container
    document.documentElement.addEventListener("mouseup", (e) => {
        // if mouse wan't pressed inside the container
        if (!mousedown) {
            return;
        }

        mousedown = false;
        content.classList.remove("grabbing");

        // don't do anything if cursor didn't move / came back where it did a mouse down
        if (mouseDownPos === e.pageX) {
            return;
        }

        // change the index on the nearest page, using the left of a page as a landmark
        const lastPos = index * CONTAINER_WIDTH;
        const middle = CONTAINER_WIDTH / 2;
        const diff = curPos - lastPos;

        if (diff > middle) { // set next page as current
            updatePosition(index + 1)
        } else if (diff < -middle) { // set previous page as current
            updatePosition(index - 1)
        } else { // stay on current page
            updatePosition(index);
        }
    });
};
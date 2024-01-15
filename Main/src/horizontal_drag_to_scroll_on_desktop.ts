export default function setHorizontalDragScrollOnDesktop(element: HTMLElement) {
    let dragStarted = false,
        dragged = false,
        preventClick = false,
        lastClientX: number | null = null;

    element.addEventListener("mousedown", (evt) => {
        dragStarted = true;
        lastClientX = evt.clientX;
    });
    window.addEventListener("mousemove", (evt) => {
        evt.preventDefault();
        const newClientX = evt.clientX;

        if (!dragStarted) return;
        else if (lastClientX === null) return (lastClientX = newClientX);
        let xDiff = lastClientX - newClientX;
        element.scrollBy({
            left: xDiff,
        });
        lastClientX = newClientX;
        dragged = true;
        preventClick = true;
    });
    window.addEventListener("mouseup", (evt) => {
        if (dragged) evt.preventDefault();
        else preventClick = false;
        dragStarted = false;
        dragged = false;
    });
    element.addEventListener("click", (evt) => {
        if (preventClick) {
            evt.preventDefault();
            preventClick = false;
        }
    });
}

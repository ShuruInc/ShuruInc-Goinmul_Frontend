function listenHorizontalDragEnd(handler) {
    let isDragReady = false;
    let isDragging = false;
    let isVerticalDrag = false;
    let isHorizontalDrag = false;
    let isInitialDrag = true;
    let startX, startY;

    const cancelDrag = () => {
        if (isDragging && isHorizontalDrag) handler();

        isDragReady = false;
        isDragging = false;
        isVerticalDrag = false;
        isHorizontalDrag = false;
        isInitialDrag = true;
    };

    const startDrag = (e) => {
        isDragReady = true;
        startX = e.clientX ?? e.touches[0].clientX;
        startY = e.clientY ?? e.touches[0].clientY;
    };

    const processDrag = (e) => {
        const currentX = e.clientX ?? e.touches[0].clientX;
        const currentY = e.clientY ?? e.touches[0].clientY;

        const deltaX = currentX - startX;
        const deltaY = currentY - startY;

        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 180;
        let isMovementHorizontal =
            (angle >= 240 && angle <= 300) || (angle >= 60 && angle <= 120);
        let dragCondition = isInitialDrag && isDragReady;

        if (isMovementHorizontal && dragCondition) {
            isDragging = true;
            isVerticalDrag = true;
            isHorizontalDrag = false;
            isInitialDrag = false;
        } else if (dragCondition) {
            isDragging = true;
            isHorizontalDrag = true;
            isVerticalDrag = false;
            isInitialDrag = false;
        }
    };

    window.addEventListener("mouseup", cancelDrag);
    window.addEventListener("mouseout", cancelDrag);
    window.addEventListener("touchend", cancelDrag);
    window.addEventListener("touchcancel", cancelDrag);

    window.addEventListener("mousedown", startDrag);
    window.addEventListener("touchstart", startDrag);

    window.addEventListener("mousemove", processDrag);
    window.addEventListener("touchmove", processDrag);
}

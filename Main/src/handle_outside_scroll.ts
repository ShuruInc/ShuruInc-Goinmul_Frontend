export default function handleOutsideScroll(
    onOutsideScroll: (delta: number, wheel: boolean) => void,
    getTouchTarget: () => HTMLElement | null,
) {
    let handlingTouch = false;

    const dispatchEvent = (evt: TouchEvent, name: string) => {
        const target = getTouchTarget();
        if (target === null) return;

        const targetBoundingRect = target.getBoundingClientRect();
        const centerTouch = (i: Touch) =>
            new Touch({
                clientX:
                    (targetBoundingRect.left + targetBoundingRect.right) / 2,
                clientY: i.clientY,
                identifier: i.identifier,
                target: target,
            });
        const newTouchEvent = new TouchEvent(name, {
            changedTouches: [...evt.changedTouches].map(centerTouch),
            touches: [...evt.touches].map(centerTouch),
            targetTouches: [...evt.targetTouches].map(centerTouch),
        });
        console.log(newTouchEvent);

        target.dispatchEvent(newTouchEvent);
    };
    document.body.addEventListener("touchstart", (evt) => {
        if (evt.target !== document.body) return;
        evt.preventDefault();

        handlingTouch = true;
        dispatchEvent(evt, "touchstart");
    });
    document.body.addEventListener("touchmove", (evt) => {
        if (handlingTouch) {
            evt.preventDefault();
            dispatchEvent(evt, "touchmove");
            return;
        }
    });
    document.body.addEventListener("touchend", (evt) => {
        if (handlingTouch) {
            handlingTouch = false;
            evt.preventDefault();

            dispatchEvent(evt, "touchend");
        }
    });
    document.body.addEventListener("touchcancel", (evt) => {
        if (handlingTouch) {
            handlingTouch = false;
            evt.preventDefault();

            dispatchEvent(evt, "touchcancel");
        }
    });

    // container 밖에서 스크롤해도 container가 스크롤되도록 설정
    document.body.addEventListener("wheel", (evt) => {
        if (evt.target !== document.body) return;
        console.log(evt.deltaMode);

        let delta = evt.deltaY;
        switch (evt.deltaMode) {
            case 0x01:
                // Convert line unit delta value to pixel unit
                delta *= Number(
                    /[0-9]+/.exec(
                        getComputedStyle(document.body).fontSize ?? "16px",
                    )![0],
                );
                break;
            case 0x02:
                // Convert page unit delta value to pixel unit
                delta *= window.innerHeight;
        }

        onOutsideScroll(delta, true);
    });
}

export default function handleOutsideScroll(
    onOutsideScroll: (delta: number) => void,
) {
    let hnadlingTouch = false,
        lasttouchY = 0;
    document.body.addEventListener("touchstart", (evt) => {
        if (evt.target !== document.body) return;

        evt.preventDefault();
        hnadlingTouch = true;
        lasttouchY = evt.targetTouches[0].clientY;
    });
    document.body.addEventListener("touchmove", (evt) => {
        if (hnadlingTouch) {
            evt.preventDefault();

            const newTouchY = evt.targetTouches[0].clientY;
            onOutsideScroll(lasttouchY - newTouchY);
            lasttouchY = newTouchY;
        }
    });
    document.body.addEventListener("touchend", (evt) => {
        if (hnadlingTouch) {
            evt.preventDefault();
            hnadlingTouch = false;
        }
    });
    document.body.addEventListener("touchcancel", (evt) => {
        if (hnadlingTouch) {
            evt.preventDefault();
            hnadlingTouch = false;
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

        onOutsideScroll(delta);
    });
}

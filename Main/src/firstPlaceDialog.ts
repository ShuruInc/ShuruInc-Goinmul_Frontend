import styles from "../styles/first-place-dialog.module.scss";
import effectImage from "../assets/confetti-explosion.png";

export default function createFirstPlaceDialog(
    due: Date,
    onEmailInput: (email: string) => void,
) {
    const wrapper = document.createElement("div");
    wrapper.className = styles.wrapper;
    wrapper.innerHTML = `<div class="${styles.background}"></div><div class="${
        styles.dialog
    }">
    <h1>1위 달성!</h1>
    <p class="${styles.congratulations}">
    <span class="${styles.due}">${
        due.getMonth() + 1
    }월 ${due.getDate()}일 ${due.getHours()}시 ${due.getMinutes()}분까지</span><br>
    1등을 유지하시면<br>
    당신의 최애 공식 굿즈 10만 원어치를<br>
    이벤트 선물로 드립니다!
    </p>
    <p class="${styles.gimmeEmail}">
    이메일 주소를 기록해주세요.<br>
    당신이 그 주인공이 된다면, 저희가 이메일로 찾아갑니다.
    </p>
    <form>
        <input type="email" placeholder="example@example.com"><br>
        <button type="submit">가록</button>
    </form>
    </div>
    <img class="${styles.effect}"></img>`;

    (wrapper.querySelector("img") as HTMLImageElement).src = effectImage;
    wrapper.querySelector("form")?.addEventListener("submit", (evt) => {
        evt.preventDefault();
        onEmailInput(
            (wrapper.querySelector("form input") as HTMLInputElement).value,
        );
        wrapper.remove();
    });

    let removed = false;
    const fitCover = (
        childWidth: number,
        childHeight: number,
        parentWidth: number,
        parentHeight: number,
    ) => {
        // if width == parentWidth
        if (childHeight * (parentWidth / childWidth) <= parentHeight) {
            return [parentWidth, childHeight * (parentWidth / childWidth)];
        } else {
            return [childWidth * (parentHeight / childHeight), parentHeight];
        }
    };

    const changeDialogSize = () => {
        const background = document.querySelector(
            "." + styles.background,
        ) as HTMLElement | null;
        if (background === null)
            return window.requestAnimationFrame(changeDialogSize);
        const backgroundBoundingBox = background.getBoundingClientRect();
        const dialog = document.querySelector(
            "." + styles.dialog,
        ) as HTMLElement;
        const bgOriginalSize = [564, 768];
        const bgSize = fitCover(
            bgOriginalSize[0],
            bgOriginalSize[1],
            Math.min(backgroundBoundingBox.width, 500),
            backgroundBoundingBox.height,
        );
        const bgXY = [
            (backgroundBoundingBox.width - bgSize[0]) / 2,
            (backgroundBoundingBox.height - bgSize[1]) / 2,
        ];

        const padding = 0;
        const dialogXy = [
            bgXY[0] + 90 * (bgSize[0] / bgOriginalSize[0]) + padding,
            bgXY[1] + 285 * (bgSize[1] / bgOriginalSize[1]) + padding,
        ];

        const dialogSize = [
            (470 - 90) * (bgSize[0] / bgOriginalSize[0]) - padding * 2,
            (650 - 285) * (bgSize[1] / bgOriginalSize[1]) - padding * 2,
        ];

        dialog.style.left = `${Math.round(dialogXy[0])}px`;
        dialog.style.top = `${Math.round(dialogXy[1])}px`;
        dialog.style.width = `${Math.round(dialogSize[0])}px`;
        dialog.style.height = `${Math.round(dialogSize[1])}px`;
        if (!removed) window.requestAnimationFrame(changeDialogSize);
    };

    wrapper.addEventListener("click", (evt) => {
        let now = evt.target as Node | null;
        while (now != null) {
            if (
                now.nodeType === now.ELEMENT_NODE &&
                (now as HTMLElement).classList.contains(styles.dialog)
            )
                return;

            now = now.parentNode;
        }

        evt.preventDefault();
        removed = true;
        wrapper.remove();
    });

    document.body.appendChild(wrapper);
    window.requestAnimationFrame(changeDialogSize);
}

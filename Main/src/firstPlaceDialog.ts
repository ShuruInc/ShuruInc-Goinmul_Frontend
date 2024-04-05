import styles from "../styles/first-place-dialog.module.scss";
import effectImage from "../assets/confetti-explosion.png";

export default function createFirstPlaceDialog(
    //due: Date,
    onEmailInput: (email: string) => void,
) {
    const wrapper = document.createElement("div");
    wrapper.className = styles.wrapper;
    wrapper.innerHTML = `<div class="${styles.background}"></div><div class="${
        styles.dialog
    }">

    <h1>1위 달성!</h1>
    <p class="${styles.congratulations}" style="line-height: 19px;">
    5월 5일 23시 59분까지<br>1등을 유지하신 분께<br>\"당신의 최애 장르 공식<br>굿즈 10만 원 상당\"을<br> 이벤트 선물로 드립니다! 
    </p>
    <p class="${styles.gimmeEmail}">
    이메일 주소를 기록해주세요<br>
    </p>
    <form>
        <input type="email" placeholder="example@example.com"><br>
        <button type="submit">전송</button>
    </form>
    </div>
    <img class="${styles.effect}"></img>`;

    (wrapper.querySelector("img") as HTMLImageElement).src =
        effectImage + "?dummy=" + Date.now();
    wrapper.querySelector("form")?.addEventListener("submit", (evt) => {
        evt.preventDefault();
        const email = (wrapper.querySelector("form input") as HTMLInputElement)
            .value;
        if (!/.+@.+\..+/.test(email)) {
            return alert("이메일이 유효하지 않습니다!");
        }

        onEmailInput(email);
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
            bgXY[0] + 70 * (bgSize[0] / bgOriginalSize[0]) + padding,
            bgXY[1] + 232 * (bgSize[1] / bgOriginalSize[1]) + padding,
        ];

        const dialogSize = [
            (493 - 70) * (bgSize[0] / bgOriginalSize[0]) - padding * 2,
            (703 - 232) * (bgSize[1] / bgOriginalSize[1]) - padding * 2,
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

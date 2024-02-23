import styles from "../styles/first-place-dialog.module.scss";
import effectImage from "../assets/confetti-explosion.png";

export default function createFirstPlaceDialog(
    due: Date,
    onEmailInput: (email: string) => void,
) {
    const wrapper = document.createElement("div");
    wrapper.className = styles.wrapper;
    wrapper.innerHTML = `<div class="${styles.dialog}">
    <p>
    축하합니다! 이 메시지는 1등에게만 보여집니다.<br>
    ${
        due.getMonth() + 1
    }월 ${due.getDate()}일 ${due.getHours()}시 ${due.getMinutes()}분까지 1등을 유지하시면<br>
    당신의 최애 장르 공식 굿즈 n만 원어치를 선물로 드립니다.<br>
    경품 수령을 원하시면 이메일 주소를 기록해주세요!<br>
    당신이 그 주인공이 된다면 저희가 이메일로 찾아갑니다.
    </p>
    <form>
        <input type="email">
        <button type="submit">가록</button>
    </form>
    </div>
    <img class="${styles.effect}"></img>`;

    (wrapper.querySelector("img") as HTMLImageElement).src = effectImage;
    wrapper.querySelector("form")?.addEventListener("submit", (evt) => {
        evt.preventDefault();
        wrapper.remove();
        onEmailInput(
            (wrapper.querySelector("form ipnut") as HTMLInputElement).value,
        );
    });

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
        wrapper.remove();
    });

    document.body.appendChild(wrapper);
}

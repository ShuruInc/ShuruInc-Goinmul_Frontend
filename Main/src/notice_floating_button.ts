import speakerIcon from "../assets/notice-floating-button-icon.svg";
import "../styles/floating-button.scss";

export default function createNoticeFloatingButton(contentHtml: string) {
    const button =
        document.querySelector(".floating-btn.notice") ??
        (() => {
            const newFloating = document.createElement("button");
            newFloating.className = "floating-btn notice";
            newFloating.innerHTML =
                '<div class="content"></div>' +
                `<div class="icon"><img src="${speakerIcon}"></div>`;
            document.body.appendChild(newFloating);
            return newFloating;
        })();

    window.addEventListener("click", (evt) => {
        let now = evt.target as Node | null;
        while (now != null) {
            if (now === button) {
                button.classList.add("active");
                return;
            }

            now = now.parentNode;
        }
        button.classList.remove("active");
    });

    const changeContent = (contentHtml: string) => {
        button.querySelector(".content")!.innerHTML = contentHtml;
    };
    changeContent(contentHtml);
    return changeContent;
}

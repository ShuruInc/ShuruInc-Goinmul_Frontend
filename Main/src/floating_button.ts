import { icon } from "@fortawesome/fontawesome-svg-core";
import { faChevronUp, faHome } from "@fortawesome/free-solid-svg-icons";
import "../styles/floating-button.scss";

type FloatingButtonListener = () => void;
const buttonListeners: FloatingButtonListener[] = [];
const chevronUpIconHtml = icon(faChevronUp).html[0];
const homeIconHtml = icon(faHome).html[0];
type FloatingButtonIconType = "up" | "home";

export function addFloatingButonListener(listener: FloatingButtonListener) {
    buttonListeners.push(listener);
}

export default function createFloatingButton(
    type: FloatingButtonIconType = "home"
) {
    const button =
        document.querySelector(".floating-btn") ??
        (() => {
            const newFloating = document.createElement("button");
            newFloating.className = "floating-btn";
            newFloating.addEventListener("click", () =>
                buttonListeners.forEach((i) => i())
            );
            document.body.appendChild(newFloating);
            return newFloating;
        })();

    const changeType = (newType: FloatingButtonIconType) => {
        button.innerHTML =
            newType === "home" ? homeIconHtml : chevronUpIconHtml;
    };
    changeType(type);
    return type;
}

import { icon } from "@fortawesome/fontawesome-svg-core";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

export default function footer() {
    const footer = document.createElement("footer");
    footer.innerHTML = `Copyright (C) 2024 Shuru<br>
        <div class="icons">
            <a class="twitter" href="https://twitter.com/messages/compose?recipient_id=1175998448841056256"></a>
        </div>`;
    footer.querySelector("a.twitter")!.innerHTML = icon(faTwitter).html[0];
    return footer;
}

import { icon } from "@fortawesome/fontawesome-svg-core";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

export default function footer() {
    const footer = document.createElement("footer");
    footer.innerHTML = `<p style="font-size: 10px; line-height:9px;">Copyright (C) 2024 Shuru<br>
    주식회사 슈르 | 대표이사 임수빈 | 사업자등록번호 : 693-86-02236 |<br> business@shuru.co.kr | 서울특별시 가산디지털 1로 119 B동 806호</p>
        <div class="icons">
            <a class="twitter" href="https://twitter.com/messages/compose?recipient_id=1175998448841056256"></a>
        </div>`;
    footer.querySelector("a.twitter")!.innerHTML = icon(faTwitter).html[0];
    return footer;
}

import urlJoin from "url-join";
import { backendUrl } from "./env";
import "../styles/common/_tweet-dialog.scss";

/**
 * 트윗을 작성하는 Dialog를 열어 사용자로부터 입력을 받고, 사용자의 입력에 따라 트윗 작성 API를 호출합니다.
 * @param content 트윗 텍스트 초기값
 * @param file 트윗 이미지
 * @returns 트윗 작성 여부
 */
export default function tweetDialog(
    content: string,
    file: File,
): Promise<boolean> {
    return new Promise((resolve, _reject) => {
        const dialogWrapper = document.createElement("div");
        dialogWrapper.className = "tweet-dialog-wrapper";
        dialogWrapper.innerHTML = `
        <div class="tweet-dialog">
                <h1>트윗 작성하기</h1>
                <img>
                <textarea></textarea>
            <div>
                <button class="submit">트윗하기</button>
                <button class="cancel">닫기</button>
            </div>
        </div>
        `;

        dialogWrapper.querySelector("img")!.src = URL.createObjectURL(file);

        // 반투명 검은 배경 클릭시 닫기
        dialogWrapper.addEventListener("click", (evt) => {
            if (evt.target === dialogWrapper) {
                evt.preventDefault();
                dialogWrapper.parentNode?.removeChild(dialogWrapper);
                resolve(false);
            }
        });

        // 트윗 텍스트 초기값 설정
        dialogWrapper.querySelector("textarea")!.value = content;

        // 닫기 버튼 클릭시 닫기
        dialogWrapper
            .querySelector("button.cancel")!
            .addEventListener("click", (evt) => {
                evt.preventDefault();

                dialogWrapper.parentNode?.removeChild(dialogWrapper);
                resolve(false);
            });

        // 작성 버튼 클릭시 API 호출
        dialogWrapper
            .querySelector("button.submit")!
            .addEventListener("click", (evt) => {
                evt.preventDefault();

                const url = urlJoin(
                    backendUrl!,
                    "/api/v1/tweet?content=" +
                        encodeURIComponent(
                            dialogWrapper.querySelector("textarea")!.value,
                        ),
                );

                let container = new DataTransfer();
                container.items.add(file);

                /**
                 * API 호출시 API 응답으로 트위터 API 인증 페이지로의
                 * 리다이렉트 응답(302)이 오는 데 이는 Fetch/XHR API
                 * 로 다를 수 없으며(opaque-redirect) 또한 사용자의
                 * 상호응답도 필요하다.
                 *
                 * 따라서 새 창에서 트윗 작성 페이지가 열리도록 하기 위해
                 * form을 만들어 submit한다.
                 */
                const form = document.createElement("form");
                form.enctype = "multipart/form-data";
                form.action = url;
                form.method = "POST";
                form.innerHTML = '<input type="file" name="image">';
                form.target = "_blank"; // 새 창에서 결과 페이지가 열리도록 한다.
                form.style.display = "none";
                form.querySelector("input")!.files = container.files;

                // submit
                document.body.append(form);
                form.submit();

                // submit후 dialog를 닫는다.
                dialogWrapper.parentNode?.removeChild(dialogWrapper);
                resolve(true);
            });

        // dialog를 표시한다.
        document.body.appendChild(dialogWrapper);
    });
}

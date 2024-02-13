import urlJoin from "url-join";
import { backendUrl } from "./env";
import "../styles/common/_tweet-dialog.scss";

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
                <textarea></textarea>
            <div>
                <button class="submit">트윗하기</button>
                <button class="cancel">닫기</button>
            </div>
        </div>
        `;

        dialogWrapper.addEventListener("click", (evt) => {
            if (evt.target === dialogWrapper) {
                evt.preventDefault();
                dialogWrapper.parentNode?.removeChild(dialogWrapper);
                resolve(false);
            }
        });
        dialogWrapper.querySelector("textarea")!.value = content;
        dialogWrapper
            .querySelector("button.cancel")!
            .addEventListener("click", (evt) => {
                evt.preventDefault();

                dialogWrapper.parentNode?.removeChild(dialogWrapper);
                resolve(false);
            });
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

                const form = document.createElement("form");
                form.enctype = "multipart/form-data";
                form.action = url;
                form.method = "POST";
                form.innerHTML = '<input type="file" name="image">';
                form.target = "_blank";
                form.style.display = "none";
                form.querySelector("input")!.files = container.files;

                document.body.append(form);
                form.submit();
                dialogWrapper.parentNode?.removeChild(dialogWrapper);
                resolve(true);
            });

        document.body.appendChild(dialogWrapper);
    });
}

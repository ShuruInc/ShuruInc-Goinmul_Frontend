import backgroundUrl from "../assets/paper.jpg";

/**
 * 이미지에 여백을 넣어 정사각형 형태로 만든다.
 * @param canvas 여백을 넣을 이미지
 * @returns 여백이 넣어진 정사각형 형태의 이미지
 */
export default async function addPadding(
    canvas: HTMLCanvasElement,
): Promise<Blob> {
    let size = Math.max(canvas.width, canvas.height);
    let x = (size - canvas.width) / 2;
    let y = (size - canvas.height) / 2;

    const backgroundImage = new Image();
    backgroundImage.src = backgroundUrl;

    const newCanvas =
        typeof OffscreenCanvas === "undefined"
            ? (() => {
                  const canvas = document.createElement("canvas");
                  canvas.width = size;
                  canvas.height = size;
                  return canvas;
              })()
            : new OffscreenCanvas(size, size);
    const newCanvasContext = newCanvas.getContext("2d") as
        | OffscreenCanvasRenderingContext2D
        | CanvasRenderingContext2D;
    newCanvasContext.drawImage(backgroundImage, 0, 0, size, size);
    newCanvasContext.drawImage(canvas, x, y);

    if ("convertToBlob" in newCanvas) {
        return await newCanvas.convertToBlob({ type: "image/png" });
    } else if ("toBlob" in newCanvas) {
        return await new Promise((resolve, reject) => {
            newCanvas.toBlob(
                (blob) => {
                    if (blob === null) reject();
                    else resolve(blob);
                },
                "image/png",
                1,
            );
        });
    }
    throw new Error();
}

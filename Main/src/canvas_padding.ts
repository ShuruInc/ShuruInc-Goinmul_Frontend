/**
 * 이미지에 여백을 넣어 정사각형 형태로 만든다.
 * @param canvas 여백을 넣을 이미지
 * @returns 여백이 넣어진 정사각형 형태의 이미지
 */
export default function padCanvas(
    canvas: HTMLCanvasElement,
    fill: string | CanvasGradient | CanvasPattern = "#ffe2c5"
) {
    let size = Math.max(canvas.width, canvas.height);
    let x = (size - canvas.width) / 2;
    let y = (size - canvas.height) / 2;
    const newCanvas = new OffscreenCanvas(size, size);
    const newCanvasContext = newCanvas.getContext("2d")!;
    newCanvasContext.fillStyle = fill;
    newCanvasContext.fillRect(0, 0, size, size);
    newCanvasContext.drawImage(canvas, x, y);

    return newCanvas;
}

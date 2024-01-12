export default function padCanvas(canvas: HTMLCanvasElement) {
    let size = Math.max(canvas.width, canvas.height);
    let x = (size - canvas.width) / 2;
    let y = (size - canvas.height) / 2;
    const newCanvas = new OffscreenCanvas(size, size);
    const newCanvasContext = newCanvas.getContext("2d")!;
    newCanvasContext.fillStyle = "#ffe2c5";
    newCanvasContext.fillRect(0, 0, size, size);
    newCanvasContext.drawImage(canvas, x, y);

    return newCanvas;
}

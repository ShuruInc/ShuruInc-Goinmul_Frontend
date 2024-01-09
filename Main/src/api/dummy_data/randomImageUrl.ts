let count = 0;
export default function RandomImageUrl(width = 200, height = 300) {
    return `https://picsum.photos/${width}/${height}?${count}${
        Math.random() * 100
    }${Date.now()}`;
}

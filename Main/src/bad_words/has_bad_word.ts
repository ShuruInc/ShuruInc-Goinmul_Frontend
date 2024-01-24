import badWordData from "./data";

export default function hasBadWord(str: string): string | false {
    for (const i of badWordData) {
        if (new RegExp(i.trim(), "g").test(str)) {
            return i;
        }
    }
    return false;
}

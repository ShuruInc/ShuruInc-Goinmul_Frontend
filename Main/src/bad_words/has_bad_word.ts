import badWordData from "./data";

export default function hasBadWord(str: string): string | false {
    if (str.length >= 2 && str.endsWith("충")) return "-충";
    for (const i of badWordData) {
        if (new RegExp(i.trim(), "g").test(str)) {
            return i;
        }
    }
    return false;
}

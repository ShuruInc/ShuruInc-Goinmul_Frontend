import goldMedal from "../assets/medal/1st.png";
import silverMedal from "../assets/medal/2nd.png";
import cooperMedal from "../assets/medal/3rd.png";
import { randomMedalEnabled } from "./env";

export default function getMedalData(ranking: number) {
    switch (
        randomMedalEnabled // 디버그용 기능
            ? Math.floor(Math.random() * 3) + 1
            : ranking // 모의고사는 메달이 없다
    ) {
        case 1:
            return goldMedal;
        case 2:
            return silverMedal;
        case 3:
            return cooperMedal;
    }

    return null;
}

/** 퀴즈 문제 데이터 */
export type QuizProblem = {
    /** 질문 텍스트 */
    question: string;
    /** 점수 */
    points: number;
    /** 이미지 혹은 초성 */
    figure: string;
    /** 이미지인지? 초성인지? */
    figureType: "image" | "initials" | "empty";
    /** 선택지 (null이면 주관식) */
    choices: null | { label: string; value: string }[];
    /** 퀴즈 id */
    id: number;
    /** 중분류 */
    secondCategoryName: string;
    /** 제약조건 */
    condition: string | null;
};

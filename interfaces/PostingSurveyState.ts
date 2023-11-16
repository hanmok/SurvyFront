import { makeRandomNumber, randomNumber } from "../utils/GetRandomNumber";
import { log, logObject } from "../utils/Log";
import { Question } from "./Question";
import { Section } from "./Section";

export interface PostingSurveyState {
    currentDate: Date;
    id: number;
    title: string;
    sections: Section[];
    questions: Question[];
}

export function isPostingSurveyState(item: any): item is PostingSurveyState {
    const ret =
        // typeof item?.currentDate === "object" &&
        // item.currentDate instanceof Date &&
        typeof item?.id === "number" &&
        typeof item?.title === "string" &&
        typeof item?.currentDate === "string";

    // &&
    // Array.isArray(item?.sections) &&
    // item.sections.every(
    //     (section: Section) =>
    //         typeof section?.id === "number" &&
    //         // typeof section?.title === 'string' &&
    //         // 다른 필수 속성들에 대한 유효성 검사도 추가해주세요
    //         true // 혹은 다른 유효성 검사 식
    // );

    logObject("testing PostingSurveyState", item);
    log("isPostingSurveyState?:" + ret);
    return ret;
}

export const makePostingSurveyState = ({
    id,
    surveyTitle,
    sections,
    questions,
}: {
    id: number | undefined;
    surveyTitle: string;
    sections: Section[];
    questions: Question[];
}) => {
    const currentDate = new Date();
    if (id) {
        // 이미 id 존재하는 경우.
        const ret: PostingSurveyState = {
            id,
            currentDate,
            title: surveyTitle,
            sections,
            questions,
        };
        return ret;
    }

    const newId = makeRandomNumber();
    const ret: PostingSurveyState = {
        id: newId,
        currentDate,
        title: surveyTitle,
        sections,
        questions,
    };
    return ret;
};

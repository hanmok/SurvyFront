import { numberOfQuestions } from "./../types/types";
import { Question } from "../interfaces/Question";
import { Section } from "../interfaces/Section";
import { SelectableOption } from "../interfaces/SelectableOption";
import { Survey } from "../interfaces/Survey";
import { logObject } from "../utils/Log";
import { printObject } from "../utils/printObject";
import { API_BASE_URL } from "./API";
import _ from "lodash";
import { makeSurvey } from "../interfaces/Survey";
import { useCustomContext } from "../features/context/CustomContext";

function convertToSnakeCase(obj) {
    return _.mapKeys(obj, (value, key) => _.snakeCase(key));
}

export async function createSurvey(
    surveyTitle: string,
    participationGoal: number,
    targetMinAge: number,
    targetMaxAge: number,
    genreIds: number[],
    geoIds: number[],
    sections: Section[],
    questions: Question[],
    isTargetMale: number | undefined,
    reward: number,
    cost: number
) {
    console.log(`createSurvey called`);
    let dummySelectableOptions: SelectableOption[] = [];
    let dummySections: Section[] = [];

    questions.forEach(q => {
        q.selectableOptions.forEach(so => {
            dummySelectableOptions.push(so);
        });
    });

    const { userId, accessToken } = useCustomContext();

    const numOfSections = sections.length;
    const survey = makeSurvey(
        userId,
        surveyTitle,
        participationGoal,
        targetMinAge,
        targetMaxAge,
        genreIds,
        geoIds,
        isTargetMale,
        reward,
        cost,
        numOfSections
    );

    logObject("made survey from createSurvey: ", survey);

    return await postWholeSurvey(
        survey,
        sections,
        questions,
        dummySelectableOptions,
        accessToken
    );
}

export async function postWholeSurvey(
    survey: Survey,
    sections: Section[],
    questions: Question[],
    selectableOptions: SelectableOption[],
    accessToken: string
): Promise<ApiResponse> {
    console.log("hello!!");
    const url = `${API_BASE_URL}/survey/whole`;
    const data = { survey, sections, questions, selectableOptions };
    printObject(data, "before post whole survey");

    const snakeData = {
        survey: convertToSnakeCase(survey),
        sections: sections.map(convertToSnakeCase),
        questions: questions.map(convertToSnakeCase),
        selectable_options: selectableOptions.map(convertToSnakeCase),
    };

    printObject(snakeData, "after converting to snake case,");

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(snakeData),
        });
        if (!response.ok) {
            console.log(`posting whole survey error!!`);
            throw new Error("posting whole survey error!!!!");
        }
        const responseData: ApiResponse = await response.json();
        logObject("response:", responseData);
        return responseData;
    } catch (error) {
        console.error(`posting whole survey error`, error);
        throw error;
    }
}

export const getSurveys = async (accessToken: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/survey`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const jsonData = await response.json();

        const surveys: Survey[] = jsonData.data.map((item: Survey) => ({
            title: item.title,
            id: item.id,
            currentParticipation: item.currentParticipation,
            participationGoal: item.participationGoal,
            initialSectionId: item.initialSectionId,
            genres: item.genres,
            // rewardRange: item.rewardRange,
        }));

        return surveys; // 이 부분이 수정된 부분. 함수가 Promise<[Survey]>를 반환하게 함
    } catch (error) {
        throw new Error("error fetching survey");
    }
};

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
import { fetchData } from "./BaseAPI";
import { convertToSnakeCase } from "../utils/SnakeToCamel";

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
    cost: number,
    userId: number,
    accessToken: string
) {
    console.log(`createSurvey called`);
    let dummySelectableOptions: SelectableOption[] = [];

    questions.forEach(q => {
        q.selectableOptions.forEach(so => {
            dummySelectableOptions.push(so);
        });
    });

    // const { userId, accessToken } = useCustomContext();

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

    return fetchData(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(snakeData),
    });
}

export const getSurveys = async (accessToken: string) => {
    const url = `${API_BASE_URL}/survey`;
    return fetchData<Survey[]>(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

import { Question } from "../interfaces/Question";
import { Section } from "../interfaces/Section";
import { SelectableOption } from "../interfaces/SelectableOption";
import { Survey } from "../interfaces/Survey";
import { logObject } from "../utils/Log";
import { printObject } from "../utils/printObject";
import { API_BASE_URL } from "./API";
import _ from "lodash";

function convertToSnakeCase(obj) {
    return _.mapKeys(obj, (value, key) => _.snakeCase(key));
}

export async function postWholeSurvey(
    survey: Survey,
    sections: Section[],
    questions: Question[],
    selectableOptions: SelectableOption[]
): Promise<ApiResponse> {
    // ) {
    console.log("hello!!");
    const url = `${API_BASE_URL}/survey/whole`;
    const data = { survey, sections, questions, selectableOptions };
    printObject(data, "before post whole survey");
    // const snakeData = _.mapKeys(data, (value, key) => _.snakeCase(key));
    const snakeData = {
        survey: convertToSnakeCase(survey),
        sections: sections.map(convertToSnakeCase),
        questions: questions.map(convertToSnakeCase),
        selectable_options: selectableOptions.map(convertToSnakeCase),
    };
    printObject(snakeData, "after post whole survey");
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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
        console.log(`posting whole survey error`);
        throw error;
    }
}

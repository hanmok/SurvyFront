import { Question } from "../../interfaces/Question";
import { Section } from "../../interfaces/Section";
import { SelectableOption } from "../../interfaces/SelectableOption";
import { Survey, SurveyBuilder } from "../../interfaces/Survey";
import { convertToSnakeCase } from "../../utils/SnakeToCamel";
import { API_BASE_URL } from "../API";
import BaseApi from "../BaseAPI";

export class SurveyService extends BaseApi {
    async getParticipatedSurveyIds(
        userId: number,
        accessToken: string
    ): Promise<ApiResponse<number[]>> {
        const url = `${API_BASE_URL}/participating/user/${userId}/participated-surveys`;
        return this.fetchData<number[]>(url, "GET", undefined, accessToken);
    }

    async fetchParticipatedSurveys(
        userId: number,
        accessToken: string
    ): Promise<ApiResponse<number[]>> {
        const url = `${API_BASE_URL}/user/${userId}/participated-surveys`;
        return this.fetchData<number[]>(url, "GET", undefined, accessToken);
    }
    // 'HCXQAOU'asd
    async getByCode(
        code: string,
        accessToken: string
    ): Promise<ApiResponse<Survey>> {
        let url = `${API_BASE_URL}/survey/bycode`;
        const queryParams = new URLSearchParams({ code });
        url = `${url}?${queryParams.toString()}`;
        return this.fetchData<Survey>(url, "GET", undefined, accessToken);
    }

    async getPostedSurveyIds(
        userId: number,
        accessToken: string
    ): Promise<ApiResponse<number[]>> {
        const url = `${API_BASE_URL}/posting/user/${userId}/posted-surveys`;
        return this.fetchData<number[]>(url, "GET", undefined, accessToken);
    }

    async postWholeSurvey(
        survey: Survey,
        sections: Section[],
        questions: Question[],
        selectableOptions: SelectableOption[],
        accessToken: string
    ): Promise<ApiResponse> {
        const url = `${API_BASE_URL}/survey/whole`;
        const data = { survey, sections, questions, selectableOptions };
        const body = {
            survey: convertToSnakeCase(survey),
            sections: sections.map(convertToSnakeCase),
            questions: questions.map(convertToSnakeCase),
            selectable_options: selectableOptions.map(convertToSnakeCase),
        };
        return this.fetchData(url, "POST", body, accessToken);
    }

    async getSurveys(accessToken: string) {
        const url = `${API_BASE_URL}/survey`;
        return this.fetchData<Survey[]>(url, "GET", undefined, accessToken);
    }

    async createSurvey(
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
        expectedTimeInSec: number,
        accessToken: string
    ) {
        console.log(`createSurvey called`);
        let dummySelectableOptions: SelectableOption[] = [];

        questions.forEach(q => {
            q.selectableOptions.forEach(so => {
                dummySelectableOptions.push(so);
            });
        });

        const numOfSections = sections.length;

        const survey = new SurveyBuilder(
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
            numOfSections,
            expectedTimeInSec
        ).build();

        return await this.postWholeSurvey(
            survey,
            sections,
            questions,
            dummySelectableOptions,
            accessToken
        );
    }
}

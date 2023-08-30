import { API_BASE_URL } from "./API";
import _ from "lodash";
export async function postAnswer(
    surveyId: number,
    questionId: number,
    selectableOptionId: number,
    userId: number
): Promise<ApiResponse> {
    const url = `${API_BASE_URL}/answer`;
    const data = { surveyId, userId, questionId, selectableOptionId };

    const snakeData = _.mapKeys(data, (value, key) => _.snakeCase(key));

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(snakeData),
        });

        if (!response.ok) {
            console.log("error!!");
            throw new Error("Network response was not ok");
        }

        const responseData: ApiResponse = await response.json();
        // console.log(`userResponse id: ${responseData.data}`);
        console.log(`status: ${responseData.statusCode}`);

        return responseData;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

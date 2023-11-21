import { logObject } from "../utils/Log";
import { API_BASE_URL } from "./API";
import { fetchData } from "./BaseAPI";

export async function patchParticipating(
    accessToken: string,
    userId: number,
    surveyId: number,
    isHonest: boolean
) {
    const url = `${API_BASE_URL}/participating/user/${userId}/survey/${surveyId}`;
    const body = { is_honest: isHonest };

    // logObject("calling patch api");

    return fetchData(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
    });
}

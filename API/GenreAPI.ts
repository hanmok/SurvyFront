import { logObject } from "../utils/Log";
import { API_BASE_URL } from "./API";
import { Genre } from "../interfaces/Genre";

export async function getAllGenres(): Promise<ApiResponse<[Genre]>> {
    const url = `${API_BASE_URL}/genre`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error(`get all genre error!!`);
            throw new Error("get all genre error!!");
        }

        const responseData: ApiResponse<[Genre]> = await response.json();

        logObject("genre response", responseData);
        return responseData;
    } catch (error) {
        console.error("error fetching all genres", error);
        throw error;
    }
}

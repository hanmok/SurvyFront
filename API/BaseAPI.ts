import { logObject } from "../utils/Log";

export interface ApiOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
}

export async function fetchData<T>(
    url: string,
    options: ApiOptions,
    message?: string
): Promise<T> {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        // return response.json().data;

        const apiResponse = await response.json();
        const result: T = apiResponse.data;
        logObject(`API ${message} Result:`, result);
        return result;
        // return apiResponse.data;
    } catch (error) {
        console.log(`${url} API call failed: ${error.message}`);
        throw error;
    }
}

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
        logObject(`api called, url:${url}, options`, options);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        // return response.json().data;
        // 아 그렇구나.. Data 만 쳐 뱉어대는구나..
        const apiResponse: ApiResponse<T> = await response.json();
        // const result: T = apiResponse.data;
        // logObject(`API ${message} Result`, result);
        logObject(`API ${message} Result`, apiResponse);

        const statusCode = apiResponse.statusCode;

        if (statusCode >= 200 && statusCode < 300) {
            return apiResponse.data;
        } else {
            throw new Error(apiResponse.message);
        }

        // if (apiResponse.statusCode )

        // return result;
        // return apiResponse.data;
        // return apiResponse;
    } catch (error) {
        console.log(`${url} API call failed: ${error.message}`);
        throw error;
    }
}

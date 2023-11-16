import { API_BASE_URL } from "./API";

export type UserResponse = ApiResponse<User>;

export async function login(
    username: string,
    password: string
): Promise<UserResponse> {
    const url = `${API_BASE_URL}/user/signin`;
    const data = { username, password };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const responseData: UserResponse = await response.json();
        console.log(`userResponse id: ${responseData.data.userId}`);

        return responseData;
    } catch (error) {
        console.error("login error", error);
        throw error;
    }
}

export async function autoSignin(refreshToken: string): Promise<UserResponse> {
    const url = `${API_BASE_URL}/user/auto-signin`;
    const data = { refreshToken };
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const responseData: UserResponse = await response.json();
        console.log(`userResponse from autoSignin: ${responseData}`);
        return responseData;
    } catch (error) {
        console.error("login error", error);
        throw error;
    }
}

export async function fetchParticipatedSurveys(
    userId: number
): Promise<number[]> {
    const url = `${API_BASE_URL}/user/${userId}/participated-surveys`;

    try {
        console.log(`calling api: ${url}`);
        const response = await fetch(url, {
            method: "GET",
            // headers: {
            //     "Content-Type": "application/json",
            // },
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        console.log(`response.json: ${response.json}`);
        const responseData: number[] = await response.json();
        console.log(`fetched surveyIds: ${responseData}`);

        return responseData;
    } catch (error) {
        console.error("fetch participated surveys", error);
        throw error;
    }
}

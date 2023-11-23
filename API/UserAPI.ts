import { API_BASE_URL } from "./API";
import { logObject } from "../utils/Log";
import { UserState } from "../interfaces/UserState";
import { UserDetail } from "../features/context/CustomContext";
import { fetchData } from "./BaseAPI";
import { UserGenre } from "../interfaces/UserGenre";
import { Genre } from "../interfaces/Genre";

export type UserResponse = ApiResponse<UserState>;

export async function getParticipatedSurveyIds(
    userId: number,
    accessToken: string
) {
    const url = `${API_BASE_URL}/participating/user/${userId}/participated-surveys`;
    const data = { userId };

    return fetchData<number[]>(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export async function getPostedSurveyIds(
    userId: number,
    accessToken: string
): Promise<number[]> {
    const url = `${API_BASE_URL}/posting/user/${userId}/posted-surveys`;
    return fetchData<number[]>(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export async function signin(
    username: string,
    password: string
): Promise<UserState> {
    const url = `${API_BASE_URL}/user/signin`;
    const data = { username, password };

    return fetchData<UserState>(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export async function signup(username: string, password: string) {
    const url = `${API_BASE_URL}/user/signup`;
    const data = { username, password };

    return fetchData(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export async function signOut(accessToken: string) {
    const url = `${API_BASE_URL}/user/signout`;
    return fetchData(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export async function autoSignin(refreshToken: string): Promise<UserState> {
    const url = `${API_BASE_URL}/user/auto-signin`;

    return fetchData<UserState>(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "refresh-token": refreshToken,
        },
    });
}

export async function getUserDetail(accessToken: string) {
    const url = `${API_BASE_URL}/user/details`;
    return fetchData<UserDetail>(
        url,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        },
        "userDetail"
    );
}

export async function getUserGenres(accessToken: string, userId: number) {
    const url = `${API_BASE_URL}/user-genre/user/${userId}`;
    return fetchData<Genre[]>(
        url,

        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        },
        "userGenre"
    );
}

export async function removeUser(userId: number, accessToken: string) {
    const url = `${API_BASE_URL}/user/${userId}`;

    return fetchData(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export async function fetchParticipatedSurveys(
    userId: number,
    accessToken: string
): Promise<number[]> {
    const url = `${API_BASE_URL}/user/${userId}/participated-surveys`;

    return fetchData<number[]>(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export async function updateUserGenres(
    userId: number,
    accessToken: string,
    genreIds: number[]
) {
    const url = `${API_BASE_URL}/user-genre/user/${userId}/genres`;

    // const data = { userId, genreIds };
    const snakeData = {
        user_id: userId,
        genre_ids: genreIds,
    };

    logObject("sending Data from updateUserGenres", snakeData);

    return fetchData(
        url,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(snakeData),
        },
        "updateUserGenres"
    );
}

export async function checkUsernameDuplicate(username: string) {
    let url = `${API_BASE_URL}/user/check-username`;

    const queryParams = new URLSearchParams({ username });
    url = `${url}?${queryParams.toString()}`;

    const checkUsernameResponse = fetchData(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    logObject("checkUsernameResponse", checkUsernameResponse);
    return checkUsernameResponse;
}

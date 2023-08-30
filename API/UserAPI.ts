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
        throw error;
    }
}

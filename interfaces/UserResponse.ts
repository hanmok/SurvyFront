// interface UserResponse {
// 	statusCode: number;
// 	message: string;
// 	data: User;
//     // userId: number;
//     // accessToken: string;
//     // refreshToken: string;
// }

/** userId, accessToken, refreshToken */
interface User {
    userId: number;
    accessToken: string;
    refreshToken: string;
}

/** statusCode, message, data */
interface ApiResponse<T = any> {
    statusCode: number;
    message: string;
    data?: T;
}

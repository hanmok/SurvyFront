interface ApiResponse<T = any> {
    statusCode: number;
    message: string;
    data?: T;
}

interface Genre {
    id: number;
    name: string;
}

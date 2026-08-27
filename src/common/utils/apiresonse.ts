import type { Response } from "express";

class ApiResponse {
    static ok<T>(res: Response, data:T, message: string = 'Success', statusCode: number = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }

    static created<T>(res: Response, data:T, message: string = 'Created', statusCode: number = 201) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }

    static accepted<T>(res: Response, data:T, message: string = 'Accepted', statusCode: number = 202) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }

    static noContent<T>(res: Response, data:T, message: string = 'No Content', statusCode: number = 204) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }
}

export default ApiResponse
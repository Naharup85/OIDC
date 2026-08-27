class ApiError extends Error {
    public statusCode: number;
    public isOperational: boolean;
    constructor(statusCode: number, message: string, isOperational: boolean = true, stack: string = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    static badRequest(message: string, stack: string = ''): ApiError {
        return new ApiError(400, message, true, stack);
    }

    static unauthorized(message: string, stack: string = ''): ApiError {
        return new ApiError(401, message, true, stack);
    }

    static forbidden(message: string, stack: string = ''): ApiError {
        return new ApiError(403, message, true, stack);
    }

    static notFound(message: string, stack: string = ''): ApiError {
        return new ApiError(404, message, true, stack);
    }

    static internal(message: string, stack: string = ''): ApiError {
        return new ApiError(500, message, true, stack);
    }

    static badGateway(message: string, stack: string = ''): ApiError {
        return new ApiError(502, message, true, stack);
    }

    static serviceUnavailable(message: string, stack: string = ''): ApiError {
        return new ApiError(503, message, true, stack);
    }

    static gatewayTimeout(message: string, stack: string = ''): ApiError {
        return new ApiError(504, message, true, stack);
    }
}

export default ApiError;
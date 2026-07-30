export const successResponse = (data, message = 'Success') => {
    return {
        success: true,
        message,
        data,
    };
};
export const errorResponse = (message = 'An error occurred', details = null) => {
    const response = {
        success: false,
        message,
    };
    if (details) {
        response.details = details;
    }
    return response;
};

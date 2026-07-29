export interface SuccessResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  details?: any;
}

export const successResponse = <T>(data: T, message: string = 'Success'): SuccessResponse<T> => {
  return {
    success: true,
    message,
    data,
  };
};

export const errorResponse = (message: string = 'An error occurred', details: any = null): ErrorResponse => {
  const response: ErrorResponse = {
    success: false,
    message,
  };

  if (details) {
    response.details = details;
  }

  return response;
};
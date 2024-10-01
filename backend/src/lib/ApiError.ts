class ApiError extends Error {
  statusCode: number;
  status: string;

  constructor(statusCode: number, message: string, status?: string) {
    super(message);

    this.statusCode = statusCode;
    this.status =
      status || `${statusCode}`.startsWith("4") ? "failure" : "error";

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;

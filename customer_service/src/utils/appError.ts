import { StatusCode } from "@/constants/app.constants";

export class AppError extends Error {
  name: string;
  statusCode: number;
  description: string;
  isOperational?: boolean;
  errorStack: any;
  loggingErrorResponse: any;

  constructor(
    name: string,
    statusCode: number,
    description: string,
    isOperational?: boolean,
    errorStack?: any,
    loggingErrorResponse?: any,
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.description = description;
    this.isOperational = isOperational;
    this.errorStack = errorStack;
    this.loggingErrorResponse = loggingErrorResponse;
    Error.captureStackTrace(this);
  }
}

export class ApiError extends AppError {
  constructor(
    name: string,
    statusCode: number = StatusCode.SERVER_ERROR,
    description: string = "internal server error",
    isOperational?: boolean,
  ) {
    super(name, statusCode, description, isOperational);
  }
}

export class BadRequestError extends AppError {
  constructor(description: string = "bad request", loggingErrorResponse: any) {
    super(
      "NOT FOUND",
      StatusCode.BAD_REQUEST,
      description,
      true,
      false,
      loggingErrorResponse,
    );
  }
}

export class ValidationError extends AppError {
  constructor(description: string = "validation error", errorStack: any) {
    super("bad request", StatusCode.BAD_REQUEST, description, true, errorStack);
  }
}

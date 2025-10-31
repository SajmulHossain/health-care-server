import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let error = err;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      message = "Duplicate key error";
      error = err.meta;
      statusCode = httpStatus.CONFLICT;
    }

    if (err.code === "P1000") {
      message = "Authentication failed against database server";
      error = err.meta;
      statusCode = httpStatus.BAD_GATEWAY;
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    message = "Validation Error";
    error = err.message;
    statusCode = httpStatus.BAD_REQUEST;
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    message = "Prisma unknown request error";
    error = err.message;
  }

  res.status(statusCode).json({
    success,
    message,
    error,
    stack: error.stack,
  });
};

export default globalErrorHandler;

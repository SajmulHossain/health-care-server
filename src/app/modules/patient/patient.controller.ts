import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PatientService } from "./patient.service";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await PatientService.getAllFromDB(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Patient retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientService.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Patient retrieval successfully",
    data: result,
  });
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientService.softDelete(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Patient soft deleted successfully",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await PatientService.updateIntoDB(user, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Patient updated successfully",
    data: result,
  });
});

export const PatientController = {
  getAllFromDB,
  getByIdFromDB,
  softDelete,
  updateIntoDB,
};

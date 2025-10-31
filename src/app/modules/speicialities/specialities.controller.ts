import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { SpecialitiesServices } from "./specialities.service";

const inserIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialitiesServices.inserIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Specialties created successfully!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialitiesServices.getAllFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Specialties data fetched successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SpecialitiesServices.deleteFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Specialty deleted successfully",
    data: result,
  });
});

export const SpecialitiesControllers = {
  inserIntoDB,
  getAllFromDB,
  deleteFromDB,
};

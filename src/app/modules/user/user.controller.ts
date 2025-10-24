import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { UserServices } from "./user.service";

const createPatient = catchAsync(async (req, res) => {
  const data = await UserServices.createPatient(req);


  sendResponse(res, {
    statusCode: 201,
    data,
    message: "Patient created successfully",
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const data = await UserServices.getAllUsers(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: 200,
    data,
    message: "Data retrived successfully",
  });
});

export const UserControllers = {
  createPatient,
  getAllUsers
};

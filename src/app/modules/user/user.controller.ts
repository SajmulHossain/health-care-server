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

const createAdmin = catchAsync(async (req, res) => {
  const result = await UserServices.createAdmin(req);
  sendResponse(res, {
    statusCode: 201,
    message: "Admin Created successfuly!",
    data: result,
  });
});

const createDoctor = catchAsync(async (req, res) => {
  const result = await UserServices.createDoctor(req);
  sendResponse(res, {
    statusCode: 201,
    message: "Doctor Created successfuly!",
    data: result,
  });
});


const getAllUsers = catchAsync(async (req, res) => {
  const {data, meta} = await UserServices.getAllUsers(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: 200,
    data,
    message: "Data retrived successfully",
    meta
  });
});

export const UserControllers = {
  createPatient,
  getAllUsers,
  createAdmin,
  createDoctor
};

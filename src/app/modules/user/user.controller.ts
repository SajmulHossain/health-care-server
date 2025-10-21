import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { UserServices } from "./user.service";

const createPatient = catchAsync(async (req, res) => {
  const data = await UserServices.createPatient(req);


  sendResponse(res, {
    statusCode: 201,
    data: "",
    message: "Patient created successfully",
  });
});

export const UserControllers = {
  createPatient,
};

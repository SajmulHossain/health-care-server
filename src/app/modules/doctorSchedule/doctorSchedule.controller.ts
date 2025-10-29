import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { DoctorScheduleServices } from "./doctorSchedule.service";

const createSchedule = catchAsync(
  async (req, res) => {
    const data = await DoctorScheduleServices.createSchedule(
      req.user,
      req.body
    );

    sendResponse(res, {
      data,
      message: "Schedule created successfully",
      statusCode: 201,
    });
  }
);

export const DoctorScheduleControllers = {
  createSchedule,
};

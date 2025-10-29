import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ScheduleServices } from "./schedule.service";

const createSchedule = catchAsync(async (req, res) => {
  const data = await ScheduleServices.createSchedule(req.body);

  sendResponse(res, {
    data,
    message: "Schedule Created",
    statusCode: 201,
  });
});

export const ScheduleControllers = {
  createSchedule,
};

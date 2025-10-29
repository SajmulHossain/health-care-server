import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ScheduleServices } from "./schedule.service";

const getScheduleForDoctors = catchAsync(async (req, res) => {
  const { result: data, meta } = await ScheduleServices.getScheduleForDoctors(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    data,
    message: "Data retrived Successfully",
    statusCode: 200,
    meta,
  });
});

const createSchedule = catchAsync(async (req, res) => {
  const data = await ScheduleServices.createSchedule(req.body);

  sendResponse(res, {
    data,
    message: "Schedule Created",
    statusCode: 201,
  });
});

const deleteSchedule = catchAsync(async (req, res) => {
  const data = await ScheduleServices.deleteSchedule(req.params.id);

  sendResponse(res, {
    data,
    message: "Schedule Deleted Successfully",
    statusCode: 201,
  });
});

export const ScheduleControllers = {
  createSchedule,
  getScheduleForDoctors,
  deleteSchedule,
};

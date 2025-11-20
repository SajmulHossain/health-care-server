import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AppointmentService } from "./appointment.service";

const getMyAppointment = catchAsync(async (req, res) => {
  const { email, role } = req.user;
  const { data, meta } = await AppointmentService.getMyAppointment(
    email as string,
    role as string,
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: 201,
    message: "Appointment Created Successfully",
    data,
    meta,
  });
});

const createAppointment = catchAsync(async (req, res) => {
  const { email } = req.user;
  const data = await AppointmentService.createAppointment(
    email as string,
    req.body
  );

  sendResponse(res, {
    statusCode: 201,
    message: "Appointment Created Successfully",
    data,
  });
});

export const AppointmentController = {
  createAppointment,
  getMyAppointment,
};

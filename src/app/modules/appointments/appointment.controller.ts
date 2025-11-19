import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AppointmentService } from "./appointment.service";

const createAppointment = catchAsync(async (req, res) => {
  const {email} = req.user;
  const data = await AppointmentService.createAppointment(email as string, req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Appointment Created Successfully",
    data,
  });
});

export const AppointmentController = {
  createAppointment,
};

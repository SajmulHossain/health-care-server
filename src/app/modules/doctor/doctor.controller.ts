import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { DoctorServices } from "./doctor.service";

const getAllDoctors = catchAsync(async (req, res) => {
  const { data, meta } = await DoctorServices.getAllDoctors(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    data,
    meta,
    message: "Data retrived successfully",
    statusCode: 200,
  });
});

const updateDoctor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await DoctorServices.updateDoctor(id, req.body);

  sendResponse(res, {
    data,
    message: "Data retrived successfully",
    statusCode: 200,
  });
});

export const DoctorControllers = {
  getAllDoctors,
  updateDoctor,
};
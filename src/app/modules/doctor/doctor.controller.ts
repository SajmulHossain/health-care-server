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

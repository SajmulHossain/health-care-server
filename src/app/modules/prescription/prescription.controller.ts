import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PrescriptionService } from "./prescription.service";

const createPrescription = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const data = await PrescriptionService.createPrescription();

  sendResponse(res, {
    statusCode: 201,
    message: "Prescription Created Successfully",
    data,
  });
});

export const PrescriptionController = {
    createPrescription
}
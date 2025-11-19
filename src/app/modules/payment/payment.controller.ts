import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PaymentService } from "./payment.service";

const createPayment = catchAsync(async (req, res) => {
  const data = await PaymentService.createPayment();

  sendResponse(res, {
    statusCode: 201,
    message: "Appointment Created Successfully",
    data,
  });
});


export const PaymentController = {
    createPayment
}
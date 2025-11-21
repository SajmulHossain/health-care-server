import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ReviewService } from "./review.service";

const createReview = catchAsync(async (req, res) => {
  const data = await ReviewService.createReview();

  sendResponse(res, {
    statusCode: 201,
    message: "Appointment Created Successfully",
    data,
  });
});

export const ReviewContoller = {
    createReview
}
import config from "../../config";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { stripe } from "../../utils/stripe";
import { PaymentService } from "./payment.service";

const handleStripeWebhookEvent = catchAsync(async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = config.web_hook_secret as string;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error("⚠️ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  const data = await PaymentService.handleStripeWebhookEvent(event);

  sendResponse(res, {
    statusCode: 201,
    message: "Appointment Created Successfully",
    data,
  });
});


export const PaymentController = {
  handleStripeWebhookEvent,
};
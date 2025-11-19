import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { stripe } from "../../utils/stripe";
import { PaymentService } from "./payment.service";

const handleStripeWebhookEvent = catchAsync(async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret =
    "whsec_7aa0e876564d7172ed1ebbda82f18cd6c740ac93ff44efecbf654c0d71bf3f1c";

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const data = await PaymentService.handleStripeWebhookEvent(event);

  sendResponse(res, {
    statusCode: 200,
    message: "Web Hook request sent successfully",
    data,
  });
});

export const PaymentController = {
  handleStripeWebhookEvent,
};

import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import config from "./app/config";
import { uptime } from "process";
import router from "./app/routes";
import cookieParser from 'cookie-parser';
import { PaymentController } from "./app/modules/payment/payment.controller";

const app: Application = express();

app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }), // important for signature verification
  PaymentController.handleStripeWebhookEvent
);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", router);

app.get("/", (_req: Request, res: Response) => {
  res.send({
    message: "Server is running..",
    environment: config.node_env,
    uptime: uptime().toLocaleString() + "seconds",
    timeStamps: new Date().toLocaleString(),
  });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;

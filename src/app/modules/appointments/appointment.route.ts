import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/my-appointments", checkAuth(UserRole.PATIENT, UserRole.DOCTOR), AppointmentController.getMyAppointment);

router.post("",checkAuth(UserRole.PATIENT), AppointmentController.createAppointment);

router.patch("/status/:id", checkAuth(UserRole.ADMIN, UserRole.DOCTOR), AppointmentController.updateAppointmentStatus)

export const AppointmentRoutes = router;
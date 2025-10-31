import { Router } from "express";
import { DoctorScheduleControllers } from "./doctorSchedule.controller";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../middlewares/validateRequest";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";

const router = Router()

router.post("/", checkAuth(UserRole.DOCTOR), validateRequest(DoctorScheduleValidation.createDoctorScheduleValidationSchema), DoctorScheduleControllers.createSchedule)

export const DoctorScheduleRoutes = router;
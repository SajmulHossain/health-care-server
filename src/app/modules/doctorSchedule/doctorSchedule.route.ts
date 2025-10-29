import { Router } from "express";
import { DoctorScheduleControllers } from "./doctorSchedule.controller";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";

const router = Router()

router.post("/", checkAuth(UserRole.DOCTOR), DoctorScheduleControllers.createSchedule)

export const DoctorScheduleRoutes = router;
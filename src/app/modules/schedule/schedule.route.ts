import { Router } from "express";
import { ScheduleControllers } from "./schedule.controller";
import { UserRole } from "@prisma/client";
import checkAuth from "../../middlewares/checkAuth";

const router = Router();

router.get(
  "",
  checkAuth(UserRole.ADMIN, UserRole.DOCTOR),
  ScheduleControllers.getScheduleForDoctors
);
router.post("", ScheduleControllers.createSchedule);
router.delete("/:id", ScheduleControllers.deleteSchedule);

export const ScheduleRoutes = router;

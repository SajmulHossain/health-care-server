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
router.post("", checkAuth(UserRole.ADMIN), ScheduleControllers.createSchedule);
router.delete("/:id", checkAuth(UserRole.ADMIN), ScheduleControllers.deleteSchedule);

export const ScheduleRoutes = router;

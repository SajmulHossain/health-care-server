import { Router } from "express";
import { ScheduleControllers } from "./schedule.controller";

const router = Router();

router.get("", ScheduleControllers.getScheduleForDoctors);
router.post("", ScheduleControllers.createSchedule);

export const ScheduleRoutes = router;
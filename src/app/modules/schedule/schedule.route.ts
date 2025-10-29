import { Router } from "express";
import { ScheduleControllers } from "./schedule.controller";

const router = Router();

router.get("", ScheduleControllers.getScheduleForDoctors);
router.post("", ScheduleControllers.createSchedule);
router.delete("/:id", ScheduleControllers.deleteSchedule);

export const ScheduleRoutes = router;
import { Router } from "express";
import { DoctorControllers } from "./doctor.controller";

const router = Router();

router.get("", DoctorControllers.getAllDoctors);
router.patch("/:id", DoctorControllers.updateDoctor);

export const DoctorRoutes = router;
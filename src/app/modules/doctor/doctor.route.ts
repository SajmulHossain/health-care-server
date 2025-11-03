import { Router } from "express";
import { DoctorControllers } from "./doctor.controller";

const router = Router();

router.get("", DoctorControllers.getAllDoctors);
router.post("/suggestion", DoctorControllers.getAISuggestions);
router.patch("/:id", DoctorControllers.updateDoctor);

export const DoctorRoutes = router;
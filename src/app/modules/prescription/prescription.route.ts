import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";
import { PrescriptionController } from "./prescription.controller";

const router = Router();

router.post("", checkAuth(UserRole.DOCTOR), PrescriptionController.createPrescription);

export const PrescriptionRoutes = router;
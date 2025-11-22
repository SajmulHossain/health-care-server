import express from "express";
import { PatientController } from "./patient.controller";
import { UserRole } from "@prisma/client";
import checkAuth from "../../middlewares/checkAuth";

const router = express.Router();

router.get("/", PatientController.getAllFromDB);

router.get("/:id", PatientController.getByIdFromDB);

router.patch("/", checkAuth(UserRole.PATIENT), PatientController.updateIntoDB);

router.delete("/soft/:id", PatientController.softDelete);

export const PatientRoutes = router;
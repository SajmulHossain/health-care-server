import { Router } from "express";
import { UserControllers } from "./user.controller";

const router = Router();

router.post("/create-patient", UserControllers.createPatient)

export const UserRoutes = router;
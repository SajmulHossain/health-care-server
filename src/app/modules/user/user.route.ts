import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { fileUploader } from "../../utils/fileUploader";
import { UserValidation } from "./user.validation";

const router = Router();

router.post("/create-patient", fileUploader.upload.single("file"), (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createPatientValidationZodSchema.parse(JSON.parse(req.body.data))
    return UserControllers.createPatient(req, res, next);
})

export const UserRoutes = router;
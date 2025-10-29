import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { fileUploader } from "../../utils/fileUploader";
import { UserValidation } from "./user.validation";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/", checkAuth(UserRole.ADMIN), UserControllers.getAllUsers);
router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createPatientValidationZodSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserControllers.createPatient(req, res, next);
  }
);

router.post(
  "/create-admin",
  checkAuth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createAdminValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserControllers.createAdmin(req, res, next);
  }
);

router.post(
  "/create-doctor",
  checkAuth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    console.log(JSON.parse(req.body.data));
    req.body = UserValidation.createDoctorValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserControllers.createDoctor(req, res, next);
  }
);

export const UserRoutes = router;
import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/me", checkAuth(...Object.values(UserRole)), AuthControllers.getMe);
router.post("/login", AuthControllers.login);
router.post("/refresh-token", AuthControllers.refreshToken);
router.patch(
  "/change-password",
  checkAuth(...Object.values(UserRole)),
  AuthControllers.changePassword
);

export const AuthRoutes = router;

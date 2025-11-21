import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";
import { ReviewContoller } from "./review.controller";

const router = Router();

router.post("/", checkAuth(UserRole.PATIENT), ReviewContoller.createReview);

export const ReviewRoutes = router;
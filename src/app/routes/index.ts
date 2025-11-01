import express, { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { DoctorScheduleRoutes } from "../modules/doctorSchedule/doctorSchedule.route";
import { ScheduleRoutes } from "../modules/schedule/schedule.route";
import { SpecialitiesRoutes } from "../modules/speicialities/specialities.route";
import { UserRoutes } from "../modules/user/user.route";
import { DoctorRoutes } from "../modules/doctor/doctor.route";

const router = express.Router();

const moduleRoutes: {
  path: string;
  route: Router;
}[] = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/schedule",
    route: ScheduleRoutes
  },
  {
    path: "/doctorSchedule",
    route: DoctorScheduleRoutes
  },
  {
    path: "/specialities",
    route: SpecialitiesRoutes
  },
  {
    path: "/doctor",
    route: DoctorRoutes
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
import express, { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';


const router = express.Router();

const moduleRoutes: {
    path: string,
    route: Router
}[] = [
    {
        path: '/',
        route: UserRoutes
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;
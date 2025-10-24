import catchAsync from "../../shared/catchAsync";
import { AuthServices } from "./auth.service";

const login = catchAsync(async(req, res) => {
    const data = await AuthServices.login(req.body);
})

export const AuthControllers = {
    login
}
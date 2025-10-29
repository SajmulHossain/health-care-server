import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthServices } from "./auth.service";

const login = catchAsync(async (req, res) => {
  const { accessToken, refreshToken, needPasswordChange } =
    await AuthServices.login(req.body);

  res.cookie("accessToken", accessToken, {
    maxAge: 1000 * 60 * 60,
    secure: false,
    sameSite: "none",
    httpOnly: true,
  });
  res.cookie("refreshToken", refreshToken, {
    maxAge: 1000 * 60 * 60 * 24 * 2,
    secure: false,
    sameSite: "none",
    httpOnly: true,
  });

  sendResponse(res, {
    data: { needPasswordChange },
    message: "Login successfull",
    statusCode: 200,
  });
});

export const AuthControllers = {
  login,
};

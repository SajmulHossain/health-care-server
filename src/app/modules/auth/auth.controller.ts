import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthServices } from "./auth.service";

const login = catchAsync(async (req, res) => {
  const { accessToken, refreshToken, needPasswordChange } =
    await AuthServices.login(req.body);

  res.cookie("accessToken", accessToken, {
    maxAge: 1000 * 60 * 60,
    secure: true,
    sameSite: "none",
    httpOnly: true,
  });
  res.cookie("refreshToken", refreshToken, {
    maxAge: 1000 * 60 * 60 * 24 * 2,
    secure: true,
    sameSite: "none",
    httpOnly: true,
  });

  sendResponse(res, {
    data: { needPasswordChange },
    message: "Login successfull",
    statusCode: 200,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { accessToken, needPasswordChange } = await AuthServices.refreshToken(
    req.cookies.refreshToken
  );

  res.cookie("accessToken", accessToken, {
    maxAge: 1000 * 60 * 60,
    secure: true,
    sameSite: "none",
    httpOnly: true,
  });

  sendResponse(res, {
    data: { needPasswordChange },
    statusCode: 200,
    message: "Access Token Created Successfully",
  });
});

const getMe = catchAsync(async (req, res) => {
  const data = await AuthServices.getMe(req.user);

  sendResponse(res, {
    statusCode: 200,
    message: "User retrived successfully",
    data,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const data = await AuthServices.changePassword(req.user.email, req.body);

  sendResponse(res, {
    statusCode: 200,
    message: "Password changed successfully",
    data,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const data = await AuthServices.forgotPassword(req.body.email);

  sendResponse(res, {
    statusCode: 200,
    message: "Password changed successfully",
    data,
  });
});

export const AuthControllers = {
  login,
  refreshToken,
  getMe,
  changePassword,
  forgotPassword
};

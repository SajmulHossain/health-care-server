import { UserRole, UserStatus } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import ApiError from "../../shared/ApiError";
import { prisma } from "../../shared/prisma";
import { token } from "../../utils/jwt";
import { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../config";
import { getForgotPasswordHtml } from "./auth.constant";
import { sendEmail } from "../../utils/sendEmail";

const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isPasswordMatched = await compare(payload.password, user.password);

  if (!isPasswordMatched) {
    throw new ApiError(400, "Password Didn't matched");
  }

  const accessToken = token.createToken(
    { email: user.email, role: user.role },
    config.token.access_token_secret as Secret,
    config.token.access_token_expire as string
  );
  const refreshToken = token.createToken(
    { email: user.email, role: user.role },
    config.token.refresh_token_secret as Secret,
    config.token.refresh_token_expire as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

const refreshToken = async (payload: string) => {
  const decodedData = token.verifyToken(payload);

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = token.createToken(
    {
      email: user.email,
      role: user.role,
    },
    config.token.access_token_secret as Secret,
    config.token.access_token_expire as string
  );

  return {
    accessToken,
    needPasswordChange: user.needPasswordChange,
  };
};

const getMe = async (user: JwtPayload) => {
  const data = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
    include:
      user.role === UserRole.PATIENT
        ? { patient: true }
        : user.role === UserRole.DOCTOR
        ? { doctor: true }
        : user.role === UserRole.ADMIN
        ? { admin: true }
        : {},
  });

  return data;
};

const changePassword = async (
  email: string,
  payload: { oldPassword: string; newPassword: string }
) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await compare(payload.oldPassword, user.password);

  if (!isCorrectPassword) {
    throw new ApiError(400, "Wrong Password");
  }

  const hashedPassword = await hash(payload.newPassword, 10);

  await prisma.user.update({
    where: {
      email,
      status: UserStatus.ACTIVE,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return;
};

const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
      status: UserStatus.ACTIVE,
    },
  });

  const forgetToken = token.createToken({
    email: user.email,
    role: user.role,
  }, config.token.forgot_password_secret as Secret, "5m");

  const html = getForgotPasswordHtml(forgetToken);
  
  sendEmail({to: user.email, html, subject: "Forgot Password"});
  return;
};

export const AuthServices = {
  login,
  refreshToken,
  getMe,
  changePassword,
  forgotPassword
};

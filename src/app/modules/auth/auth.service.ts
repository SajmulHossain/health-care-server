import { UserRole, UserStatus } from "@prisma/client";
import { compare } from "bcryptjs";
import ApiError from "../../shared/ApiError";
import { prisma } from "../../shared/prisma";
import { token } from "../../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

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
    "abcd",
    "1h"
  );
  const refreshToken = token.createToken(
    { email: user.email, role: user.role },
    "abcd",
    "2d"
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
    "abcd",
    "1h"
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

export const AuthServices = {
  login,
  refreshToken,
  getMe
};

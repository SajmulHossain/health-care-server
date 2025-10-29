import { NextFunction, Request, Response } from "express";
import { token } from "../utils/jwt";

const checkAuth =
  (...roles: string[]) =>
  async (req: Request & { user: any }, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.get("accessToken");

      if (!token) {
        throw new Error("You are not authorized");
      }

      const verifiedUser = token.verifyToken(token);

      req.user = verifiedUser;

      if (roles.length && roles.includes(verifiedUser.role)) {
        throw new Error("Your are not permitted");
      }

      next();
    } catch (error) {
      next(error);
    }
  };

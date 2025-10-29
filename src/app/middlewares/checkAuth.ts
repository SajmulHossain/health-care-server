import { NextFunction, Request, Response } from "express";
import { token } from "../utils/jwt";

const checkAuth = (...roles: string[]) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      const accessToken = req.cookies?.accessToken;

      if (!accessToken) {
        throw new Error("You are not authorized");
      }

      const verifiedUser = token.verifyToken(accessToken);

      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new Error("Your are not permitted");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default checkAuth;

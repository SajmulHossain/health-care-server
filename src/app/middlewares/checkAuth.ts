import { NextFunction, Request, Response } from "express";
import { token } from "../utils/jwt";
import ApiError from "../shared/ApiError";

const checkAuth = (...roles: string[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies?.accessToken;

      if (!accessToken) {
        throw new ApiError(401, "You are not authorized");
      }

      const verifiedUser = token.verifyToken(accessToken);

      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(401, "Your are not permitted");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default checkAuth;

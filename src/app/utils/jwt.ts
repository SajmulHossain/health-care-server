import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const createToken = (payload: JwtPayload, key: Secret, expiresIn: string) => {
  const token = jwt.sign(payload, key, {
    expiresIn,
  } as SignOptions);

  return token;
};

const verifyToken = (token: string) => {
 return jwt.verify(token, "abcd") as JwtPayload;
};

export const token = {
  createToken,
  verifyToken,
};

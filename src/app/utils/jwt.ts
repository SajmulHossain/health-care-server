import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const createToken = (payload: JwtPayload, key: Secret, expiresIn: string) => {
  const token = jwt.sign(payload, key, {
    expiresIn,
  } as SignOptions);

  return token;
};

export const token = {
  createToken,
};

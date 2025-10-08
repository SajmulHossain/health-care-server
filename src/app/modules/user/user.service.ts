import { hash } from "bcryptjs";
import { CreateUserInput } from "./user.interface";
import { prisma } from "../../shared/prisma";

const createPatient = async (payload: CreateUserInput) => {
  payload.password = await hash(payload.password, 10);

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: payload.email,
        password: payload.password,
      },
    });

    return await tnx.patient.create({
      data: {
        name: payload.name,
        email: payload.email,
      },
    });
  });

  return result;
};

export const UserServices = {
  createPatient,
};

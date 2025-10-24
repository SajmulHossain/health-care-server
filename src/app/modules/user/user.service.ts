import { hash } from "bcryptjs";
import { Request } from "express";
import { prisma } from "../../shared/prisma";
import { fileUploader } from "../../utils/fileUploader";

const createPatient = async (req: Request) => {
  if(req.file) {
    const uploadedData = await fileUploader.uploadToCloudinary(req.file);
    req.body.patient.profilePhoto = uploadedData?.secure_url;
  }

  req.body.password = await hash(req.body.password, 10);

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.patient.email,
        password: req.body.password,
      },
    });

    return await tnx.patient.create({
      data: req.body.patient
    });
  });

  return result;
};

const getAllUsers = async(query: Record<string, string>) => {
  const page = Number(query.page || 1)
  const limit = Number(query.limit || 10)

  return await prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit
  });
}

export const UserServices = {
  createPatient,
  getAllUsers
};

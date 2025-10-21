import { hash } from "bcryptjs";
import { Request } from "express";
import { prisma } from "../../shared/prisma";
import { fileUploader } from "../../utils/fileUploader";

const createPatient = async (req: Request) => {
  if(req.file) {
    const uploadedData = await fileUploader.uploadToCloudinary(req.file);
    console.log(uploadedData);
  }
  
  // req.body.password = await hash(req.body.password, 10);

  // const result = await prisma.$transaction(async (tnx) => {
  //   await tnx.user.create({
  //     data: {
  //       email: req.body.email,
  //       password: req.body.password,
  //     },
  //   });

  //   return await tnx.patient.create({
  //     data: {
  //       name: req.body.name,
  //       email: req.body.email,
  //     },
  //   });
  // });

  // return result;
};

export const UserServices = {
  createPatient,
};

import { hash } from "bcryptjs";
import { Request } from "express";
import { prisma } from "../../shared/prisma";
import { fileUploader } from "../../utils/fileUploader";
import pick from "../../utils/pick";
import getPaginationInfo from "../../utils/pagination&sorting";
import { Admin, Doctor, Prisma, UserRole } from "@prisma/client";
import { userFilterableFields, userSearchableField } from "./user.constant";

const createPatient = async (req: Request) => {
  if (req.file) {
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
      data: req.body.patient,
    });
  });

  return result;
};

const createAdmin = async (req: Request): Promise<Admin> => {
  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword: string = await hash(req.body.password, 10);

  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdAdminData = await transactionClient.admin.create({
      data: req.body.admin,
    });

    return createdAdminData;
  });

  return result;
};

const createDoctor = async (req: Request): Promise<Doctor> => {
  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
  }
  const hashedPassword: string = await hash(req.body.password, 10);

  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdDoctorData = await transactionClient.doctor.create({
      data: req.body.doctor,
    });

    return createdDoctorData;
  });

  return result;
};


const getAllUsers = async (query: Record<string, string>) => {
  const options = pick(query, ["page", "limit", "sortBy", "sortOrder"]);
  const { limit, page, sortBy, sortOrder } = getPaginationInfo(options);

  const { search, ...filterData } = pick(query, userFilterableFields);

  const andConditions: Prisma.UserWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: userSearchableField.map((field) => ({
        [field]: { contains: search, mode: "insensitive" },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  const whereCondition = andConditions.length ? {
    AND: andConditions
  } : {}

  const result = await prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition
  });

  const total = await prisma.user.count({
    where: whereCondition
  });

  return {
    data: result,
    meta: {
      page,
      limit,
      total,
    },
  };
};

export const UserServices = {
  createPatient,
  getAllUsers,
  createAdmin,
  createDoctor
};

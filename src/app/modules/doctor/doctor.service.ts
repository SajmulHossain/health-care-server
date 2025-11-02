import { userFilterableFields } from "./../user/user.constant";
import { Doctor, Prisma } from "@prisma/client";
import getPaginationInfo from "../../utils/pagination&sorting";
import pick from "../../utils/pick";
import { DoctorConstants } from "./doctor.constant";
import { prisma } from "../../shared/prisma";

const getAllDoctors = async (query: Record<string, string>) => {
  const options = pick(query, DoctorConstants.options);
  const { limit, page, sortBy, sortOrder } = getPaginationInfo(options);

  const { search, ...filters } = pick(query, DoctorConstants.filters);

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: DoctorConstants.search.map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filters).length) {
    const filterConditions = Object.keys(filters).map((key) => ({
      [key]: {
        equals: filters[key],
      },
    }));

    andConditions.push(...filterConditions);
  }

  const whereConditions: Prisma.DoctorWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const data = await prisma.doctor.findMany({
    where: whereConditions,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.doctor.count({
    where: whereConditions,
  });

  return {
    data,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const updateDoctor = async (id: string, payload: Partial<Doctor>) => {
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const data = await prisma.doctor.update({
    where: {
      id,
    },
    data: payload,
  });

  return data;
};

export const DoctorServices = {
  getAllDoctors,
  updateDoctor,
};

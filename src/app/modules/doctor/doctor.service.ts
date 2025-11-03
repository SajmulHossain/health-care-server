import { Doctor, Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import getPaginationInfo from "../../utils/pagination&sorting";
import pick from "../../utils/pick";
import { DoctorConstants } from "./doctor.constant";
import ApiError from "../../shared/ApiError";
import { openai } from "../../config/open-router";

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
  await prisma.doctor.findUniqueOrThrow({
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

const getAISuggestions = async ({ symptoms }: { symptoms: string[] }) => {
  if (!(symptoms && symptoms.length)) {
    throw new ApiError(400, "No symptoms found");
  }

  const doctors = await prisma.doctor.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });

  const prompt = `You are a medical assistant AI. Based on the patient's symtomps, suggest the top 3 most successfull doctor. Each doctor  has specialities and years of experience.
  Only suggest doctors who are relavant to given symptoms

  Symptoms: ${symptoms.join(", ")}

  Here the doctor list in JSON format: ${JSON.stringify(doctors, null, 2)}
  
  Return your response in JSON format with full indivisual doctor data
  
  `;

  const completion = await openai.chat.completions.create({
    model: "z-ai/glm-4.5-air:free`",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful AI medical assistant that provides doctor suggesstion",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return doctors;
};

export const DoctorServices = {
  getAllDoctors,
  updateDoctor,
  getAISuggestions,
};

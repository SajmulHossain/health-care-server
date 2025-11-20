import { prisma } from "../../shared/prisma";
import { v4 as uuidv4 } from "uuid";
import { stripe } from "../../utils/stripe";
import ApiError from "../../shared/ApiError";
import pick from "../../utils/pick";
import getPaginationInfo from "../../utils/pagination&sorting";
import { Prisma, UserRole } from "@prisma/client";

const createAppointment = async (
  email: string,
  paylaod: {
    doctorId: string;
    scheduleId: string;
  }
) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email,
    },
  });

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: paylaod.doctorId,
      isDeleted: false,
    },
  });

  const isBooked = await prisma.doctorSchedule.findFirstOrThrow({
    where: {
      doctorId: paylaod.doctorId,
      scheduleId: paylaod.scheduleId,
      isBooked: false,
    },
  });

  if (!isBooked) {
    throw new ApiError(400, "The slot already booked");
  }

  const videoCallingId = uuidv4();

  const result = await prisma.$transaction(async (tnx) => {
    const appointmentData = await tnx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: paylaod.scheduleId,
        videoCallingId,
      },
    });

    await tnx.doctorSchedule.update({
      where: {
        //   doctorId: doctorData.id,
        //   scheduleId: paylaod.scheduleId,
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: paylaod.scheduleId,
        },
      },
      data: {
        isBooked: true,
      },
    });

    const transactionId = uuidv4();

    const paymentData = await tnx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId,
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Appointment with ${doctorData.name}`,
            },
            unit_amount: doctorData.appointmentFee * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        appointmentId: appointmentData.id,
        paymentId: paymentData.id,
      },
      success_url: `${"https://sajmul-portfolio.vercel.app"}/dashboard`,
      cancel_url: "https://sajmul.com",
    });

    return { paymentUrl: session.url };
  });

  return result;
};

const getMyAppointment = async (
  email: string,
  role: string,
  query: Record<string, string>
) => {
  const options = pick(query, ["page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(query, ["status", "paymentStatus"]);
  console.log(filters);

  const { limit: take, page, sortBy, sortOrder } = getPaginationInfo(options);

  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (role === UserRole.PATIENT) {
    andConditions.push({
      patient: {
        email,
      },
    });
  } else if (role === UserRole.DOCTOR) {
    andConditions.push({
      doctor: {
        email,
      },
    });
  }

  if (Object.keys(filters).length > 0) {
    const filterConditions = Object.keys(filters).map((key) => ({
      [key]: {
        equals: filters[key],
      },
    }));

    andConditions.push(...filterConditions);
  }

  const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const data = await prisma.appointment.findMany({
    where: whereConditions,
    skip: take * (page - 1),
    take,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include:
      role === UserRole.PATIENT
        ? {
            doctor: true,
          }
        : {
            patient: true,
          },
  });

  const total = await prisma.appointment.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit: take,
    },
    data,
  };
};

export const AppointmentService = {
  createAppointment,
  getMyAppointment,
};

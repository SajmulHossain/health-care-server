import { prisma } from "../../shared/prisma";
import { v4 as uuidv4 } from "uuid";

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

    await tnx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId,
      },
    });

    return appointmentData;
  });

  return result;
};

export const AppointmentService = {
  createAppointment,
};

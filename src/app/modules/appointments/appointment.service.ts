import { prisma } from "../../shared/prisma";
import { v4 as uuidv4 } from "uuid";
import { stripe } from "../../utils/stripe";

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
          quantity: 1
        },
      ],
      success_url: `${"https://sajmul-portfolio.vercel.app"}/dashboard`,
      cancel_url: "https://sajmul.com"
    });

    console.log(session);

    return appointmentData;
  });

  return result;
};

export const AppointmentService = {
  createAppointment,
};

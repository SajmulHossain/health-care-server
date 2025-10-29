import { prisma } from "../../shared/prisma";

const createSchedule = async (
  user: Express.Request["user"],
  payload: {
    scheduleIds: string[];
  }
) => {
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const data = payload.scheduleIds.map((id) => ({
    doctorId: doctor.id,
    scheduleId: id,
  }));

  return await prisma.doctorSchedule.createManyAndReturn({
    data,
  });
};

export const DoctorScheduleServices = {
  createSchedule,
};

import { addMinutes, addHours, format } from "date-fns";
import { prisma } from "../../shared/prisma";
import pick from "../../utils/pick";
import getPaginationInfo from "../../utils/pagination&sorting";
import { Prisma } from "@prisma/client";
import { Request } from "express";

const getScheduleForDoctors = async (
  query: Record<string, string>,
  user: Request["user"]
) => {
  const options = pick(query, ["page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(query, ["startDateTime", "endDateTime"]);

  const { limit, page, sortBy, sortOrder } = getPaginationInfo(options);

  const andConditions: Prisma.ScheduleWhereInput[] = [];

  if (filters.startDateTime && filters.endDateTime) {
    andConditions.push({
      AND: [
        {
          startDateTime: {
            gte: filters.startDateTime,
          },

          endDateTime: {
            lte: filters.endDateTime,
          },
        },
      ],
    });
  }

  const whereConditions: Prisma.ScheduleWhereInput = andConditions.length
    ? {
        AND: andConditions,
      }
    : {};

  const doctorSchedules = await prisma.doctorSchedule.findMany({
    where: {
      doctor: {
        email: user.email,
      },
    },
    select: {
      scheduleId: true,
    },
  });

  const doctorScheduleIds = doctorSchedules.map(
    (schedules) => schedules.scheduleId
  );

  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorScheduleIds,
      },
    },
    skip: (page - 1) * limit,
    take: limit,

    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorScheduleIds,
      },
    },
  });

  return {
    result,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const createSchedule = async (payload: any) => {
  const { startDate, endDate, startTime, endTime } = payload;

  const intervalTime = 30;
  const schedules = [];

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      const slotStartDateTime = startDateTime;
      const slotEndDateTime = addMinutes(startDateTime, intervalTime);

      const scheduleData = {
        startDateTime: slotStartDateTime,
        endDateTime: slotEndDateTime,
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });

        schedules.push(result);
      }

      slotStartDateTime.setMinutes(
        slotStartDateTime.getMinutes() + intervalTime
      );
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

const deleteSchedule = async (id: string) => {
  return prisma.schedule.delete({
    where: {
      id,
    },
  });
};

export const ScheduleServices = {
  createSchedule,
  getScheduleForDoctors,
  deleteSchedule,
};

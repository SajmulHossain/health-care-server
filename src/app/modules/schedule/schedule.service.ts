import { addMinutes, addHours, format } from "date-fns";
import { prisma } from "../../shared/prisma";
import pick from "../../utils/pick";
import getPaginationInfo from "../../utils/pagination&sorting";
import { Prisma } from "@prisma/client";

const getScheduleForDoctors = async (query: Record<string, string>) => {
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

  const result = await prisma.schedule.findMany({
    where: whereConditions,
    skip: (page - 1) * limit,
    take: limit,

    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.schedule.count({
    where: whereConditions
  })

  return {
    result,
    meta: {
      page, limit, total
    }
  }
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

export const ScheduleServices = {
  createSchedule,
  getScheduleForDoctors,
};

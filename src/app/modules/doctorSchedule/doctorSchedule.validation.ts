import { array, object, string } from "zod";

const createDoctorScheduleValidationSchema = object({
  scheduleIds: array(string()),
});

export const DoctorScheduleValidation = {
    createDoctorScheduleValidationSchema
}
import prisma from "@/prisma/client";

interface Schedules {
  [key: string]: {
    day: string | undefined;
    times: {
      [key: string]: {
        field_id: number;
        booking_date: Date;
        start_time: Date;
        end_time: Date;
        is_booked: boolean;
      };
    };
  };
}

export const getSchedules = async (field_id: number) => {
  const getDate = (date: Date): string => {
    const now = new Date(date);

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getTime = (date: Date): string | undefined =>
    parseInt(
      date.toISOString().split("T")[1]?.split(":")[0] || "00"
    ).toString();

  const getDay = (date: Date): string | undefined => {
    const day = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];

    const index_day = date.getDay();

    return day[index_day];
  };

  const schedules: Schedules = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const next_week = new Date(today);
  next_week.setDate(today.getDate() + 7);

  const bookings = await prisma.booking.groupBy({
    by: ["start_time", "booking_date", "end_time"],
    where: {
      field_id,
      booking_date: {
        gte: today,
        lte: next_week,
      },
    },
    _count: { id: true },
  });

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const day = getDay(date);
    const times: any = {};

    for (let time = 8; time < 23; time++) {
      times[time.toString()] = {
        field_id,
        booking_date: date,
        start_time: new Date(date.setHours(time, 0, 0, 0)),
        end_time: new Date(date.setHours(time + 1, 0, 0, 0)),
        is_booked: false,
      };
    }

    schedules[getDate(date)] = {
      day,
      times,
    };
  }

  for (const booking of bookings) {
    const date = getDate(booking.booking_date);
    const time = getTime(booking.start_time) || "";

    if (schedules[date] && schedules[date].times[time]) {
      const timeValue = schedules[date].times[time];

      schedules[date].times[time] = {
        ...timeValue,
        is_booked: booking._count.id >= 1 ? true : false,
      };
    }
  }

  return schedules;
};

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
    const iso = date.toISOString();
    return iso.split("T")[0] || '';
  };

  const getTime = (date: Date): string => {
    const iso = date.toISOString();
    const timePart = iso.split("T")[1];
    if (!timePart) return '';
    return timePart.split(":")[0] || '';
  };


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
  today.setUTCHours(0, 0, 0, 0);
  const next_week = new Date(today);
  next_week.setUTCDate(today.getUTCDate() + 7);

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
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(today.getUTCDate() + i);
    const dateStr = date.toISOString();
    const day = getDay(date);
    const times: any = {};

    for (let time = 8; time < 23; time++) {
      times[time.toString()] = {
        field_id,
        booking_date: dateStr,
        start_time: new Date(date.setUTCHours(time, 0, 0, 0)),
        end_time: new Date(date.setUTCHours(time + 1, 0, 0, 0)),
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

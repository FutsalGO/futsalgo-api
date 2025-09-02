import prisma from "@/prisma/client";

// Service untuk ambil semua fields
export async function getAllFieldsService() {
  const fields = await prisma.field.findMany({
    orderBy: {
      created_at: "desc",
    },
  });

  // Normalisasi Decimal ke number
  return fields.map((f) => ({
    ...f,
    weekday_price:
      typeof (f as any).weekday_price === "object"
        ? Number((f as any).weekday_price)
        : (f as any).weekday_price,
    weekend_price:
      typeof (f as any).weekend_price === "object"
        ? Number((f as any).weekend_price)
        : (f as any).weekend_price,
  }));
}

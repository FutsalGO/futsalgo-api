import prisma from "@/prisma/client";
export const createField = async (data: {
  name: string;
  description?: string | null;
  weekday_price: number;
  weekend_price?: number | null; // ⬅️ perbaiki ini
  imageUrl?: string | null;
}) => {
  return await prisma.field.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      weekday_price: data.weekday_price,
      weekend_price: data.weekend_price ?? null,
      imageUrl: data.imageUrl ?? null,
    },
  });
};

export const updateField = async (
  id: number,
  data: {
    name?: string;
    description?: string | null;
    weekday_price?: number;
    weekend_price?: number | null;
    imageUrl?: string | null;
  }
) => {
  return await prisma.field.update({
    where: { id },
    data,
  });
};

export const deleteField = async (id: number) => {
  return await prisma.field.delete({
    where: { id },
  });
};

export const createField = async (data: {
  name: string;
  description?: string | null;
  weekday_price: number;
  weekend_price: number; // ⬅️ perbaiki ini
  imageUrl?: string | null;
}) => {
  return await prisma.field.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      weekday_price: data.weekday_price,
      weekend_price: data.weekend_price,
      imageUrl: data.imageUrl ?? null,
    },
  });
};

export const updateField = async (
  id: number,
  data: {
    name?: string;
    description?: string | null;
    weekday_price?: number;
    weekend_price?: number;
    imageUrl?: string | null;
  }
) => {
  return await prisma.field.update({
    where: { id },
    data,
  });
};

export const deleteField = async (id: number) => {
  return await prisma.field.delete({
    where: { id },
  });
};

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

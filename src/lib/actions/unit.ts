"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getUnits() {
    try {
        const units = await prisma.unit.findMany({
            orderBy: { name: "asc" },
        });
        return { success: true, data: units };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function createUnit(data: { name: string; type: "RELIGION" | "GENERAL" }) {
    try {
        const unit = await prisma.unit.create({
            data: {
                name: data.name,
                type: data.type,
            },
        });
        revalidatePath("/dashboard/units");
        revalidatePath("/dashboard/students/new");
        revalidatePath("/dashboard/students");
        return { success: true, data: unit };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateUnit(id: string, data: { name: string; type: "RELIGION" | "GENERAL" }) {
    try {
        const unit = await prisma.unit.update({
            where: { id },
            data: {
                name: data.name,
                type: data.type,
            },
        });
        revalidatePath("/dashboard/units");
        revalidatePath("/dashboard/students");
        return { success: true, data: unit };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteUnit(id: string) {
    try {
        await prisma.unit.delete({ where: { id } });
        revalidatePath("/dashboard/units");
        revalidatePath("/dashboard/students");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getUnitById(id: string) {
    try {
        const unit = await prisma.unit.findUnique({
            where: { id },
        });
        if (!unit) return { success: false, error: "Unit not found" };
        return { success: true, data: unit };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

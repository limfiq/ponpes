"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getStudents(unitId?: string) {
    try {
        const students = await prisma.student.findMany({
            where: unitId ? { unitId } : {},
            include: {
                unit: true,
                parent: true,
            },
            orderBy: { name: "asc" },
        });
        return { success: true, data: students };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function createStudent(data: {
    nisn: string;
    name: string;
    unitId: string;
    parentId?: string;
    status: string;
}) {
    try {
        const student = await prisma.student.create({
            data: {
                nisn: data.nisn,
                name: data.name,
                unitId: data.unitId,
                parentId: data.parentId || null,
                status: data.status,
            },
        });
        revalidatePath("/dashboard/students");
        return { success: true, data: student };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteStudent(id: string) {
    try {
        await prisma.student.delete({ where: { id } });
        revalidatePath("/dashboard/students");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateStudent(id: string, data: {
    nisn: string;
    name: string;
    unitId: string;
    parentId?: string;
    status: string;
}) {
    try {
        const student = await prisma.student.update({
            where: { id },
            data: {
                nisn: data.nisn,
                name: data.name,
                unitId: data.unitId,
                parentId: data.parentId || null,
                status: data.status,
            },
        });
        revalidatePath("/dashboard/students");
        return { success: true, data: student };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getStudentById(id: string) {
    try {
        const student = await prisma.student.findUnique({
            where: { id },
            include: { unit: true },
        });
        if (!student) return { success: false, error: "Student not found" };
        return { success: true, data: student };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

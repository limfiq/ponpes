"use server";
import { PrismaClient, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function getParents() {
    try {
        const parents = await prisma.user.findMany({
            where: { role: "PARENT" },
            orderBy: { name: "asc" },
            select: { id: true, name: true, email: true },
        });
        return { success: true, data: parents };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            include: { unit: true },
            orderBy: { name: "asc" },
        });
        // Remove passwords from response
        const safeUsers = users.map(({ password, ...user }) => user);
        return { success: true, data: safeUsers };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getUserById(id: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: { unit: true },
        });
        if (!user) return { success: false, error: "User not found" };
        const { password, ...safeUser } = user;
        return { success: true, data: safeUser };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function createUser(data: { name: string; email: string; password?: string; role: Role; unitId?: string }) {
    try {
        const hashedPassword = await bcrypt.hash(data.password || "password123", 10);
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role,
                unitId: data.unitId || null,
            },
        });
        revalidatePath("/dashboard/users");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateUser(id: string, data: { name: string; email: string; password?: string; role: Role; unitId?: string }) {
    try {
        const updateData: any = {
            name: data.name,
            email: data.email,
            role: data.role,
            unitId: data.unitId || null,
        };

        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        await prisma.user.update({
            where: { id },
            data: updateData,
        });
        revalidatePath("/dashboard/users");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteUser(id: string) {
    try {
        await prisma.user.delete({ where: { id } });
        revalidatePath("/dashboard/users");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}


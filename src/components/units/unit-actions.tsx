"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteUnit } from "@/lib/actions/unit";

export function UnitActions({ unitId }: { unitId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this unit? It may contain students and staff!")) return;

        setIsDeleting(true);
        const res = await deleteUnit(unitId);
        if (!res.success) {
            alert(res.error || "Failed to delete unit");
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex justify-end gap-2">
            <Link href={`/dashboard/units/${unitId}/edit`}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/50">
                    <Pencil className="h-4 w-4" />
                </Button>
            </Link>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}

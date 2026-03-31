"use client";
import { useRouter } from "next/navigation";

export function UnitFilter({ units, currentUnitId }: { units: { id: string, name: string }[], currentUnitId?: string }) {
    const router = useRouter();

    return (
        <select
            className="flex h-9 w-full sm:w-[200px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={currentUnitId || ""}
            onChange={(e) => {
                const val = e.target.value;
                if (val) {
                    router.push(`/dashboard/students?unitId=${val}`);
                } else {
                    router.push(`/dashboard/students`);
                }
            }}
        >
            <option value="">All Units</option>
            {units.map((u) => (
                <option key={u.id} value={u.id}>
                    {u.name}
                </option>
            ))}
        </select>
    );
}

"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getUnitById, updateUnit } from "@/lib/actions/unit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function EditUnitPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");
    const [unitData, setUnitData] = useState<any>(null);

    useEffect(() => {
        if (!id) return;
        const fetchUnit = async () => {
            const res = await getUnitById(id);
            if (res.success && res.data) {
                setUnitData(res.data);
            } else {
                setError("Failed to load unit data.");
            }
            setPageLoading(false);
        };
        fetchUnit();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id) return;
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            type: formData.get("type") as "RELIGION" | "GENERAL",
        };

        const res = await updateUnit(id, data);
        if (res.success) {
            router.push("/dashboard/units");
        } else {
            setError(res.error || "An error occurred");
            setLoading(false);
        }
    };

    if (pageLoading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/units">
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Edit Unit</h2>
                    <p className="text-muted-foreground mt-1">Update the unit details below.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Unit Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Unit Name</label>
                                <Input name="name" required defaultValue={unitData?.name} placeholder="e.g. Madrasah Diniyah" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Unit Type</label>
                                <select
                                    name="type"
                                    required
                                    defaultValue={unitData?.type}
                                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="RELIGION">Religion (Tahfidz, Madrasah Diniyah)</option>
                                    <option value="GENERAL">General (SMP, SMA, SMK)</option>
                                </select>
                            </div>
                        </div>

                        {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                                <Save className="h-4 w-4 mr-2" />
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

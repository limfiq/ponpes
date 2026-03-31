"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUnit } from "@/lib/actions/unit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function NewUnitPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            type: formData.get("type") as "RELIGION" | "GENERAL",
        };

        const res = await createUnit(data);
        if (res.success) {
            router.push("/dashboard/units");
        } else {
            setError(res.error || "An error occurred");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/units">
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Create New Unit</h2>
                    <p className="text-muted-foreground mt-1">Fill in the details below to add an education unit.</p>
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
                                <Input name="name" required placeholder="e.g. Madrasah Diniyah" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Unit Type</label>
                                <select
                                    name="type"
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="" disabled selected>Select a type</option>
                                    <option value="RELIGION">Religion (Tahfidz, Madrasah Diniyah)</option>
                                    <option value="GENERAL">General (SMP, SMA, SMK)</option>
                                </select>
                            </div>
                        </div>

                        {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                                <Save className="h-4 w-4 mr-2" />
                                {loading ? "Saving..." : "Save Unit"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getUserById, updateUser } from "@/lib/actions/user";
import { getUnits } from "@/lib/actions/unit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");
    const [units, setUnits] = useState<{ id: string; name: string }[]>([]);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            const [unitsRes, userRes] = await Promise.all([
                getUnits(),
                getUserById(id)
            ]);

            if (unitsRes.success && unitsRes.data) {
                setUnits(unitsRes.data);
            }
            if (userRes.success && userRes.data) {
                setUserData(userRes.data);
            } else {
                setError("Failed to load user data.");
            }
            setPageLoading(false);
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id) return;
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string || undefined,
            role: formData.get("role") as any,
            unitId: formData.get("unitId") as string || undefined,
        };

        const res = await updateUser(id, data);
        if (res.success) {
            router.push("/dashboard/users");
        } else {
            setError(res.error || "An error occurred");
            setLoading(false);
        }
    };

    if (pageLoading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/users">
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Edit User</h2>
                    <p className="text-muted-foreground mt-1">Update the user's information below.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>User Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <Input name="name" required defaultValue={userData?.name} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <Input name="email" type="email" required defaultValue={userData?.email} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Password</label>
                                <Input name="password" type="password" placeholder="Leave blank to keep current" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Role</label>
                                <select
                                    name="role"
                                    required
                                    defaultValue={userData?.role}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="PARENT">PARENT</option>
                                    <option value="TEACHER">TEACHER</option>
                                    <option value="ADMIN_UNIT">ADMIN_UNIT</option>
                                    <option value="ADMIN_YAYASAN">ADMIN_YAYASAN</option>
                                </select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">Assigned Unit (Optional for Yayasan Admin/Parent)</label>
                                <select
                                    name="unitId"
                                    defaultValue={userData?.unitId || ""}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">No Unit Assigned (Global)</option>
                                    {units.map((unit) => (
                                        <option key={unit.id} value={unit.id}>
                                            {unit.name}
                                        </option>
                                    ))}
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

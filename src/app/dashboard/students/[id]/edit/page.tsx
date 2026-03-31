"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getStudentById, updateStudent } from "@/lib/actions/student";
import { getUnits } from "@/lib/actions/unit";
import { getParents } from "@/lib/actions/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function EditStudentPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");
    const [units, setUnits] = useState<{ id: string; name: string }[]>([]);
    const [parents, setParents] = useState<{ id: string; name: string }[]>([]);
    const [studentData, setStudentData] = useState<any>(null);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            const [unitsRes, parentsRes, studentRes] = await Promise.all([
                getUnits(),
                getParents(),
                getStudentById(id)
            ]);

            if (unitsRes.success && unitsRes.data) {
                setUnits(unitsRes.data);
            }
            if (parentsRes.success && parentsRes.data) {
                setParents(parentsRes.data);
            }
            if (studentRes.success && studentRes.data) {
                setStudentData(studentRes.data);
            } else {
                setError("Failed to load student data.");
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
            nisn: formData.get("nisn") as string,
            name: formData.get("name") as string,
            unitId: formData.get("unitId") as string,
            parentId: formData.get("parentId") as string || undefined,
            status: formData.get("status") as string,
        };

        const res = await updateStudent(id, data);
        if (res.success) {
            router.push("/dashboard/students");
        } else {
            setError(res.error || "An error occurred");
            setLoading(false);
        }
    };

    if (pageLoading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/students">
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Edit Student</h2>
                    <p className="text-muted-foreground mt-1">Update the student information below.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Student Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">NISN / ID</label>
                                <Input name="nisn" required defaultValue={studentData?.nisn} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <Input name="name" required defaultValue={studentData?.name} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Education Unit</label>
                                <select
                                    name="unitId"
                                    required
                                    defaultValue={studentData?.unitId}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="" disabled>Select a unit</option>
                                    {units.map((unit) => (
                                        <option key={unit.id} value={unit.id}>
                                            {unit.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <select
                                    name="status"
                                    required
                                    defaultValue={studentData?.status}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="GRADUATED">GRADUATED</option>
                                    <option value="DROPOUT">DROPOUT</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Parent (Optional)</label>
                                <select
                                    name="parentId"
                                    defaultValue={studentData?.parentId || ""}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">No Parent Assigned</option>
                                    {parents.map((parent) => (
                                        <option key={parent.id} value={parent.id}>
                                            {parent.name}
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

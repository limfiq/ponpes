import { getStudents } from "@/lib/actions/student";
import { getUnits } from "@/lib/actions/unit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { StudentActions } from "@/components/students/student-actions";
import { UnitFilter } from "@/components/students/unit-filter";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function StudentsPage({ searchParams }: { searchParams: { unitId?: string } }) {
    const [result, unitsRes] = await Promise.all([
        getStudents(searchParams.unitId),
        getUnits()
    ]);
    const students = result.success ? result.data : [];
    const units = unitsRes.success && unitsRes.data ? unitsRes.data : [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Students Management</h2>
                    <p className="text-muted-foreground mt-1">Manage database records and filter by education unit.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <UnitFilter units={units} currentUnitId={searchParams.unitId} />
                    <Link href="/dashboard/students/new" className="w-full sm:w-auto">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add New Student
                        </Button>
                    </Link>
                </div>
            </div>

            <Card className="shadow-sm">
                <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
                    <CardTitle className="text-lg">All Registered Students</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {result.success === false ? (
                        <div className="p-8 text-center text-red-500">
                            Database connection error: {result.error}
                        </div>
                    ) : students!.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                            <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                                <UserPlus className="h-6 w-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No students found</h3>
                            <p className="mt-1">Get started by creating a new student record.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50 dark:bg-gray-900/50 hover:bg-transparent">
                                        <TableHead>NISN</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Unit / School</TableHead>
                                        <TableHead>Parent</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students!.map((student) => (
                                        <TableRow key={student.id} className="cursor-default hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <TableCell className="font-medium">{student.nisn}</TableCell>
                                            <TableCell>{student.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                                                    {student.unit?.name || "Unassigned"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {student.parent?.name ? (
                                                    <span className="text-sm">{student.parent.name}</span>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground italic">None</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={student.status === "ACTIVE" ? "default" : "destructive"}
                                                    className={student.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300" : ""}>
                                                    {student.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <StudentActions studentId={student.id} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

import { getUnits } from "@/lib/actions/unit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { UnitActions } from "@/components/units/unit-actions";

export default async function UnitsPage() {
    const result = await getUnits();
    const units = result.success && result.data ? result.data : [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Education Units</h2>
                    <p className="text-muted-foreground mt-1">Manage schools and education units within the Yayasan.</p>
                </div>
                <Link href="/dashboard/units/new">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Unit
                    </Button>
                </Link>
            </div>

            <Card className="shadow-sm">
                <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
                    <CardTitle className="text-lg">All Registered Units</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {units.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No units found</h3>
                            <p className="mt-1">Get started by creating a new education unit.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50 dark:bg-gray-900/50 hover:bg-transparent">
                                        <TableHead>System ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {units.map((unit) => (
                                        <TableRow key={unit.id} className="cursor-default hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <TableCell className="font-medium text-xs text-muted-foreground">{unit.id}</TableCell>
                                            <TableCell className="font-medium">{unit.name}</TableCell>
                                            <TableCell>
                                                <Badge variant={unit.type === "RELIGION" ? "default" : "secondary"}
                                                    className={unit.type === "RELIGION" ? "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" : ""}>
                                                    {unit.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <UnitActions unitId={unit.id} />
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

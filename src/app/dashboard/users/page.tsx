import { getUsers } from "@/lib/actions/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { UserActions } from "@/components/users/user-actions";

export default async function UsersPage() {
    const result = await getUsers();
    const users = result.success && result.data ? result.data : [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">User Management</h2>
                    <p className="text-muted-foreground mt-1">Manage staff, teachers, and parents within the system.</p>
                </div>
                <Link href="/dashboard/users/new">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add New User
                    </Button>
                </Link>
            </div>

            <Card className="shadow-sm">
                <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
                    <CardTitle className="text-lg">All Registered Users</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {users.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No users found</h3>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50 dark:bg-gray-900/50 hover:bg-transparent">
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Assigned Unit</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id} className="cursor-default hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300">
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {user.unit ? (
                                                    <span className="text-sm">{user.unit.name}</span>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground italic">None (Global Admin)</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <UserActions userId={user.id} />
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

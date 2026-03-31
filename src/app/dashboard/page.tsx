import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, Banknote, CalendarCheck } from "lucide-react";

export default function DashboardPage() {
    const stats = [
        { name: "Total Students", value: "1,200", icon: Users, color: "text-blue-600" },
        { name: "Active Classes", value: "45", icon: GraduationCap, color: "text-indigo-600" },
        { name: "Today's Attendance", value: "98%", icon: CalendarCheck, color: "text-emerald-600" },
        { name: "Monthly Revenue", value: "Rp 150M", icon: Banknote, color: "text-orange-600" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Dashboard Overview</h2>
                <p className="text-muted-foreground mt-1">Welcome back to the Yayasan Management System.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.name} className="hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors bg-white dark:bg-gray-900">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {stat.name}
                            </CardTitle>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-8">
                <Card className="col-span-4 bg-white dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle>Recent Enrollments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Table placeholder */}
                        <div className="rounded-xl border border-dashed p-12 flex flex-col items-center justify-center text-muted-foreground bg-gray-50/50 dark:bg-gray-800/50">
                            <Users className="h-8 w-8 mb-4 text-gray-400" />
                            <p>No recent enrollments to display</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 bg-white dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle>Quick Access</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="group rounded-xl border p-5 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 hover:from-blue-100/50 hover:to-indigo-100/50 dark:from-blue-900/10 dark:to-indigo-900/10 dark:border-gray-800 transition-all cursor-pointer">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                                    <Banknote className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold text-blue-800 dark:text-blue-300">Record New Payment</h3>
                            </div>
                            <p className="text-sm text-blue-600/80 dark:text-blue-400/80 ml-11">Register SPP/Syahriah daily transactions.</p>
                        </div>
                        <div className="group rounded-xl border p-5 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 hover:from-emerald-100/50 hover:to-teal-100/50 dark:from-emerald-900/10 dark:to-teal-900/10 dark:border-gray-800 transition-all cursor-pointer">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                                    <CalendarCheck className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300">Setoran Hafalan Log</h3>
                            </div>
                            <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 ml-11">Input daily attendance and memorization.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

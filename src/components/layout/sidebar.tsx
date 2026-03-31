import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    ClipboardList,
    Wallet,
    Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Students", href: "/dashboard/students", icon: Users },
    { name: "Academic", href: "/dashboard/academic", icon: GraduationCap },
    { name: "Attendance", href: "/dashboard/attendance", icon: ClipboardList },
    { name: "Finance", href: "/dashboard/finance", icon: Wallet },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ className }: { className?: string }) {
    return (
        <div className={cn("hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col", className)}>
            <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-white px-6 pb-4 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <div className="flex h-16 shrink-0 items-center">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Yayasan Management
                    </span>
                </div>
                <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                            <ul role="list" className="-mx-2 space-y-1">
                                {navigation.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
                                        >
                                            <item.icon
                                                className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600 dark:text-gray-500 dark:group-hover:text-indigo-400"
                                                aria-hidden="true"
                                            />
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

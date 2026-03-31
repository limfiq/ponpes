"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError(res.error);
            setLoading(false);
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50/50 dark:bg-gray-950 p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

            <Card className="w-full max-w-md shadow-xl border-white/20 relative z-10 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader className="space-y-3 text-center pb-6">
                    <div className="mx-auto bg-indigo-100 dark:bg-indigo-900/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-2 shadow-inner">
                        <GraduationCap className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-indigo-700 to-blue-500 dark:from-indigo-400 dark:to-blue-300 bg-clip-text text-transparent">
                        Yayasan Management
                    </CardTitle>
                    <CardDescription className="text-base font-medium">
                        Welcome back. Please sign in to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2 relative">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1" htmlFor="email">
                                Email Address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@yayasan.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11 shadow-sm focus-visible:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-2 relative">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="password">
                                    Password
                                </label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-11 shadow-sm focus-visible:ring-indigo-500"
                            />
                        </div>
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm font-medium text-center border border-red-100 dark:border-red-800">
                                {error}
                            </div>
                        )}
                        <Button
                            type="submit"
                            className="w-full h-11 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all shadow-md hover:shadow-lg"
                            disabled={loading}
                        >
                            {loading ? "Authenticating..." : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

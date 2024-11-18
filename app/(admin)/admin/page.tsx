import { getServerSession } from "next-auth";
import Dashboard from "./dashboard";
import { authOptions } from "@/app/lib/auth-options";

interface DashboardData {
    totalItems: number;
    pendingReviews: number;
    rentalRequests: number;
    overdueItems: number;
    monthDataList: { month: number; count: number }[];
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    const res = await fetch("http://localhost:8080/admin/dashboard/status", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.id_token}`,
        },
        cache: "no-cache",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch dashboard data");
    }

    const data: DashboardData = await res.json();

    return <Dashboard data={data} />;
}

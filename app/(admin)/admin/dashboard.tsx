"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    CartesianGrid,
    YAxis,
    ResponsiveContainer,
} from "recharts";

interface DashboardData {
    totalItems: number;
    pendingReviews: number;
    rentalRequests: number;
    overdueItems: number;
    monthDataList: { month: number; count: number }[];
}

export default function Dashboard({ data }: { data: DashboardData }) {
    return (
        <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
            {/* Statistics Cards */}
            <Card>
                <CardHeader>
                    <CardTitle>전체 등록 물품 수</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{data.totalItems}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>심사 대기 수</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{data.pendingReviews}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>물품 대여 신청 수</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{data.rentalRequests}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>물품 연체 수</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{data.overdueItems}</p>
                </CardContent>
            </Card>

            {/* Chart */}
            <div className="col-span-1 md:col-span-2 lg:col-span-4">
                <Card>
                    <CardHeader>
                        <CardTitle>월별 물품 등록 수</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.monthDataList}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="month"
                                    label={{
                                        value: "월",
                                        position: "insideBottom",
                                        offset: -5,
                                    }}
                                />
                                <YAxis
                                    label={{
                                        value: "등록 수",
                                        angle: -90,
                                        position: "insideLeft",
                                    }}
                                />
                                <Tooltip />
                                <Bar dataKey="count" fill="#4682B4" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

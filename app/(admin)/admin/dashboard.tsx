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
import { Package, Clock, ShoppingCart, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardData {
    totalItems: number;
    pendingReviews: number;
    rentalRequests: number;
    overdueItems: number;
    monthDataList: { month: number; count: number }[];
}

export default function Dashboard({ data }: { data: DashboardData }) {
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const chartVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1 } },
    };

    return (
        <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
            {/* Statistics Cards */}
            {[
                {
                    icon: <Package className="inline-block mr-2" />,
                    title: "전체 등록 물품 수",
                    value: data.totalItems,
                },
                {
                    icon: <Clock className="inline-block mr-2" />,
                    title: "심사 대기 수",
                    value: data.pendingReviews,
                },
                {
                    icon: <ShoppingCart className="inline-block mr-2" />,
                    title: "물품 대여 신청 수",
                    value: data.rentalRequests,
                },
                {
                    icon: <AlertCircle className="inline-block mr-2" />,
                    title: "물품 연체 수",
                    value: data.overdueItems,
                },
            ].map((item, index) => (
                <motion.div
                    key={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 * index, duration: 0.5 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {item.icon}
                                {item.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{item.value}</p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}

            {/* Chart */}
            <motion.div
                className="col-span-1 md:col-span-2 lg:col-span-4"
                variants={chartVariants}
                initial="hidden"
                animate="visible"
            >
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
            </motion.div>
        </div>
    );
}

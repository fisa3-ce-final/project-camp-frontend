"use client";

import { FC, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderPageData } from "@/app/types/order-data";
import { useRouter } from "next/navigation";

interface MyOrdersPageProps {
    orderPageData: OrderPageData;
    idToken: string;
}

const MyOrdersPage: FC<MyOrdersPageProps> = ({ orderPageData, idToken }) => {
    const { content, pageable } = orderPageData;
    const router = useRouter();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="flex justify-center h-full min-h-screen bg-gray-100">
            <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-md space-y-10">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="mb-4"
                >
                    ← 뒤로가기
                </Button>
                <h1 className="text-2xl font-bold mb-4">📦 내 주문 내역</h1>
                <div className="grid grid-cols-1 gap-4">
                    {content.map((order, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle>{`🛒 주문 번호: ${order.orderId}`}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-2">
                                    📅 주문 날짜:{" "}
                                    {new Date(
                                        order.orderDate
                                    ).toLocaleDateString()}
                                </p>
                                <Badge className="mb-2">
                                    {order.orderStatus === "PENDING"
                                        ? "⏳ 결제 중"
                                        : order.orderStatus}
                                </Badge>
                            </CardContent>
                            {order.orderStatus === "PENDING" && (
                                <CardFooter>
                                    <Button variant="destructive">
                                        주문 취소
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>
                    ))}
                </div>
                <div className="mt-4 text-center">
                    <p>
                        현재 페이지: {pageable.pageNumber + 1} /{" "}
                        {orderPageData.totalPages}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MyOrdersPage;

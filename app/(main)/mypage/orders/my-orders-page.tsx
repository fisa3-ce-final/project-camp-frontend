"use client";

import { FC } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrderPageData } from "@/app/types/order-data";

interface MyOrdersPageProps {
    orderPageData: OrderPageData;
    idToken: string;
}

const MyOrdersPage: FC<MyOrdersPageProps> = ({ orderPageData, idToken }) => {
    const { content, pageable } = orderPageData;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">📦 내 주문 내역</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.map((order, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{`🛒 ${order.rentalItemName}`}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                📅 주문 날짜:{" "}
                                {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                            <p>📂 카테고리: {order.category}</p>
                            <p>📦 재고: {order.stock}개</p>
                            <Badge>
                                {order.orderStatus === "PENDING"
                                    ? "⏳ 대기 중"
                                    : order.orderStatus}
                            </Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="mt-4">
                <p>
                    현재 페이지: {pageable.pageNumber + 1} /{" "}
                    {orderPageData.totalPages}
                </p>
            </div>
        </div>
    );
};

export default MyOrdersPage;

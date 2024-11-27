"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Package, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { OrderPageData } from "@/app/types/order-data";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

async function fetchOrders(
    page: number,
    idToken: string
): Promise<OrderPageData> {
    const response = await fetch(
        `/backend/rental-items/my-orders?page=${page}&size=10`,
        {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        }
    );
    if (!response.ok) throw new Error("Failed to fetch orders");
    return response.json();
}

async function cancelOrder(orderId: number, idToken: string) {
    const response = await fetch(`/backend/orders/${orderId}/pending`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
    });
    if (!response.ok) throw new Error("주문 취소에 실패했습니다.");
}

export default function MyOrdersPage() {
    const [orderPageData, setOrderPageData] = useState<OrderPageData | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        const loadOrders = async () => {
            if (!session?.user?.id_token) return;
            setIsLoading(true);
            try {
                const data = await fetchOrders(
                    currentPage,
                    session.user.id_token
                );
                setOrderPageData(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                );
            } finally {
                setIsLoading(false);
            }
        };
        loadOrders();
    }, [currentPage, session?.user?.id_token]);

    const handlePageChange = (newPage: number) => setCurrentPage(newPage);

    const handleCancelOrder = async (orderId: number) => {
        if (!session?.user?.id_token) return;
        try {
            await cancelOrder(orderId, session.user.id_token);
            toast.success("주문이 성공적으로 취소되었습니다.");
            const updatedData = await fetchOrders(
                currentPage,
                session.user.id_token
            );
            setOrderPageData(updatedData);
        } catch (err) {
            console.error("Failed to cancel order:", err);
            toast.error("주문 취소에 실패했습니다.");
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6 text-center">
                        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
                        <p className="text-xl font-semibold text-red-500">
                            {error}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex justify-center h-full bg-gray-100  min-h-screen">
            <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-md space-y-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="container mx-auto px-4 py-8"
                >
                    <motion.div
                        initial={{ x: -50 }}
                        animate={{ x: 0 }}
                        className="flex items-center mb-8"
                    >
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="mr-4"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <h1 className="text-3xl font-bold">내 주문 내역</h1>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                {[...Array(5)].map((_, index) => (
                                    <Card
                                        key={index}
                                        className="overflow-hidden"
                                    >
                                        <CardHeader>
                                            <Skeleton className="h-6 w-3/4" />
                                        </CardHeader>
                                        <CardContent>
                                            <Skeleton className="h-4 w-1/2 mb-2" />
                                            <Skeleton className="h-4 w-1/4" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                {orderPageData?.content.map((order, index) => (
                                    <motion.div
                                        key={order.orderId}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                            <CardHeader>
                                                <CardTitle className="flex items-center">
                                                    <Package className="mr-2 h-5 w-5" />
                                                    주문 번호: {order.orderId}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="mb-2">
                                                    📅 주문 날짜:{" "}
                                                    {new Date(
                                                        order.orderDate
                                                    ).toLocaleDateString()}
                                                </p>
                                                <Badge
                                                    variant={
                                                        order.orderStatus ===
                                                        "PENDING"
                                                            ? "secondary"
                                                            : "default"
                                                    }
                                                    className="mb-2"
                                                >
                                                    {order.orderStatus ===
                                                    "PENDING"
                                                        ? "⏳ 결제 중"
                                                        : order.orderStatus}
                                                </Badge>
                                            </CardContent>
                                            <CardFooter className="flex justify-between">
                                                <Button
                                                    onClick={() =>
                                                        router.push(
                                                            `/cart/order/detail/${order.orderId}`
                                                        )
                                                    }
                                                >
                                                    주문 상세 보기
                                                </Button>
                                                {order.orderStatus ===
                                                    "PENDING" && (
                                                    <Button
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleCancelOrder(
                                                                order.orderId
                                                            )
                                                        }
                                                    >
                                                        주문 취소
                                                    </Button>
                                                )}
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!isLoading && orderPageData && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-8 flex justify-between items-center"
                        >
                            <Button
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 0}
                                variant="outline"
                            >
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                이전
                            </Button>
                            <p className="text-sm font-medium">
                                페이지 {currentPage + 1} /{" "}
                                {orderPageData.totalPages}
                            </p>
                            <Button
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={
                                    orderPageData.last ||
                                    orderPageData.content.length === 0
                                }
                                variant="outline"
                            >
                                다음
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

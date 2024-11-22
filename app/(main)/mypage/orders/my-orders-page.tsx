"use client";

import { FC, useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface MyOrdersPageProps {
    idToken: string;
}

async function cancelOrder(orderId: number, idToken: string) {
    const response = await fetch(`/backend/orders/${orderId}/pending`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
    });
    if (!response.ok) {
        throw new Error("주문 취소에 실패했습니다.");
    }
}

interface MyOrdersPageProps {
    idToken: string;
}

async function fetchOrders(
    page: number,
    idToken: string
): Promise<OrderPageData> {
    const response = await fetch(
        `/backend/rental-items/my-orders?page=${page}&size=10`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
            },
        }
    );
    if (!response.ok) {
        throw new Error("Failed to fetch orders");
    }
    return response.json();
}

const MyOrdersPage: FC<MyOrdersPageProps> = ({ idToken }) => {
    const [orderPageData, setOrderPageData] = useState<OrderPageData | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const loadOrders = async () => {
            setIsLoading(true);
            try {
                const data = await fetchOrders(currentPage, idToken);
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
    }, [currentPage, idToken]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

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
                    {isLoading
                        ? Array.from({ length: 5 }).map((_, index) => (
                              <Card key={index}>
                                  <CardHeader>
                                      <Skeleton className="h-6 w-3/4" />
                                  </CardHeader>
                                  <CardContent>
                                      <Skeleton className="h-4 w-1/2 mb-2" />
                                      <Skeleton className="h-4 w-1/4" />
                                  </CardContent>
                              </Card>
                          ))
                        : orderPageData?.content.map((order, index) => (
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
                                  <CardFooter>
                                      <Button
                                          className="mr-5"
                                          onClick={() => {
                                              router.push(
                                                  `/cart/order/detail/${order.orderId}`
                                              );
                                          }}
                                      >
                                          주문 상세 보기
                                      </Button>

                                      {order.orderStatus === "PENDING" && (
                                          <Button
                                              variant="destructive"
                                              onClick={async () => {
                                                  try {
                                                      await cancelOrder(
                                                          order.orderId,
                                                          idToken
                                                      );
                                                  } catch (err) {
                                                      console.error(
                                                          "Failed to cancel order:",
                                                          err
                                                      );
                                                      toast.error(
                                                          "주문 취소에 실패했습니다."
                                                      );
                                                  }
                                                  window.location.reload();
                                              }}
                                          >
                                              주문 취소
                                          </Button>
                                      )}
                                  </CardFooter>
                              </Card>
                          ))}
                </div>
                {!isLoading && orderPageData && (
                    <div className="mt-4 flex justify-between items-center">
                        <Button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                        >
                            이전
                        </Button>
                        <p>
                            페이지 {currentPage + 1} /{" "}
                            {orderPageData.totalPages}
                        </p>
                        <Button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={
                                orderPageData.last ||
                                orderPageData.content.length === 0
                            }
                        >
                            다음
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;

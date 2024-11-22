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

const MyOrdersPage: FC<MyOrdersPageProps> = ({ idToken }) => {
    const [orderPageData, setOrderPageData] = useState<OrderPageData | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(
                    `/backend/rental-items/my-orders?page=0&size=10`,
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

                const data: OrderPageData = await response.json();
                setOrderPageData(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
        window.scrollTo(0, 0);
    }, [idToken]);

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
                                                      // You might want to show an error message to the user here
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
                    <div className="mt-4 text-center">
                        <p>
                            현재 페이지: {orderPageData.pageable.pageNumber + 1}{" "}
                            / {orderPageData.totalPages}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;

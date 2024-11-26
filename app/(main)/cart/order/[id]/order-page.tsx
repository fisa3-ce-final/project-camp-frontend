"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner"; // sonner 임포트
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Order } from "@/app/types/order-data";

const CartOrderPage = ({ idToken }: { idToken: string }) => {
    const router = useRouter();
    const { id: orderId } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string>("원 페이");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!orderId) {
            toast.error("주문 ID가 없습니다.");
            router.push("/logout");
            return;
        }

        const fetchOrder = async () => {
            try {
                const response = await fetch(`/backend/orders/${orderId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                    cache: "no-store",
                });

                if (response.ok) {
                    const data: Order = await response.json();
                    setOrder(data);
                } else if (response.status === 404) {
                    toast.info("해당 주문을 찾을 수 없습니다.");
                    router.push("/cart");
                } else {
                    throw new Error("주문 정보를 불러오는 데 실패했습니다.");
                }
            } catch (error: any) {
                console.error("Error fetching order:", error);
                toast.error(
                    error.message || "주문 정보를 불러오는 데 실패했습니다."
                );
                router.push("/cart");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, idToken, router]);

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <Skeleton className="h-10 w-1/3 mb-6" />
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                        {Array(3)
                            .fill(null)
                            .map((_, index) => (
                                <Skeleton
                                    key={index}
                                    className="h-24 w-full rounded-lg"
                                />
                            ))}
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-40 w-full rounded-lg" />
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <div className="max-w-6xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">
                주문 내역 🛒
            </h1>
            <div className="flex flex-col gap-8 items-center md:flex-col md:items-center">
                {/* 왼쪽 섹션: 배송 정보 및 결제 수단 */}
                <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-semibold mb-4">
                        배송 정보 📦
                    </h2>
                    <p>
                        <strong>주소:</strong>{" "}
                        {order.address || "등록된 주소가 없습니다."}
                    </p>
                    <p>
                        <strong>전화번호:</strong>{" "}
                        {order.phone || "등록된 전화번호가 없습니다."}
                    </p>
                    {/* <h2 className="text-2xl font-semibold mt-6 mb-4">
                        결제 수단 💳
                    </h2>
                    <div className="flex items-center space-x-4">
                        <input
                            type="radio"
                            id="wonpay"
                            name="paymentMethod"
                            value="원 페이"
                            checked={paymentMethod === "원 페이"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="wonpay" className="text-sm font-medium">
                            우리WON페이
                        </label>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                        <input
                            type="radio"
                            id="tosspay"
                            name="paymentMethod"
                            value="토스페이"
                            checked={paymentMethod === "토스페이"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label
                            htmlFor="tosspay"
                            className="text-sm font-medium"
                        >
                            토스페이
                        </label>
                    </div> */}
                </div>

                {/* 오른쪽 섹션: 결제 요약 */}
                <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-semibold mb-4">
                        결제 요약 💰
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-medium mb-2">
                                주문 항목
                            </h3>
                            {order.orderItems.map((item) => (
                                <div
                                    key={item.rentalItemId}
                                    className="flex justify-between items-center mb-2"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {item.itemName}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            수량: {item.quantity}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">
                                            {item.subtotal.toLocaleString()} 원
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-4">
                            <div className="flex justify-between mb-2">
                                <span>총 상품 금액</span>
                                <span>
                                    {order.totalItemPrice.toLocaleString()} 원
                                </span>
                            </div>
                            <div className="flex justify-between mb-2 text-primary">
                                <span>할인 금액</span>
                                <span>
                                    -{order.discountAmount.toLocaleString()} 원
                                </span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>최종 결제 금액</span>
                                <span>
                                    {order.finalPrice.toLocaleString()} 원
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <Button
                            className="w-full"
                            onClick={() => {
                                toast.success("결제가 완료되었습니다!");
                                router.push("/cart");
                            }}
                        >
                            결제 진행하기
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartOrderPage;

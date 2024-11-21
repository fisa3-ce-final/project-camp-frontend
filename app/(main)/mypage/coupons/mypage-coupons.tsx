"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Scissors } from "lucide-react";

interface Coupon {
    couponId: number;
    name: string;
    discount: number;
    type: string;
    expiryDate: string;
    amount?: number;
    received?: boolean;
}

export default function ImprovedMypageCoupons({
    idToken,
}: {
    idToken: string;
}) {
    const router = useRouter();
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingAvailable, setLoadingAvailable] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingStates, setLoadingStates] = useState<{
        [key: number]: boolean;
    }>({});

    const fetchCoupons = async (page = 0) => {
        setLoading(true);
        try {
            const response = await fetch(
                `/backend/user-coupons?page=${page}&size=10`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                }
            );
            const data = await response.json();
            setCoupons(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error fetching coupons:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableCoupons = async (page = 0) => {
        setLoadingAvailable(true);
        try {
            const response = await fetch(
                `/backend/community/coupon?page=${page}&size=10`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                }
            );
            const data = await response.json();
            setAvailableCoupons(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error fetching available coupons:", error);
        } finally {
            setLoadingAvailable(false);
        }
    };

    const handleCouponReceive = async (couponId: number) => {
        setLoadingStates((prev) => ({ ...prev, [couponId]: true }));
        try {
            const response = await fetch("/backend/user-coupons", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({ couponId }),
            });
            if (response.ok) {
                toast.success("🎉 쿠폰을 성공적으로 받았습니다!");
                fetchAvailableCoupons(currentPage);
            } else {
                toast.error("❌ 쿠폰 받기에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error receiving coupon:", error);
            toast.error("❌ 쿠폰 받기에 실패했습니다.");
        } finally {
            setLoadingStates((prev) => ({ ...prev, [couponId]: false }));
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchCoupons();
    }, []);

    const handlePageChange = (newPage: number, type: "list" | "get") => {
        setCurrentPage(newPage);
        if (type === "list") {
            fetchCoupons(newPage);
        } else {
            fetchAvailableCoupons(newPage);
        }
    };

    const renderCoupon = (coupon: Coupon, isAvailable: boolean) => (
        <div
            key={`coupon-${coupon.couponId}`}
            className="relative bg-white rounded-lg shadow-md overflow-hidden mb-4"
        >
            {/* <div className="absolute top-0 left-0 w-6 h-6 bg-primary rounded-br-lg"></div>
            <div className="absolute top-0 right-0 w-6 h-6 bg-primary rounded-bl-lg"></div> */}
            <div className="px-6 py-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-primary">
                        {coupon.name}
                    </h3>
                    <Scissors className="text-primary" />
                </div>
                <p className="text-3xl font-bold mb-2">
                    {coupon.type === "PERCENTAGE_DISCOUNT"
                        ? `${coupon.discount}% OFF`
                        : `${coupon.discount.toLocaleString()}원 할인`}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                    만료일: {new Date(coupon.expiryDate).toLocaleDateString()}
                </p>
                {isAvailable && (
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-gray-600">
                            남은 수량: {coupon.amount}
                        </p>
                        {coupon.received ? (
                            <Button
                                disabled
                                className="bg-gray-300 text-gray-600"
                            >
                                수령 완료
                            </Button>
                        ) : (
                            <Button
                                onClick={() =>
                                    handleCouponReceive(coupon.couponId)
                                }
                                disabled={
                                    coupon.amount === 0 ||
                                    loadingStates[coupon.couponId]
                                }
                                className="bg-primary hover:bg-primary-dark text-white"
                            >
                                {loadingStates[coupon.couponId]
                                    ? "받는 중..."
                                    : coupon.amount! > 0
                                    ? "받기"
                                    : "품절"}
                            </Button>
                        )}
                    </div>
                )}
            </div>
            <div className="absolute bottom-0 left-0 w-full h-2 bg-primary"></div>
        </div>
    );

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <Button
                variant="outline"
                onClick={() => router.back()}
                className="mb-4"
            >
                ← 뒤로가기
            </Button>

            <h1 className="text-3xl font-bold mb-6">🎁 내 쿠폰</h1>
            <Tabs
                defaultValue="list"
                className="w-full"
                onValueChange={(value) => {
                    setCurrentPage(0);
                    if (value === "list") {
                        fetchCoupons(0);
                    } else if (value === "get") {
                        fetchAvailableCoupons(0);
                    }
                }}
            >
                <TabsList className="flex justify-center mb-6">
                    <TabsTrigger value="list" className="px-6 py-2">
                        보유 쿠폰
                    </TabsTrigger>
                    <TabsTrigger value="get" className="px-6 py-2">
                        받을 수 있는 쿠폰
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, index) => (
                                <Skeleton
                                    key={index}
                                    className="h-40 w-full rounded-lg"
                                />
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {coupons.map((coupon) =>
                                    renderCoupon(coupon, false)
                                )}
                            </div>
                            <div className="flex justify-between items-center mt-6">
                                <Button
                                    disabled={currentPage === 0}
                                    onClick={() =>
                                        handlePageChange(
                                            currentPage - 1,
                                            "list"
                                        )
                                    }
                                >
                                    이전
                                </Button>
                                <p className="text-sm">
                                    {currentPage + 1} / {totalPages} 페이지
                                </p>
                                <Button
                                    disabled={currentPage === totalPages - 1}
                                    onClick={() =>
                                        handlePageChange(
                                            currentPage + 1,
                                            "list"
                                        )
                                    }
                                >
                                    다음
                                </Button>
                            </div>
                        </>
                    )}
                </TabsContent>

                <TabsContent value="get">
                    {loadingAvailable ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, index) => (
                                <Skeleton
                                    key={index}
                                    className="h-40 w-full rounded-lg"
                                />
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {availableCoupons.map((coupon) =>
                                    renderCoupon(coupon, true)
                                )}
                            </div>
                            <div className="flex justify-between items-center mt-6">
                                <Button
                                    disabled={currentPage === 0}
                                    onClick={() =>
                                        handlePageChange(currentPage - 1, "get")
                                    }
                                >
                                    이전
                                </Button>
                                <p className="text-sm">
                                    {currentPage + 1} / {totalPages} 페이지
                                </p>
                                <Button
                                    disabled={currentPage === totalPages - 1}
                                    onClick={() =>
                                        handlePageChange(currentPage + 1, "get")
                                    }
                                >
                                    다음
                                </Button>
                            </div>
                        </>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

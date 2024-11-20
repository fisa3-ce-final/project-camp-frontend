"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Coupon } from "@/app/types/admin-coupon";
import { toast } from "sonner";

export default function MypageCoupons({ idToken }: { idToken: string }) {
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
                    cache: "no-store",
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
                    cache: "no-store",
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
    const renderDiscountValue = (coupon: Coupon) => {
        if (coupon.type === "PERCENTAGE_DISCOUNT") {
            return `${coupon.discount}%`;
        }
        if (coupon.type === "FIXED_AMOUNT_DISCOUNT") {
            return `${coupon.discount.toLocaleString()}원`;
        }
        return "-";
    };

    const handleCouponReceive = async (couponId: number) => {
        setLoadingStates((prev) => ({ ...prev, [couponId]: true })); // 버튼 로딩 상태 활성화

        try {
            const response = await fetch("/backend/user-coupons", {
                method: "POST",
                cache: "no-store",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({ couponId }),
            });
            if (response.ok) {
                toast.success("🎉 쿠폰을 성공적으로 받았습니다!");
                fetchAvailableCoupons(currentPage); // 새로고침
            } else {
                toast.error("❌ 쿠폰 받기에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error receiving coupon:", error);
            toast.error("❌ 쿠폰 받기에 실패했습니다.");
        } finally {
            setLoadingStates((prev) => ({ ...prev, [couponId]: false })); // 로딩 상태 해제
        }
    };

    useEffect(() => {
        // 페이지 로드 시 최상단으로 스크롤
        window.scrollTo(0, 0);

        // 보유 쿠폰 목록 초기 로드
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

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* 뒤로가기 버튼 */}
            <Button
                variant="outline"
                onClick={() => router.back()}
                className="mb-4"
            >
                ← 뒤로가기
            </Button>

            <h1 className="text-2xl font-bold mb-4">🎁 내 쿠폰</h1>
            <Tabs
                defaultValue="list"
                className="w-full"
                onValueChange={(value) => {
                    setCurrentPage(0); // 탭 변경 시 페이지 초기화
                    if (value === "list") {
                        fetchCoupons(0);
                    } else if (value === "get") {
                        fetchAvailableCoupons(0);
                    }
                }}
            >
                <TabsList className="flex justify-center mb-4">
                    <TabsTrigger value="list">보유 쿠폰</TabsTrigger>
                    <TabsTrigger value="get">받을 수 있는 쿠폰</TabsTrigger>
                </TabsList>

                {/* 보유 쿠폰 목록 */}
                <TabsContent value="list">
                    {loading ? (
                        <div>
                            <Skeleton className="h-8 w-full mb-2" />
                            <Skeleton className="h-8 w-full mb-2" />
                            <Skeleton className="h-8 w-full mb-2" />
                        </div>
                    ) : (
                        <>
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>쿠폰명</TableHead>
                                        <TableHead>할인율</TableHead>
                                        <TableHead>유형</TableHead>
                                        <TableHead>만료일</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {coupons.map((coupon) => (
                                        <TableRow
                                            key={
                                                "coupon_list-" + coupon.couponId
                                            }
                                        >
                                            <TableCell>{coupon.name}</TableCell>
                                            <TableCell>
                                                {renderDiscountValue(coupon)}
                                            </TableCell>
                                            <TableCell>{coupon.type}</TableCell>
                                            <TableCell>
                                                {new Date(
                                                    coupon.expiryDate
                                                ).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex justify-between items-center mt-4">
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
                                <p>
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

                {/* 받을 수 있는 쿠폰 목록 */}
                <TabsContent value="get">
                    {loadingAvailable ? (
                        <div>
                            <Skeleton className="h-8 w-full mb-2" />
                            <Skeleton className="h-8 w-full mb-2" />
                            <Skeleton className="h-8 w-full mb-2" />
                        </div>
                    ) : (
                        <>
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>쿠폰명</TableHead>
                                        <TableHead>할인율</TableHead>
                                        <TableHead>유형</TableHead>
                                        <TableHead>만료일</TableHead>
                                        <TableHead>수량</TableHead>
                                        <TableHead>작업</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {availableCoupons.map((coupon) => (
                                        <TableRow
                                            key={
                                                "available_coupon-" +
                                                coupon.couponId
                                            }
                                        >
                                            <TableCell>{coupon.name}</TableCell>
                                            <TableCell>
                                                {renderDiscountValue(coupon)}
                                            </TableCell>
                                            <TableCell>{coupon.type}</TableCell>
                                            <TableCell>
                                                {new Date(
                                                    coupon.expiryDate
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                {coupon.amount}
                                            </TableCell>
                                            <TableCell>
                                                {coupon.received ? ( // received가 true이면 "수령 완료" 표시
                                                    <Button disabled={true}>
                                                        수령 완료
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={() =>
                                                            handleCouponReceive(
                                                                coupon.couponId
                                                            )
                                                        }
                                                        disabled={
                                                            coupon.amount ===
                                                                0 ||
                                                            loadingStates[
                                                                coupon.couponId
                                                            ]
                                                        } // 수량이 없거나 로딩 중일 때 비활성화
                                                    >
                                                        {loadingStates[
                                                            coupon.couponId
                                                        ]
                                                            ? "받는 중..." // 로딩 상태 표시
                                                            : coupon.amount > 0
                                                            ? "받기"
                                                            : "품절"}
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex justify-between items-center mt-4">
                                <Button
                                    disabled={currentPage === 0}
                                    onClick={() =>
                                        handlePageChange(currentPage - 1, "get")
                                    }
                                >
                                    이전
                                </Button>
                                <p>
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

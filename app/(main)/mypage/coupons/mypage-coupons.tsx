"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Scissors, Gift } from "lucide-react";

interface Coupon {
    couponId: number;
    name: string;
    discount: number;
    type: "PERCENTAGE_DISCOUNT" | "FIXED_DISCOUNT";
    expiryDate: string;
    amount?: number;
    received?: boolean;
}

interface CouponPageData {
    content: Coupon[];
    totalPages: number;
}

const fetchCoupons = async (
    type: "owned" | "available",
    page: number,
    token: string
): Promise<CouponPageData> => {
    const url =
        type === "owned"
            ? `/backend/user-coupons?page=${page}&size=10`
            : `/backend/community/coupon?page=${page}&size=10`;
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch coupons");
    return res.json();
};

const claimCoupon = async (couponId: number, token: string): Promise<void> => {
    const res = await fetch("/backend/user-coupons", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ couponId }),
    });
    if (!res.ok) throw new Error("Failed to claim coupon");
};

export default function CouponPage() {
    const [activeTab, setActiveTab] = useState<"owned" | "available">("owned");
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session?.user?.id_token) {
            loadCoupons();
        }
    }, [session, activeTab, currentPage]);

    const loadCoupons = async () => {
        if (!session?.user?.id_token) return;
        setLoading(true);
        try {
            const data = await fetchCoupons(
                activeTab,
                currentPage,
                session.user.id_token
            );
            setCoupons(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            toast.error("쿠폰을 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleClaimCoupon = async (couponId: number) => {
        if (!session?.user?.id_token) return;
        try {
            await claimCoupon(couponId, session.user.id_token);
            toast.success("쿠폰이 성공적으로 발급되었습니다!");
            loadCoupons();
        } catch (error) {
            toast.error("쿠폰 발급에 실패했습니다.");
        }
    };

    const CouponCard = ({ coupon }: { coupon: Coupon }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-semibold">
                                {coupon.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                                만료:{" "}
                                {new Date(
                                    coupon.expiryDate
                                ).toLocaleDateString()}
                            </p>
                        </div>
                        <Scissors className="text-primary h-6 w-6" />
                    </div>
                    <p className="text-3xl font-bold mb-2">
                        {coupon.type === "PERCENTAGE_DISCOUNT"
                            ? `${coupon.discount}% 할인`
                            : `${coupon.discount.toLocaleString()}원 할인`}
                    </p>
                    {activeTab === "available" && (
                        <Badge
                            variant={
                                coupon.amount && coupon.amount > 0
                                    ? "secondary"
                                    : "outline"
                            }
                        >
                            {coupon.amount && coupon.amount > 0
                                ? `남은 수량: ${coupon.amount}`
                                : "소진됨"}
                        </Badge>
                    )}
                </CardContent>
                {activeTab === "available" && (
                    <CardFooter className="bg-gray-50 p-4">
                        <Button
                            onClick={() => handleClaimCoupon(coupon.couponId)}
                            disabled={
                                coupon.received ||
                                (coupon.amount !== undefined &&
                                    coupon.amount <= 0)
                            }
                            className="w-full"
                        >
                            {coupon.received
                                ? "이미 받음"
                                : coupon.amount && coupon.amount > 0
                                ? "쿠폰 받기"
                                : "소진됨"}
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </motion.div>
    );

    return (
        <div className="flex justify-center h-full bg-gray-100  min-h-screen">
            <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-md space-y-10">
                <div className="flex items-center justify-between mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="p-2"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <h1 className="text-3xl font-bold flex items-center">
                        <Gift className="mr-2" /> 내 쿠폰
                    </h1>
                    <div className="w-10" /> {/* Spacer for alignment */}
                </div>

                <Tabs
                    value={activeTab}
                    onValueChange={(value) =>
                        setActiveTab(value as "owned" | "available")
                    }
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="owned">보유 쿠폰</TabsTrigger>
                        <TabsTrigger value="available">
                            사용 가능 쿠폰
                        </TabsTrigger>
                    </TabsList>
                    <AnimatePresence mode="wait">
                        <TabsContent value={activeTab} className="mt-6">
                            {loading ? (
                                <div className="space-y-4">
                                    {[...Array(3)].map((_, index) => (
                                        <Skeleton
                                            key={index}
                                            className="h-40 w-full"
                                        />
                                    ))}
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-4"
                                >
                                    {coupons.length > 0 ? (
                                        coupons.map((coupon) => (
                                            <CouponCard
                                                key={coupon.couponId}
                                                coupon={coupon}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500">
                                            쿠폰이 없습니다.
                                        </p>
                                    )}
                                </motion.div>
                            )}
                        </TabsContent>
                    </AnimatePresence>
                </Tabs>

                {!loading && totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6">
                        <Button
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                setCurrentPage((prev) => Math.max(prev - 1, 0));
                            }}
                            disabled={currentPage === 0}
                            variant="outline"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" /> 이전
                        </Button>
                        <span className="text-sm font-medium">
                            {currentPage + 1} / {totalPages} 페이지
                        </span>
                        <Button
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages - 1)
                                );
                            }}
                            disabled={currentPage === totalPages - 1}
                            variant="outline"
                        >
                            다음 <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

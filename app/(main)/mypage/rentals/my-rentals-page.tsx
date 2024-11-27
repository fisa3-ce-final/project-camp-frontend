"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { RentalItemPageData } from "@/app/types/my-rental-item";
import { categoryMapEngToKor } from "@/app/types/category-map";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ChevronLeft,
    ChevronRight,
    Package,
    Calendar,
    AlertCircle,
} from "lucide-react";

async function fetchRentalData(
    page: number,
    idToken: string
): Promise<RentalItemPageData> {
    const response = await fetch(
        `/backend/rental-items/my-rental-items?page=${page}&size=10`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
            },
            cache: "no-cache",
        }
    );
    if (!response.ok) throw new Error("데이터를 불러오는 데 실패했습니다.");
    return response.json();
}

export default function MyRentalsPage() {
    const [rentalData, setRentalData] = useState<RentalItemPageData | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        const loadRentalData = async () => {
            if (!session?.user?.id_token) return;
            setLoading(true);
            try {
                const data = await fetchRentalData(
                    currentPage,
                    session.user.id_token
                );
                setRentalData(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "알 수 없는 오류가 발생했습니다."
                );
            } finally {
                setLoading(false);
            }
        };
        loadRentalData();
    }, [currentPage, session?.user?.id_token]);

    const handlePageChange = (newPage: number) => setCurrentPage(newPage);

    if (error) {
        return (
            <div className="flex justify-center h-full bg-gray-100">
                <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-md space-y-10">
                    <Card className="w-full">
                        <CardContent className="pt-6 text-center">
                            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
                            <p className="text-xl font-semibold text-red-500">
                                ❌ 오류: {error}
                            </p>
                        </CardContent>
                    </Card>
                </div>
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
                        <h1 className="text-xl font-bold md:text-3xl">
                            🛒 대여중인 물품
                        </h1>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                {[...Array(3)].map((_, index) => (
                                    <Card key={index} className="w-full">
                                        <CardHeader>
                                            <Skeleton className="h-6 w-3/4" />
                                            <Skeleton className="h-4 w-1/2 mt-2" />
                                        </CardHeader>
                                        <CardContent>
                                            <Skeleton className="h-4 w-full mb-2" />
                                            <Skeleton className="h-4 w-3/4 mb-2" />
                                            <Skeleton className="h-4 w-1/2" />
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
                                {rentalData?.content.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className="w-full hover:shadow-lg transition-shadow duration-300">
                                            <CardHeader>
                                                <CardTitle className="flex items-center">
                                                    <Package className="mr-2 h-5 w-5" />
                                                    {item.rentalItem}
                                                </CardTitle>
                                                <CardDescription>
                                                    카테고리:{" "}
                                                    {
                                                        categoryMapEngToKor[
                                                            item.category
                                                        ]
                                                    }
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium">
                                                            수량:
                                                        </span>
                                                        <span>
                                                            {item.quantity}개
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium">
                                                            대여 상태:
                                                        </span>
                                                        <Badge
                                                            variant={
                                                                item.orderStatus ===
                                                                "COMPLETED"
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                        >
                                                            {item.orderStatus}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Calendar className="mr-2 h-4 w-4" />
                                                        <span className="font-medium">
                                                            대여일:
                                                        </span>
                                                        <span className="ml-auto">
                                                            {new Date(
                                                                item.rentalDate
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Calendar className="mr-2 h-4 w-4" />
                                                        <span className="font-medium">
                                                            반납 예정일:
                                                        </span>
                                                        <span className="ml-auto">
                                                            {new Date(
                                                                item.returnDate
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!loading && rentalData && (
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
                                {rentalData.totalPages}
                            </p>
                            <Button
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={
                                    currentPage >= rentalData.totalPages - 1
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

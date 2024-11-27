"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    categoryMapEngToKor,
    statusColorMapping,
    statusMapping,
} from "@/app/types/category-map";
import { ChevronLeft, ChevronRight, Package, Calendar } from "lucide-react";
import { toast } from "sonner";

interface RentalItem {
    rentalItem: string;
    category: string;
    status: string;
    stock: number;
    rentalDate: string;
}

interface RentalItemsResponse {
    content: RentalItem[];
    totalPages: number;
}

const fetchRentalItems = async (
    page: number,
    token: string
): Promise<RentalItemsResponse> => {
    const response = await fetch(
        `/backend/rental-items/my-items?page=${page}&size=10`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );
    if (!response.ok)
        throw new Error(`Failed to fetch: ${response.statusText}`);
    return response.json();
};

export default function MyItemsPage() {
    const [rentalItemsData, setRentalItemsData] =
        useState<RentalItemsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session?.user?.id_token) {
            loadRentalItems();
        }
    }, [session, currentPage]);

    const loadRentalItems = async () => {
        if (!session?.user?.id_token) return;
        setLoading(true);
        try {
            const data = await fetchRentalItems(
                currentPage,
                session.user.id_token
            );
            setRentalItemsData(data);
        } catch (error) {
            console.error("Error fetching rental items:", error);
            toast.error("물품 목록을 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const RentalItemCard = ({ item }: { item: RentalItem }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="shadow-md border hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>{categoryMapEngToKor[item.category]}</span>
                        <Badge
                            className={`text-white ${
                                statusColorMapping[item.status] === "yellow"
                                    ? "bg-yellow-500"
                                    : statusColorMapping[item.status] ===
                                      "green"
                                    ? "bg-green-500"
                                    : "bg-gray-500"
                            }`}
                        >
                            {statusMapping[item.status] || item.status}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="flex items-center mb-2">
                        <Package className="mr-2 h-4 w-4" />
                        재고: {item.stock}
                    </p>
                    <p className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        등록일: {new Date(item.rentalDate).toLocaleDateString()}
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    );

    return (
        <div className="flex justify-center h-full bg-gray-100 min-h-screen">
            <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-md space-y-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="p-2"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <h1 className="text-3xl font-bold flex items-center">
                            <Package className="mr-2" /> 내가 등록한 물품
                        </h1>
                        <div className="w-10" /> {/* Spacer for alignment */}
                    </div>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                            >
                                {[...Array(6)].map((_, index) => (
                                    <Card
                                        key={index}
                                        className="shadow-md border"
                                    >
                                        <CardHeader>
                                            <Skeleton className="h-6 w-24" />
                                        </CardHeader>
                                        <CardContent>
                                            <Skeleton className="h-4 w-20 mb-2" />
                                            <Skeleton className="h-4 w-32" />
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
                                className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                            >
                                {rentalItemsData?.content.map((item) => (
                                    <RentalItemCard
                                        key={item.rentalItem}
                                        item={item}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!loading && rentalItemsData && (
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
                                <ChevronLeft className="h-4 w-4 mr-2" /> 이전
                            </Button>
                            <span className="text-sm font-medium">
                                페이지 {currentPage + 1} /{" "}
                                {rentalItemsData.totalPages}
                            </span>
                            <Button
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={
                                    currentPage >=
                                    rentalItemsData.totalPages - 1
                                }
                                variant="outline"
                            >
                                다음 <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

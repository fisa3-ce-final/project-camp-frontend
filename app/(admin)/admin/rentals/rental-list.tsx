"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Rental, RentalResponse } from "@/app/types/admin-rental";
import { categoryMapEngToKor } from "@/app/types/category-map";

const RentalList: React.FC = () => {
    const [data, setData] = useState<RentalResponse | null>(null);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [page]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `/backend/admin/rentals/all?page=${page}&size=10`
            );
            const jsonData: RentalResponse = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
        } finally {
            setLoading(false);
        }
    };

    const tableVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const tableRowVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8  min-h-screen"
        >
            <Card className="w-full max-w-6xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-primary">
                        대여 이용 현황
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-bold">
                                        대여 ID
                                    </TableHead>
                                    <TableHead className="font-bold">
                                        사용자 이름
                                    </TableHead>
                                    <TableHead className="font-bold">
                                        대여 물품
                                    </TableHead>
                                    <TableHead className="font-bold">
                                        카테고리
                                    </TableHead>
                                    <TableHead className="font-bold">
                                        대여일
                                    </TableHead>
                                    <TableHead className="font-bold">
                                        반납일
                                    </TableHead>
                                    <TableHead className="font-bold">
                                        상태
                                    </TableHead>
                                    <TableHead className="font-bold">
                                        가격
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence mode="wait">
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={8}>
                                                <div className="space-y-2">
                                                    {[...Array(5)].map(
                                                        (_, index) => (
                                                            <Skeleton
                                                                key={index}
                                                                className="h-12 w-full"
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        <motion.tbody
                                            variants={tableVariants}
                                            initial="hidden"
                                            animate="show"
                                        >
                                            {data?.content.map((rental) => (
                                                <motion.tr
                                                    key={`${rental.rentalId}_${rental.userId}_${rental.returnDate}`}
                                                    variants={tableRowVariants}
                                                    initial="hidden"
                                                    animate="show"
                                                    exit="hidden"
                                                    className="hover:bg-gray-100 transition-colors duration-200"
                                                >
                                                    <TableCell>
                                                        {rental.rentalId}
                                                    </TableCell>
                                                    <TableCell>
                                                        {rental.userName}
                                                    </TableCell>
                                                    <TableCell>
                                                        {rental.rentalItemName}
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            categoryMapEngToKor[
                                                                rental
                                                                    .rentalItemCategory
                                                            ]
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(
                                                            new Date(
                                                                rental.rentalDate
                                                            ),
                                                            "yyyy-MM-dd"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(
                                                            new Date(
                                                                rental.returnDate
                                                            ),
                                                            "yyyy-MM-dd"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                                rental.status ===
                                                                "ACTIVE"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : rental.status ===
                                                                      "OVERDUE"
                                                                    ? "bg-red-100 text-red-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                            }`}
                                                        >
                                                            {rental.status}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        $
                                                        {rental.price.toFixed(
                                                            2
                                                        )}
                                                    </TableCell>
                                                </motion.tr>
                                            ))}
                                        </motion.tbody>
                                    )}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </div>
                    {data && (
                        <motion.div
                            className="mt-6 flex justify-between items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button
                                onClick={() =>
                                    setPage((prev) => Math.max(0, prev - 1))
                                }
                                disabled={page === 0}
                                className="flex items-center transition-all duration-300 hover:bg-primary hover:text-white"
                            >
                                <ChevronLeft className="mr-2 h-4 w-4" /> 이전
                            </Button>
                            <span className="text-sm font-medium">
                                페이지 {page + 1} / {data.totalPages}
                            </span>
                            <Button
                                onClick={() =>
                                    setPage((prev) =>
                                        Math.min(data.totalPages - 1, prev + 1)
                                    )
                                }
                                disabled={page === data.totalPages - 1}
                                className="flex items-center transition-all duration-300 hover:bg-primary hover:text-white"
                            >
                                다음 <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </motion.div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default RentalList;

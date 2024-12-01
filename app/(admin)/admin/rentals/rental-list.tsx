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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Rental, RentalResponse } from "@/app/types/admin-rental";

interface RentalListProps {
    idToken: string;
}

const RentalList: React.FC<RentalListProps> = ({ idToken }) => {
    const [data, setData] = useState<RentalResponse | null>(null);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<Set<number>>(new Set());

    const statusMap: Record<string, string> = {
        COMPLETED: "완료",
        PENDING: "대기",
        CANCELLED: "취소",
        RENTED: "대여 중",
        RETURNED: "반납됨",
        OVERDUE: "연체",
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `/backend/admin/rentals?page=${page}&size=20`,
                {
                    method: "GET",
                    cache: "no-store",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("데이터를 불러오는 중 오류 발생");
            }
            const jsonData: RentalResponse = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error("데이터 로드 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (orderId: number) => {
        setUpdating((prev) => new Set(prev).add(orderId));
        try {
            const response = await fetch(
                `/backend/admin/rentals/${orderId}?status=RETURNED`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("반납 처리 실패");
            }
            // Optimistic UI 업데이트
            setData((prevData) => {
                if (!prevData) return prevData;
                const updatedContent = prevData.content.map((rental) =>
                    rental.orderId === orderId
                        ? { ...rental, status: "RETURNED" }
                        : rental
                );
                return { ...prevData, content: updatedContent };
            });
        } catch (error) {
            console.error("반납 처리 중 오류 발생:", error);
        } finally {
            setUpdating((prev) => {
                const updated = new Set(prev);
                updated.delete(orderId);
                return updated;
            });
        }
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
            className="p-8 min-h-screen"
        >
            <Card className="w-full max-w-6xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-primary">
                        대여 내역 관리 🚀
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>대여 ID</TableHead>
                                    <TableHead>사용자 이름</TableHead>
                                    <TableHead>대여일</TableHead>
                                    <TableHead>반납일</TableHead>
                                    <TableHead>상태</TableHead>
                                    <TableHead>가격</TableHead>
                                    <TableHead>액션</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={7}>
                                                <Skeleton className="h-10 w-full" />
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        data?.content.map((rental) => (
                                            <motion.tr
                                                key={rental.orderId}
                                                variants={tableRowVariants}
                                                initial="hidden"
                                                animate="show"
                                                className="hover:bg-gray-50"
                                            >
                                                <TableCell>
                                                    {rental.orderId}
                                                </TableCell>
                                                <TableCell>
                                                    {rental.userName}
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
                                                    <Badge>
                                                        {statusMap[
                                                            rental.status
                                                        ] || rental.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    ${rental.price.toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        onClick={() =>
                                                            handleReturn(
                                                                rental.orderId
                                                            )
                                                        }
                                                        disabled={
                                                            rental.status ===
                                                                "RETURNED" ||
                                                            updating.has(
                                                                rental.orderId
                                                            )
                                                        }
                                                        className="bg-blue-500 text-white hover:bg-blue-600"
                                                    >
                                                        {updating.has(
                                                            rental.orderId
                                                        )
                                                            ? "처리 중..."
                                                            : "반납 처리"}
                                                    </Button>
                                                </TableCell>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </div>
                    {data && (
                        <div className="flex justify-between mt-4">
                            <Button
                                onClick={() =>
                                    setPage((prev) => Math.max(prev - 1, 0))
                                }
                                disabled={page === 0}
                            >
                                <ChevronLeft className="mr-2" /> 이전
                            </Button>
                            <span>
                                페이지 {page + 1} / {data.totalPages}
                            </span>
                            <Button
                                onClick={() =>
                                    setPage((prev) =>
                                        Math.min(prev + 1, data.totalPages - 1)
                                    )
                                }
                                disabled={page === data.totalPages - 1}
                            >
                                다음 <ChevronRight className="ml-2" />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default RentalList;

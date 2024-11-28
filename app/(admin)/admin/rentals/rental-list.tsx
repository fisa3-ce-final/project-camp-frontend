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
import { Rental, RentalResponse } from "@/app/types/admin-rental";
import { categoryMapEngToKor } from "@/app/types/category-map";

const RentalList: React.FC = () => {
    const [data, setData] = useState<RentalResponse | null>(null);
    const [page, setPage] = useState(0);

    useEffect(() => {
        fetchData();
    }, [page]);

    const fetchData = async () => {
        try {
            const response = await fetch(
                `/backend/admin/rentals/all?page=${page}&size=10`
            );
            const jsonData: RentalResponse = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">대여 이용 현황</h1>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>대여 ID</TableHead>
                            <TableHead>사용자 이름</TableHead>
                            <TableHead>대여 물품</TableHead>
                            <TableHead>카테고리</TableHead>
                            <TableHead>대여일</TableHead>
                            <TableHead>반납일</TableHead>
                            <TableHead>상태</TableHead>
                            <TableHead>가격</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence>
                            {data?.content.map((rental) => (
                                <motion.tr
                                    key={
                                        rental.rentalId +
                                        "_" +
                                        rental.userId +
                                        "_" +
                                        rental.returnDate
                                    }
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <TableCell>{rental.rentalId}</TableCell>
                                    <TableCell>{rental.userName}</TableCell>
                                    <TableCell>
                                        {rental.rentalItemName}
                                    </TableCell>
                                    <TableCell>
                                        {
                                            categoryMapEngToKor[
                                                rental.rentalItemCategory
                                            ]
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {format(
                                            new Date(rental.rentalDate),
                                            "yyyy-MM-dd"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {format(
                                            new Date(rental.returnDate),
                                            "yyyy-MM-dd"
                                        )}
                                    </TableCell>
                                    <TableCell>{rental.status}</TableCell>
                                    <TableCell>
                                        ${rental.price.toFixed(2)}
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>
            {data && (
                <div className="mt-4 flex justify-between items-center">
                    <Button
                        onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                        disabled={page === 0}
                    >
                        이전
                    </Button>
                    <span>
                        페이지 {page + 1} / {data.totalPages}
                    </span>
                    <Button
                        onClick={() =>
                            setPage((prev) =>
                                Math.min(data.totalPages - 1, prev + 1)
                            )
                        }
                        disabled={page === data.totalPages - 1}
                    >
                        다음
                    </Button>
                </div>
            )}
        </div>
    );
};

export default RentalList;

"use client";

import { FC, useEffect, useState } from "react";
import { RentalItemsResponse } from "@/app/types/my-items";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import clsx from "clsx"; // 클래스 조건부 적용을 위한 패키지 (설치 필요)
import {
    categoryMapEngToKor,
    statusColorMapping,
    statusMapping,
} from "@/app/types/category-map"; // 카테고리 매핑 임포트
import { useRouter } from "next/navigation";

interface RentalItemsPageProps {
    idToken: string;
}

const MyItemsPage: FC<RentalItemsPageProps> = ({ idToken }) => {
    const [rentalItemsData, setRentalItemsData] =
        useState<RentalItemsResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0); // 현재 페이지 상태
    const router = useRouter();

    const fetchRentalItems = async (page: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `/backend/rental-items/my-items?page=${page}&size=10`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                    cache: "no-cache",
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }

            const data: RentalItemsResponse = await response.json();
            setRentalItemsData(data);
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRentalItems(currentPage);
    }, [currentPage, idToken]);

    const handleNextPage = () => {
        if (rentalItemsData && currentPage < rentalItemsData.totalPages - 1) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 10 }).map((_, index) => (
                    <Card key={index} className="shadow-md border">
                        <CardHeader>
                            <CardTitle>
                                <Skeleton className="h-6 w-24" />
                            </CardTitle>
                            <Badge>
                                <Skeleton className="h-4 w-16" />
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-20 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) return <p>❌ Error: {error}</p>;

    return (
        <div className="p-4">
            <Button
                variant="outline"
                onClick={() => router.back()}
                className="mb-4"
            >
                ← 뒤로가기
            </Button>
            <h1 className="text-2xl font-bold mb-4">
                📦 내가 등록한 물품 목록
            </h1>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {rentalItemsData?.content.map((item) => (
                    <Card key={item.rentalItem} className="shadow-md border">
                        <CardHeader>
                            <CardTitle>
                                {/* 카테고리 영어값을 한글로 변환하여 표시 */}
                                {categoryMapEngToKor[item.category]}
                            </CardTitle>
                            <Badge
                                className={clsx(
                                    "text-white",
                                    statusColorMapping[item.status] ===
                                        "yellow" && "bg-yellow-500",
                                    statusColorMapping[item.status] ===
                                        "green" && "bg-green-500"
                                )}
                            >
                                {statusMapping[item.status] || item.status}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <p>📦 재고: {item.stock}</p>
                            <p>
                                📅 등록일:{" "}
                                {new Date(item.rentalDate).toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {/* 페이징 버튼 추가 */}
            <div className="flex justify-center items-center mt-4 space-x-4">
                <Button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 0}
                    className="disabled:opacity-50"
                >
                    이전
                </Button>
                <span>
                    페이지 {currentPage + 1} / {rentalItemsData?.totalPages}
                </span>
                <Button
                    onClick={handleNextPage}
                    disabled={
                        rentalItemsData
                            ? currentPage >= rentalItemsData.totalPages - 1
                            : true
                    }
                    className="disabled:opacity-50"
                >
                    다음
                </Button>
            </div>
        </div>
    );
};

export default MyItemsPage;

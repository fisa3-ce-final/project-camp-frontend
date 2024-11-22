"use client";

import { FC, useState, useEffect } from "react";
import { RentalItemPageData } from "@/app/types/my-rental-item";
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
import { useRouter } from "next/navigation";

interface MyRentalsPageProps {
    idToken: string;
}

const MyRentalsPage: FC<MyRentalsPageProps> = ({ idToken }) => {
    const [rentalData, setRentalData] = useState<RentalItemPageData | null>(
        null
    );
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0); // 현재 페이지 상태
    const router = useRouter();

    const fetchData = async (page: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `/backend/rental-items/my-rental-items?page=${page}&size=10`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                    cache: "no-store",
                }
            );

            if (!response.ok) {
                throw new Error("데이터를 불러오는 데 실패했습니다.");
            }

            const data: RentalItemPageData = await response.json();
            setRentalData(data);
        } catch (err: any) {
            setError(err.message || "알 수 없는 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage); // 현재 페이지의 데이터를 가져옴
    }, [currentPage]);

    const handleNextPage = () => {
        if (rentalData && currentPage < rentalData.totalPages - 1) {
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
            <Card className="shadow-lg">
                <CardHeader>
                    {/* Replace CardTitle with a div or span */}
                    <div className="card-title">
                        <Skeleton className="h-6 w-32" />
                    </div>
                    {/* Replace CardDescription with a div or span */}
                    <div className="card-description">
                        <Skeleton className="h-4 w-24" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-2">
                        <Skeleton className="h-4 w-40" />
                    </div>
                    <div className="mb-2">
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="mb-2">
                        <Skeleton className="h-4 w-36" />
                    </div>
                    <Skeleton className="h-4 w-28" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return <p>❌ 오류: {error}</p>;
    }

    return (
        <div className="p-4">
            <Button
                variant="outline"
                onClick={() => router.back()}
                className="mb-4"
            >
                ← 뒤로가기
            </Button>
            <h1 className="text-2xl font-bold mb-4">🛒 대여중인 물품</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rentalData?.content.map((item, index) => (
                    <Card key={index} className="shadow-lg">
                        <CardHeader>
                            <CardTitle>{item.rentalItem} 🌟</CardTitle>
                            <CardDescription>
                                카테고리: {item.category}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-2">
                                <strong>수량:</strong> {item.quantity}개
                            </div>
                            <div className="mb-2 flex items-center">
                                <strong>대여 상태:</strong>{" "}
                                <Badge className="ml-2">
                                    {item.orderStatus}
                                </Badge>
                            </div>
                            <div className="mb-2">
                                <strong>대여일:</strong>{" "}
                                {new Date(item.rentalDate).toLocaleDateString()}
                            </div>
                            <div className="mb-2">
                                <strong>반납 예정일:</strong>{" "}
                                {new Date(item.returnDate).toLocaleDateString()}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="mt-4 flex justify-between items-center">
                <Button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 0}
                    className="disabled:opacity-50"
                >
                    이전
                </Button>
                <div>
                    페이지 {currentPage + 1} / {rentalData?.totalPages}
                </div>
                <Button
                    onClick={handleNextPage}
                    disabled={
                        rentalData
                            ? currentPage >= rentalData.totalPages - 1
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

export default MyRentalsPage;

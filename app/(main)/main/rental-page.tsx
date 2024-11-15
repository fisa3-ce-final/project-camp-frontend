"use client";

import { FC, useState, useEffect } from "react";
import Link from "next/link";
import { MainSidebar } from "@/app/components/main-sidebar";
import { Button } from "@/components/ui/button";
import { RentalItemCard } from "@/app/components/rental-item-card";
import { RentalPageData } from "@/app/types/rental-item";

export interface RentalPageProps {
    rentalPageData: RentalPageData;
}

const RentalPage: FC<RentalPageProps> = ({ rentalPageData }) => {
    const [rentalItems, setRentalItems] = useState(rentalPageData.content);
    const [pageable, setPageable] = useState(rentalPageData.pageable);
    const [totalPages, setTotalPages] = useState(rentalPageData.totalPages);
    const [page, setPage] = useState(pageable.pageNumber + 1);
    const [searchQuery, setSearchQuery] = useState("");

    // 현재 페이지 그룹의 시작 페이지 계산
    const currentPageGroup = Math.floor((page - 1) / 10);
    const startPage = currentPageGroup * 10 + 1;
    const endPage = Math.min(startPage + 9, totalPages);

    const handleSearch = () => {
        console.log("검색어:", searchQuery);
        fetchData(1); // 검색어 입력 후 첫 페이지로 이동
    };

    const handleCategorySelect = (category: string) => {
        console.log("Selected category:", category);
        fetchData(1); // 카테고리 선택 시 첫 페이지로 이동
    };

    const fetchData = async (pageNumber: number) => {
        try {
            const response = await fetch(
                `/backend/rental-items/category/all?page=${
                    pageNumber - 1
                }&size=10`,
                {
                    method: "GET",
                    cache: "no-cache",
                }
            );
            const data: RentalPageData = await response.json();
            setRentalItems(data.content);
            setPageable(data.pageable);
            setTotalPages(data.totalPages);
            setPage(pageNumber);
        } catch (error) {
            console.error("Failed to fetch rental items:", error);
        }
    };

    const handlePageChange = (newPage: number) => {
        fetchData(newPage);
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <aside className="hidden md:block w-full md:w-1/4 bg-gray-100 p-4 border-b md:border-b-0 md:border-r">
                <MainSidebar onCategorySelect={handleCategorySelect} />
            </aside>
            <main className="flex-1 p-4">
                <div className="flex items-center w-full gap-2 mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="검색어를 입력하세요"
                        className="border rounded-md px-4 py-2 w-full"
                    />
                    <Button onClick={handleSearch}>검색</Button>
                    <Link href="/main/write">
                        <Button>글쓰기</Button>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rentalItems.map((item) => (
                        <Link href={`/main/detail/${item.id}`} key={item.id}>
                            <RentalItemCard
                                name={item.name}
                                price={item.price}
                                rating={4.8} // 예시 고정 값
                                category={item.category}
                            />
                        </Link>
                    ))}
                </div>
                {/* 페이지네이션 버튼 */}
                <div className="flex justify-center mt-4 space-x-2">
                    {startPage > 1 && (
                        <Button
                            onClick={() => handlePageChange(startPage - 10)}
                        >
                            이전
                        </Button>
                    )}
                    {Array.from(
                        { length: endPage - startPage + 1 },
                        (_, index) => (
                            <Button
                                key={index}
                                onClick={() =>
                                    handlePageChange(startPage + index)
                                }
                                variant={
                                    page === startPage + index
                                        ? "default"
                                        : "outline"
                                }
                            >
                                {startPage + index}
                            </Button>
                        )
                    )}
                    {endPage < totalPages && (
                        <Button
                            onClick={() => handlePageChange(startPage + 10)}
                        >
                            다음
                        </Button>
                    )}
                </div>
            </main>
        </div>
    );
};

export default RentalPage;

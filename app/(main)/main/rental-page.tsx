"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { MainSidebar } from "@/app/components/main-sidebar";
import { Button } from "@/components/ui/button";
import { RentalItemCard } from "@/app/components/rental-item-card";
import { categoryMap, categoryMapEngToKor } from "@/app/types/category-map";
import { RentalPageData } from "@/app/types/rental-item";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { headers } from "next/headers";

export interface RentalPageProps {
    rentalPageData: RentalPageData;
}

const RentalPage: FC<RentalPageProps> = ({ rentalPageData }) => {
    const [rentalItems, setRentalItems] = useState(rentalPageData.content);
    const [pageable, setPageable] = useState(rentalPageData.pageable);
    const [totalPages, setTotalPages] = useState(rentalPageData.totalPages);
    const [page, setPage] = useState(pageable.pageNumber + 1);
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("ALL");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { data: session } = useSession();

    // 현재 페이지 그룹의 시작 페이지 계산
    const currentPageGroup = Math.floor((page - 1) / 10);
    const startPage = currentPageGroup * 10 + 1;
    const endPage = Math.min(startPage + 9, totalPages);

    const handleSearch = () => {
        console.log("검색어:", searchQuery);
        setCategory("ALL");
        fetchData("ALL", 1); // 검색어 입력 후 첫 페이지로 이동
    };

    const handleCategorySelect = (selectedCategoryEng: string) => {
        console.log("Selected category:", selectedCategoryEng);

        setCategory(selectedCategoryEng);
        fetchData(selectedCategoryEng, 1); // 카테고리 선택 시 첫 페이지로 이동
    };

    const fetchData = async (_category: string, pageNumber: number) => {
        console.log("Fetching data for category:", _category);
        try {
            const response = await fetch(
                `/backend/rental-items/category/${_category}?page=${
                    pageNumber - 1
                }&size=10`,
                {
                    method: "GET",
                    cache: "no-cache",
                    headers: {
                        Authorization: `Bearer ${session?.user.id_token}`,
                    },
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
        fetchData(category, newPage);
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Sidebar */}
            <MainSidebar
                onCategorySelect={handleCategorySelect}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            {/* Main Content */}
            <main className="flex-1 p-4 overflow-y-auto">
                {/* Mobile Header */}
                <div className="flex items-center justify-between md:hidden mb-4">
                    <Button
                        onClick={() => setIsSidebarOpen(true)}
                        variant="ghost"
                        className="p-2"
                        aria-label="메뉴 열기"
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                    <h1 className="text-lg font-semibold">렌탈 아이템</h1>
                </div>
                {/* Search and Actions */}
                <div className="flex flex-col md:flex-row items-center w-full gap-4 mb-6">
                    <div className="flex-1 w-full">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="검색어를 입력하세요"
                            className="border rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex space-x-2 w-full md:w-auto">
                        <Button
                            onClick={handleSearch}
                            className="w-full md:w-auto"
                        >
                            검색
                        </Button>
                        <Link href="/main/write" className="w-full md:w-auto">
                            <Button
                                variant="default"
                                className="w-full md:w-auto"
                            >
                                글쓰기
                            </Button>
                        </Link>
                    </div>
                </div>
                {/* Rental Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rentalItems.map((item) => (
                        <Link
                            href={`/main/detail/${item.rentalId}`}
                            key={"main_detail_" + item.rentalId}
                        >
                            <RentalItemCard
                                userImageUrl={
                                    item.userImageUrl || "/logo-img.png"
                                }
                                rentalImageUrl={
                                    item.rentalImageUrl === "이미지 없음"
                                        ? "https://images.unsplash.com/photo-1544077960-604201fe74bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1651&q=80"
                                        : item.rentalImageUrl
                                }
                                nickname={item.nickname || "N/A"}
                                name={item.rentalItemName}
                                price={item.price}
                                rating={item.ratingAvg} // 예시 고정 값
                                category={categoryMapEngToKor[item.category]}
                            />
                        </Link>
                    ))}
                </div>
                {/* 페이지네이션 버튼 */}
                <div className="flex justify-center mt-6 space-x-2 flex-wrap">
                    {startPage > 1 && (
                        <Button
                            onClick={() => handlePageChange(startPage - 10)}
                            className="mb-2"
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
                                className="mb-2"
                            >
                                {startPage + index}
                            </Button>
                        )
                    )}
                    {endPage < totalPages && (
                        <Button
                            onClick={() => handlePageChange(startPage + 10)}
                            className="mb-2"
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

"use client";

import { FC, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { MainSidebar } from "@/app/components/main-sidebar";
import { Button } from "@/components/ui/button";
import { RentalItemCard } from "@/app/components/rental-item-card";
import { categoryMapEngToKor } from "@/app/types/category-map";
import { RentalPageData } from "@/app/types/rental-item";
import { Menu, Search, Plus } from "lucide-react";
import debounce from "lodash.debounce";
import { Input } from "@/components/ui/input";

export interface RentalPageProps {
    rentalPageData: RentalPageData;
    idToken: string;
    initialSearchQuery: string;
    initialCategory: string;
    initialPage: number;
}

const RentalPage: FC<RentalPageProps> = ({
    rentalPageData,
    idToken,
    initialSearchQuery,
    initialCategory,
    initialPage,
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [rentalItems, setRentalItems] = useState(rentalPageData.content);
    const [pageable, setPageable] = useState(rentalPageData.pageable);
    const [totalPages, setTotalPages] = useState(rentalPageData.totalPages);
    const [page, setPage] = useState(initialPage);
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
    const [category, setCategory] = useState(initialCategory);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 현재 페이지 그룹의 시작 페이지 계산
    const currentPageGroup = Math.floor((page - 1) / 10);
    const startPage = currentPageGroup * 10 + 1;
    const endPage = Math.min(startPage + 9, totalPages);

    // 데이터 페칭 함수
    const fetchData = async (
        _category: string,
        pageNumber: number,
        _searchQuery: string = ""
    ) => {
        setIsLoading(true);
        setError(null);
        console.log(
            "Fetching data for category:",
            _category,
            "with search query:",
            _searchQuery
        );
        try {
            let url = "";
            if (_searchQuery.trim() !== "") {
                // 검색 API 사용
                url = `/backend/rental-items/search/${encodeURIComponent(
                    _searchQuery.trim()
                )}?page=${pageNumber - 1}&size=10`;
            } else {
                // 카테고리 기반 API 사용
                url = `/backend/rental-items/category/${_category}?page=${
                    pageNumber - 1
                }&size=10`;
            }

            const response = await fetch(url, {
                method: "GET",
                cache: "no-cache",
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data: RentalPageData = await response.json();

            setRentalItems(data.content);
            setPageable(data.pageable);
            setTotalPages(data.totalPages);
            setPage(pageNumber);

            window.scrollTo(0, 0);
        } catch (error) {
            console.error("Failed to fetch rental items:", error);
            setError("렌탈 아이템을 불러오는 데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // URL 업데이트 함수
    const updateURL = (
        currentCategory: string,
        currentPage: number,
        currentQuery: string
    ) => {
        const params = new URLSearchParams();

        if (currentCategory && currentCategory !== "ALL") {
            params.set("category", currentCategory);
        }

        if (currentQuery.trim() !== "") {
            params.set("query", currentQuery.trim());
        }

        if (currentPage > 1) {
            params.set("page", currentPage.toString());
        }

        const queryString = params.toString();
        router.push(`/main${queryString ? `?${queryString}` : ""}`);
    };

    // 검색 핸들러
    const handleSearch = () => {
        console.log("검색어:", searchQuery);
        const newCategory = searchQuery.trim() !== "" ? "SEARCH" : "ALL";
        setCategory(newCategory); // 검색 모드로 설정
        fetchData(newCategory, 1, searchQuery);
        updateURL(newCategory, 1, searchQuery);
    };

    // 카테고리 선택 핸들러
    const handleCategorySelect = (selectedCategoryEng: string) => {
        console.log("Selected category:", selectedCategoryEng);
        setCategory(selectedCategoryEng);
        setSearchQuery(""); // 카테고리 선택 시 검색어 초기화
        fetchData(selectedCategoryEng, 1, "");
        updateURL(selectedCategoryEng, 1, "");
    };

    // 페이지 변경 핸들러
    const handlePageChange = (newPage: number) => {
        fetchData(category, newPage, category === "SEARCH" ? searchQuery : "");
        updateURL(category, newPage, category === "SEARCH" ? searchQuery : "");
    };

    // 디바운스된 검색 함수
    const debouncedSearch = debounce(() => {
        handleSearch();
    }, 300);

    // 검색어 변경 시 디바운스된 함수 호출
    useEffect(() => {
        if (searchQuery.trim() !== "") {
            debouncedSearch();
        } else {
            // 검색어가 비어있으면 카테고리 "ALL"로 데이터 로드
            fetchData("ALL", 1, "");
            updateURL("ALL", 1, "");
        }

        // 클린업 함수
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchQuery]);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            <MainSidebar
                onCategorySelect={handleCategorySelect}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            <main className="flex-1 p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold">
                            렌탈 아이템
                        </h1>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                        <div className="relative w-full md:w-1/2">
                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="검색어를 입력하세요"
                                className="pl-10"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Button
                                onClick={handleSearch}
                                className="w-full md:w-auto"
                            >
                                검색
                            </Button>
                            <Link
                                href="/main/write"
                                className="w-full md:w-auto"
                            >
                                <Button variant="outline" className="w-full">
                                    <Plus className="mr-2 h-4 w-4" /> 글쓰기
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {error && <div className="text-red-500 mb-4">{error}</div>}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {rentalItems.map((item) => (
                            <motion.div
                                key={`main_detail_${item.rentalId}`}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Link href={`/main/detail/${item.rentalId}`}>
                                    <RentalItemCard
                                        userImageUrl={
                                            item.userImageUrl || "/logo-img.png"
                                        }
                                        rentalImageUrl={
                                            item.rentalImageUrl ===
                                            "이미지 없음"
                                                ? "/placeholder_rental_image.jpg"
                                                : item.rentalImageUrl
                                        }
                                        nickname={item.nickname || "N/A"}
                                        name={item.rentalItemName}
                                        price={item.price}
                                        rating={item.ratingAvg}
                                        category={
                                            categoryMapEngToKor[item.category]
                                        }
                                    />
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="flex justify-center mt-8">
                        <div className="join">
                            {startPage > 1 && (
                                <Button
                                    onClick={() =>
                                        handlePageChange(startPage - 10)
                                    }
                                    className="join-item"
                                >
                                    «
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
                                        className="mb-2 mr-2"
                                    >
                                        {startPage + index}
                                    </Button>
                                )
                            )}
                            {endPage < totalPages && (
                                <Button
                                    onClick={() =>
                                        handlePageChange(startPage + 10)
                                    }
                                    className="join-item"
                                >
                                    »
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RentalPage;

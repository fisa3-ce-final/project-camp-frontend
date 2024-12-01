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
import { Search, Plus } from "lucide-react";
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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currentPageGroup = Math.floor((page - 1) / 5);
    const startPage = currentPageGroup * 5 + 1;
    const endPage = Math.min(startPage + 4, totalPages);

    const fetchData = async (
        _category: string,
        pageNumber: number,
        _searchQuery: string = ""
    ) => {
        setIsLoading(true);
        setError(null);
        try {
            let url = "";
            if (_searchQuery.trim() !== "") {
                url = `/backend/rental-items/search/${encodeURIComponent(
                    _searchQuery.trim()
                )}?page=${pageNumber - 1}&size=10`;
            } else {
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

    const handleSearch = () => {
        const newCategory = searchQuery.trim() !== "" ? "SEARCH" : "ALL";
        setCategory(newCategory);
        fetchData(newCategory, 1, searchQuery);
        updateURL(newCategory, 1, searchQuery);
    };

    const handleCategorySelect = (selectedCategoryEng: string) => {
        setCategory(selectedCategoryEng);
        setSearchQuery("");
        fetchData(selectedCategoryEng, 1, "");
        updateURL(selectedCategoryEng, 1, "");
    };

    const handlePageChange = (newPage: number) => {
        fetchData(category, newPage, category === "SEARCH" ? searchQuery : "");
        updateURL(category, newPage, category === "SEARCH" ? searchQuery : "");
    };

    const debouncedSearch = debounce(() => {
        handleSearch();
    }, 300);

    useEffect(() => {
        if (searchQuery.trim() !== "") {
            debouncedSearch();
        } else {
            fetchData("ALL", 1, "");
            updateURL("ALL", 1, "");
        }

        return () => {
            debouncedSearch.cancel();
        };
    }, [searchQuery]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm md:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
                    <MainSidebar onCategorySelect={handleCategorySelect} />
                    <h1 className="text-2xl font-bold text-gray-900 ml-4">
                        캠핑 용품
                    </h1>
                </div>
            </header>
            <div className="flex-1 flex justify-center">
                <div className="w-full max-w-7xl flex">
                    <aside className="hidden md:block w-64">
                        <MainSidebar onCategorySelect={handleCategorySelect} />
                    </aside>
                    <main className="flex-1 p-4 md:p-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
                                <div className="flex flex-col md:flex-row items-center gap-4">
                                    <div className="relative w-full md:w-2/3">
                                        <Input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            placeholder="검색어를 입력하세요"
                                            className="pl-10"
                                        />
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                    <div className="flex gap-2 w-full md:w-1/3">
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
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                            >
                                                <Plus className="mr-2 h-4 w-4" />{" "}
                                                글쓰기
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="text-red-500 mb-4">{error}</div>
                            )}

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
                            >
                                {rentalItems.slice(0, 10).map((item) => (
                                    <motion.div
                                        key={`main_detail_${item.rentalId}`}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Link
                                            href={`/main/detail/${item.rentalId}`}
                                        >
                                            <RentalItemCard
                                                userImageUrl={
                                                    item.userImageUrl ||
                                                    "/logo-img.png"
                                                }
                                                rentalImageUrl={
                                                    item.rentalImageUrl ===
                                                    "이미지 없음"
                                                        ? "/placeholder_rental_image.jpg"
                                                        : item.rentalImageUrl
                                                }
                                                nickname={
                                                    item.nickname || "N/A"
                                                }
                                                name={item.rentalItemName}
                                                price={item.price}
                                                rating={item.ratingAvg}
                                                category={
                                                    categoryMapEngToKor[
                                                        item.category
                                                    ]
                                                }
                                            />
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>

                            <div className="flex justify-center mt-8">
                                <nav className="inline-flex rounded-md shadow">
                                    {startPage > 1 && (
                                        <Button
                                            onClick={() =>
                                                handlePageChange(startPage - 5)
                                            }
                                            className="rounded-l-md"
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
                                                    handlePageChange(
                                                        startPage + index
                                                    )
                                                }
                                                variant={
                                                    page === startPage + index
                                                        ? "default"
                                                        : "ghost"
                                                }
                                                className="px-4 py-2"
                                            >
                                                {startPage + index}
                                            </Button>
                                        )
                                    )}
                                    {endPage < totalPages && (
                                        <Button
                                            onClick={() =>
                                                handlePageChange(startPage + 5)
                                            }
                                            className="rounded-r-md"
                                        >
                                            »
                                        </Button>
                                    )}
                                </nav>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default RentalPage;

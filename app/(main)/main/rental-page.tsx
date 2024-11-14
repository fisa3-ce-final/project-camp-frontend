// app/rental/rental-page.tsx
"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { MainSidebar } from "@/app/components/main-sidebar";
import { Button } from "@/components/ui/button";
import { RentalItemCard } from "@/app/components/rental-item-card";
import { RentalPageData } from "@/app/types/rental-item";

export interface RentalPageProps {
    rentalPageData: RentalPageData;
}

const RentalPage: FC<RentalPageProps> = ({ rentalPageData }) => {
    const { content: rentalItems, pageable } = rentalPageData;
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
        console.log("검색어:", searchQuery);
    };

    const handleCategorySelect = (category: string) => {
        console.log("Selected category:", category);
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
                                rating={4.8} // 예시 고정 값, 필요시 데이터에 맞게 변경
                                category={item.category}
                                reviewCount={27} // 예시 고정 값, 필요시 데이터에 맞게 변경
                            />
                        </Link>
                    ))}
                </div>
                <div className="mt-4">
                    <p>
                        현재 페이지: {pageable.pageNumber + 1} /{" "}
                        {rentalPageData.totalPages}
                    </p>
                </div>
            </main>
        </div>
    );
};

export default RentalPage;

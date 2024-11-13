// app/page.tsx
"use client";

import Link from "next/link";
import { MainSidebar } from "@/app/components/main-sidebar";
import { MainItemCard } from "@/app/components/main-item-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RentalItemCard } from "@/app/components/rental-item-card";

export default function RentalPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
        console.log("검색어:", searchQuery);
    };

    const handleCategorySelect = (category: string) => {
        console.log("Selected category:", category);
        // 선택된 카테고리로 필요한 작업 수행
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
                    <Link href="/main/describe">
                        <RentalItemCard
                            name="Luxury Tent"
                            price={15000}
                            rating={4.8}
                            category="텐트"
                            reviewCount={27}
                        />
                    </Link>

                    <RentalItemCard
                        name="Luxury Tent"
                        price={15000}
                        rating={4.8}
                        category="텐트"
                        reviewCount={27}
                    />

                    <RentalItemCard
                        name="Luxury Tent"
                        price={15000}
                        rating={4.8}
                        category="텐트"
                        reviewCount={27}
                    />
                    <RentalItemCard
                        name="Luxury Tent"
                        price={15000}
                        rating={3.8}
                        category="텐트"
                        reviewCount={27}
                    />
                </div>
            </main>
        </div>
    );
}

"use client";

import { useState } from "react";
import { Menu,Tent, Utensils, Bed, Sofa, Sun } from "lucide-react";

interface MainSidebarProps {
    onCategorySelect: (category: string) => void;
}

export function MainSidebar({ onCategorySelect }: MainSidebarProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
        onCategorySelect(category); // 선택된 카테고리를 부모 컴포넌트로 전달
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">캠핑 용품 렌탈 품목</h2>
            <ul className="space-y-4">
                <li
                    className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                        selectedCategory === "전체 카테고리" ? "bg-blue-100" : ""
                    }`}
                    onClick={() => handleCategoryClick("전체 카테고리")}
                >
                    <Menu className="w-5 h-5" />
                    <span>전체 카테고리</span>
                </li>
                <li
                    className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                        selectedCategory === "텐트" ? "bg-blue-100" : ""
                    }`}
                    onClick={() => handleCategoryClick("텐트")}
                >
                    <Tent className="w-5 h-5" />
                    <span>텐트</span>
                </li>
                <li
                    className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                        selectedCategory === "취사도구" ? "bg-blue-100" : ""
                    }`}
                    onClick={() => handleCategoryClick("취사도구")}
                >
                    <Utensils className="w-5 h-5" />
                    <span>취사도구</span>
                </li>
                <li
                    className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                        selectedCategory === "침낭" ? "bg-blue-100" : ""
                    }`}
                    onClick={() => handleCategoryClick("침낭")}
                >
                    <Bed className="w-5 h-5" />
                    <span>침낭</span>
                </li>
                <li
                    className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                        selectedCategory === "캠핑가구" ? "bg-blue-100" : ""
                    }`}
                    onClick={() => handleCategoryClick("캠핑가구")}
                >
                    <Sofa className="w-5 h-5" />
                    <span>캠핑가구</span>
                </li>
                <li
                    className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                        selectedCategory === "조명" ? "bg-blue-100" : ""
                    }`}
                    onClick={() => handleCategoryClick("조명")}
                >
                    <Sun className="w-5 h-5" />
                    <span>조명</span>
                </li>
            </ul>
        </div>
    );
}
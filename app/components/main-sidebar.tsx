"use client";

import { useState } from "react";
import {
    Menu,
    Tent,
    Utensils,
    Bed,
    Sofa,
    Sun,
    X,
    Backpack,
} from "lucide-react";
import { categoryMap } from "@/app/types/category-map";

interface MainSidebarProps {
    onCategorySelect: (category: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

export function MainSidebar({
    onCategorySelect,
    isOpen,
    onClose,
}: MainSidebarProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );

    const handleCategoryClick = (categoryKey: string) => {
        const category = categoryMap[categoryKey] || "ALL"; // Default to "ALL" if not found
        setSelectedCategory(categoryKey);
        onCategorySelect(category); // 선택된 카테고리를 부모 컴포넌트로 전달
        onClose(); // 카테고리 선택 시 사이드바 닫기 (모바일 용)
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
                    onClick={onClose}
                ></div>
            )}
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 w-64 bg-gray-100 p-4 border-r z-50 min-h-screen transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out md:static md:min-h-screen md:translate-x-0 overflow-y-auto`}
            >
                {/* Close button for mobile */}
                <div className="flex justify-between items-center mb-4 md:hidden">
                    <h2 className="text-xl font-bold">캠핑 용품</h2>
                    <button onClick={onClose}>
                        <X className="w-6 h-6" />
                    </button>
                </div>
                {/* Sidebar content */}
                <h2 className="text-xl font-bold mb-4 md:block hidden">
                    캠핑 용품 렌탈 품목
                </h2>
                <ul className="space-y-4">
                    <li
                        className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                            selectedCategory === "전체" ? "bg-blue-100" : ""
                        }`}
                        onClick={() => handleCategoryClick("전체")}
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
                            selectedCategory === "배낭" ? "bg-blue-100" : ""
                        }`}
                        onClick={() => handleCategoryClick("배낭")}
                    >
                        <Backpack className="w-5 h-5" />
                        <span>배낭</span>
                    </li>
                    <li
                        className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                            selectedCategory === "취사 도구"
                                ? "bg-blue-100"
                                : ""
                        }`}
                        onClick={() => handleCategoryClick("취사 도구")}
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
                            selectedCategory === "캠핑 가구"
                                ? "bg-blue-100"
                                : ""
                        }`}
                        onClick={() => handleCategoryClick("캠핑 가구")}
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
        </>
    );
}

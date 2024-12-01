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
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface MainSidebarProps {
    onCategorySelect: (category: string) => void;
}

export function MainSidebar({ onCategorySelect }: MainSidebarProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("전체");
    const [isOpen, setIsOpen] = useState(false);

    const handleCategoryClick = (categoryKey: string) => {
        const category = categoryMap[categoryKey] || "ALL";
        setSelectedCategory(categoryKey);
        onCategorySelect(category);
        setIsOpen(false);
    };

    const categories = [
        { key: "전체", icon: Menu, label: "전체 카테고리" },
        { key: "텐트", icon: Tent, label: "텐트" },
        { key: "배낭", icon: Backpack, label: "배낭" },
        { key: "취사 도구", icon: Utensils, label: "취사 도구" },
        { key: "침낭", icon: Bed, label: "침낭" },
        { key: "캠핑 가구", icon: Sofa, label: "캠핑가구" },
        { key: "조명", icon: Sun, label: "조명" },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">캠핑 용품</h2>
            </div>
            <ScrollArea className="flex-grow">
                <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        렌탈 품목
                    </h3>
                    <nav>
                        <ul className="space-y-1">
                            {categories.map((cat) => (
                                <li key={cat.key}>
                                    <Button
                                        variant="ghost"
                                        className={`w-full justify-start ${
                                            selectedCategory === cat.key
                                                ? "bg-blue-100 text-blue-700"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleCategoryClick(cat.key)
                                        }
                                    >
                                        <cat.icon className="mr-2 h-4 w-4" />
                                        {cat.label}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </ScrollArea>
        </div>
    );

    return (
        <>
            {/* Mobile View */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                    <SidebarContent />
                </SheetContent>
            </Sheet>

            {/* Desktop View */}
            <aside className="hidden md:block w-64 bg-white border-r border-gray-200 h-full">
                <SidebarContent />
            </aside>
        </>
    );
}

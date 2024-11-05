// components/Sidebar.tsx
import { Tent, Utensils, Bed, Sofa, Sun } from "lucide-react";

export function MainSidebar() {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">캠핑 용품 렌탈 품목</h2>
            <ul className="space-y-6">
                <li className="flex items-center space-x-2">
                    <span>전체 카테고리</span>
                </li>
                <li className="flex items-center space-x-2">
                    <Tent className="w-5 h-5" />
                    <span>텐트</span>
                </li>
                <li className="flex items-center space-x-2">
                    <Utensils className="w-5 h-5" />
                    <span>취사도구</span>
                </li>
                <li className="flex items-center space-x-2">
                    <Bed className="w-5 h-5" />
                    <span>침낭</span>
                </li>
                <li className="flex items-center space-x-2">
                    <Sofa className="w-5 h-5" />
                    <span>캠핑가구</span>
                </li>
                <li className="flex items-center space-x-2">
                    <Sun className="w-5 h-5" />
                    <span>조명</span>
                </li>
            </ul>
        </div>
    );
}

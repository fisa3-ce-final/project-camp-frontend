// app/rental/camping-item-detail.tsx
"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { RentalItemDetailResponse } from "@/app/types/rental-item";

interface CampingItemDetailProps {
    rentalItemDetailData: RentalItemDetailResponse;
}

const CampingItemDetail: FC<CampingItemDetailProps> = ({ rentalItemDetailData }) => {
    const { title, description, price, category, viewCount, createdAt, stock, imageUrl, ratingAvg } = rentalItemDetailData;

    const handleAddToCart = () => {
        alert("장바구니에 추가되었습니다.");
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <Card className="overflow-hidden">
                <img src={imageUrl} alt={title} className="w-full h-72 object-cover" />
                
                <CardHeader className="p-4">
                    <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                    <div className="flex items-center mb-2 text-yellow-500">
                        <Star className="h-5 w-5" />
                        <span className="ml-1">{ratingAvg.toFixed(1)}</span>
                    </div>
                    <CardDescription className="text-gray-600 mt-2">
                        {category} · 조회수 {viewCount} · 등록일 {createdAt}
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="p-4 space-y-2">
                    <p className="text-xl font-semibold">1박 ₩{price.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">카테고리: {category}</p>
                    <p className="text-sm text-gray-600">재고: {stock}개</p>
                    <Badge variant="outline" className="mt-2">캠핑기어</Badge>
                </CardContent>
            </Card>

            <div className="mt-8">
                <h2 className="text-lg font-bold mb-2">상품 설명</h2>
                <p className="text-gray-700">{description}</p>
            </div>

            <Button onClick={handleAddToCart} className="w-full mt-6 bg-black text-white py-3">장바구니 담기</Button>
        </div>
    );
};

export default CampingItemDetail;

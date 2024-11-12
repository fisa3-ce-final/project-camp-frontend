"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const CampingItemDetail = () => {
  // 더미 데이터 정의
  const item = {
    id: "1",
    title: "2인용 고급 텐트",
    description: "이 텐트는 고급 소재로 제작되어 내구성이 뛰어나며 2인이 사용하기에 적합한 편안한 공간을 제공합니다.",
    price: 100000,
    category: "캠핑 용품",
    viewCount: 1234,
    createdAt: "2024-10-19",
    stock: 1,
    imageUrl: "/placeholder-image.png", // 기본 이미지 경로 (예: public 폴더 내 이미지 사용)
    ratingAvg: 4.5,
  };

  const handleAddToCart = () => {
    alert("장바구니에 추가되었습니다.");
    // 실제 장바구니 연동이 필요할 경우 이 부분에 API 호출을 추가합니다.
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex items-start space-x-6">
        <div className="flex-1">
          <CardHeader className="p-0">
            <CardTitle className="text-2xl font-bold">{item.title}</CardTitle>
            <div className="flex items-center mb-2">
              <Star className="text-yellow-500" /> <span className="ml-1 text-yellow-500">{item.ratingAvg.toFixed(1)}</span>
            </div>
          </CardHeader>

          <img src={item.imageUrl} alt={item.title} className="w-full h-auto rounded-md object-cover" />

          <CardContent>
            <p className="text-xl font-semibold">1박 ₩{item.price.toLocaleString()}</p>
            <p className="text-sm text-gray-600">카테고리: {item.category}</p>
            <p className="text-sm text-gray-600">조회 수: {item.viewCount}</p>
            <p className="text-sm text-gray-600">생성 시간: {item.createdAt}</p>
            <p className="text-sm text-gray-600">재고: {item.stock}개</p>
          </CardContent>
          <Badge variant="outline" className="mt-2">캠핑기어</Badge>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">상품 설명</h2>
        <p>{item.description}</p>
      </div>

      <Button onClick={handleAddToCart} className="w-full mt-6 bg-black text-white py-3">장바구니 담기</Button>
    </div>
  );
};

export default CampingItemDetail;

// app/community/write/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function WritePage() {
    const [itemName, setItemName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState("");  // 수량 추가
    const [price, setPrice] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        // 폼 제출 로직 추가
        console.log({
            itemName,
            category,
            description,
            quantity,
            price,
            file,
        });
    };

    return (
        <div className="w-2/3 mx-auto p-6 border rounded-md shadow-sm mt-10">
            <h1 className="text-xl font-bold mb-4">캠핑 용품 등록</h1>
            
            <label className="block text-sm font-medium mb-1">물품 이름</label>
            <Input
                placeholder="예: 2인용 텐트"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="mb-4"
            />

            <label className="block text-sm font-medium mb-1">카테고리</label>
            <Select onValueChange={(value) => setCategory(value)}>
                <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="텐트">텐트</SelectItem>
                    <SelectItem value="배낭">배낭</SelectItem>
                    <SelectItem value="침낭">침낭</SelectItem>
                    <SelectItem value="캠핑가구">캠핑가구</SelectItem>
                    <SelectItem value="조명">조명</SelectItem>
                    {/* 필요시 카테고리 추가 */}
                </SelectContent>
            </Select>

            <label className="block text-sm font-medium mt-4 mb-1">상세 설명</label>
            <Textarea
                placeholder="물품의 상태, 특징 등을 자세히 설명해주세요."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="mb-4"
            />

            <label className="block text-sm font-medium mb-1">수량</label>
            <Input
                type="number"
                placeholder="예: 10"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mb-4"
            />

            <label className="block text-sm font-medium mb-1">1일 대여 가격 (원)</label>
            <Input
                type="number"
                placeholder="예: 10000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mb-4"
            />

            <label className="block text-sm font-medium mb-1">사진 업로드</label>
            <Input
                type="file"
                onChange={handleFileChange}
                className="mb-4"
            />

            <Button onClick={handleSubmit} className="w-full">등록하기</Button>
        </div>
    );
}
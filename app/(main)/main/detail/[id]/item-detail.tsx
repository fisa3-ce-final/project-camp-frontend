// app/item/[id]/item-detail.tsx
"use client";

import { FC } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import { RentalItemDetail } from "@/app/types/rental-item";
import { categoryMapEngToKor } from "@/app/types/category-map";

interface ItemDetailProps {
    itemDetail: RentalItemDetail;
}

const ItemDetail: FC<ItemDetailProps> = ({ itemDetail }) => {
    const {
        name,
        description,
        price,
        stock,
        category,
        status,
        viewCount,
        ratingAvg,
        reviewNum,
        createdAt,
        image,
    } = itemDetail;

    return (
        <div className="p-4 flex justify-center">
            {/* 카드 형태 컨테이너 */}
            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
                <div className="flex flex-col gap-6 p-6">
                    {/* 이미지 Carousel 섹션 */}
                    <div className="w-full">
                        {image?.length > 0 ? (
                            <Carousel>
                                {image.map((imgInfo, index) => (
                                    <div
                                        key={index}
                                        className="w-full h-64 md:h-80"
                                    >
                                        <img
                                            src={imgInfo.imageUrl}
                                            alt={`${name} - ${index + 1}`}
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        ) : (
                            <div className="w-full h-64 md:h-80 bg-gray-200 flex items-center justify-center rounded-md">
                                이미지 없음
                            </div>
                        )}
                    </div>

                    {/* 상세 정보 섹션 */}
                    <div className="flex flex-col">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="secondary">
                                {categoryMapEngToKor[category]}
                            </Badge>
                        </div>

                        <h1 className="text-2xl font-bold mb-2">{name}</h1>

                        <p className="text-sm text-gray-500">
                            등록일: {new Date(createdAt).toLocaleDateString()}
                        </p>

                        <div className="mb-4">
                            <p className="text-lg font-semibold mb-1">
                                가격:{" "}
                                <span className="text-primary">{price} 원</span>
                            </p>
                            <p>재고: {stock}개</p>
                            <p>조회수: {viewCount}</p>
                            <p>
                                평점: {ratingAvg}점 ({reviewNum} 리뷰)
                            </p>
                        </div>

                        <p className="mb-4">{description}</p>

                        <div className="mt-4">
                            <Button variant="default" className="w-full">
                                대여하기
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetail;

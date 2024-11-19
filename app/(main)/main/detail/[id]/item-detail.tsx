"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { RentalItemDetail } from "@/app/types/rental-item";
import { categoryMapEngToKor } from "@/app/types/category-map";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface ItemDetailProps {
    itemDetail: RentalItemDetail;
    idToken: string;
}

const ItemDetail: FC<ItemDetailProps> = ({ itemDetail, idToken }) => {
    const {
        id,
        name,
        description,
        price,
        stock,
        category,
        viewCount,
        ratingAvg,
        reviewNum,
        createdAt,
        image,
    } = itemDetail;

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleRentButtonClick = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/backend/cart-items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({ rentalItemId: id }),
                cache: "no-cache",
            });

            if (response.ok) {
                toast.success("장바구니에 담기를 성공하였습니다!");
                router.push("/main");
            } else {
                const errorText = await response.text();
                toast.error(errorText);
                // setTimeout(() => {
                //     window.location.reload(); // 요청 실패 시 새로고침
                // }, 1000);
            }
        } catch (error) {
            toast.error("서버와의 통신 중 오류가 발생했습니다.");
            // setTimeout(() => {
            //     window.location.reload(); // 예외 발생 시 새로고침
            // }, 1000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 flex justify-center">
            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
                <div className="flex flex-col gap-6 p-6">
                    <div className="w-full flex justify-center">
                        {image?.length > 0 ? (
                            <Carousel className="w-full max-w-md">
                                <CarouselContent>
                                    {image.map((imgInfo, index) => (
                                        <CarouselItem key={"img_" + index}>
                                            <Card>
                                                <CardContent className="flex aspect-square items-center justify-center p-0">
                                                    <img
                                                        src={imgInfo.imageUrl}
                                                        alt="상품 이미지"
                                                        className="select-none"
                                                    ></img>
                                                </CardContent>
                                            </Card>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        ) : (
                            <div className="w-full h-64 md:h-80 bg-gray-200 flex items-center justify-center rounded-md">
                                이미지 없음
                            </div>
                        )}
                    </div>

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
                            <Button
                                variant="default"
                                className="w-full"
                                onClick={handleRentButtonClick}
                                disabled={isLoading} // 비활성화 상태 추가
                            >
                                {isLoading ? "대여 처리 중..." : "대여하기"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetail;

"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
import { getQueryClient } from "@/app/lib/get-query-client";
import { Star, Calendar, Package, Eye } from "lucide-react";

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
    const queryClient = getQueryClient();

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
                queryClient.invalidateQueries({
                    queryKey: ["cartQuantity"],
                });
                router.push("/main");
            } else {
                const errorText = await response.text();
                toast.error(errorText);
            }
        } catch (error) {
            toast.error("서버와의 통신 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-4 flex justify-center"
        >
            <Card className="w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 p-6">
                        {image?.length > 0 ? (
                            <Carousel className="w-full">
                                <CarouselContent>
                                    {image.map((imgInfo, index) => (
                                        <CarouselItem key={`img_${index}`}>
                                            <div className="aspect-square relative overflow-hidden rounded-lg">
                                                <img
                                                    src={imgInfo.imageUrl}
                                                    alt={`상품 이미지 ${
                                                        index + 1
                                                    }`}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="absolute left-[-5] top-1/2 transform -translate-y-1/2 -translate-x-4 z-10" />
                                <CarouselNext className="absolute right-[-5] top-1/2 transform -translate-y-1/2 translate-x-4 z-10" />
                            </Carousel>
                        ) : (
                            <div className="w-full aspect-square bg-gray-200 flex items-center justify-center rounded-lg">
                                <Package size={48} className="text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div className="md:w-1/2 p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <Badge variant="secondary" className="text-sm">
                                    {categoryMapEngToKor[category]}
                                </Badge>
                                <div className="flex items-center text-yellow-500">
                                    <Star className="w-4 h-4 mr-1" />
                                    <span>{ratingAvg.toFixed(1)}</span>
                                    <span className="text-gray-500 text-sm ml-1">
                                        ({reviewNum} 리뷰)
                                    </span>
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold mb-2">{name}</h1>
                            <p className="text-gray-600 mb-4">{description}</p>
                            <div className="flex items-center mb-2">
                                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                <p className="text-sm text-gray-500">
                                    등록일:{" "}
                                    {new Date(createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center mb-4">
                                <Eye className="w-4 h-4 mr-2 text-gray-500" />
                                <p className="text-sm text-gray-500">
                                    조회수: {viewCount}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-primary mb-4">
                                {price.toLocaleString()} 원
                                <span className="text-base font-normal text-gray-500">
                                    /일
                                </span>
                            </p>
                            <p className="mb-4 text-sm text-gray-600">
                                재고: {stock}개
                            </p>
                            <Button
                                variant="default"
                                className="w-full"
                                onClick={handleRentButtonClick}
                                disabled={isLoading}
                            >
                                {isLoading ? "담는 중..." : "장바구니 담기"}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default ItemDetail;

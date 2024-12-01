"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { categoryMapEngToKor } from "@/app/types/category-map";

interface RentalItemCardProps {
    nickname: string;
    userImageUrl: string;
    name: string;
    price: number;
    rating: number;
    category: string;
    rentalImageUrl: string;
    className?: string;
}

export function RentalItemCard({
    nickname,
    userImageUrl,
    name,
    price,
    rating,
    category,
    rentalImageUrl,
    className,
}: RentalItemCardProps) {
    const formatPrice = (price: number) => `${price.toLocaleString()}원/일`;

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={16}
                className={i < fullStars ? "text-yellow-400" : "text-gray-300"}
                fill="currentColor"
                aria-label={`${i + 1} Star`}
            />
        ));
    };

    return (
        <div className={cn("w-full max-w-sm mx-auto", className)}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-48 w-full">
                    <img
                        src={rentalImageUrl}
                        alt={name}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="p-4">
                    <div className="flex items-center space-x-3 mb-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={userImageUrl} alt={nickname} />
                            <AvatarFallback>{nickname[0]}</AvatarFallback>
                        </Avatar>
                        <p className="font-semibold text-sm">{nickname}</p>
                    </div>
                    <h2 className="font-bold text-lg mb-1 truncate">{name}</h2>
                    <p className="text-sm text-gray-600 mb-2">
                        {categoryMapEngToKor[category] || category}
                    </p>
                    <p className="font-bold text-lg text-blue-600 mb-2">
                        {formatPrice(price)}
                    </p>
                    <div className="flex items-center space-x-1">
                        {renderStars(rating)}
                        <span className="text-sm text-gray-600 ml-2">
                            ({rating.toFixed(1)})
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

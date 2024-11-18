"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react"; // Using Star icon from lucide-react
import { categoryMap, categoryMapEngToKor } from "@/app/types/category-map";

interface RentalItemCardProps {
    nickname: string;
    userImageUrl: string;
    name: string;
    price: number;
    rating: number;
    category: string;
    rentalImageUrl: string;
}

export function RentalItemCard({
    nickname,
    userImageUrl,
    name,
    price,
    rating,
    category,
    rentalImageUrl,
}: RentalItemCardProps) {
    // Helper to format price as "15,000원/일"
    const formatPrice = (price: number) => `${price.toLocaleString()}원/일`;

    // Render stars based on the rating
    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating); // Number of filled stars
        const stars = [];

        for (let i = 0; i < 5; i++) {
            stars.push(
                <Star
                    key={i}
                    size={20}
                    className={
                        i < fullStars ? "text-yellow-400" : "text-gray-300"
                    }
                    fill="currentColor" // Ensures the star is solid if filled
                    aria-label={`${i + 1} Star`}
                />
            );
        }
        return stars;
    };

    return (
        <div className="w-full">
            <div
                className="cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl max-w-sm mx-auto flex flex-col justify-between p-4"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)), url(${rentalImageUrl})`,
                    backgroundSize: "cover",
                }}
            >
                <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
                <div className="flex flex-row items-center space-x-4 z-10">
                    <Avatar className="h-10 w-10 rounded-full border-2 shrink-0">
                        <AvatarImage
                            src={userImageUrl}
                            alt="아바타"
                            className=" h-10 w-10 object-cover rounded-full"
                        />
                        <AvatarFallback className="h-10 w-10 flex items-center justify-center text-2xl font-bold text-white bg-gray-400 rounded-full"></AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <p className="font-semibold text-lg text-gray-50 relative z-10">
                            {nickname}
                        </p>
                    </div>
                </div>
                <div className="text content mt-4">
                    <h1 className="font-bold text-lg md:text-2xl text-gray-50 relative z-10">
                        {name}
                    </h1>
                    {/* 카테고리 영어 값을 한글로 변환하여 표시 */}
                    <p className="text-gray-300 text-sm mb-2">
                        {categoryMapEngToKor[category] || category}
                    </p>
                    <p className="font-bold text-xl text-gray-50 relative z-10 mb-4">
                        {formatPrice(price)}
                    </p>
                    <div className="flex items-center space-x-1 relative z-10">
                        {renderStars(rating)}
                        {/* <span className="text-sm text-gray-400 ml-2">
                            ({reviewCount})
                        </span> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

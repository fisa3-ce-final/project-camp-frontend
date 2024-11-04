// components/ItemCard.tsx
import Image from "next/image";

interface ItemCardProps {
    name: string;
    category: string;
    price: string;
}

export function MainItemCard({ name, category, price }: ItemCardProps) {
    return (
        <div className="border rounded-lg p-4 flex flex-col items-center">
            <div className="bg-gray-200 w-full h-40 mb-4 flex items-center justify-center">
                <span className="text-gray-400">이미지 없음</span>
            </div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm text-gray-500">{category}</p>
            <p className="text-lg font-bold">{price}</p>
            <button className="mt-4 px-4 py-2 bg-black text-white rounded">
                렌탈하기
            </button>
        </div>
    );
}

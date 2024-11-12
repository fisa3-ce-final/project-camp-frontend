import Link from "next/link";

interface ItemCardProps {
    name: string;
    category: string;
    price: string;
}

export function MainItemCard({ name, category, price }: ItemCardProps) {
    return (
        <div className="border rounded-lg p-4 flex flex-col justify-between h-full">
            {/* 이미지 공간 */}
            <div className="bg-gray-200 w-full h-40 mb-4 flex items-center justify-center">
                <span className="text-gray-400">이미지 없음</span>
            </div>
            
            {/* 상단 섹션 - name과 category를 왼쪽 상단에 배치 */}
            <div className="flex flex-col items-start mb-4">
                <h3 className="text-lg font-semibold">{name}</h3>
                <p className="text-sm text-gray-500">{category}</p>
            </div>

            {/* 하단 섹션 - price는 왼쪽, button은 오른쪽에 배치 */}
            <div className="flex justify-between items-center w-full">
                <p className="text-lg font-bold">{price}</p>
                <Link href="/main/describe">
                    <button className="px-4 py-2 bg-black text-white rounded">
                        렌탈하기
                    </button>
                </Link>
            </div>
        </div>
    );
}
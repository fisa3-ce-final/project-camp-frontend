// app/rental/[id]/page.tsx
import { FC } from "react";

import { RentalItemDetailResponse } from "@/app/types/rental-item";
import CampingItemDetail from "./detail-page";
import { useParams } from "next/navigation";

interface DetailPageProps {
    params: {
        id: string;
    };
}

const RentalItemDetailPage: FC<DetailPageProps> = async ({ params }) => {
    const { id } = params;

    // 서버에서 데이터 가져오기
    const response = await fetch(`http://localhost:8080/rental-items/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data: RentalItemDetailResponse = await response.json();

    // 데이터를 클라이언트 컴포넌트에 전달
    return <CampingItemDetail rentalItemDetailData={data} />;
};

export default RentalItemDetailPage;

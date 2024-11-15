// types/rental-item.ts

import { Pageable } from "./pageable";

// 대여 아이템 인터페이스
export interface RentalItem {
    nickname: string | null;
    userImageUrl: string;
    rentalId: number;
    rentalItemName: string;
    price: number;
    stock: number;
    category: string;
    status: string;
    ratingAvg: number;
}

// 페이지네이션 정보 인터페이스
export interface RentalPageData {
    content: RentalItem[];
    pageable: Pageable;
    totalElements: number;
    totalPages: number;
    last: boolean;
    size: number;
    number: number;
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}

// 대여 아이템 상세 정보 응답 인터페이스
export interface RentalItemDetailResponse {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    viewCount: number;
    createdAt: string;
    stock: number;
    imageUrl: string;
    ratingAvg: number;
}

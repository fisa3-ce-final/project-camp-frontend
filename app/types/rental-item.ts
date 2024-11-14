import { Pageable } from "./pageable";

export interface RentalItem {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: string;
    status: string;
}

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

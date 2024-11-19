import { Pageable } from "./pageable";

export interface Sort {
    sorted: boolean; // 정렬 여부
    unsorted: boolean; // 정렬되지 않음 여부
    empty: boolean; // 정렬 데이터가 비어있는지 여부
}

export interface RentalItem {
    rentalItemId: number;
    name: string;
    category: string;
    price: number;
    status: "APPROVED" | "PENDING" | "REJECTED"; // Enum-like type for status
    createdAt: string; // ISO 8601 Date String
}
// API Response Interface
export interface RentalItemsResponse {
    content: RentalItem[]; // Array of Rental Items
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

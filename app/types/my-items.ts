import { Pageable } from "./pageable";

export interface RentalItemData {
    rentalItem: string;
    category: string;
    stock: number;
    status: string;
    rentalDate: string;
}

export interface RentalItemsResponse {
    content: RentalItemData[];
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

import { Pageable } from "./pageable";

export interface RentalItem {
    rentalItem: string;
    category: string;
    quantity: number;
    orderStatus: "COMPLETED" | "PENDING" | "AVAILABLE";
    rentalDate: string;
    returnDate: string;
}

export interface RentalItemPageData {
    content: RentalItem[];
    pageable: Pageable;
    totalElements: number;
    totalPages: number;
}

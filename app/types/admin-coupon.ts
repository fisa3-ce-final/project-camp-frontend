import { Pageable } from "./pageable";

export type CouponType = "PERCENTAGE_DISCOUNT" | "FIXED_AMOUNT_DISCOUNT";

export interface Coupon {
    couponId: number;
    name: string;
    discount: number;
    type: CouponType;
    expiryDate: string;
    amount: number;
    createdAt: string;
}

export interface CouponData {
    content: Coupon[];
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

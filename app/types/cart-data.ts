export interface RentalItem {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: string;
    status: string;
    image: { imageUrl: string; imageOrder: number }[];
}

export interface CartItem {
    id: number;
    quantity: number;
    rentalItem: RentalItem;
}

export interface CartPageData {
    userId: number;
    cartItems: CartItem[];
    coupons: {
        couponId: number;
        name: string;
        discount: number;
        type: string;
        expiryDate: string;
        createdAt: string;
        used: boolean;
    }[];
}

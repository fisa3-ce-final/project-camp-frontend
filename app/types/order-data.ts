export interface OrderItem {
    rentalItemId: number;
    itemName: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface Order {
    userId: number;
    message: string;
    orderId: number;
    address: string;
    phone: string;
    orderItems: OrderItem[];
    rentalDays: number;
    totalItemPrice: number;
    discountAmount: number;
    finalPrice: number;
    createdAt: string;
    updatedAt: string;
}

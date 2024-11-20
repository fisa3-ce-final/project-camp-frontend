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

export interface Order {
    rentalItemName: string;
    category: string;
    stock: number;
    orderStatus: string;
    orderDate: string;
}

export interface OrderPageData {
    content: Order[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        offset: number;
        paged: boolean;
        unpaged: boolean;
        sort: {
            sorted: boolean;
            unsorted: boolean;
            empty: boolean;
        };
    };
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

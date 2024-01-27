export interface Cart {
    uuid?: string;
    userId?: string;
    products: CartProduct[];
    totalAmount?: number;
}

export interface CartProduct {
    productUUID: string;
    quantity: number;
    sellingPrice?: number;
}

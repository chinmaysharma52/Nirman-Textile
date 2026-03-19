export type Product = {
  _id: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  category?: string;
  createdAt?: string;
};

export type OrderAddress = {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  pincode: string;
};

export type OrderItem = {
  product: string;
  quantity: number;
};

export type Order = {
  _id: string;
  items: {
    product: Product | string;
    quantity: number;
  }[];
  totalPrice: number;
  address: OrderAddress;
  status: "pending" | "delivered";
  paymentMethod: "COD";
  createdAt: string;
};


export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating?: {
    rate?: number;
    count?: number;
  };
  rate?: number;
  count?: number;
  createdAt?: string;
}

// src/app/book.model.ts
export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  price: number;
  description: string;
  imageUrl: string;
  authors?: string[];
  publishedDate?: string;
  categories?: string[];
  apiDescription?: string;  // Add this line
}

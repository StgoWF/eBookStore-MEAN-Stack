// src/app/book.model.ts
export interface Book {
    _id: string;
    title: string;
    author: string;
    genre: string;
    price: number;
    description: string;
    imageUrl: string;
    authors?: string[];  // Propiedad opcional
    publishedDate?: string; // Propiedad opcional
    categories?: string[];  // Propiedad opcional
  }
  
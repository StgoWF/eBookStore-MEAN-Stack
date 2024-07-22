// src/app/book.model.ts
export interface Book {
    _id: string;
    title: string;
    author: string;
    genre: string; // Incluye el campo genre
    price: number;
    description: string;
    imageUrl?: string; // Nuevo campo para la URL de la imagen
  }
  
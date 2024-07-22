// src/app/cart.model.ts
import { Book } from './book.model'; // Asegúrate de importar el modelo de libro

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
}

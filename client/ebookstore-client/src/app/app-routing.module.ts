// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component'; // Asegúrate de tener este componente
import { DataDeletionComponent } from './data-deletion/data-deletion.component';
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';


const routes: Routes = [
  { path: 'books', component: BookListComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cart', component: CartComponent }, // Añade la ruta del carrito
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: '**', redirectTo: '/books' }, // Rutas no encontradas
  { path: 'data-deletion', component: DataDeletionComponent },
  { path: 'payment-confirmation', component: PaymentConfirmationComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

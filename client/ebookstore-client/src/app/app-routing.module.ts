// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { BookListComponent } from './book-list/book-list.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { NotFoundComponent } from './not-found/not-found.component'; // Nuevo componente para manejar 404

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'books', component: BookListComponent },
  { path: 'books/:id', component: BookDetailComponent },
  { path: '', redirectTo: '/books', pathMatch: 'full' }, // Redirige a la lista de libros por defecto
  { path: '**', component: NotFoundComponent } // Maneja rutas no encontradas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

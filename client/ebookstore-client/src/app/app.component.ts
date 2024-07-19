import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <nav>
      <a routerLink="/register">Register</a>
      <a routerLink="/login">Login</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent { }

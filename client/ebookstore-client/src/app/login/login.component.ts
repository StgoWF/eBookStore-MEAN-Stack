// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  message: string = '';

  constructor(private userService: UserService) {}

  login() {
    const user = { email: this.email, password: this.password };
    this.userService.login(user).subscribe(
      response => {
        this.message = 'Login successful';
      },
      error => {
        this.message = 'Login failed';
      }
    );
  }
}

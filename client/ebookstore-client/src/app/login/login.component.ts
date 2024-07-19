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

  constructor(private userService: UserService) {}

  login() {
    const user = { email: this.email, password: this.password };
    this.userService.login(user).subscribe(
      response => {
        console.log('User logged in successfully');
      },
      error => {
        console.error('Error logging in user', error);
      }
    );
  }
}

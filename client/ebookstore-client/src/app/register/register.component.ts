// src/app/register/register.component.ts
import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  message: string = '';

  constructor(private userService: UserService) {}

  register() {
    const user = { username: this.username, email: this.email, password: this.password };
    this.userService.register(user).subscribe(
      response => {
        this.message = 'Registration successful';
      },
      error => {
        this.message = 'Registration failed';
      }
    );
  }
}


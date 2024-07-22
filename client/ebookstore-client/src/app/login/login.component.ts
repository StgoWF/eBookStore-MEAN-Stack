// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  message: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const user = { email: this.email, password: this.password };
    this.authService.login(user).subscribe(
      response => {
        console.log('Login response:', response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);
        console.log('Stored token:', response.token);
        console.log('Stored userId:', response.userId);
        this.router.navigate(['/books']);
      },
      error => {
        this.message = 'Login failed';
        console.error('Login error:', error);
      }
    );
  }

  closeModal() {
    this.router.navigate(['/']);
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle().then(() => {
      this.router.navigate(['/books']);
    }).catch(error => {
      console.error('Google login error:', error);
    });
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook().then(() => {
      this.router.navigate(['/books']);
    }).catch(error => {
      console.error('Facebook login error:', error);
    });
  }
}

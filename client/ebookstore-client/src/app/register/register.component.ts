import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    const user = { username: this.username, email: this.email, password: this.password };
    this.authService.register(user).subscribe(
      response => {
        console.log(response);
        this.message = 'Registration successful, logging in...';
        this.loginAfterRegistration(user.email, user.password);
      },
      error => {
        this.message = 'Registration failed';
        console.error(error);
      }
    );
  }

  loginAfterRegistration(email: string, password: string) {
    const user = { email, password };
    this.authService.login(user).subscribe(
      response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);
        this.router.navigate(['/books']);
      },
      error => {
        this.message = 'Login failed after registration';
        console.error(error);
      }
    );
  }

  closeModal() {
    this.router.navigate(['/']);
  }

  registerWithGoogle() {
    this.authService.loginWithGoogle().then(() => {
      this.router.navigate(['/books']);
    }).catch(error => {
      console.error('Google register error:', error);
    });
  }

  registerWithFacebook() {
    this.authService.loginWithFacebook().then(() => {
      this.router.navigate(['/books']);
    }).catch(error => {
      console.error('Facebook register error:', error);
    });
  }
}

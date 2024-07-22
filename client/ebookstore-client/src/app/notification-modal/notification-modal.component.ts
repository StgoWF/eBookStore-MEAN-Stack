import { Component } from '@angular/core';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.css']
})
export class NotificationModalComponent {
  message: string = '';
  isVisible: boolean = false;

  showNotification(message: string): void {
    this.message = message;
    this.isVisible = true;
    setTimeout(() => {
      this.closeNotification();
    }, 3000); // El modal se cerrará automáticamente después de 3 segundos
  }

  closeNotification(): void {
    this.isVisible = false;
  }
}

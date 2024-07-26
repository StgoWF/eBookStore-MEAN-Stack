import { Component } from '@angular/core';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.css']
})
export class NotificationModalComponent {
  message: string = '';
  isVisible: boolean = false;
  type: 'success' | 'error' = 'success';

  showNotification(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.type = type;
    this.isVisible = true;
    setTimeout(() => {
      this.closeNotification();
    }, 3000); // The modal will close automatically after 3 seconds
  }

  closeNotification(): void {
    this.isVisible = false;
  }
}

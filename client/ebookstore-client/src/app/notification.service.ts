import { Injectable } from '@angular/core';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationModal: NotificationModalComponent;

  registerNotificationModal(notificationModal: NotificationModalComponent) {
    this.notificationModal = notificationModal;
  }

  showNotification(message: string) {
    if (this.notificationModal) {
      this.notificationModal.showNotification(message);
    } else {
      console.error('NotificationModalComponent is not registered.');
    }
  }
}

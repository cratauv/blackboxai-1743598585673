import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationEmailComponent } from './confirmation-email/confirmation-email.component';
import { CancellationEmailComponent } from './cancellation-email/cancellation-email.component';
import { ReminderEmailComponent } from './reminder-email/reminder-email.component';

@NgModule({
  declarations: [
    ConfirmationEmailComponent,
    CancellationEmailComponent,
    ReminderEmailComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ConfirmationEmailComponent,
    CancellationEmailComponent,
    ReminderEmailComponent
  ]
})
export class EmailNotificationsModule { }
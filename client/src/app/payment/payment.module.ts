import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentFormComponent } from './payment-form-new.component';
import { PaymentStatusComponent } from './payment-status.component';

@NgModule({
  declarations: [
    PaymentProcessingComponent,
    PaymentFormComponent,
    PaymentStatusComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PaymentProcessingComponent
  ]
})
export class PaymentModule { }
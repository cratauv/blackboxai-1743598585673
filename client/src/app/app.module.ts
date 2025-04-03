import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BookingOptionsModule } from './booking-options/booking-options.module';
import { EmailNotificationsModule } from './email-notifications/email-notifications-new.module';
import { PaymentProcessingComponent } from './payment/payment-processing.component';
import { AnalyticsDashboardComponent } from './analytics/analytics-dashboard-new.component';

@NgModule({
  declarations: [
    AppComponent,
    AnalyticsDashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BookingOptionsModule,
    EmailNotificationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
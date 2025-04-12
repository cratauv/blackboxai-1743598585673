import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingProcessComponent } from './booking-process.component';
import { Step1DateTimeComponent } from './steps/step1-date-time.component';
import { Step2CustomerInfoComponent } from './steps/step2-customer-info.component';
import { Step3ServiceSelectionComponent } from './steps/step3-service-selection.component';
import { Step4ConfirmationComponent } from './steps/step4-confirmation.component';
import { BookingManagementComponent } from './booking-management.component';
import { BookingCalendarComponent } from './calendar/booking-calendar.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { BookingHistoryListComponent } from './booking-history/booking-history-list.component';

const routes: Routes = [
  {
    path: 'book',
    component: BookingProcessComponent,
    children: [
      { path: 'step1', component: Step1DateTimeComponent },
      { path: 'step2', component: Step2CustomerInfoComponent },
      { path: 'step3', component: Step3ServiceSelectionComponent },
      { path: 'step4', component: Step4ConfirmationComponent },
      { path: '', redirectTo: 'step1', pathMatch: 'full' }
    ]
  },
  {
    path: 'manage',
    component: BookingManagementComponent,
    children: [
      { path: 'calendar', component: BookingCalendarComponent },
      { path: 'history', component: BookingHistoryListComponent },
      { path: 'details/:id', component: BookingDetailsComponent },
      { path: '', redirectTo: 'calendar', pathMatch: 'prefix' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }
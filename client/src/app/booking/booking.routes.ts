import { Routes } from '@angular/router';
import { BookingProcessComponent } from './booking-process.component';
import { Step3ServiceSelectionComponent } from './steps/step3-service-selection.component';

export const BOOKING_ROUTES: Routes = [
  {
    path: 'booking',
    children: [
      { 
        path: 'process',
        component: BookingProcessComponent,
        children: [
          { path: 'services', component: Step3ServiceSelectionComponent },
          { path: '', redirectTo: 'services', pathMatch: 'full' }
        ]
      }
    ]
  }
];
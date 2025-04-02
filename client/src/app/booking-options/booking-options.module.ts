import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BookingOptionsService } from './booking-options.service';
import { BookingOptionsListComponent } from './booking-options-list/booking-options-list.component';
import { ReviewListComponent } from './review-list/review-list.component';
import { AddReviewComponent } from './add-review/add-review.component';

@NgModule({
  declarations: [
    BookingOptionsListComponent,
    ReviewListComponent,
    AddReviewComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [BookingOptionsService]
})
export class BookingOptionsModule { }
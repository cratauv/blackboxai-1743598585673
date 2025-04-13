import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BookingService } from '../../booking.service';
import { Booking } from '../../../models/booking.model';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent {
  properties: any[] = []; // Will hold available properties
  selectedProperty: any;

  bookingForm = this.fb.group({
    propertyId: ['', Validators.required],
    propertyName: ['', Validators.required],
    propertyDetails: this.fb.group({
      address: [''],
      amenities: [''],
      capacity: [0]
    }),
    checkInDate: ['', Validators.required],
    checkOutDate: ['', Validators.required],
    guests: this.fb.group({
      adults: [1, [Validators.required, Validators.min(1)]],
      children: [0],
      infants: [0]
    }),
    specialRequests: [''],
    paymentMethod: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService
  ) {
    this.loadProperties();
  }

  loadProperties() {
    this.bookingService.getBookingOptions().subscribe(options => {
      this.properties = options;
    });
  }

  onPropertySelect(event: any) {
    const propertyId = event.target.value;
    this.selectedProperty = this.properties.find(p => p.id === propertyId);
    
    if (this.selectedProperty) {
      this.bookingForm.patchValue({
        propertyName: this.selectedProperty.name,
        propertyDetails: {
          address: this.selectedProperty.address,
          amenities: this.selectedProperty.amenities?.join(', ') || '',
          capacity: this.selectedProperty.capacity || 0
        }
      });
    }
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      const formValue = this.bookingForm.value;
      const bookingData = {
        ...formValue,
        checkInDate: new Date(formValue.checkInDate || ''),
        checkOutDate: new Date(formValue.checkOutDate || ''),
        guests: {
          adults: formValue.guests?.adults || 1,
          children: formValue.guests?.children || 0,
          infants: formValue.guests?.infants || 0
        },
        specialRequests: formValue.specialRequests || '',
        paymentMethod: formValue.paymentMethod || ''
      } as Booking;
      
      this.bookingService.createBooking(bookingData).subscribe({
        next: () => alert('Booking created successfully!'),
        error: (err) => console.error('Booking failed:', err)
      });
    }
  }
}
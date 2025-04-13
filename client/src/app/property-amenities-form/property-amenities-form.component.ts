import { Component } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-property-amenities-form',
  templateUrl: './property-amenities-form.component.html',
  styleUrls: ['./property-amenities-form.component.css']
})
export class PropertyAmenitiesFormComponent {
  amenitiesForm = this.fb.group({
    basic: this.fb.array([]),
    safety: this.fb.array([]),
    accessibility: this.fb.array([]),
    additional: ['']
  });

  basicAmenities = [
    'WiFi', 'TV', 'Air Conditioning', 'Heating', 'Kitchen', 'Washer', 'Dryer', 'Free Parking'
  ];

  safetyAmenities = [
    'Smoke Alarm', 'First Aid Kit', 'Fire Extinguisher', 'Carbon Monoxide Alarm'
  ];

  accessibilityAmenities = [
    'Step-free Access', 'Wide Hallway', 'Accessible Bathroom', 'Elevator'
  ];

  constructor(private fb: FormBuilder) {
    this.initializeAmenities();
  }

  initializeAmenities() {
    this.basicAmenities.forEach(() => this.basic.push(this.fb.control(false)));
    this.safetyAmenities.forEach(() => this.safety.push(this.fb.control(false)));
    this.accessibilityAmenities.forEach(() => this.accessibility.push(this.fb.control(false)));
  }

  get basic() {
    return this.amenitiesForm.get('basic') as FormArray;
  }

  get safety() {
    return this.amenitiesForm.get('safety') as FormArray;
  }

  get accessibility() {
    return this.amenitiesForm.get('accessibility') as FormArray;
  }

  onSubmit() {
    const selectedAmenities = [
      ...this.basicAmenities.filter((_, i) => this.basic.value[i]),
      ...this.safetyAmenities.filter((_, i) => this.safety.value[i]),
      ...this.accessibilityAmenities.filter((_, i) => this.accessibility.value[i]),
      this.amenitiesForm.value.additional
    ].filter(a => a);
    
    console.log('Selected Amenities:', selectedAmenities);
    // TODO: Connect to property service
  }
}
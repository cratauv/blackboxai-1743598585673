import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../filter.service';
import { SearchCriteria } from '../../models/search.model';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-panel">
      <h3>Filters</h3>
      
      <div class="filter-section">
        <h4>Property Types</h4>
        <div *ngFor="let type of propertyTypes" class="filter-option">
          <input type="checkbox" 
                 [id]="'type-' + type"
                 [(ngModel)]="selectedTypes[type]"
                 (change)="updateFilters()">
          <label [for]="'type-' + type">{{type}}</label>
        </div>
      </div>

      <div class="filter-section">
        <h4>Amenities</h4>
        <div *ngFor="let amenity of amenities" class="filter-option">
          <input type="checkbox"
                 [id]="'amenity-' + amenity"
                 [(ngModel)]="selectedAmenities[amenity]"
                 (change)="updateFilters()">
          <label [for]="'amenity-' + amenity">{{amenity}}</label>
        </div>
      </div>

      <div class="filter-section">
        <h4>Accessibility</h4>
        <div *ngFor="let option of accessibilityOptions" class="filter-option">
          <input type="checkbox"
                 [id]="'accessibility-' + option"
                 [(ngModel)]="selectedAccessibility[option]"
                 (change)="updateFilters()">
          <label [for]="'accessibility-' + option">{{option}}</label>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-panel {
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .filter-section {
      margin-bottom: 1.5rem;
    }
    h4 {
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }
    .filter-option {
      display: flex;
      align-items: center;
      margin-bottom: 0.25rem;
    }
    input[type="checkbox"] {
      margin-right: 0.5rem;
    }
  `]
})
export class FilterPanelComponent {
  @Output() filterChange = new EventEmitter<SearchCriteria['filters']>();
  
  propertyTypes: string[] = [];
  amenities: string[] = [];
  accessibilityOptions: string[] = [];
  
  selectedTypes: Record<string, boolean> = {};
  selectedAmenities: Record<string, boolean> = {};
  selectedAccessibility: Record<string, boolean> = {};

  constructor(private filterService: FilterService) {}

  ngOnInit() {
    this.loadFilters();
  }

  loadFilters() {
    this.filterService.getPropertyTypes().subscribe(types => {
      this.propertyTypes = types;
    });
    this.filterService.getAmenities().subscribe(amenities => {
      this.amenities = amenities;
    });
    this.filterService.getAccessibilityOptions().subscribe(options => {
      this.accessibilityOptions = options;
    });
  }

  updateFilters() {
    const filters = {
      propertyTypes: Object.keys(this.selectedTypes).filter(k => this.selectedTypes[k]),
      amenities: Object.keys(this.selectedAmenities).filter(k => this.selectedAmenities[k]),
      accessibility: Object.keys(this.selectedAccessibility).filter(k => this.selectedAccessibility[k])
    };
    this.filterChange.emit(filters);
  }
}
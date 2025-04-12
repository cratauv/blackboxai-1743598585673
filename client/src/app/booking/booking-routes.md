# Booking System Routes and Flows

## Core Booking Flow
```
/booking/process
  /step1-date-time
  /step2-customer-info  
  /step3-service-selection
  /step4-confirmation
```

## Calendar Management
```
/calendar
  /sync → calendar-sync.component
  /provider → calendar-provider.component
```

## Booking Management
```
/bookings
  /manage → booking-management.component
  /history → booking-history-list.component
  /:id → booking-details.component
```

## Service Options  
```
/services
  /search → search.component
  /:id → booking-option-card.component
  /availability → real-time-availability.component
```

## Reviews
```
/reviews
  /add → add-review.component
  /list → review-list.component  
```

## Email Templates
```
/emails
  /confirmation → confirmation-email.component
  /cancellation → cancellation-email.component
  /reminder → reminder-email.component
```

## Key Dependencies:
- All booking components depend on BookingService
- Calendar components use CalendarService
- Email components use EmailService
- Review components use ReviewService
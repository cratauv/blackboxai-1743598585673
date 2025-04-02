const bookingConfirmationTemplate = (booking) => {
  const checkIn = new Date(booking.checkInDate).toLocaleDateString()
  const checkOut = new Date(booking.checkOutDate).toLocaleDateString()
  
  return {
    subject: `Booking Confirmation #${booking._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2d3748;">Your Booking is Confirmed!</h1>
        <h2 style="color: #4a5568;">${booking.property.title}</h2>
        
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2d3748;">Booking Details</h3>
          <p><strong>Confirmation #:</strong> ${booking._id}</p>
          <p><strong>Dates:</strong> ${checkIn} - ${checkOut}</p>
          <p><strong>Guests:</strong> ${booking.guests.adults} adults, ${booking.guests.children || 0} children</p>
          <p><strong>Address:</strong> ${booking.property.address}</p>
        </div>

        <div style="background: #f7fafc; padding: 20px; border-radius: 8px;">
          <h3 style="color: #2d3748;">Payment Summary</h3>
          <p>Base Price: $${booking.pricing.nightlyRate} x ${booking.pricing.nights} nights</p>
          <p>Cleaning Fee: $${booking.pricing.cleaningFee}</p>
          <p>Service Fee: $${booking.pricing.serviceFee}</p>
          <p>Taxes: $${booking.pricing.taxes}</p>
          <p style="font-weight: bold; border-top: 1px solid #e2e8f0; padding-top: 10px;">
            Total: $${booking.pricing.total}
          </p>
        </div>
        <p style="margin-top: 20px;">We look forward to hosting you! Please contact us if you have any questions.</p>
      </div>
    `
  }
}

const bookingCancellationTemplate = (booking) => {
  return {
    subject: `Booking Cancellation #${booking._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc3545;">Booking Cancellation Confirmation</h1>
        <h2 style="color: #4a5568;">${booking.property.title}</h2>
        
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2d3748;">Cancellation Details</h3>
          <p><strong>Booking #:</strong> ${booking._id}</p>
          <p><strong>Original Dates:</strong> ${new Date(booking.checkInDate).toLocaleDateString()} - ${new Date(booking.checkOutDate).toLocaleDateString()}</p>
          <p><strong>Refund Amount:</strong> $${booking.refundAmount?.toFixed(2) || '0.00'}</p>
          <p><strong>Reason:</strong> ${booking.cancellationReason || 'Not specified'}</p>
        </div>
        <p>We're sorry to see you go. Hope to welcome you back soon!</p>
      </div>
    `
  }
}

const bookingReminderTemplate = (booking) => {
  const daysUntilCheckIn = Math.ceil(
    (new Date(booking.checkInDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return {
    subject: `Reminder: Your Stay Starts in ${daysUntilCheckIn} Day${daysUntilCheckIn !== 1 ? 's' : ''}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2d3748;">Your Stay is Coming Up!</h1>
        <h2 style="color: #4a5568;">${booking.property.title}</h2>
        
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2d3748;">Booking Details</h3>
          <p><strong>Check-in:</strong> ${new Date(booking.checkInDate).toLocaleDateString()}</p>
          <p><strong>Check-out:</strong> ${new Date(booking.checkOutDate).toLocaleDateString()}</p>
          <p><strong>Address:</strong> ${booking.property.address}</p>
          <p><strong>Host Contact:</strong> ${booking.property.owner.email}</p>
        </div>
        <p>We're excited to host you! Here are some things to prepare:</p>
        <ul>
          <li>Check your check-in instructions</li>
          <li>Review the property amenities</li>
          <li>Pack accordingly for your trip</li>
        </ul>
      </div>
    `
  }
}

module.exports = { 
  bookingConfirmationTemplate,
  bookingCancellationTemplate,
  bookingReminderTemplate
}

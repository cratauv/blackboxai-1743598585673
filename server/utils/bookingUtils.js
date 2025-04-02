const calculateTotalPrice = (property, checkInDate, checkOutDate, guests) => {
  const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
  const basePrice = property.pricePerNight * nights;
  const cleaningFee = property.cleaningFee || 0;
  const serviceFee = basePrice * 0.12; // 12% service fee
  const taxes = basePrice * 0.08; // 8% tax

  return {
    nightlyRate: property.pricePerNight,
    cleaningFee,
    serviceFee,
    taxes,
    total: basePrice + cleaningFee + serviceFee + taxes,
    nights
  };
};

const checkAvailability = async (property, checkInDate, checkOutDate) => {
  const conflictingBookings = await Booking.find({
    property: property._id,
    $or: [
      { checkInDate: { $lt: new Date(checkOutDate) }, checkOutDate: { $gt: new Date(checkInDate) } },
      { checkInDate: { $gte: new Date(checkInDate), $lte: new Date(checkOutDate) } }
    ],
    status: { $ne: 'cancelled' }
  });

  return conflictingBookings.length === 0;
};

module.exports = { calculateTotalPrice, checkAvailability };
export const hotelReservationHashKey = (hotelId: string) => `RESERVATION#${hotelId}`;
export const reservationRangeKey = (userId: string, start: Date) =>
    `${start.getUTCFullYear()}-${start.getUTCMonth()}-${start.getUTCDate()}#${userId}`

export const restaurantReservationHashKey = (hotelId: string) => `RESTAURANT#${hotelId}`;

export const hotelReservationKey = (hotelId: string, userId: string, start: Date) => ({
    hashKey: hotelReservationHashKey(hotelId),
    rangeKey: reservationRangeKey(userId, start),
});

export const restaurantReservationKey = (hotelId: string, userId: string, start: Date) => ({
    hashKey: restaurantReservationHashKey(hotelId),
    rangeKey: reservationRangeKey(userId, start),
});

import {calculatePrice} from "../../src/specifics/priceCalculation";
import {CreateReservationRequest} from "../../../../util/domain/types";

describe('price calculation', () => {
    it('should correctly calculate price for one night', () => {
        const startDate = new Date(2020, 11, 10, 12, 0, 0);
        const dayLater = new Date(2020, 11, 11, 12, 0, 0);

        const exampleCreateRequest: CreateReservationRequest = {
            hotelId: '1',
            userId: '10',
            start: startDate,
            end: dayLater,
            timestamp: undefined, // does not really matter here
        };

        const result = calculatePrice(exampleCreateRequest);

        expect(result.hotelId).toBe('1');
        expect(result.price).toBe(20);
    });

    it('should correctly calculate price for three night', () => {
        const startDate = new Date(2020, 11, 10, 12, 0, 0);
        const dayLater = new Date(2020, 11, 13, 12, 0, 0);

        const exampleCreateRequest: CreateReservationRequest = {
            hotelId: '1',
            userId: '10',
            start: startDate,
            end: dayLater,
            timestamp: undefined, // does not really matter here
        };

        const result = calculatePrice(exampleCreateRequest);

        expect(result.hotelId).toBe('1');
        expect(result.price).toBe(60);
    });
});

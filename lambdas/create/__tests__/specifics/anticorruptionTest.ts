// import * as E from "fp-ts/Either";
import {fromEventToCreateRequest} from "../../src/specifics/anticorruption";
import {unsafeUnwrap, unsafeUnwrapLeft} from "fp-ts-std/Either";
import {CreateReservationRequest} from "../../../../util/domain/types";

// const getResult = (either: any) => {
//     return E.getOrElseW((err) => err)(either);
// }

const config = {
    tableName: 'ourTable',
    environment: 'dev',
    testHotelAllowed: true,
};

describe('anti corruption checks', () => {
    it('should fail if test hotel is passed in when not allowed', () => {
        const noTestHotelConfig = {
            tableName: 'ourTable',
            environment: 'prod',
            testHotelAllowed: false,
        };

        const now = new Date();
        const oneDayInFuture = new Date(now.getTime() + 25 * 60 * 60 * 1000);

        const eventData = {
            hotelId: '1',
            userId: '10',
            start: now,
            end: oneDayInFuture,
            timestamp: now,
        }

        const event = {
            body: JSON.stringify(eventData)
        }

        const result = unsafeUnwrapLeft(
            fromEventToCreateRequest(event)(noTestHotelConfig)
        );

        expect(result).toBe('Test hotel is not allowed in environment prod');
    });

    it('should fail when there is no start or end date', () => {
        const now = new Date();

        const eventData = {
            hotelId: '1',
            userId: '10',
            start: '',
            end: '',
            timestamp: now,
        }

        const event = {
            body: JSON.stringify(eventData)
        }

        // const result = getResult(
        //     fromEventToCreateRequest(event)
        // );

        const result = unsafeUnwrapLeft(
            fromEventToCreateRequest(event)(config)
        );

        expect(result).toBe('Start date should be before end date');
    });

    it('should fail when the start date is after the end date', () => {
        const now = new Date();
        const oneHourInFuture = new Date(now.getTime() + 60 * 60 * 1000);

        const eventData = {
            hotelId: '1',
            userId: '10',
            start: oneHourInFuture,
            end: now,
            timestamp: now,
        }

        const event = {
            body: JSON.stringify(eventData)
        }

        const result = unsafeUnwrapLeft(
            fromEventToCreateRequest(event)(config)
        );

        expect(result).toBe('Start date should be before end date');
    });

    it('should return create request type when everything is ok', () => {
        const now = new Date();
        const oneDayInFuture = new Date(now.getTime() + 25 * 60 * 60 * 1000);

        const eventData = {
            hotelId: '1',
            userId: '10',
            start: now,
            end: oneDayInFuture,
            timestamp: now,
        }

        const event = {
            body: JSON.stringify(eventData)
        }

        const result = unsafeUnwrap(
            fromEventToCreateRequest(event)(config)
        ) as CreateReservationRequest;

        expect(result.hotelId).toBe('1');
        expect(result.userId).toBe('10');
        expect(result.start instanceof Date).toBeTruthy();
        expect(result.end instanceof Date).toBeTruthy();
    });
});

import {unsafeUnwrap, unsafeUnwrapLeft} from "fp-ts-std/Either";
import {fromEventToRetrieveRequest} from "../../src/specifics/anticorruption";
import {ClientError} from "../../../../util/domain/types";

describe('anti corruption', () => {
    it('returns a retrieve request for a valid payload', () => {
        const startDate = new Date(2020, 11, 10, 12, 0, 0);

        const queryStringParameters = {
            hotelId: '1',
            userId: '11',
            start: startDate.toISOString(),
        }

        const event = {
            queryStringParameters,
        }

        const result = unsafeUnwrap(fromEventToRetrieveRequest(event));

        expect(result.hotelId).toBe('1');
        // other checks
    });

    it('returns an error for a invalid payload', () => {
        const queryStringParameters = {
            hotelId: '1',
            userId: '11',
            start: '',
        }
        const event = {
            queryStringParameters,
        }

        const result = unsafeUnwrapLeft(fromEventToRetrieveRequest(event)) as ClientError;

        expect(result.type).toBe('ClientError');
        expect(result.message).toBe('Missing start');
    });
});

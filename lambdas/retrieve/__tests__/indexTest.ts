import {handler} from "../src";
import {mocked} from "ts-jest/utils";
import {get} from "../src/gateway/awsCalls";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import GetItemOutput = DocumentClient.GetItemOutput;
import GetItemInput = DocumentClient.GetItemInput;

jest.mock("../src/gateway/awsCalls");

describe('retrieve index test', () => {
    beforeEach( () => {
        mocked(get as any).mockClear();
    });

    it('should return the asked-for reservation with price set to 0 for test hotel', async () => {
        const startDate = new Date(2020, 11, 10, 12, 0, 0);

        const mockGet = mocked(get as any).mockImplementation((params: GetItemInput): Promise<GetItemOutput> => {
            if (params.Key['hashKey'] === 'RESERVATION#1') {
                return Promise.resolve({
                    Item: {
                        hotelId: '1',
                        start: startDate.toISOString(),
                        end: startDate.toISOString(),
                        timestamp: startDate.toISOString(),
                        price: 100,
                    }
                });
            }
            return Promise.resolve({});
        });

        const queryStringParameters = {
            hotelId: '1',
            userId: '11',
            start: startDate.toISOString(),
        }
        const event = {
            queryStringParameters,
        }

        const result: any = await handler(event);

        expect(result.statusCode).toBe(200);

        const body = JSON.parse(result.body);

        expect(body.hotel.price).toBe(0);
        expect(body.restaurant).toBeNull();
        expect(mockGet.mock.calls).toHaveLength(2);
    });

    it('should return a 400 for an unknown reservation', async () => {
        const mockGet = mocked(get as any).mockImplementation((): Promise<GetItemOutput> => {
            return Promise.resolve({});
        });

        const startDate = new Date(2020, 11, 10, 12, 0, 0);

        const queryStringParameters = {
            hotelId: 'false',
            userId: 'request',
            start: startDate.toISOString(),
        }
        const event = {
            queryStringParameters,
        }

        const result: any = await handler(event);

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe('Unknown reservation');
        expect(mockGet.mock.calls).toHaveLength(1);
    });

    it('should return a 500 for a server error reservation', async () => {
        const mockGet = mocked(get as any).mockImplementation((): Promise<GetItemOutput> => {
            return Promise.reject('reason');
        });

        const startDate = new Date(2020, 11, 10, 12, 0, 0);

        const queryStringParameters = {
            hotelId: 'false',
            userId: 'request',
            start: startDate.toISOString(),
        }
        const event = {
            queryStringParameters,
        }

        const result: any = await handler(event);

        expect(result.statusCode).toBe(500);
        expect(result.body).toBe('reason');
        expect(mockGet.mock.calls).toHaveLength(1);
    });
});

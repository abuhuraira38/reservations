import {handler} from "../src";
import {save} from "../src/gateway/awsCalls";
import {mocked} from "ts-jest/utils";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import PutItemOutput = DocumentClient.PutItemOutput;

jest.mock("../src/gateway/awsCalls");

describe('create index test', () => {
    beforeEach( () => {
        mocked(save as any).mockClear();
    });

    it('should return a 400 with an error message if start date is later than end date', async () => {
        const mockSave = mocked(save as any).mockImplementation((): Promise<PutItemOutput> => {
            return Promise.resolve({});
        });

        const now = new Date();
        const oneHourInFuture = new Date(now.getTime() + 60 * 60 * 1000);

        const eventData = {
            hotelId: '1',
            userId: '11',
            start: oneHourInFuture,
            end: now,
            timestamp: now,
        }
        const event = {
            body: JSON.stringify(eventData),
        }

        const result = await handler(event);

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe('Start date should be before end date');
        expect(mockSave.mock.calls).toHaveLength(0);
    });

    it('should return 200 if everything is ok', async () => {
        const mockSave = mocked(save as any).mockImplementation((): Promise<PutItemOutput> => {
            return Promise.resolve({});
        });

        const now = new Date();
        const oneHourInFuture = new Date(now.getTime() + 60 * 60 * 1000);

        const eventData = {
            hotelId: '1',
            userId: '11',
            start: now,
            end: oneHourInFuture,
            timestamp: now,
        }
        const event = {
            body: JSON.stringify(eventData),
        }

        const result = await handler(event);

        expect(result.statusCode).toBe(200);
        expect(result.body).toBe('Reservation created');
        expect(mockSave.mock.calls).toHaveLength(1);
    });
});

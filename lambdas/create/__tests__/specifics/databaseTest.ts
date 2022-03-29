import {mocked} from 'ts-jest/utils';
import {addId, saveToDatabase} from "../../src/specifics/database";
import {CreateReservationPricedRequest} from "../../../../util/domain/types";
import {save} from "../../src/gateway/awsCalls";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import PutItemOutput = DocumentClient.PutItemOutput;

jest.mock("../../src/gateway/awsCalls");

const config = {
    tableName: 'ourTable',
    environment: 'dev',
    testHotelAllowed: true,
};

describe('id generation', () => {
    it('should generate a primary key and sort key', () => {
        const startDate = new Date(2020, 11, 10, 12, 0, 0);
        const dayLater = new Date(2020, 11, 11, 12, 0, 0);

        const exampleRequest: CreateReservationPricedRequest = {
            hotelId: '1',
            userId: '10',
            start: startDate,
            end: dayLater,
            price: 20,
            timestamp: startDate,
        };

        const result = addId(exampleRequest);

        expect(result.hotelId).toBe('1');
        expect(result.hashKey).toBe("RESERVATION#1");
        expect(result.rangeKey).toBe("2020-11-10#10");
    });
});

describe('save', () => {
    beforeEach( () => {
        mocked(save as any).mockClear();
    });

    it('should save and then return an enriched event', async () => {
        const mockSave = mocked(save as any).mockImplementation((): Promise<PutItemOutput> => {
            return Promise.resolve({});
        });

        const startDate = new Date(2020, 11, 10, 12, 0, 0);
        const dayLater = new Date(2020, 11, 11, 12, 0, 0);

        const exampleRequest: CreateReservationPricedRequest = {
            hotelId: '1',
            userId: '10',
            start: startDate,
            end: dayLater,
            price: 20,
            timestamp: startDate,
        };

        await saveToDatabase(exampleRequest)(config)();

        expect(mockSave.mock.calls).toHaveLength(1);
    });
});

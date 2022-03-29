import * as TE from 'fp-ts/lib/TaskEither';
import {Config, CreateReservationPricedRequest, CreateReservationPricedWithIdRequest} from "../../../../util/domain/types";
import {flow} from "fp-ts/function";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import PutItemInput = DocumentClient.PutItemInput;
import {save} from "../gateway/awsCalls";
import {hotelReservationKey} from "../../../../util/common/dynamoSchema";

export const addId = (createRequest: CreateReservationPricedRequest): CreateReservationPricedWithIdRequest => ({
    ...hotelReservationKey(createRequest.hotelId, createRequest.userId, createRequest.start),
    ...createRequest
});

export const dynamoParams = (config: Config) =>
    (request: CreateReservationPricedWithIdRequest): PutItemInput => {
        return {
            TableName: config.tableName,
            Item: {
                hashKey: request.hashKey,
                rangeKey: request.rangeKey,
                hotelId: request.hotelId,
                userId: request.userId,
                start: request.start.toISOString(),
                end: request.end.toISOString(),
                timestamp: request.timestamp.toISOString(),
                price: request.price,
            }
        };
    }

export const saveToDatabase = (createRequest: CreateReservationPricedRequest) =>
    (config: Config) => {
        const createParams = flow(addId, dynamoParams(config))(createRequest);
        return TE.tryCatch(() => save(createParams), String);
    };

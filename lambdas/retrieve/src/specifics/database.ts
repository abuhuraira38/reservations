import * as TE from 'fp-ts/lib/TaskEither';
import * as O from 'fp-ts/lib/Option'
import * as STE from 'fp-ts-contrib/StateTaskEither';
import {ErrorResponse, HotelReservation, RestaurantReservation, RetrieveReservationRequest, RetrieveState} from "../../../../util/domain/types";
import {get} from "../gateway/awsCalls";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import {pipe} from "fp-ts/pipeable";
import {hotelReservationKey, restaurantReservationKey} from "../../../../util/common/dynamoSchema";
import {MorphicErrorResponse} from "../../../../util/common/responses";
import GetItemOutput = DocumentClient.GetItemOutput;

const hotelParams = (hotelId: string, userId: string, start: Date) => {
    return {
        TableName: process.env.DATABASE_NAME,
        Key: {
            ...hotelReservationKey(hotelId, userId, start)
        }
    };
};

const fromItemToHotelReservation = (state: RetrieveState) => (output: GetItemOutput): HotelReservation => {
    const item = output.Item;
    return {
        hotelId: item['hotelId'],
        userId: item['userId'],
        start: item['start'],
        end: item['end'],
        timestamp: item['timestamp'],
        price: state.isTest ? 0 : item['price'],
    };
};

const restaurantParams = (hotelId: string, userId: string, start: Date) => {
    return {
        TableName: process.env.DATABASE_NAME,
        Key: {
            ...restaurantReservationKey(hotelId, userId, start)
        }
    };
};

const fromItemToRestaurantReservation = (output: GetItemOutput): RestaurantReservation => {
    const item = output.Item;
    return {
        hotelId: item['hotelId'],
        userId: item['userId'],
        start: item['start'],
        end: item['end'],
        timestamp: item['timestamp'],
        price: item['price'],
        freeDrink: item['freeDrink'],
    };
};

const emptyCheck = (output: GetItemOutput) => output.Item ? O.some(output) : O.none;

export const retrieveHotel = (request: RetrieveReservationRequest): STE.StateTaskEither<RetrieveState, ErrorResponse, HotelReservation> => (state: RetrieveState) => {
    const fromItemToReservationWithTestCheck = fromItemToHotelReservation(state);

    return pipe(
        hotelParams(request.hotelId, request.userId, request.start),
        params => TE.tryCatch(() => get(params), (message: string) => MorphicErrorResponse.of.ServerError({message})),
        TE.map(emptyCheck),
        TE.map(
            O.map(fromItemToReservationWithTestCheck),
        ),
        TE.chain(TE.fromOption(() => MorphicErrorResponse.of.ClientError({message: 'Unknown reservation'}))),
        TE.map(r => [r, state]),
    );
};

export const retrieveRestaurant = (request: RetrieveReservationRequest): STE.StateTaskEither<RetrieveState, ErrorResponse, O.Option<RestaurantReservation>> => (state: RetrieveState) => {
    return pipe(
        restaurantParams(request.hotelId, request.userId, request.start),
        params => TE.tryCatch(() => get(params), (err: string) => MorphicErrorResponse.of.ServerError({ message: err })),
        TE.map(emptyCheck),
        TE.map(
            O.map(fromItemToRestaurantReservation),
        ),
        TE.map(r => [r, state]),
    );
}

export const retrieve = (request: RetrieveReservationRequest): STE.StateTaskEither<RetrieveState, ErrorResponse, HotelReservation> => (state: RetrieveState) => {
    const fromItemToReservationWithTestCheck = fromItemToHotelReservation(state);

    return pipe(
        hotelParams(request.hotelId, request.userId, request.start),
        params => TE.tryCatch(() => get(params), (message: string) => {
            return MorphicErrorResponse.of.ServerError({message})
        }),
        TE.map(emptyCheck),
        TE.map(
            O.map(fromItemToReservationWithTestCheck),
        ),
        TE.chain(TE.fromOption(() => {
            return MorphicErrorResponse.of.ClientError({message: 'Unknown reservation'})
        })),
        TE.map(r => [r, state]),
    );
};

import {Config, CreateReservationRequest, LambdaEvent} from "../../../../util/domain/types";
import * as E from 'fp-ts/Either';
import {flip} from "fp-ts/function";
import {lt, ordDate} from "fp-ts/Ord";
import {pipe} from "fp-ts/pipeable";
import {JsonRecord} from "fp-ts/lib/Either";
import {curry2} from "fp-ts-std/Function";

const getBody = (event: LambdaEvent) => event.body;
const parseJsonDefaultError = curry2(flip(E.parseJSON))
    (() => 'Could not parse body of request');

const toCreateReservationRequest = (body: JsonRecord): CreateReservationRequest => ({
    hotelId: body.hotelId as string,
    userId: body.userId as string,
    start: new Date(Date.parse(body.start as string)),
    end: new Date(Date.parse(body.end as string)),
    timestamp: new Date(Date.parse(body.timestamp as string)),
});

const checkCreateRequest = (createRequest: CreateReservationRequest) =>
    lt(ordDate)(createRequest.start, createRequest.end) ?
        E.right(createRequest) :
        E.left('Start date should be before end date');

const checkTestHotel = (config: Config) =>
    (createRequest: CreateReservationRequest) => {
        return config.testHotelAllowed || createRequest.hotelId !== '1' ? E.right(createRequest) : E.left(`Test hotel is not allowed in environment ${config.environment}`);
    }

export const fromEventToCreateRequest = (event: LambdaEvent) =>
    (config: Config): E.Either<string, CreateReservationRequest> =>
        pipe(
            getBody(event),
            parseJsonDefaultError,
            E.map(toCreateReservationRequest),
            E.chain(checkCreateRequest),
            E.chain(checkTestHotel(config)),
        );

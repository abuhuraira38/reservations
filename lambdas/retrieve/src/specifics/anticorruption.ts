import * as E from 'fp-ts/lib/Either';
import {ErrorResponse, LambdaEvent, RetrieveReservationRequest, RetrieveState} from "../../../../util/domain/types";
import {pipe} from "fp-ts/pipeable";
import {guard} from "fp-ts-std/Function";
import {MorphicErrorResponse} from "../../../../util/common/responses";
import * as STE from "fp-ts-contrib/StateTaskEither";
import * as TE from "fp-ts/TaskEither";

const toRetrieveRequest = (event: LambdaEvent): RetrieveReservationRequest => ({
    hotelId: event.queryStringParameters?.hotelId,
    userId: event.queryStringParameters?.userId,
    start: new Date(Date.parse(event.queryStringParameters?.start as string)),
});

const checkRetrieveRequest = (event: LambdaEvent) => {
    const queryParamGuard = guard([
        [(e: LambdaEvent) => !e.queryStringParameters,
            () => `Missing query string params`],
        [(e: LambdaEvent) => !e.queryStringParameters.hotelId,
            () => `Missing hotel id`],
        [(e: LambdaEvent) => !e.queryStringParameters.userId,
            () => `Missing user id`],
        [(e: LambdaEvent) => !e.queryStringParameters.start,
            () => `Missing start`],
    ])(() => '');
    const message = queryParamGuard(event);

    return message ?
        E.left(MorphicErrorResponse.of.ClientError({ message }))
        : E.right(event);
};

export const fromEventToRetrieveRequest = (event: LambdaEvent): E.Either<ErrorResponse, RetrieveReservationRequest> => {
    return pipe(
        checkRetrieveRequest(event),
        E.map(toRetrieveRequest),
    );
};

export const checkHotelTest = (request: RetrieveReservationRequest)
    : STE.StateTaskEither<RetrieveState, unknown, RetrieveReservationRequest> =>
    (state: RetrieveState) => {
        const newState = request.hotelId === '1' ? {isTest: true} : state;
        return TE.of([request, newState]);
    };

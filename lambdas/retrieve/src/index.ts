import * as TE from 'fp-ts/lib/TaskEither';
import * as STE from 'fp-ts-contrib/StateTaskEither';
import * as O from 'fp-ts/lib/Option';
import {LambdaEvent} from "../../../util/domain/types";
import {checkHotelTest, fromEventToRetrieveRequest} from "./specifics/anticorruption";
import {pipe} from "fp-ts/pipeable";
import {retrieveHotel, retrieveRestaurant} from "./specifics/database";
import {mapMorphicErrorResponse, okResponse} from "../../../util/common/responses";
import {sequenceS} from "fp-ts/Apply";

const ado = sequenceS(STE.stateTaskEither);

export const handler = async (event: LambdaEvent) => {
    console.log(event);

    const handleState = pipe(
        fromEventToRetrieveRequest(event),
        STE.fromEither,
        STE.chain(checkHotelTest),
        STE.chain(r =>
            ado({
                hotel: retrieveHotel(r),
                restaurant: retrieveRestaurant(r),
            })),
    )({isTest: false});

    return pipe(
        handleState,
        TE.map((res) => {
            const reservations = res[0];
            return JSON.stringify({
                hotel: reservations.hotel,
                restaurant: O.getOrElse(() => null)(reservations.restaurant),
            });
        }),
        TE.map(okResponse),
        TE.getOrElse(mapMorphicErrorResponse)
    )();
};

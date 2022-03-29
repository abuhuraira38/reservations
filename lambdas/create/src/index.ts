import * as RE from 'fp-ts/ReaderEither';
import * as RTE from 'fp-ts/ReaderTaskEither';
import * as RT from 'fp-ts/ReaderTask';
import {LambdaEvent} from "../../../util/domain/types";
import {fromEventToCreateRequest} from "./specifics/anticorruption";
import {pipe} from "fp-ts/pipeable";
import {calculatePrice} from "./specifics/priceCalculation";
import {saveToDatabase} from "./specifics/database";
import {badRequestResponse, okResponse} from "../../../util/common/responses";
import {generateConfig} from "./specifics/config";

export const handler = async (event: LambdaEvent) => {
    const config = generateConfig();

    return pipe(
        RE.right(event),
        RE.chain(fromEventToCreateRequest),
        RE.map(calculatePrice),
        RTE.fromReaderEither,
        RTE.chain(saveToDatabase),
        RTE.bimap(badRequestResponse, () => okResponse('Reservation created')),
        RTE.getOrElse(RT.of),
    )(config)();
};

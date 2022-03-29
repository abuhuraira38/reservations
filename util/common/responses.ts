import {Response, ErrorResponse, ClientError, ServerError} from "../domain/types";
import {makeADT, ofType} from "morphic-ts/lib/adt";

export const okResponse = (message: string): Response => ({
    statusCode: 200,
    body: message,
});

export const badRequestResponse = (err: string): Response => ({
    statusCode: 400,
    body: err,
});

export const internalServerErrorResponse = (err: string): Response => ({
    statusCode: 500,
    body: err,
});

export const clientError = (message: string): ErrorResponse => {
    return {
        type: 'ClientError',
        message,
    };
}

export const serverError = (message: string): ErrorResponse => {
    return {
        type: 'ServerError',
        message,
    };
};

export const MorphicErrorResponse = makeADT('type')({
    ClientError: ofType<ClientError>(),
    ServerError: ofType<ServerError>(),
});

export const mapMorphicErrorResponse = (err: ErrorResponse) => {
    return () => MorphicErrorResponse.match({
        ClientError: ({message}) => {
            return Promise.resolve(badRequestResponse(message))
        },
        ServerError: ({message}) => {
            return Promise.resolve(internalServerErrorResponse(message))
        },
    })(err);
};

export const mapErrorToResponse = (err: ErrorResponse) => {
    return () => new Promise((resolve) => {
        switch (err.type) {
            case 'ClientError':
                return resolve(badRequestResponse(err.message));
            case 'ServerError':
                return resolve(internalServerErrorResponse(err.message));
            default:
                const _exhaustiveCheck: never = err;
                return _exhaustiveCheck;
        }
    });
};

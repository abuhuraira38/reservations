export type Config = {
    tableName: string,
    environment: string,
    testHotelAllowed: boolean,
};

export type RetrieveState = {
    isTest: boolean,
};

// REST
type EventHeaders = {}

export type QueryStringParams = {
    hotelId?: string,
    userId?: string,
    start?: string,
}

export type LambdaEvent = {
    queryStringParameters?: QueryStringParams,
    // headers: EventHeaders,
    // httpMethod: string,
    body?: string, // CHANGED
}

export type Response = {
    statusCode: number,
    body: string,
}

// DOMAIN
export type CreateReservationRequest = {
    hotelId: string,
    userId: string,
    start: Date,
    end: Date,
    timestamp: Date,
};

export type CreateReservationPricedRequest = {
    hotelId: string,
    userId: string,
    start: Date,
    end: Date,
    timestamp: Date,
    price: number,
};

export type CreateReservationPricedWithIdRequest = {
    hashKey: string,
    rangeKey: string,
    hotelId: string,
    userId: string,
    start: Date,
    end: Date,
    timestamp: Date,
    price: number,
}

export type RetrieveReservationRequest = {
    hotelId: string,
    userId: string,
    start: Date,
};

export type HotelReservation = {
    hotelId: string,
    userId: string,
    start: Date,
    end: Date,
    timestamp: Date,
    price: number,
};

export type RestaurantReservation = {
    hotelId: string,
    userId: string,
    start: Date,
    end: Date,
    timestamp: Date,
    price: number,
    freeDrink: string,
};

// ERROR RESPONSES
export type ClientError = {
    readonly type: 'ClientError',
    readonly message: string,
}
export type ServerError = {
    readonly type: 'ServerError',
    readonly message: string,
}

export type ErrorResponse = ClientError | ServerError

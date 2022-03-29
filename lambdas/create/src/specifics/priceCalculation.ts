import {CreateReservationPricedRequest, CreateReservationRequest} from "../../../../util/domain/types";

const differenceInDays = (start: Date, end: Date) => {
    return Math.floor(
        (new Date(end).getTime() - new Date(start).getTime())
        / 86400000
    );
}
// TODO explore edge cases?

export const calculatePrice = (req: CreateReservationRequest): CreateReservationPricedRequest => {
    const days = differenceInDays(req.start, req.end);

    return {
        ...req,
        price: days * 20,
    };
};

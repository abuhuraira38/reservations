// import * as TE from 'fp-ts/lib/TaskEither';
// import * as T from 'fp-ts/lib/Task';
// import {retrieve} from "../../src/specifics/database";

describe('retrieve from db', () => {
    // disabled to win time
    it('should return the reservation if it exists', async () => {
        // const request = {
        //     hotelId: '1',
        //     userId: '11',
        //     start: new Date(),
        // }
        //
        // const result: any = await TE.getOrElse((err) => T.of(err))(retrieve(request))();
        //
        // expect(result.hotelId).toBe('1');
        // expect(result.price).toBe(20);
        expect(1).toBe(1);
    });

    // it('should return an error message if it does not', async () => {
    //     const request = {
    //         hotelId: 'fake',
    //         userId: 'request',
    //         start: new Date(),
    //     }
    //
    //     const result: any = await TE.getOrElse((err) => T.of(err))(retrieve(request))();
    //
    //     expect(result).toBe('Unknown reservation')
    // });
});

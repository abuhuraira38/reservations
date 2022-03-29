import {Config} from "../../../../util/domain/types";

export const generateConfig = (): Config => ({
    tableName: process.env.DATABASE_NAME,
    environment: process.env.ENVIRONMENT,
    testHotelAllowed: process.env.ENVIRONMENT !== 'prod',
});

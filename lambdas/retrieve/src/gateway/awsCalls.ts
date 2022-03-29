import {DynamoDB} from "aws-sdk";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import GetItemInput = DocumentClient.GetItemInput;

const client = new DynamoDB.DocumentClient({accessKeyId: 'AKIAUE4SGOF3ZUKTJ2GN', secretAccessKey: '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', region: "eu-west-1"});

export const get = (params: GetItemInput) => {
    return client.get(params).promise();
};

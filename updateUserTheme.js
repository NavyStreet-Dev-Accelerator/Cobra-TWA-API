"use strict";
const AWS = require("aws-sdk");

AWS.config.update({ region: "us-west-2" });

exports.handler = async (event, context) => {
  const ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: "us-west-2",
  });

  let responseBody = "";
  let statusCode = 0;

  const { userId, themeId } = event.pathParameters;
  const updateValues = JSON.parse(event.body);

  const createUpdateQuery = (fields) => {
    const exp = {
      UpdateExpression: "set",
      ExpressionAttributeValues: {},
    };

    Object.entries(fields).forEach(([key, item]) => {
      exp.UpdateExpression += ` ${key} = :${key},`;
      exp.ExpressionAttributeValues[`:${key}`] = item;
    });
    exp.UpdateExpression = exp.UpdateExpression.slice(0, -1);
    return exp;
  };

  const expression = await createUpdateQuery(updateValues);

  const params = {
    TableName: "Themes",
    Key: {
      userId,
      themeId,
    },
    ...expression,
  };

  try {
    const data = await documentClient.update(params).promise();
    responseBody = JSON.stringify(data);
    statusCode = 201;
  } catch (err) {
    responseBody = `Unable to update theme`;
    statusCode = 403;
  }

  const response = {
    statusCode,
    body: responseBody,
    headers: {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*",
    },
  };

  return response;
};

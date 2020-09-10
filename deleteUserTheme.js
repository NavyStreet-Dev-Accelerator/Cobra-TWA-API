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

  const params = {
    TableName: "Themes",
    Key: {
      userId,
      themeId,
    },
  };

  try {
    const data = await documentClient.delete(params).promise();
    responseBody = JSON.stringify(data);
    statusCode = 200;
  } catch (err) {
    responseBody = `Unable to delete theme data`;
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

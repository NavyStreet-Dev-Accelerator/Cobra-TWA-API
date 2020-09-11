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

  const { userId, themeId, themeName, themeWords } = JSON.parse(event.body);

  const params = {
    TableName: "Themes",
    Item: {
      userId,
      themeId,
      themeName,
      themeWords,
    },
  };

  try {
    const data = await documentClient.put(params).promise();
    responseBody = JSON.stringify(data);
    statusCode = 201;
  } catch (err) {
    responseBody = `Unable to create new theme`;
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

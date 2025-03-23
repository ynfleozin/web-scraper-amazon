import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function listProducts() {
  try {
    const tableName = process.env.DYNAMODB_TABLE;

    if (!tableName) {
      throw new Error("DYNAMODB_TABLE não está definido no ambiente.");
    }

    const params = {
      TableName: tableName,
    };

    const result = await dynamoDb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
      headers: { "Content-Type": "application/json" },
    };
  }
}

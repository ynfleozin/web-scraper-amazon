import AWS from "aws-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";
import puppeteer from "puppeteer";

export const SELECTORS = {
  product: ".p13n-sc-uncoverable-faceout",
  title: [".p13n-sc-truncated", "._cDEzb_p13n-sc-css-line-clamp-3_g3dy1"],
  price: "._cDEzb_p13n-sc-price_3mJ9Z",
};

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function getProducts(event: APIGatewayProxyEvent) {
  let browser;
  try {
    const category = event.pathParameters?.category || "";

    if (category && !/^[a-zA-Z0-9\-]+$/.test(category)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Parâmetros inválidos." }),
      };
    }

    const url = `https://www.amazon.com.br/gp/bestsellers/${
      category ? `${encodeURIComponent(category)}` : ""
    }`;

    browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(url);

    await page.waitForSelector(SELECTORS.product);
    const products = await page.evaluate((SELECTORS) => {
      const content = document.querySelectorAll(SELECTORS.product);

      return Array.from(content)
        .slice(0, 3)
        .map((item) => {
          let title =
            item.querySelector(SELECTORS.title[0])?.textContent?.trim() ||
            item.querySelector(SELECTORS.title[1])?.textContent?.trim() ||
            "Título não disponível.";

          let price =
            item.querySelector(SELECTORS.price)?.textContent?.trim() ||
            "Preço não disponível.";

          return {
            productId: Math.random().toString(36).substring(2,15),
            title,
            price,
          };
        });
    }, SELECTORS);

    const tableName = process.env.DYNAMODB_TABLE;

    if (!tableName) {
      throw new Error("DYNAMODB_TABLE não está definido no ambiente.");
    }

    for (const product of products) {
      const params = {
        TableName: tableName,
        Item: product,
      };
      await dynamoDb.put(params).promise();
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ products }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
      headers: { "Content-Type": "application/json" },
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

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
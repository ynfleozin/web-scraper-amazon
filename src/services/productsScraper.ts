import puppeteer from "puppeteer";

export async function getProducts() {
  let browser;
  try {
    const url = "https://www.amazon.com.br/gp/bestsellers/";

    browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(url);

    await page.waitForSelector(".p13n-sc-uncoverable-faceout");
    const products = await page.evaluate(() => {
      const content = document.querySelectorAll(".p13n-sc-uncoverable-faceout");

      return Array.from(content)
        .slice(0, 3)
        .map((item) => {
          const title = item
            .querySelector(".p13n-sc-truncated")
            ?.textContent?.trim();
          const price = item
            .querySelector("._cDEzb_p13n-sc-price_3mJ9Z")
            ?.textContent?.trim();

          return {
            title,
            price,
          };
        });
    });

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
    if(browser) {
        await browser.close();
    }
  }
}

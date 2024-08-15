import { MessageCreator } from "../MessageCreator";

describe("Message Creator tests", () => {
  test("test, given an order response of a purchase of bnb, it should create the correct purchase message", () => {
    const response = {
      symbol: "bnbusdt",
      side: "BUY",
      type: "MARKET",
      transactTime: new Date(1716840209228),
      quantity: 0.1,
      price: 602.1,
      commissionAsset: "BNB",
    };

    const message = MessageCreator.createPurchaseMessage(response);

    expect(message).toContain(
      "We purchased 💰  0.1 bnb and paid 60.21000000000001 usdt"
    );
  });

  test("test, given an order response of a purchase of doge, it should create the correct purchase message", () => {
    const response = {
      symbol: "dogeusdt",
      side: "BUY",
      type: "MARKET",
      transactTime: new Date(1716840209228),
      quantity: 40,
      price: 0.1349,
      commissionAsset: "DOGE",
    };

    const message = MessageCreator.createPurchaseMessage(response);

    expect(message).toContain("We purchased 💰  40 doge and paid 5.396 usdt");
  });

  test("test, given an order response of a sale of doge, it should create the correct sales message", () => {
    const response = {
      symbol: "dogeusdt",
      side: "SELL",
      type: "MARKET",
      transactTime: new Date(1716839137101),
      quantity: 40,
      price: 0.13487,
      commissionAsset: "USDT",
    };

    const message = MessageCreator.createSaleMessage(response);

    expect(message).toContain("We sold 🤑  40 doge and received 5.3948 usdt");
  });
});

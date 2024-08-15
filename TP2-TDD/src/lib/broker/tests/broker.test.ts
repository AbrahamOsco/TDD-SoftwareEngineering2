import { rejects } from "assert";
import { Broker } from "../Broker";

const broker = Broker.getInstance();

describe("Tests with mocks", () => {
  test("test, with a mock balance response we should fetch USDT balance", async () => {
    jest
      .spyOn(broker, "getBalance")
      .mockReturnValue(
        Promise.resolve({ asset: "USDT", available: 1340.3809031 })
      );

    const response = await broker.getBalance("USDT");

    expect(response.asset).toEqual("USDT");
    expect(broker.getBalance).toHaveBeenCalledWith("USDT");
  });

  test("test, with a mock order response we should sell 0.1 ETH and get USDT", async () => {
    jest.spyOn(broker, "sell").mockReturnValue(
      Promise.resolve({
        symbol: "ethusdt",
        side: "SELL",
        type: "MARKET",
        transactTime: new Date(1716839137101),
        quantity: 0.1,
        price: 3916.93,
        commissionAsset: "USDT",
      })
    );

    const response = await broker.sell("ethusdt", 0.1);

    expect(response.symbol).toEqual("ethusdt");
    expect(response.side).toEqual("SELL");
    expect(broker.sell).toHaveBeenCalledWith("ethusdt", 0.1);
  });

  test("test, with a mock order response we should buy 0.1 BNB and pay with USDT", async () => {
    jest.spyOn(broker, "buy").mockReturnValue(
      Promise.resolve({
        symbol: "bnbusdt",
        side: "BUY",
        type: "MARKET",
        transactTime: new Date(1716840209228),
        quantity: 0.1,
        price: 602.1,
        commissionAsset: "BNB",
      })
    );

    const response = await broker.buy("bnbusdt", 0.1);

    expect(response.symbol).toEqual("bnbusdt");
    expect(response.side).toEqual("BUY");
    expect(broker.buy).toHaveBeenCalledWith("bnbusdt", 0.1);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});

test("test, when trying to buy a nonexistent cryptocurrency it should throw an exception", async () => {
  const symbol = "tddusdt";

  await expect(broker.buy(symbol, 1)).rejects.toThrow();
});

test("test, when trying to sell a nonexistent cryptocurrency it should throw an exception", async () => {
  const symbol = "tddusdt";

  await expect(broker.sell(symbol, 1)).rejects.toThrow();
});

test("test, when trying to fetch balance of a nonexistent cryptocurrency it should throw an exception", async () => {
  const asset = "TDD";

  await expect(broker.getBalance(asset)).rejects.toThrow();
});

test("test, when trying to buy a negative quantity it should throw an exception", async () => {
  const symbol = "bnbusdt";
  const quantity = -1;

  await expect(broker.buy(symbol, quantity)).rejects.toThrow();
});

test("test, when trying to sell a negative quantity it should throw an exception", async () => {
  const symbol = "ethusdt";
  const quantity = -0.1;

  await expect(broker.sell(symbol, quantity)).rejects.toThrow();
});

test("test, when trying to buy and account has insufficient balance it should throw an exception", async () => {
  const symbol = "btcusdt";
  const quantity = 100;

  await expect(broker.buy(symbol, quantity)).rejects.toThrow();
});

test("test, when trying to sell and account has insufficient balance it should throw an exception", async () => {
  const symbol = "btcusdt";
  const quantity = 100;

  await expect(broker.sell(symbol, quantity)).rejects.toThrow();
});

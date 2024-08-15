import { PriceData } from "../models/PriceData";
import { Observer, DataService } from "../services/DataService";

class MockObserver implements Observer {
  async update(): Promise<void> {
    // Mock implementation
  }
}

describe("DataService", () => {
  let dataService: DataService;
  let mockObserver: MockObserver;

  beforeEach(() => {
    dataService = DataService.getInstance();
    mockObserver = new MockObserver();
    dataService.addObserver(mockObserver);

    jest.clearAllMocks();
  });

  afterEach(() => {
    // Reset singleton instance and clear data
    (DataService as any).instance = undefined;
    dataService = DataService.getInstance();
  });

  it("should add price data and notify observers on significant change", async () => {
    const mockUpdate = jest.spyOn(mockObserver, "update");
    const priceData: PriceData = {
      symbol: "BTCUSDT",
      price: 100,
      timestamp: Date.now(),
    };

    dataService.addPriceData(priceData);
    expect(dataService.getPriceHistory("BTCUSDT")).toContainEqual(priceData);
    expect(dataService.getLastPrice("BTCUSDT")).toBe(100);
    expect(mockUpdate).not.toHaveBeenCalled(); // No debe haberse llamado en la primera inserción

    const newPriceData: PriceData = {
      symbol: "BTCUSDT",
      price: 101, // 1% change, should be significant
      timestamp: Date.now(),
    };

    dataService.addPriceData(newPriceData);
    expect(dataService.getPriceHistory("BTCUSDT")).toContainEqual(newPriceData);
    expect(dataService.getLastPrice("BTCUSDT")).toBe(101);
    expect(mockUpdate).toHaveBeenCalled(); // Debe haberse llamado una vez con el cambio significativo
  });

  it("should not notify observers on insignificant change", async () => {
    const mockUpdate = jest.spyOn(mockObserver, "update");
    const priceData: PriceData = {
      symbol: "BTCUSDT",
      price: 100,
      timestamp: Date.now(),
    };

    dataService.addPriceData(priceData);
    expect(dataService.getPriceHistory("BTCUSDT")).toContainEqual(priceData);
    expect(dataService.getLastPrice("BTCUSDT")).toBe(100);
    expect(mockUpdate).not.toHaveBeenCalled(); // No debe haberse llamado en la primera inserción

    const newPriceData: PriceData = {
      symbol: "BTCUSDT",
      price: 100.05, // 0.05% change, should be insignificant
      timestamp: Date.now(),
    };

    dataService.addPriceData(newPriceData);
    expect(dataService.getPriceHistory("BTCUSDT")).not.toContainEqual(
      newPriceData,
    ); // No debe haberse agregado
    expect(dataService.getLastPrice("BTCUSDT")).toBe(100); // Último precio no debe cambiar
    expect(mockUpdate).not.toHaveBeenCalled(); // No debe haberse llamado ya que el cambio es insignificante
  });

  it("should not add price data with insignificant change and retain last price", async () => {
    const priceData: PriceData = {
      symbol: "BTCUSDT",
      price: 100,
      timestamp: Date.now(),
    };

    const insignificantPriceData: PriceData = {
      symbol: "BTCUSDT",
      price: 100.05, // 0.05% change, should be insignificant
      timestamp: Date.now(),
    };

    dataService.addPriceData(priceData);
    dataService.addPriceData(insignificantPriceData);

    const history = dataService.getPriceHistory("BTCUSDT");
    expect(history).toHaveLength(1); // Solo debe haber un dato en el historial
    expect(history).toContainEqual(priceData); // El historial debe contener solo el primer dato
    expect(history).not.toContainEqual(insignificantPriceData); // El historial no debe contener el segundo dato
    expect(dataService.getLastPrice("BTCUSDT")).toBe(100); // Último precio debe seguir siendo el primer precio
  });

  it("should clean old data", async () => {
    const oldTimestamp = Date.now() - 2 * 60 * 60 * 1000; // 2 hours ago
    const oldPriceData: PriceData = {
      symbol: "BTCUSDT",
      price: 100,
      timestamp: oldTimestamp,
    };

    const newPriceData: PriceData = {
      symbol: "BTCUSDT",
      price: 101,
      timestamp: Date.now(),
    };

    await dataService.addPriceData(oldPriceData);
    await dataService.addPriceData(newPriceData);

    const history = dataService.getPriceHistory("BTCUSDT");
    expect(history).not.toContainEqual(oldPriceData);
    expect(history).toContainEqual(newPriceData);
    expect(dataService.getLastPrice("BTCUSDT")).toBe(101); // Último precio debe ser el nuevo precio
  });

  it("should return undefined for last price if no price data exists", () => {
    expect(dataService.getLastPrice("BTCUSDT")).toBeUndefined();
  });

  it("should return last price if price data exists", async () => {
    const priceData: PriceData = {
      symbol: "BTCUSDT",
      price: 100,
      timestamp: Date.now(),
    };

    dataService.addPriceData(priceData);
    expect(dataService.getLastPrice("BTCUSDT")).toBe(100);
  });

  it("should return default value if no prices in range", () => {
    const defaultValue = [0];
    const prices = dataService.getPricesInRange(
      "BTCUSDT",
      3600,
      0,
      defaultValue,
    );
    expect(prices).toEqual(defaultValue);
  });

  it("should return prices in range if they exist", async () => {
    const priceData: PriceData = {
      symbol: "BTCUSDT",
      price: 100,
      timestamp: Date.now() - 3000, // 3 seconds ago
    };

    const priceData2: PriceData = {
      symbol: "BTCUSDT",
      price: 101,
      timestamp: Date.now() - 1000, // 1 second ago
    };

    dataService.addPriceData(priceData);
    dataService.addPriceData(priceData2);

    const prices = dataService.getPricesInRange("BTCUSDT", 3600, 0, [0]);
    expect(prices).toEqual([100, 101]);
  });
});

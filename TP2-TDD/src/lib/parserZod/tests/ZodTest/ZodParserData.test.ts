  import { PriceData } from "../../../market/models/PriceData";
import { DataService } from "../../../market/services/DataService";
import { Variables } from "../../classes/Variables/Variables";
import { ZodParser } from "../../classes/ZodParser/ZodParser";

describe("Test Zod with Data", () => {
  let variables: Variables;
  let dataService: DataService;

  beforeEach(() => {
    variables = Variables.getInstance();

    // Reset the DataService singleton instance
    (DataService as any).instance = undefined;
    dataService = DataService.getInstance();

    // Pre-load DataService with test data
    const priceData1: PriceData = {
      symbol: "BTCUSDT",
      price: 100,
      timestamp: Date.now(),
    };
    const priceData2: PriceData = {
      symbol: "BTCUSDT",
      price: 105,
      timestamp: Date.now(),
    };
    const priceData3: PriceData = {
      symbol: "BTCUSDT",
      price: 110,
      timestamp: Date.now(),
    };

    dataService.addPriceData(priceData1);
    dataService.addPriceData(priceData2);
    dataService.addPriceData(priceData3);
  });

  afterEach(() => {
    Variables.reset();

    // Clear the DataService singleton instance
    (DataService as any).instance = undefined;
  });

  it("test la accion modifica el valor de una variable usando el ultimo valor del historial", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/action/setVariableWithDataFunction.json",
    );
    const rules = zodParser.getRules();
    expect(rules.length).toBe(1);
    expect(rules[0].getActions().length).toBe(1);
    await rules[0].tryApplyActions();
    expect(variables.getValue("VALUE")).toBe(110);
  });
});

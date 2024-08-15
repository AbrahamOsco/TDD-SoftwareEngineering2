import { PriceData } from "../../../market/models/PriceData";
import { DataService } from "../../../market/services/DataService";
import { BooleanValue } from "../../classes/BaseTypeValues/BooleanValue";
import { NumberValue } from "../../classes/BaseTypeValues/NumberValue";
import { StringValue } from "../../classes/BaseTypeValues/StringValue";
import { CallArgumentsData } from "../../classes/CallArguments/CallArgumentData";
import { Data } from "../../classes/Data/Data";
import { CallValue } from "../../classes/Values/CallValue";
import { ConstantValue } from "../../classes/Values/ConstantValue";
import { DataWithoutValueInHistoryOrDefaultException } from "../../exceptions/data.Exceptions";

describe("DataService", () => {
    let dataService: DataService;
  
    beforeEach(() => {
      dataService = DataService.getInstance();
      jest.clearAllMocks();
    });
  
    afterEach(() => {
      // Reset singleton instance and clear data
      (DataService as any).instance = undefined;
      dataService = DataService.getInstance();
    });

    it("test simple data", async () => {
        const priceData1: PriceData = {
            symbol: "BTCUSDT",
            price: 100,
            timestamp: Date.now() - 3000,
          };

        const priceData2: PriceData = {
              symbol: "BTCUSDT",
              price: 100, // 1% change, should be significant
              timestamp: Date.now() - 1000,
        };
        DataService.getInstance().addPriceData(priceData1);
        DataService.getInstance().addPriceData(priceData2);

        const constValue1 = new ConstantValue(new NumberValue(0.01));
        const constValue2 = new ConstantValue(new NumberValue(0.01));

        const aData = new Data("BTCUSDT", 3600, 0, [constValue1, constValue2]);
        const result = await aData.getValues();      
        const argumentData = new CallArgumentsData(aData);
        const callValue1 = new CallValue("==", argumentData);
        await expect(callValue1.getValue()).resolves.toBe(true);;
      });

      it("test simple data wiht no priceData in history with default value equals", async () => {
        const constValue1 = new ConstantValue(new NumberValue(0.01));
        const constValue2 = new ConstantValue(new NumberValue(0.01));

        const aData = new Data("BTCUSDT", 3600, 0, [constValue1, constValue2]);
        const result = await aData.getValues();      
        
        const argumentData = new CallArgumentsData(aData);
        const callValue1 = new CallValue("==", argumentData);
        await expect(callValue1.getValue()).resolves.toBe(true);;
      });
      
      it("test simple data wiht no priceData in history with different default value", async () => {
        const constValue1 = new ConstantValue(new NumberValue(0.01));
        const constValue2 = new ConstantValue(new NumberValue(0.06));

        const aData = new Data("BTCUSDT", 3600, 0, [constValue1, constValue2]);
        const result = await aData.getValues();      
        
        const argumentData = new CallArgumentsData(aData);
        const callValue1 = new CallValue("==", argumentData);
        await expect(callValue1.getValue()).resolves.toBe(false);;
      });


      it("test simple data wiht no priceData in history with different default value", async () => {
        const constValue1 = new ConstantValue(new NumberValue(0.01));
        const constValue2 = new ConstantValue(new NumberValue(0.10));

        const aData = new Data("BTCUSDT", 3600, 0, [constValue1, constValue2]);
        const result = await aData.getValues();      
        
        const argumentData = new CallArgumentsData(aData);
        const callValue1 = new CallValue("MAX", argumentData);
        await expect(callValue1.getValue()).resolves.toBe(0.10);;
      })

      it("test simple data wiht no priceData in history with different default value", async () => {
        const constValue1 = new ConstantValue(new NumberValue(0.01));
        const constValue2 = new ConstantValue(new NumberValue(0.10));

        const aData = new Data("BTCUSDT", 3600, 0, [constValue1, constValue2]);
        const result = await aData.getValues();      
        
        const argumentData = new CallArgumentsData(aData);
        const callValue1 = new CallValue("MIN", argumentData);
        await expect(callValue1.getValue()).resolves.toBe(0.01);;
      })

      it("test data value without value history and does not have default values ​​should throw exception.", async () => {
        const aData = new Data("BTCUSDT", 3600, 0, []);
        await expect(aData.getValues()).rejects.toThrow(DataWithoutValueInHistoryOrDefaultException);    
      })
      

})

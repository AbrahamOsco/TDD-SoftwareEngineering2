import { SellMarketAction } from "../../classes/Actions/SellMarketAction";
import { BooleanValue } from "../../classes/BaseTypeValues/BooleanValue";
import { NumberValue } from "../../classes/BaseTypeValues/NumberValue";
import { StringValue } from "../../classes/BaseTypeValues/StringValue";
import { CallArgumentsArray } from "../../classes/CallArguments/CallArgumentsArray";
import { CallValue } from "../../classes/Values/CallValue";
import { ConstantValue } from "../../classes/Values/ConstantValue";
import { VariableValue } from "../../classes/Values/VariableValue";
import { Variables } from "../../classes/Variables/Variables";
import { BooleanCantBeAmountError, StringCantBeAmountError } from "../../exceptions/basicValueExceptions";

test("test buyMarket action test ", async () => {
    const constValue1 = new ConstantValue(new NumberValue(0.01));
    const constValue2 = new ConstantValue(new BooleanValue(true));
    const constValue3 = new ConstantValue(new StringValue("hello world"));
    Variables.getInstance().setVariable("example1", new NumberValue(0.01));
    Variables.getInstance().setVariable("example2", new BooleanValue(false));
    const variable1 = new VariableValue("example1");
    const variable2 = new VariableValue("example2");
    const callValue = new CallValue("==", new CallArgumentsArray([constValue1, constValue2]))
  
    const sellMarketAction1 = new SellMarketAction("bnbusdt", constValue1);
    const sellMarketAction2 = new SellMarketAction("bnbusdt", constValue2 );
    const sellMarketAction3 = new SellMarketAction("bnbusdt", constValue3 );
    const sellMarketAction4 = new SellMarketAction("bnbusdt", variable1 );
    const sellMarketAction5 = new SellMarketAction("bnbusdt", variable2 );
    const sellMarketAction8 = new SellMarketAction("bnbusdt", callValue );

    await expect(sellMarketAction1.apply()).resolves.not.toThrow;
    await expect(sellMarketAction2.apply()).rejects.toThrow(BooleanCantBeAmountError);
    await expect(sellMarketAction3.apply()).rejects.toThrow(StringCantBeAmountError);
    await expect(sellMarketAction4.apply()).resolves.not.toThrow;
    await expect(sellMarketAction5.apply()).rejects.toThrow(BooleanCantBeAmountError);
    await expect(sellMarketAction8.apply()).rejects.toThrow(BooleanCantBeAmountError);
})



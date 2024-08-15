import { BuyMarketAction } from "../../classes/Actions/BuyMarketAction"
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
  
    const buyMarketAction1 = new BuyMarketAction("bnbusdt", constValue1);
    const buyMarketAction2 = new BuyMarketAction("bnbusdt", constValue2 );
    const buyMarketAction3 = new BuyMarketAction("bnbusdt", constValue3 );
    const buyMarketAction4 = new BuyMarketAction("bnbusdt", variable1 );
    const buyMarketAction5 = new BuyMarketAction("bnbusdt", variable2 );
    const buyMarketAction8 = new BuyMarketAction("bnbusdt", callValue );

    await expect(buyMarketAction1.apply()).resolves.not.toThrow;
    await expect(buyMarketAction2.apply()).rejects.toThrow(BooleanCantBeAmountError);
    await expect(buyMarketAction3.apply()).rejects.toThrow(StringCantBeAmountError);
    await expect(buyMarketAction4.apply()).resolves.not.toThrow;
    await expect(buyMarketAction5.apply()).rejects.toThrow(BooleanCantBeAmountError);
    await expect(buyMarketAction8.apply()).rejects.toThrow(BooleanCantBeAmountError);

})

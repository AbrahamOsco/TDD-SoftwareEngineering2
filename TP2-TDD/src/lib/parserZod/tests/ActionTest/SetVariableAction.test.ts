import { Broker } from "../../../broker";
import { SetVariableAction } from "../../classes/Actions/SetVariableAction";
import { BooleanValue } from "../../classes/BaseTypeValues/BooleanValue";
import { NumberValue } from "../../classes/BaseTypeValues/NumberValue";
import { StringValue } from "../../classes/BaseTypeValues/StringValue";
import { CallArgumentsArray } from "../../classes/CallArguments/CallArgumentsArray";
import { CallValue } from "../../classes/Values/CallValue";
import { ConstantValue } from "../../classes/Values/ConstantValue";
import { VariableValue } from "../../classes/Values/VariableValue";
import { WalletValue } from "../../classes/Values/WalletValue";
import { Variables } from "../../classes/Variables/Variables";

jest.setTimeout(5000000);

test("test set variables using constant, variable, wallet and call Value", async () => {
    const constValue1 = new ConstantValue(new NumberValue(30));
    const constValue2 = new ConstantValue(new BooleanValue(true));
    const constValue3 = new ConstantValue(new StringValue("hello world"));
    Variables.getInstance().insert("exampleVar1", new NumberValue(0.10));
    Variables.getInstance().insert("exampleVar2", new BooleanValue(false));
    const variable1 = new VariableValue("exampleVar1");
    const variable2 = new VariableValue("exampleVar2");
    const walletValue1 = new WalletValue("BTC");
    const walletValue2 = new WalletValue("ETH");
    const callValue = new CallValue("==", new CallArgumentsArray([constValue1, constValue2]))

    const setVariable1 = new SetVariableAction("example1", constValue1);
    const setVariable2 = new SetVariableAction("example2", constValue2);
    const setVariable3 = new SetVariableAction("example3", constValue3);
    const setVariable4 = new SetVariableAction("exampleVar1", variable1);
    const setVariable5 = new SetVariableAction("exampleVar2", variable2);
    const setVariable6 = new SetVariableAction("example6", walletValue1);
    const setVariable7 = new SetVariableAction("example7", walletValue2);
    const setVariable8 = new SetVariableAction("example8", callValue);

    await setVariable1.apply();
    await setVariable2.apply();
    await setVariable3.apply();
    await setVariable4.apply();
    await setVariable5.apply();
    await setVariable6.apply();
    await setVariable7.apply();
    await setVariable8.apply();

    expect( Variables.getInstance().getValue("example1")).toBe(await constValue1.getValue());
    expect( Variables.getInstance().getValue("example2")).toBe(await constValue2.getValue());
    expect( Variables.getInstance().getValue("example3")).toBe(await constValue3.getValue());
    expect( Variables.getInstance().getValue("exampleVar1")).toBe(await variable1.getValue());
    expect( Variables.getInstance().getValue("exampleVar2")).toBe(await variable2.getValue());
    expect( Variables.getInstance().getValue("example6")).toBeCloseTo(await walletValue1.getValue(), 0.3);
    expect( Variables.getInstance().getValue("example7")).toBeCloseTo(await walletValue2.getValue(), 0.3);
    expect( Variables.getInstance().getValue("example8")).toBe(await callValue.getValue());
})

test("test set Variable action ", async () => {
    const broker = Broker.getInstance();
    jest
      .spyOn(broker, "getBalance")
      .mockReturnValue(Promise.resolve({ asset: "BTC", available: 1 }));

    Variables.getInstance().insert("example1", new StringValue("hello world"));
    const wallet1 = new WalletValue("BTC");
    const setVariable = new SetVariableAction("example1", wallet1);
    await setVariable.apply();
    expect(Variables.getInstance().getValue("example1")).toEqual(1);
    expect(broker.getBalance).toHaveBeenCalledWith("BTC");
    jest.restoreAllMocks();
});



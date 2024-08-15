import { BooleanValue } from "../../classes/BaseTypeValues/BooleanValue";
import { NumberValue } from "../../classes/BaseTypeValues/NumberValue"
import { StringValue } from "../../classes/BaseTypeValues/StringValue";
import { ConstantValue } from "../../classes/Values/ConstantValue"
import { VariableValue } from "../../classes/Values/VariableValue"
import { WalletValue } from "../../classes/Values/WalletValue";
import { Variables } from "../../classes/Variables/Variables";
import { NumberCantEvaluatedError, StringCantEvaluatedError } from "../../exceptions/basicValueExceptions";
import { WalletCantEvaluatedError } from "../../exceptions/valueExceptions";

jest.setTimeout(1000000)

test("test condition in values const, variable and wallet", async ( ) =>{
    const value1 = new ConstantValue(new NumberValue(30));
    const value2 = new ConstantValue(new StringValue("hello world"));
    const value3 = new ConstantValue(new BooleanValue(false));
    
    Variables.getInstance().insert("example1", new NumberValue(50));
    Variables.getInstance().insert("example2", new StringValue("hello world"));
    Variables.getInstance().insert("example3", new BooleanValue(true));

    const value4 = new VariableValue("example1");
    const value5 = new VariableValue("example2");
    const value6 = new VariableValue("example3");
    
    const value7 = new WalletValue("BTC");
    const value8 = new WalletValue("ETH");
    const value9 = new WalletValue("BNB");

    await expect(value1.evaluate()).rejects.toThrow(NumberCantEvaluatedError); 
    await expect(value2.evaluate()).rejects.toThrow(StringCantEvaluatedError); 
    await expect(value3.evaluate()).resolves.toBe(false); 
    await expect(value4.evaluate()).rejects.toThrow(NumberCantEvaluatedError);
    await expect(value5.evaluate()).rejects.toThrow(StringCantEvaluatedError); 
    await expect(value6.evaluate()).resolves.toBe(true)
    await expect(value7.evaluate()).rejects.toThrow(WalletCantEvaluatedError);
    await expect(value8.evaluate()).rejects.toThrow(WalletCantEvaluatedError); 
    await expect(value9.evaluate()).rejects.toThrow(WalletCantEvaluatedError); 
})

test("test get in values const, variable and wallet", async ( ) =>{
    const value1 = new ConstantValue(new NumberValue(30));
    const value2 = new ConstantValue(new StringValue("hello world"));
    const value3 = new ConstantValue(new BooleanValue(false));
    
    Variables.getInstance().insert("example1", new NumberValue(50));
    Variables.getInstance().insert("example2", new StringValue("hello world"));
    Variables.getInstance().insert("example3", new BooleanValue(true));

    const value4 = new VariableValue("example1");
    const value5 = new VariableValue("example2");
    const value6 = new VariableValue("example3");
    
    const value7 = new WalletValue("BTC");
    const value8 = new WalletValue("ETH");
    const value9 = new WalletValue("BNB");

    await expect(value1.getValue()).resolves.toBe(30)
    await expect(value2.getValue()).resolves.toBe("hello world")
    await expect(value3.getValue()).resolves.toBe(false)
    await expect(value4.getValue()).resolves.toBe(50)
    await expect(value5.getValue()).resolves.toBe("hello world")
    await expect(value6.getValue()).resolves.toBe(true)
    await expect(value7.getValue()).resolves.toBeGreaterThan(0.01)
    await expect(value8.getValue()).resolves.toBeGreaterThan(0.01)
    await expect(value9.getValue()).resolves.toBeGreaterThan(0.01)
})

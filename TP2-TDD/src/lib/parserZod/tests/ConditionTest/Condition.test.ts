import { BooleanValue } from "../../classes/BaseTypeValues/BooleanValue";
import { NumberValue } from "../../classes/BaseTypeValues/NumberValue";
import { StringValue } from "../../classes/BaseTypeValues/StringValue";
import { Condition } from "../../classes/Condition/Condition"
import { ConstantValue } from "../../classes/Values/ConstantValue"
import { VariableValue } from "../../classes/Values/VariableValue";
import { WalletValue } from "../../classes/Values/WalletValue";
import { Variables } from "../../classes/Variables/Variables";
import { NumberCantEvaluatedError, StringCantEvaluatedError } from "../../exceptions/basicValueExceptions";
import { WalletCantEvaluatedError } from "../../exceptions/valueExceptions";
import { ValueOfTheVariableDoesNotExistError } from "../../exceptions/variablesExceptions";

test("test condition with constantValue ", async () => {
    const condition1 = new Condition(new ConstantValue( new NumberValue(1) ));
    const condition2 = new Condition(new ConstantValue( new StringValue("hello world") ));
    const condition3 = new Condition(new ConstantValue( new BooleanValue(true) ));
    const condition4 = new Condition(new ConstantValue( new BooleanValue(false) ));

    Variables.getInstance().insert("example1", new NumberValue(300));
    Variables.getInstance().insert("example2", new StringValue("another world"));
    Variables.getInstance().insert("example3", new BooleanValue(true));
    Variables.getInstance().insert("example4", new BooleanValue(false));
    
    await expect( condition1.evaluate()).rejects.toThrow(NumberCantEvaluatedError); 
    await expect( condition2.evaluate()).rejects.toThrow(StringCantEvaluatedError); 
    await expect( condition3.evaluate()).resolves.toBe(true);
    await expect( condition4.evaluate()).resolves.toBe(false);
} )

test("test condition with variablesValue", async () => {
    const condition5 = new Condition(new VariableValue( "example1" ));
    const condition6 = new Condition(new VariableValue( "example2" ));
    const condition7 = new Condition(new VariableValue( "example3" ));
    const condition8 = new Condition(new VariableValue( "example4" ));
    const condition9 = new Condition(new VariableValue( "not exists" ));

    await expect( condition5.evaluate()).rejects.toThrow(NumberCantEvaluatedError); 
    await expect( condition6.evaluate()).rejects.toThrow(StringCantEvaluatedError); 
    await expect( condition7.evaluate()).resolves.toBe(true);
    await expect( condition8.evaluate()).resolves.toBe(false);
    await expect( condition9.evaluate()).rejects.toThrow(ValueOfTheVariableDoesNotExistError); 
} )


test("test condition with walletValue", async () => {
    const condition1 = new Condition(new WalletValue("USDT" ));
    const condition2 = new Condition(new WalletValue("ETH" ));
    const condition3 = new Condition(new WalletValue("DOGECOIN" ));
    await expect( condition1.evaluate()).rejects.toThrow(WalletCantEvaluatedError); 
    await expect( condition2.evaluate()).rejects.toThrow(WalletCantEvaluatedError); 
    await expect( condition3.evaluate()).rejects.toThrow(WalletCantEvaluatedError); 
} )


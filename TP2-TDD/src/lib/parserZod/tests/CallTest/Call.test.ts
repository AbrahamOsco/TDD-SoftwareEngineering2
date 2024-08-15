import { BooleanValue } from "../../classes/BaseTypeValues/BooleanValue";
import { NumberValue } from "../../classes/BaseTypeValues/NumberValue"
import { StringValue } from "../../classes/BaseTypeValues/StringValue";
import { CallArgumentsArray } from "../../classes/CallArguments/CallArgumentsArray";
import { CallValue } from "../../classes/Values/CallValue";
import { ConstantValue } from "../../classes/Values/ConstantValue"
import { VariableValue } from "../../classes/Values/VariableValue";
import { WalletValue } from "../../classes/Values/WalletValue";
import { Variables } from "../../classes/Variables/Variables";
import { AND, AVERAGE, DISTINCT, DIVIDE, EQUALS, FIRST, GREATER_THAN, GREATER_THAN_OR_EQUAL, LAST, LESS_THAN, LESS_THAN_OR_EQUAL, MAX, MIN, MULTIPLY, NEGATE, NOT, OR, PLUS, STDDEV, SUBTRACTION } from "../../constant/constant";
import { NumberCantEvaluatedError } from "../../exceptions/basicValueExceptions";
import { ArgumentEmptyOnOperationError } from "../../exceptions/callValueExceptions";
import { CannotBeDividedByZeroException, DivisionShouldOnlyHaveTwoArgumentsException, FunctionCannotBeEvaluatedException, NegateFunctionCannotHaveMoreThanOneArgumentException, NotFunctionShouldOnlyHaveOneArgumentException, NumericalOperationWithStringsOrBooleansException, SubtractionShouldOnlyHaveTwoArgumentsException } from "../../exceptions/functionsExceptions";

jest.setTimeout(1000000)

test("test call with function equals is evaluated with constants ", async () => {
    const constValue1 = new ConstantValue(new NumberValue(30));
    const constValue2 = new ConstantValue(new NumberValue(80));
    const constValue3 = new ConstantValue(new StringValue("hello world"));
    const constValue4 = new ConstantValue(new BooleanValue(true));
    const constValue5 = new ConstantValue(new NumberValue(30));
    
    const argumentsArray1 = new CallArgumentsArray([]);    
    const argumentsArray2 = new CallArgumentsArray([constValue1]);    
    const argumentsArray3 = new CallArgumentsArray([constValue1, constValue2, constValue3, constValue4]);
    const argumentsArray4 = new CallArgumentsArray([constValue1, constValue5]);
    const argumentsArray5 = new CallArgumentsArray([constValue1, constValue2]);
    
    const callValue1 = new CallValue(EQUALS, argumentsArray1);
    const callValue2 = new CallValue(EQUALS, argumentsArray2);
    const callValue3 = new CallValue(EQUALS, argumentsArray3);
    const callValue4 = new CallValue(EQUALS, argumentsArray4);
    const callValue5 = new CallValue(EQUALS, argumentsArray5);

    
    await expect(callValue1.getValue()).rejects.toThrow(ArgumentEmptyOnOperationError)
    await expect(callValue2.evaluate()).resolves.toBe(true);
    await expect(callValue3.evaluate()).resolves.toBe(false);
    await expect(callValue4.evaluate()).resolves.toBe(true);
    await expect(callValue5.evaluate()).resolves.toBe(false);
})

test("test call with function equals is evaluated with variables ", async () => {
    Variables.getInstance().insert("example1", new NumberValue(50));
    Variables.getInstance().insert("example2", new StringValue("hello world"));
    Variables.getInstance().insert("example3", new BooleanValue(false));
    Variables.getInstance().insert("example4", new BooleanValue(false));

    const variableValue1 = new VariableValue("example1");
    const variableValue2 = new VariableValue("example2");
    const variableValue3 = new VariableValue("example3");
    const variableValue4 = new VariableValue("example4");
    
    const argumentsArray1 = new CallArgumentsArray([]);    
    const argumentsArray2 = new CallArgumentsArray([variableValue1]);    
    const argumentsArray3 = new CallArgumentsArray([variableValue1, variableValue2, variableValue3, variableValue4]);
    const argumentsArray4 = new CallArgumentsArray([variableValue3, variableValue4]);
    
    const callValue1 = new CallValue(EQUALS, argumentsArray1);
    const callValue2 = new CallValue(EQUALS, argumentsArray2);
    const callValue3 = new CallValue(EQUALS, argumentsArray3);
    const callValue4 = new CallValue(EQUALS, argumentsArray4);

    await expect(callValue1.evaluate()).rejects.toThrow(ArgumentEmptyOnOperationError)
    await expect(callValue2.evaluate()).resolves.toBe(true);
    await expect(callValue3.evaluate()).resolves.toBe(false);
    await expect(callValue4.evaluate()).resolves.toBe(true);
})

test("test call with function equals is evaluated with wallet", async () => {
    const walletValue1 = new WalletValue("BTC");
    const walletValue2 = new WalletValue("ETH");
    const walletValue3 = new WalletValue("LTC");
    const walletValue4 = new WalletValue("BNB");
    
    const argumentsArray1 = new CallArgumentsArray([]);    
    const argumentsArray2 = new CallArgumentsArray([walletValue1]);    
    const argumentsArray3 = new CallArgumentsArray([walletValue1, walletValue2, walletValue3, walletValue4]);
    const argumentsArray4 = new CallArgumentsArray([walletValue3, walletValue4]);

    const callValue1 = new CallValue(EQUALS, argumentsArray1);
    const callValue2 = new CallValue(EQUALS, argumentsArray2);
    const callValue3 = new CallValue(EQUALS, argumentsArray3);
    const callValue4 = new CallValue(EQUALS, argumentsArray4);

    await expect(callValue1.evaluate()).rejects.toThrow(ArgumentEmptyOnOperationError)
    await expect(callValue2.evaluate()).resolves.toBe(true);
    await expect(callValue3.evaluate()).resolves.toBe(false);
    await expect(callValue4.evaluate()).resolves.toBe(false);
})

test("test call with function multiply is evaluated with constants using getValue and evaluated ", async () => {
    const constValue1 = new ConstantValue(new NumberValue(10));
    const constValue2 = new ConstantValue(new NumberValue(4));
    const constValue3 = new ConstantValue(new StringValue("hello world"));
    const constValue4 = new ConstantValue(new BooleanValue(true));
    const constValue5 = new ConstantValue(new NumberValue(7));
    
    const argumentsArray1 = new CallArgumentsArray([]);    
    const argumentsArray2 = new CallArgumentsArray([constValue1]);    // 10
    const argumentsArray3 = new CallArgumentsArray([constValue1, constValue2, constValue5]); // 10 4 7
    const argumentsArray4 = new CallArgumentsArray([constValue1, constValue3]); // 10 hello world
    const argumentsArray5 = new CallArgumentsArray([constValue2, constValue4]); // 4 true
    
    const callValue1 = new CallValue(MULTIPLY, argumentsArray1);
    const callValue2 = new CallValue(MULTIPLY, argumentsArray2);
    const callValue3 = new CallValue(MULTIPLY, argumentsArray3);
    const callValue4 = new CallValue(MULTIPLY, argumentsArray4);
    const callValue5 = new CallValue(MULTIPLY, argumentsArray5);
    
    await expect(callValue1.evaluate()).rejects.toThrow(ArgumentEmptyOnOperationError);
    await expect(callValue2.evaluate()).rejects.toThrow(FunctionCannotBeEvaluatedException);
    await expect(callValue2.getValue()).resolves.toBe(10);
    await expect(callValue3.getValue()).resolves.toBe(280);
    await expect(callValue4.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue5.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
})


test("test call with function distinct is evaluated with constants using getValue and evaluated ", async () => {
    const constValue1 = new ConstantValue(new NumberValue(10));
    const constValue2 = new ConstantValue(new NumberValue(4));
    const constValue3 = new ConstantValue(new StringValue("hello world"));
    const constValue4 = new ConstantValue(new BooleanValue(true));
    const constValue5 = new ConstantValue(new NumberValue(7));
    const constValue6 = new ConstantValue(new NumberValue(10));
    const constValue7 = new ConstantValue(new BooleanValue(true));
    
    const argumentsArray1 = new CallArgumentsArray([]);    
    const argumentsArray2 = new CallArgumentsArray([constValue1]);    
    const argumentsArray3 = new CallArgumentsArray([constValue1, constValue2, constValue5]);
    const argumentsArray4 = new CallArgumentsArray([constValue1, constValue3]);
    const argumentsArray5 = new CallArgumentsArray([constValue2, constValue4]);
    const argumentsArray6 = new CallArgumentsArray([constValue1, constValue6]);
    const argumentsArray7 = new CallArgumentsArray([constValue4, constValue7]);
    
    const callValue1 = new CallValue(DISTINCT, argumentsArray1);
    const callValue2 = new CallValue(DISTINCT, argumentsArray2);
    const callValue3 = new CallValue(DISTINCT, argumentsArray3);
    const callValue4 = new CallValue(DISTINCT, argumentsArray4);
    const callValue5 = new CallValue(DISTINCT, argumentsArray5);
    const callValue6 = new CallValue(DISTINCT, argumentsArray6);
    const callValue7 = new CallValue(DISTINCT, argumentsArray7);
    
    await expect(callValue1.evaluate()).rejects.toThrow(ArgumentEmptyOnOperationError);
    await expect(callValue2.getValue()).resolves.toBe(true);
    await expect(callValue3.getValue()).resolves.toBe(true);
    await expect(callValue4.getValue()).resolves.toBe(true);
    await expect(callValue5.getValue()).resolves.toBe(true);
    await expect(callValue6.getValue()).resolves.toBe(false);
    await expect(callValue7.getValue()).resolves.toBe(false);
})

test("test call with function lesser is evaluated with constants using getValue and evaluated ", async () => {
    const constValue1 = new ConstantValue(new NumberValue(10.2));
    const constValue2 = new ConstantValue(new NumberValue(8.3));
    const constValue3 = new ConstantValue(new NumberValue(4.7));
    const constValue4 = new ConstantValue(new NumberValue(4.7));
    const constValue5 = new ConstantValue(new StringValue("hello world"));
    
    const argumentsArray1 = new CallArgumentsArray([]);    
    const argumentsArray2 = new CallArgumentsArray([constValue1]); // 10.2
    const argumentsArray3 = new CallArgumentsArray([constValue3, constValue2, constValue1]); // 4.7 8.3 10.2
    const argumentsArray4 = new CallArgumentsArray([constValue1, constValue2, constValue3]); // 10.2 8.3 4.7
    const argumentsArray5 = new CallArgumentsArray([constValue3, constValue4]);  // 4.7  4.7
    const argumentsArray6 = new CallArgumentsArray([constValue3, constValue2]);  // 4.7  8.3
    const argumentsArray7 = new CallArgumentsArray([constValue2, constValue3]);  // 8.3  4.7
    const argumentsArray8 = new CallArgumentsArray([constValue1, constValue5]);  // 10.2  hello world
    
    const callValue1 = new CallValue(LESS_THAN, argumentsArray1);
    const callValue2 = new CallValue(LESS_THAN, argumentsArray2);
    const callValue3 = new CallValue(LESS_THAN, argumentsArray3);
    const callValue4 = new CallValue(LESS_THAN, argumentsArray4);
    const callValue5 = new CallValue(LESS_THAN, argumentsArray5);
    const callValue6 = new CallValue(LESS_THAN, argumentsArray6);
    const callValue7 = new CallValue(LESS_THAN, argumentsArray7);
    const callValue8 = new CallValue(LESS_THAN, argumentsArray8);
    
    await expect(callValue1.evaluate()).rejects.toThrow(ArgumentEmptyOnOperationError);
    await expect(callValue2.evaluate()).resolves.toBe(true);
    await expect(callValue2.getValue()).resolves.toBe(true);
    await expect(callValue3.getValue()).resolves.toBe(true);
    await expect(callValue4.getValue()).resolves.toBe(false);
    await expect(callValue5.getValue()).resolves.toBe(false);
    await expect(callValue6.getValue()).resolves.toBe(true);
    await expect(callValue7.getValue()).resolves.toBe(false);
    await expect(callValue8.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
})


test("test call with function lesser or equals is evaluated with constants using getValue and evaluated ", async () => {
    const constValue1 = new ConstantValue(new NumberValue(10.2));
    const constValue2 = new ConstantValue(new NumberValue(8.3));
    const constValue3 = new ConstantValue(new NumberValue(4.7));
    const constValue4 = new ConstantValue(new NumberValue(4.7));
    const constValue5 = new ConstantValue(new StringValue("hello world"));
    
    const argumentsArray1 = new CallArgumentsArray([]);    
    const argumentsArray2 = new CallArgumentsArray([constValue1]); // 10.2
    const argumentsArray3 = new CallArgumentsArray([constValue3, constValue2, constValue1]); // 4.7 8.3 10.2
    const argumentsArray4 = new CallArgumentsArray([constValue1, constValue2, constValue3]); // 10.2 8.3 4.7
    const argumentsArray5 = new CallArgumentsArray([constValue3, constValue4]);  // 4.7  4.7
    const argumentsArray6 = new CallArgumentsArray([constValue3, constValue2]);  // 4.7  8.3
    const argumentsArray7 = new CallArgumentsArray([constValue2, constValue3]);  // 8.3  4.7
    const argumentsArray8 = new CallArgumentsArray([constValue1, constValue5]);  // 10.2  hello world
    
    const callValue1 = new CallValue(LESS_THAN_OR_EQUAL, argumentsArray1);
    const callValue2 = new CallValue(LESS_THAN_OR_EQUAL, argumentsArray2);
    const callValue3 = new CallValue(LESS_THAN_OR_EQUAL, argumentsArray3);
    const callValue4 = new CallValue(LESS_THAN_OR_EQUAL, argumentsArray4);
    const callValue5 = new CallValue(LESS_THAN_OR_EQUAL, argumentsArray5);
    const callValue6 = new CallValue(LESS_THAN_OR_EQUAL, argumentsArray6);
    const callValue7 = new CallValue(LESS_THAN_OR_EQUAL, argumentsArray7);
    const callValue8 = new CallValue(LESS_THAN_OR_EQUAL, argumentsArray8);
    
    await expect(callValue1.evaluate()).rejects.toThrow(ArgumentEmptyOnOperationError);
    await expect(callValue2.evaluate()).resolves.toBe(true);
    await expect(callValue2.getValue()).resolves.toBe(true);
    await expect(callValue3.getValue()).resolves.toBe(true);
    await expect(callValue4.getValue()).resolves.toBe(false);
    await expect(callValue5.getValue()).resolves.toBe(true);
    await expect(callValue6.getValue()).resolves.toBe(true);
    await expect(callValue7.getValue()).resolves.toBe(false);
    await expect(callValue8.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
})

test("test call with function greater is evaluated with constants using getValue and evaluated ", async () => {
    const constValue1 = new ConstantValue(new NumberValue(10.2));
    const constValue2 = new ConstantValue(new NumberValue(8.3));
    const constValue3 = new ConstantValue(new NumberValue(4.7));
    const constValue4 = new ConstantValue(new NumberValue(4.7));
    const constValue5 = new ConstantValue(new StringValue("hello world"));
    
    const argumentsArray1 = new CallArgumentsArray([]);    
    const argumentsArray2 = new CallArgumentsArray([constValue1]); // 10.2
    const argumentsArray3 = new CallArgumentsArray([constValue3, constValue2, constValue1]); // 4.7 8.3 10.2
    const argumentsArray4 = new CallArgumentsArray([constValue1, constValue2, constValue3]); // 10.2 8.3 4.7
    const argumentsArray5 = new CallArgumentsArray([constValue3, constValue4]);  // 4.7  4.7
    const argumentsArray6 = new CallArgumentsArray([constValue3, constValue2]);  // 4.7  8.3
    const argumentsArray7 = new CallArgumentsArray([constValue2, constValue3]);  // 8.3  4.7
    const argumentsArray8 = new CallArgumentsArray([constValue1, constValue5]);  // 10.2  hello world
    
    const callValue1 = new CallValue(GREATER_THAN, argumentsArray1);
    const callValue2 = new CallValue(GREATER_THAN, argumentsArray2);
    const callValue3 = new CallValue(GREATER_THAN, argumentsArray3);
    const callValue4 = new CallValue(GREATER_THAN, argumentsArray4);
    const callValue5 = new CallValue(GREATER_THAN, argumentsArray5);
    const callValue6 = new CallValue(GREATER_THAN, argumentsArray6);
    const callValue7 = new CallValue(GREATER_THAN, argumentsArray7);
    const callValue8 = new CallValue(GREATER_THAN, argumentsArray8);
    
    await expect(callValue1.evaluate()).rejects.toThrow(ArgumentEmptyOnOperationError);
    await expect(callValue2.evaluate()).resolves.toBe(true);
    await expect(callValue2.getValue()).resolves.toBe(true);
    await expect(callValue3.getValue()).resolves.toBe(false);
    await expect(callValue4.getValue()).resolves.toBe(true);
    await expect(callValue5.getValue()).resolves.toBe(false);
    await expect(callValue6.getValue()).resolves.toBe(false);
    await expect(callValue7.getValue()).resolves.toBe(true);
    await expect(callValue8.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
})


test("test call with function greater or equals is evaluated with constants using getValue and evaluated ", async () => {
    const constValue1 = new ConstantValue(new NumberValue(10.2));
    const constValue2 = new ConstantValue(new NumberValue(8.3));
    const constValue3 = new ConstantValue(new NumberValue(4.7));
    const constValue4 = new ConstantValue(new NumberValue(4.7));
    const constValue5 = new ConstantValue(new StringValue("hello world"));
    
    const argumentsArray1 = new CallArgumentsArray([]);    
    const argumentsArray2 = new CallArgumentsArray([constValue1]); // 10.2
    const argumentsArray3 = new CallArgumentsArray([constValue3, constValue2, constValue1]); // 4.7 8.3 10.2
    const argumentsArray4 = new CallArgumentsArray([constValue1, constValue2, constValue3]); // 10.2 8.3 4.7
    const argumentsArray5 = new CallArgumentsArray([constValue3, constValue4]);  // 4.7  4.7
    const argumentsArray6 = new CallArgumentsArray([constValue3, constValue2]);  // 4.7  8.3
    const argumentsArray7 = new CallArgumentsArray([constValue2, constValue3]);  // 8.3  4.7
    const argumentsArray8 = new CallArgumentsArray([constValue1, constValue5]);  // 10.2  hello world
    
    const callValue1 = new CallValue(GREATER_THAN_OR_EQUAL, argumentsArray1);
    const callValue2 = new CallValue(GREATER_THAN_OR_EQUAL, argumentsArray2);
    const callValue3 = new CallValue(GREATER_THAN_OR_EQUAL, argumentsArray3);
    const callValue4 = new CallValue(GREATER_THAN_OR_EQUAL, argumentsArray4);
    const callValue5 = new CallValue(GREATER_THAN_OR_EQUAL, argumentsArray5);
    const callValue6 = new CallValue(GREATER_THAN_OR_EQUAL, argumentsArray6);
    const callValue7 = new CallValue(GREATER_THAN_OR_EQUAL, argumentsArray7);
    const callValue8 = new CallValue(GREATER_THAN_OR_EQUAL, argumentsArray8);
    
    await expect(callValue1.evaluate()).rejects.toThrow(ArgumentEmptyOnOperationError);
    await expect(callValue2.evaluate()).resolves.toBe(true);
    await expect(callValue2.getValue()).resolves.toBe(true);
    await expect(callValue3.getValue()).resolves.toBe(false);
    await expect(callValue4.getValue()).resolves.toBe(true);
    await expect(callValue5.getValue()).resolves.toBe(true);
    await expect(callValue6.getValue()).resolves.toBe(false);
    await expect(callValue7.getValue()).resolves.toBe(true);
    await expect(callValue8.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
})

test("test call with function negate is evaluated with constants using getValue and evaluated ", async () => {
    const constValue1 = new ConstantValue(new NumberValue(10));
    const constValue2 = new ConstantValue(new NumberValue(4));
    const constValue3 = new ConstantValue(new StringValue("hello world"));
    const constValue4 = new ConstantValue(new BooleanValue(true));
    const constValue5 = new ConstantValue(new NumberValue(7));
    const constValue6 = new ConstantValue(new StringValue("hello world , how are you?"));
    
    const argumentsArray1 = new CallArgumentsArray([]);    
    const argumentsArray2 = new CallArgumentsArray([constValue1]);    // 10
    const argumentsArray3 = new CallArgumentsArray([constValue1, constValue2, constValue5]); // 10 4 7
    const argumentsArray4 = new CallArgumentsArray([constValue1, constValue3]); // 10 hello world
    const argumentsArray5 = new CallArgumentsArray([constValue2, constValue4]); // 4 true
    const argumentsArray6 = new CallArgumentsArray([constValue2]);    // 4
    const argumentsArray7 = new CallArgumentsArray([constValue6]);    // hello world how are you
    
    const callValue1 = new CallValue(NEGATE, argumentsArray1);
    const callValue2 = new CallValue(NEGATE, argumentsArray2);
    const callValue3 = new CallValue(NEGATE, argumentsArray3);
    const callValue4 = new CallValue(NEGATE, argumentsArray4);
    const callValue5 = new CallValue(NEGATE, argumentsArray5);
    const callValue6 = new CallValue(NEGATE, argumentsArray6);
    const callValue7 = new CallValue(NEGATE, argumentsArray7);
    
    await expect(callValue1.evaluate()).rejects.toThrow(ArgumentEmptyOnOperationError);
    await expect(callValue2.evaluate()).rejects.toThrow(FunctionCannotBeEvaluatedException);
    await expect(callValue2.getValue()).resolves.toBe(-10);
    await expect(callValue3.getValue()).rejects.toThrow(NegateFunctionCannotHaveMoreThanOneArgumentException);
    await expect(callValue4.getValue()).rejects.toThrow(NegateFunctionCannotHaveMoreThanOneArgumentException);
    await expect(callValue5.getValue()).rejects.toThrow(NegateFunctionCannotHaveMoreThanOneArgumentException);
    await expect(callValue6.getValue()).resolves.toBe(-4);
    await expect(callValue7.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
})

test("test call with function division is evaluated with constants using getValue and evaluated ", async () => {
    const constValue1 = new ConstantValue(new NumberValue(10));
    const constValue2 = new ConstantValue(new NumberValue(4));
    const constValue3 = new ConstantValue(new StringValue("hello world"));
    const constValue4 = new ConstantValue(new BooleanValue(true));
    const constValue5 = new ConstantValue(new NumberValue(7));
    const constValue6 = new ConstantValue(new StringValue("hello world , how are you?"));
    const constValue7 = new ConstantValue(new NumberValue(0));
    
    const argumentsArray1 = new CallArgumentsArray([]);    
    const argumentsArray2 = new CallArgumentsArray([constValue1]);    // 10
    const argumentsArray3 = new CallArgumentsArray([constValue1, constValue2, constValue5]); // 10 4 7
    const argumentsArray4 = new CallArgumentsArray([constValue1, constValue3]); // 10 hello world
    const argumentsArray5 = new CallArgumentsArray([constValue2, constValue4]); // 4 true
    const argumentsArray6 = new CallArgumentsArray([constValue2]);    // 4
    const argumentsArray7 = new CallArgumentsArray([constValue6]);    // hello world how are you
    const argumentsArray8 = new CallArgumentsArray([constValue1, constValue7]);    // 10 y 0
    const argumentsArray9 = new CallArgumentsArray([constValue1, constValue2]);    // 10 y 4
    const argumentsArray10 = new CallArgumentsArray([constValue2, constValue5]);    // 4 y 7
    
    const callValue1 = new CallValue(DIVIDE, argumentsArray1);
    const callValue2 = new CallValue(DIVIDE, argumentsArray2);
    const callValue3 = new CallValue(DIVIDE, argumentsArray3);
    const callValue4 = new CallValue(DIVIDE, argumentsArray4);
    const callValue5 = new CallValue(DIVIDE, argumentsArray5);
    const callValue6 = new CallValue(DIVIDE, argumentsArray6);
    const callValue7 = new CallValue(DIVIDE, argumentsArray7);
    const callValue8 = new CallValue(DIVIDE, argumentsArray8);
    const callValue9 = new CallValue(DIVIDE, argumentsArray9);
    const callValue10 = new CallValue(DIVIDE, argumentsArray10);

    await expect(callValue1.evaluate()).rejects.toThrow(ArgumentEmptyOnOperationError);
    await expect(callValue2.evaluate()).rejects.toThrow(FunctionCannotBeEvaluatedException);
    await expect(callValue2.getValue()).rejects.toThrow(DivisionShouldOnlyHaveTwoArgumentsException);
    await expect(callValue3.getValue()).rejects.toThrow(DivisionShouldOnlyHaveTwoArgumentsException);
    await expect(callValue4.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue5.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue6.getValue()).rejects.toThrow(DivisionShouldOnlyHaveTwoArgumentsException);
    await expect(callValue7.getValue()).rejects.toThrow(DivisionShouldOnlyHaveTwoArgumentsException);
    await expect(callValue8.getValue()).rejects.toThrow(CannotBeDividedByZeroException);
    await expect(callValue9.getValue()).resolves.toBeCloseTo(2.5);
    await expect(callValue10.getValue()).resolves.toBeCloseTo(0.5714);
})

test("test call with function subtraction is evaluated with constants using getValue and evaluated ", async () => {
    const constValue1 = new ConstantValue(new NumberValue(10));
    const constValue2 = new ConstantValue(new NumberValue(4));
    const constValue3 = new ConstantValue(new StringValue("hello world"));
    const constValue4 = new ConstantValue(new BooleanValue(true));
    const constValue5 = new ConstantValue(new NumberValue(7));
    const constValue6 = new ConstantValue(new StringValue("hello world , how are you?"));
    const constValue7 = new ConstantValue(new NumberValue(0));
    
    const argumentsArray1 = new CallArgumentsArray([]);    
    const argumentsArray2 = new CallArgumentsArray([constValue1]);    // 10
    const argumentsArray3 = new CallArgumentsArray([constValue1, constValue2, constValue5]); // 10 4 7
    const argumentsArray4 = new CallArgumentsArray([constValue1, constValue3]); // 10 hello world
    const argumentsArray5 = new CallArgumentsArray([constValue2, constValue4]); // 4 true
    const argumentsArray6 = new CallArgumentsArray([constValue2]);    // 4
    const argumentsArray7 = new CallArgumentsArray([constValue6]);    // hello world how are you
    const argumentsArray8 = new CallArgumentsArray([constValue1, constValue7]);    // 10 y 0
    const argumentsArray9 = new CallArgumentsArray([constValue1, constValue2]);    // 10 y 4
    const argumentsArray10 = new CallArgumentsArray([constValue2, constValue5]);    // 4 y 7
    
    const callValue1 = new CallValue(SUBTRACTION, argumentsArray1);
    const callValue2 = new CallValue(SUBTRACTION, argumentsArray2);
    const callValue3 = new CallValue(SUBTRACTION, argumentsArray3);
    const callValue4 = new CallValue(SUBTRACTION, argumentsArray4);
    const callValue5 = new CallValue(SUBTRACTION, argumentsArray5);
    const callValue6 = new CallValue(SUBTRACTION, argumentsArray6);
    const callValue7 = new CallValue(SUBTRACTION, argumentsArray7);
    const callValue8 = new CallValue(SUBTRACTION, argumentsArray8);
    const callValue9 = new CallValue(SUBTRACTION, argumentsArray9);
    const callValue10 = new CallValue(SUBTRACTION, argumentsArray10);

    await expect(callValue1.evaluate()).rejects.toThrow(ArgumentEmptyOnOperationError);
    await expect(callValue2.evaluate()).rejects.toThrow(FunctionCannotBeEvaluatedException);
    await expect(callValue2.getValue()).rejects.toThrow(SubtractionShouldOnlyHaveTwoArgumentsException);
    await expect(callValue3.getValue()).rejects.toThrow(SubtractionShouldOnlyHaveTwoArgumentsException);
    await expect(callValue4.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue5.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue6.getValue()).rejects.toThrow(SubtractionShouldOnlyHaveTwoArgumentsException);
    await expect(callValue7.getValue()).rejects.toThrow(SubtractionShouldOnlyHaveTwoArgumentsException);
    await expect(callValue8.getValue()).resolves.toBe(10);
    await expect(callValue9.getValue()).resolves.toBe(6);
    await expect(callValue10.getValue()).resolves.toBe(-3);
})


test("test call with function sum is evaluated with constants using getValue and evaluated ", async () => {
    const constValue1 = new ConstantValue(new NumberValue(10));
    const constValue2 = new ConstantValue(new NumberValue(4));
    const constValue3 = new ConstantValue(new StringValue("hello world"));
    const constValue4 = new ConstantValue(new BooleanValue(true));
    const constValue5 = new ConstantValue(new NumberValue(7));
    const constValue6 = new ConstantValue(new StringValue("hello world , how are you?"));
    const constValue7 = new ConstantValue(new NumberValue(0));
    
    const argumentsArray1 = new CallArgumentsArray([]);    
    const argumentsArray2 = new CallArgumentsArray([constValue1]);    // 10
    const argumentsArray3 = new CallArgumentsArray([constValue1, constValue2, constValue5]); // 10 4 7
    const argumentsArray4 = new CallArgumentsArray([constValue1, constValue3]); // 10 hello world
    const argumentsArray5 = new CallArgumentsArray([constValue2, constValue4]); // 4 true
    const argumentsArray6 = new CallArgumentsArray([constValue2]);    // 4
    const argumentsArray7 = new CallArgumentsArray([constValue6]);    // hello world how are you
    const argumentsArray8 = new CallArgumentsArray([constValue1, constValue7]);    // 10 y 0
    const argumentsArray9 = new CallArgumentsArray([constValue1, constValue2]);    // 10 y 4
    const argumentsArray10 = new CallArgumentsArray([constValue2, constValue5]);    // 4 y 7
    
    const callValue1 = new CallValue(PLUS, argumentsArray1);
    const callValue2 = new CallValue(PLUS, argumentsArray2);
    const callValue3 = new CallValue(PLUS, argumentsArray3);
    const callValue4 = new CallValue(PLUS, argumentsArray4);
    const callValue5 = new CallValue(PLUS, argumentsArray5);
    const callValue6 = new CallValue(PLUS, argumentsArray6);
    const callValue7 = new CallValue(PLUS, argumentsArray7);
    const callValue8 = new CallValue(PLUS, argumentsArray8);
    const callValue9 = new CallValue(PLUS, argumentsArray9);
    const callValue10 = new CallValue(PLUS, argumentsArray10);

    await expect(callValue1.evaluate()).rejects.toThrow(ArgumentEmptyOnOperationError);
    await expect(callValue2.evaluate()).rejects.toThrow(FunctionCannotBeEvaluatedException);
    await expect(callValue2.getValue()).resolves.toBe(10);
    await expect(callValue3.getValue()).resolves.toBe(21);
    await expect(callValue4.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue5.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue6.getValue()).resolves.toBe(4);
    await expect(callValue7.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue8.getValue()).resolves.toBe(10);
    await expect(callValue9.getValue()).resolves.toBe(14);
    await expect(callValue10.getValue()).resolves.toBe(11);
})

test("test call with function min is evaluated with constants using getValue and evaluated ", async () => {
    const constValue1 = new ConstantValue(new NumberValue(10));
    const constValue2 = new ConstantValue(new NumberValue(4));
    const constValue3 = new ConstantValue(new StringValue("hello world"));
    const constValue4 = new ConstantValue(new BooleanValue(true));
    const constValue5 = new ConstantValue(new NumberValue(7));
    const constValue6 = new ConstantValue(new StringValue("hello world , how are you?"));
    const constValue7 = new ConstantValue(new NumberValue(0));
    
    const argumentsArray1 = new CallArgumentsArray([]);    
    const argumentsArray2 = new CallArgumentsArray([constValue1]);    // 10
    const argumentsArray3 = new CallArgumentsArray([constValue1, constValue2, constValue5]); // 10 4 7
    const argumentsArray4 = new CallArgumentsArray([constValue1, constValue3]); // 10 hello world
    const argumentsArray5 = new CallArgumentsArray([constValue2, constValue4]); // 4 true
    const argumentsArray6 = new CallArgumentsArray([constValue2]);    // 4
    const argumentsArray7 = new CallArgumentsArray([constValue6]);    // hello world how are you
    const argumentsArray8 = new CallArgumentsArray([constValue1, constValue7]);    // 10 y 0
    const argumentsArray9 = new CallArgumentsArray([constValue1, constValue2]);    // 10 y 4
    const argumentsArray10 = new CallArgumentsArray([constValue2, constValue5]);    // 4 y 7
    
    const callValue1 = new CallValue(MIN, argumentsArray1);
    const callValue2 = new CallValue(MIN, argumentsArray2);
    const callValue3 = new CallValue(MIN, argumentsArray3);
    const callValue4 = new CallValue(MIN, argumentsArray4);
    const callValue5 = new CallValue(MIN, argumentsArray5);
    const callValue6 = new CallValue(MIN, argumentsArray6);
    const callValue7 = new CallValue(MIN, argumentsArray7);
    const callValue8 = new CallValue(MIN, argumentsArray8);
    const callValue9 = new CallValue(MIN, argumentsArray9);
    const callValue10 = new CallValue(MIN, argumentsArray10);

    await expect(callValue1.evaluate()).rejects.toThrow(ArgumentEmptyOnOperationError);
    await expect(callValue2.evaluate()).rejects.toThrow(FunctionCannotBeEvaluatedException);
    await expect(callValue2.getValue()).resolves.toBe(10);
    await expect(callValue3.getValue()).resolves.toBe(4);
    await expect(callValue4.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue5.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue6.getValue()).resolves.toBe(4);
    await expect(callValue7.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue8.getValue()).resolves.toBe(0);
    await expect(callValue9.getValue()).resolves.toBe(4);
    await expect(callValue10.getValue()).resolves.toBe(4);
})

test("test call with function max is evaluated with constants using getValue and evaluated ", async () => {
    const constValue1 = new ConstantValue(new NumberValue(10));
    const constValue2 = new ConstantValue(new NumberValue(4));
    const constValue3 = new ConstantValue(new StringValue("hello world"));
    const constValue4 = new ConstantValue(new BooleanValue(true));
    const constValue5 = new ConstantValue(new NumberValue(7));
    const constValue6 = new ConstantValue(new StringValue("hello world , how are you?"));
    const constValue7 = new ConstantValue(new NumberValue(0));
    
    const argumentsArray1 = new CallArgumentsArray([]);    
    const argumentsArray2 = new CallArgumentsArray([constValue1]);    // 10
    const argumentsArray3 = new CallArgumentsArray([constValue1, constValue2, constValue5]); // 10 4 7
    const argumentsArray4 = new CallArgumentsArray([constValue1, constValue3]); // 10 hello world
    const argumentsArray5 = new CallArgumentsArray([constValue2, constValue4]); // 4 true
    const argumentsArray6 = new CallArgumentsArray([constValue2]);    // 4
    const argumentsArray7 = new CallArgumentsArray([constValue6]);    // hello world how are you
    const argumentsArray8 = new CallArgumentsArray([constValue1, constValue7]);    // 10 y 0
    const argumentsArray9 = new CallArgumentsArray([constValue1, constValue2]);    // 10 y 4
    const argumentsArray10 = new CallArgumentsArray([constValue2, constValue5]);    // 4 y 7
    
    const callValue1 = new CallValue(MAX, argumentsArray1);
    const callValue2 = new CallValue(MAX, argumentsArray2);
    const callValue3 = new CallValue(MAX, argumentsArray3);
    const callValue4 = new CallValue(MAX, argumentsArray4);
    const callValue5 = new CallValue(MAX, argumentsArray5);
    const callValue6 = new CallValue(MAX, argumentsArray6);
    const callValue7 = new CallValue(MAX, argumentsArray7);
    const callValue8 = new CallValue(MAX, argumentsArray8);
    const callValue9 = new CallValue(MAX, argumentsArray9);
    const callValue10 = new CallValue(MAX, argumentsArray10);

    await expect(callValue1.evaluate()).rejects.toThrow(ArgumentEmptyOnOperationError);
    await expect(callValue2.evaluate()).rejects.toThrow(FunctionCannotBeEvaluatedException);
    await expect(callValue2.getValue()).resolves.toBe(10);
    await expect(callValue3.getValue()).resolves.toBe(10);
    await expect(callValue4.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue5.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue6.getValue()).resolves.toBe(4);
    await expect(callValue7.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue8.getValue()).resolves.toBe(10);
    await expect(callValue9.getValue()).resolves.toBe(10);
    await expect(callValue10.getValue()).resolves.toBe(7);
})

test("test call with function average is evaluated with constants using getValue and evaluated ", async () => {
    const constValue1 = new ConstantValue(new NumberValue(10));
    const constValue2 = new ConstantValue(new NumberValue(4));
    const constValue3 = new ConstantValue(new StringValue("hello world"));
    const constValue4 = new ConstantValue(new BooleanValue(true));
    const constValue5 = new ConstantValue(new NumberValue(7));
    const constValue6 = new ConstantValue(new StringValue("hello world , how are you?"));
    const constValue7 = new ConstantValue(new NumberValue(0));
    
    const argumentsArray1 = new CallArgumentsArray([]);    
    const argumentsArray2 = new CallArgumentsArray([constValue1]);    // 10
    const argumentsArray3 = new CallArgumentsArray([constValue1, constValue2, constValue5]); // 10 4 7
    const argumentsArray4 = new CallArgumentsArray([constValue1, constValue3]); // 10 hello world
    const argumentsArray5 = new CallArgumentsArray([constValue2, constValue4]); // 4 true
    const argumentsArray6 = new CallArgumentsArray([constValue2]);    // 4
    const argumentsArray7 = new CallArgumentsArray([constValue6]);    // hello world how are you
    const argumentsArray8 = new CallArgumentsArray([constValue1, constValue7]);    // 10 y 0
    const argumentsArray9 = new CallArgumentsArray([constValue1, constValue2]);    // 10 y 4
    const argumentsArray10 = new CallArgumentsArray([constValue2, constValue5]);    // 4 y 7
    
    const callValue1 = new CallValue(AVERAGE, argumentsArray1);
    const callValue2 = new CallValue(AVERAGE, argumentsArray2);
    const callValue3 = new CallValue(AVERAGE, argumentsArray3);
    const callValue4 = new CallValue(AVERAGE, argumentsArray4);
    const callValue5 = new CallValue(AVERAGE, argumentsArray5);
    const callValue6 = new CallValue(AVERAGE, argumentsArray6);
    const callValue7 = new CallValue(AVERAGE, argumentsArray7);
    const callValue8 = new CallValue(AVERAGE, argumentsArray8);
    const callValue9 = new CallValue(AVERAGE, argumentsArray9);
    const callValue10 = new CallValue(AVERAGE, argumentsArray10);

    await expect(callValue1.evaluate()).rejects.toThrow(ArgumentEmptyOnOperationError);
    await expect(callValue2.evaluate()).rejects.toThrow(FunctionCannotBeEvaluatedException);
    await expect(callValue2.getValue()).resolves.toBe(10);
    await expect(callValue3.getValue()).resolves.toBe(7);
    await expect(callValue4.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue5.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue6.getValue()).resolves.toBe(4);
    await expect(callValue7.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue8.getValue()).resolves.toBe(5);
    await expect(callValue9.getValue()).resolves.toBe(7);
    await expect(callValue10.getValue()).resolves.toBe(5.5);
})

test("test call with function average is evaluated with constants using getValue and evaluated ", async () => {
    const constValue1 = new ConstantValue(new NumberValue(10));
    const constValue2 = new ConstantValue(new NumberValue(4));
    const constValue3 = new ConstantValue(new StringValue("hello world"));
    const constValue4 = new ConstantValue(new BooleanValue(true));
    const constValue5 = new ConstantValue(new NumberValue(7));
    const constValue6 = new ConstantValue(new StringValue("hello world , how are you?"));
    const constValue7 = new ConstantValue(new NumberValue(0));
    
    const argumentsArray1 = new CallArgumentsArray([]);    
    const argumentsArray2 = new CallArgumentsArray([constValue1]);    // 10
    const argumentsArray3 = new CallArgumentsArray([constValue1, constValue2, constValue5]); // 10 4 7
    const argumentsArray4 = new CallArgumentsArray([constValue1, constValue3]); // 10 hello world
    const argumentsArray5 = new CallArgumentsArray([constValue2, constValue4]); // 4 true
    const argumentsArray6 = new CallArgumentsArray([constValue2]);    // 4
    const argumentsArray7 = new CallArgumentsArray([constValue6]);    // hello world how are you
    const argumentsArray8 = new CallArgumentsArray([constValue1, constValue7]);    // 10 y 0
    const argumentsArray9 = new CallArgumentsArray([constValue1, constValue2]);    // 10 y 4
    const argumentsArray10 = new CallArgumentsArray([constValue2, constValue5]);    // 4 y 7
    
    const callValue1 = new CallValue(STDDEV, argumentsArray1);
    const callValue2 = new CallValue(STDDEV, argumentsArray2);
    const callValue3 = new CallValue(STDDEV, argumentsArray3);
    const callValue4 = new CallValue(STDDEV, argumentsArray4);
    const callValue5 = new CallValue(STDDEV, argumentsArray5);
    const callValue6 = new CallValue(STDDEV, argumentsArray6);
    const callValue7 = new CallValue(STDDEV, argumentsArray7);
    const callValue8 = new CallValue(STDDEV, argumentsArray8);
    const callValue9 = new CallValue(STDDEV, argumentsArray9);
    const callValue10 = new CallValue(STDDEV, argumentsArray10);

    await expect(callValue1.evaluate()).rejects.toThrow(ArgumentEmptyOnOperationError);
    await expect(callValue2.evaluate()).rejects.toThrow(FunctionCannotBeEvaluatedException);
    await expect(callValue2.getValue()).resolves.toBe(0);
    await expect(callValue3.getValue()).resolves.toBeCloseTo(2.4494);
    await expect(callValue4.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue5.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue6.getValue()).resolves.toBe(0);
    await expect(callValue7.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue8.getValue()).resolves.toBeCloseTo(5);
    await expect(callValue9.getValue()).resolves.toBeCloseTo(3);
    await expect(callValue10.getValue()).resolves.toBeCloseTo(1.5);
})


test("test call with function first is evaluated with constants using getValue and evaluated ", async () => {
    const constValue1 = new ConstantValue(new NumberValue(10));
    const constValue2 = new ConstantValue(new NumberValue(4));
    const constValue3 = new ConstantValue(new StringValue("hello world"));
    const constValue4 = new ConstantValue(new BooleanValue(true));
    const constValue5 = new ConstantValue(new NumberValue(7));
    const constValue6 = new ConstantValue(new StringValue("hello world , how are you?"));
    const constValue7 = new ConstantValue(new NumberValue(0));
    
    const argumentsArray1 = new CallArgumentsArray([]);    
    const argumentsArray2 = new CallArgumentsArray([constValue1]);    // 10
    const argumentsArray3 = new CallArgumentsArray([constValue1, constValue2, constValue5]); // 10 4 7
    const argumentsArray4 = new CallArgumentsArray([constValue1, constValue3]); // 10 hello world
    const argumentsArray5 = new CallArgumentsArray([constValue2, constValue4]); // 4 true
    const argumentsArray6 = new CallArgumentsArray([constValue2]);    // 4
    const argumentsArray7 = new CallArgumentsArray([constValue6]);    // hello world how are you
    const argumentsArray8 = new CallArgumentsArray([constValue1, constValue7]);    // 10 y 0
    const argumentsArray9 = new CallArgumentsArray([constValue1, constValue2]);    // 10 y 4
    const argumentsArray10 = new CallArgumentsArray([constValue2, constValue5]);    // 4 y 7
    
    const callValue1 = new CallValue(FIRST, argumentsArray1);
    const callValue2 = new CallValue(FIRST, argumentsArray2);
    const callValue3 = new CallValue(FIRST, argumentsArray3);
    const callValue4 = new CallValue(FIRST, argumentsArray4);
    const callValue5 = new CallValue(FIRST, argumentsArray5);
    const callValue6 = new CallValue(FIRST, argumentsArray6);
    const callValue7 = new CallValue(FIRST, argumentsArray7);
    const callValue8 = new CallValue(FIRST, argumentsArray8);
    const callValue9 = new CallValue(FIRST, argumentsArray9);
    const callValue10 = new CallValue(FIRST, argumentsArray10);

    await expect(callValue1.evaluate()).rejects.toThrow(ArgumentEmptyOnOperationError);
    await expect(callValue2.evaluate()).rejects.toThrow(FunctionCannotBeEvaluatedException);
    await expect(callValue2.getValue()).resolves.toBe(10);
    await expect(callValue3.getValue()).resolves.toBe(10);
    await expect(callValue4.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue5.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue6.getValue()).resolves.toBe(4);
    await expect(callValue7.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue8.getValue()).resolves.toBe(10);
    await expect(callValue9.getValue()).resolves.toBe(10);
    await expect(callValue10.getValue()).resolves.toBe(4);
})

test("test call with function last is evaluated with constants using getValue and evaluated ", async () => {
    const constValue1 = new ConstantValue(new NumberValue(10));
    const constValue2 = new ConstantValue(new NumberValue(4));
    const constValue3 = new ConstantValue(new StringValue("hello world"));
    const constValue4 = new ConstantValue(new BooleanValue(true));
    const constValue5 = new ConstantValue(new NumberValue(7));
    const constValue6 = new ConstantValue(new StringValue("hello world , how are you?"));
    const constValue7 = new ConstantValue(new NumberValue(0));
    
    const argumentsArray1 = new CallArgumentsArray([]);    
    const argumentsArray2 = new CallArgumentsArray([constValue1]);    // 10
    const argumentsArray3 = new CallArgumentsArray([constValue1, constValue2, constValue5]); // 10 4 7
    const argumentsArray4 = new CallArgumentsArray([constValue1, constValue3]); // 10 hello world
    const argumentsArray5 = new CallArgumentsArray([constValue2, constValue4]); // 4 true
    const argumentsArray6 = new CallArgumentsArray([constValue2]);    // 4
    const argumentsArray7 = new CallArgumentsArray([constValue6]);    // hello world how are you
    const argumentsArray8 = new CallArgumentsArray([constValue1, constValue7]);    // 10 y 0
    const argumentsArray9 = new CallArgumentsArray([constValue1, constValue2]);    // 10 y 4
    const argumentsArray10 = new CallArgumentsArray([constValue2, constValue5]);    // 4 y 7
    
    const callValue1 = new CallValue(LAST, argumentsArray1);
    const callValue2 = new CallValue(LAST, argumentsArray2);
    const callValue3 = new CallValue(LAST, argumentsArray3);
    const callValue4 = new CallValue(LAST, argumentsArray4);
    const callValue5 = new CallValue(LAST, argumentsArray5);
    const callValue6 = new CallValue(LAST, argumentsArray6);
    const callValue7 = new CallValue(LAST, argumentsArray7);
    const callValue8 = new CallValue(LAST, argumentsArray8);
    const callValue9 = new CallValue(LAST, argumentsArray9);
    const callValue10 = new CallValue(LAST, argumentsArray10);

    await expect(callValue1.evaluate()).rejects.toThrow(ArgumentEmptyOnOperationError);
    await expect(callValue2.evaluate()).rejects.toThrow(FunctionCannotBeEvaluatedException);
    await expect(callValue2.getValue()).resolves.toBe(10);
    await expect(callValue3.getValue()).resolves.toBe(7);
    await expect(callValue4.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue5.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue6.getValue()).resolves.toBe(4);
    await expect(callValue7.getValue()).rejects.toThrow(NumericalOperationWithStringsOrBooleansException);
    await expect(callValue8.getValue()).resolves.toBe(0);
    await expect(callValue9.getValue()).resolves.toBe(4);
    await expect(callValue10.getValue()).resolves.toBe(7);
})

test("test call with function not is evaluated with constants using getValue and evaluated ", async () => {
    const constValue1 = new ConstantValue(new NumberValue(10));
    const constValue2 = new ConstantValue(new BooleanValue(true));
    const constValue3 = new ConstantValue(new BooleanValue(true));
    const constValue4 = new ConstantValue(new BooleanValue(false));
    const constValue5 = new ConstantValue(new BooleanValue(false));

    const argumentsArray1 = new CallArgumentsArray([]);    
    const argumentsArray2 = new CallArgumentsArray([constValue1]);    // 10
    const argumentsArray3 = new CallArgumentsArray([constValue2, constValue3, constValue5]); // true true false
    const argumentsArray4 = new CallArgumentsArray([constValue2]); // true
    const argumentsArray5 = new CallArgumentsArray([constValue4]); // false
    
    const callValue1 = new CallValue(NOT, argumentsArray1);
    const callValue2 = new CallValue(NOT, argumentsArray2);
    const callValue3 = new CallValue(NOT, argumentsArray3);
    const callValue4 = new CallValue(NOT, argumentsArray4);
    const callValue5 = new CallValue(NOT, argumentsArray5);
    
    await expect(callValue1.evaluate()).rejects.toThrow(NotFunctionShouldOnlyHaveOneArgumentException);
    await expect(callValue2.evaluate()).rejects.toThrow(NumberCantEvaluatedError);
    await expect(callValue2.getValue()).rejects.toThrow(NumberCantEvaluatedError);
    await expect(callValue3.getValue()).rejects.toThrow(NotFunctionShouldOnlyHaveOneArgumentException);
    await expect(callValue4.getValue()).resolves.toBe(false)
    await expect(callValue5.getValue()).resolves.toBe(true)
})

test("test call with function and is evaluated with constants using getValue and evaluated ", async () => {
    const constValue1 = new ConstantValue(new NumberValue(10));
    const constValue2 = new ConstantValue(new BooleanValue(true));
    const constValue3 = new ConstantValue(new BooleanValue(true));
    const constValue4 = new ConstantValue(new BooleanValue(false));
    const constValue5 = new ConstantValue(new BooleanValue(false));

    const argumentsArray1 = new CallArgumentsArray([]);    
    const argumentsArray2 = new CallArgumentsArray([constValue1]);    // 10
    const argumentsArray3 = new CallArgumentsArray([constValue2, constValue3, constValue5]); // true true false
    const argumentsArray4 = new CallArgumentsArray([constValue2]); // true
    const argumentsArray5 = new CallArgumentsArray([constValue4]); // false
    const argumentsArray6 = new CallArgumentsArray([constValue4, constValue5]); // false false
    const argumentsArray7 = new CallArgumentsArray([constValue1, constValue4]); // 1 false ->excep 
    const argumentsArray8 = new CallArgumentsArray([constValue2, constValue3]); // true true 
    
    const callValue1 = new CallValue(AND, argumentsArray1);
    const callValue2 = new CallValue(AND, argumentsArray2);
    const callValue3 = new CallValue(AND, argumentsArray3);
    const callValue4 = new CallValue(AND, argumentsArray4);
    const callValue5 = new CallValue(AND, argumentsArray5);
    const callValue6 = new CallValue(AND, argumentsArray6);
    const callValue7 = new CallValue(AND, argumentsArray7);
    const callValue8 = new CallValue(AND, argumentsArray8);
    
    await expect(callValue1.evaluate()).rejects.toThrow(ArgumentEmptyOnOperationError);
    await expect(callValue2.evaluate()).rejects.toThrow(NumberCantEvaluatedError)
    await expect(callValue2.getValue()).rejects.toThrow(NumberCantEvaluatedError)
    await expect(callValue3.getValue()).resolves.toBe(false)
    await expect(callValue4.getValue()).resolves.toBe(true)
    await expect(callValue5.getValue()).resolves.toBe(false)
    await expect(callValue6.getValue()).resolves.toBe(false)
    await expect(callValue7.getValue()).rejects.toThrow(NumberCantEvaluatedError);
    await expect(callValue8.getValue()).resolves.toBe(true)

})

test("test call with function or is evaluated with constants using getValue and evaluated ", async () => {
    const constValue1 = new ConstantValue(new NumberValue(10));
    const constValue2 = new ConstantValue(new BooleanValue(true));
    const constValue3 = new ConstantValue(new BooleanValue(true));
    const constValue4 = new ConstantValue(new BooleanValue(false));
    const constValue5 = new ConstantValue(new BooleanValue(false));

    const argumentsArray1 = new CallArgumentsArray([]);    
    const argumentsArray2 = new CallArgumentsArray([constValue1]);    // 10
    const argumentsArray3 = new CallArgumentsArray([constValue2, constValue3, constValue5]); // true true false
    const argumentsArray4 = new CallArgumentsArray([constValue2]); // true
    const argumentsArray5 = new CallArgumentsArray([constValue4]); // false
    const argumentsArray6 = new CallArgumentsArray([constValue4, constValue5]); // false false
    const argumentsArray7 = new CallArgumentsArray([constValue1, constValue4]); // 1 false ->excep 
    const argumentsArray8 = new CallArgumentsArray([constValue2, constValue3]); // true true 
    
    const callValue1 = new CallValue(OR, argumentsArray1);
    const callValue2 = new CallValue(OR, argumentsArray2);
    const callValue3 = new CallValue(OR, argumentsArray3);
    const callValue4 = new CallValue(OR, argumentsArray4);
    const callValue5 = new CallValue(OR, argumentsArray5);
    const callValue6 = new CallValue(OR, argumentsArray6);
    const callValue7 = new CallValue(OR, argumentsArray7);
    const callValue8 = new CallValue(OR, argumentsArray8);
    
    await expect(callValue1.evaluate()).rejects.toThrow(ArgumentEmptyOnOperationError);
    await expect(callValue2.evaluate()).rejects.toThrow(NumberCantEvaluatedError)
    await expect(callValue2.getValue()).rejects.toThrow(NumberCantEvaluatedError)
    await expect(callValue3.getValue()).resolves.toBe(true)
    await expect(callValue4.getValue()).resolves.toBe(true)
    await expect(callValue5.getValue()).resolves.toBe(false)
    await expect(callValue6.getValue()).resolves.toBe(false)
    await expect(callValue7.getValue()).rejects.toThrow(NumberCantEvaluatedError);
    await expect(callValue8.getValue()).resolves.toBe(true)

})

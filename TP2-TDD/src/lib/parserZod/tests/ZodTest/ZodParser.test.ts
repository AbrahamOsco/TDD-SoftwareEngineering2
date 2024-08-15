import { log } from "console";
import { Variables } from "../../classes/Variables/Variables";
import { ZodParser } from "../../classes/ZodParser/ZodParser";
import { ArgumentEmptyOnOperationError } from "../../exceptions/callValueExceptions";
import { DataWithoutValueInHistoryOrDefaultException } from "../../exceptions/data.Exceptions";
import {
  CannotBeDividedByZeroException,
  FunctionCannotBeEvaluatedException,
  NegateFunctionCannotHaveMoreThanOneArgumentException,
  NotFunctionShouldOnlyHaveOneArgumentException,
  NumericalOperationWithStringsOrBooleansException,
} from "../../exceptions/functionsExceptions";
import {
  InvalidFormatFoundInJsonError,
  ValueOfTheVariableDoesNotExistError,
} from "../../exceptions/variablesExceptions";
import { Broker } from "../../../broker";
jest.setTimeout(5000000);

describe("Test Zod Parse", () => {
  let variables: Variables;
  let broker: Broker;

  beforeEach(() => {
    variables = Variables.getInstance();
    broker = Broker.getInstance();
  });

  afterEach(() => {
    Variables.reset();
    jest.restoreAllMocks();
  });

  it("test parse Rule Mock with recursive call should not throw and sell 0.00023 of BITCOIN", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/data/dataExampleBTC.json",
    );
    const rules = zodParser.getRules();
    expect(rules.length).toBe(1);
    expect(rules[0].getActions().length).toBe(1);
    await expect(rules[0].tryApplyActions()).resolves.not.toThrow;
  });

  it("test apply actions that a rule with call function <= and call *\
  when applying the actions it should create the variable aBoolean whose value is true.", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/call/callLesserOrEquals.json",
    );
    const rules = zodParser.getRules();
    await rules[0].tryApplyActions();
    expect(variables.getValue("aBoolean")).toBe(true);
  });
  it("test parse Rule using Call Last and Average Data, when applying the\
  action it should create the variable aBoolean whose value is true.", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/data/dataUsingLastAndAvg.json",
    );
    const rules = zodParser.getRules();
    expect(rules.length).toBe(1);
    expect(rules[0].getActions().length).toBe(1);
    await rules[0].tryApplyActions();
    expect(variables.getValue("aNewVariable")).toBe(true);
  });

  it("test testing the order of actions and the evaluation of the condition of a rule after executing\
     the actions of the previous rule, you should first buy  eth/usdt, and in the next\
     rule sell and sell  bnb/usdt.", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/other/orderActionsConditionRules.json",
    );
    const rules = zodParser.getRules();
    await rules[0].tryApplyActions();
    await rules[1].tryApplyActions();
    await rules[2].tryApplyActions();
    expect(rules.length).toBe(3);
    expect(rules[0].getActions().length).toBe(2);
    expect(rules[1].getActions().length).toBe(1);
    expect(rules[2].getActions().length).toBe(1);
  });

  it("test tries to assign incorrect values ​​to the variable and should throw an exception. ", () => {
    expect(() => {
      new ZodParser(__dirname + "/mocks/other/incorrectVariable1.json");
    }).toThrow(InvalidFormatFoundInJsonError);
  });

  it("test tries to assign incorrect values ​​to the variable and should throw an exception. ", () => {
    expect(() => {
      new ZodParser(__dirname + "/mocks/other/incorrectVariable2.json");
    }).toThrow(InvalidFormatFoundInJsonError);
  });
  it("test parse Rule Mock with incorrect call function shoul be throw a exception", () => {
    expect(() => {
      new ZodParser(__dirname + "/mocks/call/callIncorrectFunctionName.json");
    }).toThrow(InvalidFormatFoundInJsonError);
  });

  it("test parse Rule Mock with condition empty should throw an exception", () => {
    expect(() => {
      new ZodParser(__dirname + "/mocks/other/conditionEmpty.json");
    }).toThrow(InvalidFormatFoundInJsonError);
  });

  it("test parse Rule Mock with action empty should throw an exception", () => {
    expect(() => {
      new ZodParser(__dirname + "/mocks/other/actionEmpty.json");
    }).toThrow(InvalidFormatFoundInJsonError);
  });
  

  it("test tries to obtain value of variables that do not exist, an exception should be thrown.", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/other/readVariablesDontExists.json",
    );
    const rules = zodParser.getRules();
    await expect(rules[0].tryApplyActions()).rejects.toThrow(
      ValueOfTheVariableDoesNotExistError,
    );
  });

  it("test apply actions that a rule with call function <= and call * .", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/call/callLesserOrEquals.json",
    );
    const rules = zodParser.getRules();
    await expect(rules[0].tryApplyActions()).resolves.not.toThrow();
  });

  it("test data without any value in its history or default values should throw an exception.", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/data/dataWithoutAnyValue.json",
    );
    const rules = zodParser.getRules();
    await expect(rules[0].tryApplyActions()).rejects.toThrow(
      DataWithoutValueInHistoryOrDefaultException,
    );
  });

  it("test call with division by zero should throw a exception", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/call/callWithDivisionByZero.json",
    );
    const rules = zodParser.getRules();
    await expect(rules[0].tryApplyActions()).rejects.toThrow(
      CannotBeDividedByZeroException,
    );
  });

  it("test the sum function cannot be evaluated it should throw an exception.", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/call/callSumInCondition.json",
    );
    const rules = zodParser.getRules();
    await expect(rules[0].tryApplyActions()).rejects.toThrow(
      FunctionCannotBeEvaluatedException,
    );
  });

  it("test uses the callvalue with less and subtraction, when applying the actions\
    it should create the variable aBoolean whose value is true.", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/call/callLesserAndSubtraction.json",
    );
    const rules = zodParser.getRules();
    await rules[0].tryApplyActions();
    expect(variables.getValue("aBoolean")).toBe(true);
  });

  it("test uses the callvalue with Greater >, FIRST and LAST, when applying the actions\
    it should create the variable aBoolean whose value is true.", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/call/callGreaterFirstAndLast.json",
    );
    const rules = zodParser.getRules();
    await rules[0].tryApplyActions();
    expect(variables.getValue("aBoolean")).toBe(true);
  });

  it("test uses the callvalue with GreaterOrEquals >= , MIN and MAX, when applying the actions\
    it should create the variable aBoolean whose value is true.", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/call/callGreaterOrEqualsWithMinAndMax.json",
    );
    const rules = zodParser.getRules();
    await rules[0].tryApplyActions();
    expect(variables.getValue("aBoolean")).toBe(true);
  });

  it("test uses the callvalue with AND and VARIABLES booleans, when applying the actions\
    it should create the variable aBoolean whose value is true.", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/call/callWithAndYVariable.json",
    );
    const rules = zodParser.getRules();
    await rules[0].tryApplyActions();
    expect(variables.getValue("aBoolean")).toBe(true);
  });

  it("test uses the callvalue with OR and NOT using VARIABLES booleans, when applying the actions\
    it should create the variable aBoolean whose value is true.", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/call/callOrAndNot.json",
    );
    const rules = zodParser.getRules();
    await rules[0].tryApplyActions();
    expect(variables.getValue("aBoolean")).toBe(true);
  });

  it("test uses the callvalue with EQUALS and DISTINCT using VARIABLES booleans, when applying the actions\
    it should create the variable aBoolean whose value is true.", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/call/callWithEqualsAndDistinct.json",
    );
    const rules = zodParser.getRules();
    await rules[0].tryApplyActions();
    expect(variables.getValue("aBoolean")).toBe(true);
  });

  it("test uses the callvalue with MULTIPLY (*) and without any\
    value should be throw a exception", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/call/callMultiplyWithoutArguments.json",
    );
    const rules = zodParser.getRules();
    await expect(rules[0].tryApplyActions()).rejects.toThrow(
      ArgumentEmptyOnOperationError,
    );
  });

  it("test uses the callvalue with MULTIPLY (*) in condition should be throw a exception", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/call/callMultiplyInCondition.json",
    );
    const rules = zodParser.getRules();
    await expect(rules[0].tryApplyActions()).rejects.toThrow(
      FunctionCannotBeEvaluatedException,
    );
  });

  it("test uses the callvalue with LESSER (<) and NEGATE using VARIABLES booleans\
    when applying the actions it should create the variable aBoolean whose value is true.", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/call/callLesserAndNegate.json",
    );
    const rules = zodParser.getRules();
    await rules[0].tryApplyActions();
    expect(variables.getValue("aBoolean")).toBe(true);
  });

  it("test uses the callvalue with Negate cannot have more that\
    one argument should be throw a exception", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/call/callNegateWithMore1Argument.json",
    );
    const rules = zodParser.getRules();
    await expect(rules[0].tryApplyActions()).rejects.toThrow(
      NegateFunctionCannotHaveMoreThanOneArgumentException,
    );
  });

  it("test uses the callvalue with NOT cannot have more that\
    one argument should be throw a exception ", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/call/callNotWithMore1Argument.json",
    );
    const rules = zodParser.getRules();
    await expect(rules[0].tryApplyActions()).rejects.toThrow(
      NotFunctionShouldOnlyHaveOneArgumentException,
    );
  });

  it("test using the callValue with Greater than or equal is compared with\
    strings and booleans it should throw an exception.", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/call/callGreaterEqualsWithBoolStrings.json",
    );
    const rules = zodParser.getRules();
    await expect(rules[0].tryApplyActions()).rejects.toThrow(
      NumericalOperationWithStringsOrBooleansException,
    );
  });

  it("test uses the callvalue with Division by zero should be throw a exception", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/call/callWithDivisionByZero.json",
    );
    const rules = zodParser.getRules();
    await expect(rules[0].tryApplyActions()).rejects.toThrow(
      CannotBeDividedByZeroException,
    );
  });

  it("test uses the callvalue with STDDEV with a empty set should be throw a exception", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/call/callStandardDeviationForAnEmptySet.json",
    );
    const rules = zodParser.getRules();
    await expect(rules[0].tryApplyActions()).rejects.toThrow(
      ArgumentEmptyOnOperationError,
    );
  });

  it("test uses the callvalue with Standard Deviation (<) and Average using CONSTANT\
    when applying the actions it should create the variable aBoolean whose value is true.", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/call/callWithStandarDesviationAndAverage.json",
    );
    const rules = zodParser.getRules();
    await rules[0].tryApplyActions();
    expect(variables.getValue("VariableLoca")).toBe(12);
  });

  it("json without any rule should throw exception", async () => {
    expect(() => {
      new ZodParser(__dirname + "/mocks/other/jsonWithoutRules.json");
    }).toThrow(InvalidFormatFoundInJsonError);
  });

  it("test exception is thrown for zero division", async () => {
    const zoParser = new ZodParser(
      __dirname + "/mocks/call/callWithDivisionByZero.json",
    );
    const rules = zoParser.getRules();
    await expect(rules[0].tryApplyActions()).rejects.toThrow(
      CannotBeDividedByZeroException,
    );
  });

  it("test exception is thrown for standard deviation on empty set", async () => {
    const zoParser = new ZodParser(
      __dirname + "/mocks/call/callStandardDeviationForAnEmptySet.json",
    );
    const rules = zoParser.getRules();
    await expect(rules[0].tryApplyActions()).rejects.toThrow(
      ArgumentEmptyOnOperationError,
    );
  });

  it("test exception is thrown for the sum of two strings", async () => {
    const zoParser = new ZodParser(
      __dirname + "/mocks/call/callIncorrectTypeForTheSumString.json",
    );
    const rules = zoParser.getRules();
    await expect(rules[0].tryApplyActions()).rejects.toThrow(
      NumericalOperationWithStringsOrBooleansException,
    );
  });

  it("test exception is thrown for the sum of two booleans", async () => {
    const zoParser = new ZodParser(
      __dirname + "/mocks/call/callIncorrectTypeForTheSumBoolean.json",
    );
    const rules = zoParser.getRules();
    await expect(rules[0].tryApplyActions()).rejects.toThrow(
      NumericalOperationWithStringsOrBooleansException,
    );
  });

  it("test exception is thrown for the multiply of two strings", async () => {
    const zoParser = new ZodParser(
      __dirname + "/mocks/call/callIncorrectTypeForTheMultiplyString.json",
    );
    const rules = zoParser.getRules();
    await expect(rules[0].tryApplyActions()).rejects.toThrow(
      NumericalOperationWithStringsOrBooleansException,
    );
  });

  it("test exception is thrown for the multiply of two booleans", async () => {
    const zoParser = new ZodParser(
      __dirname + "/mocks/call/callIncorrectTypeForTheMultiplyBoolean.json",
    );
    const rules = zoParser.getRules();
    await expect(rules[0].tryApplyActions()).rejects.toThrow(
      NumericalOperationWithStringsOrBooleansException,
    );
  });

  it("test uses the callvalue with LESSER (<), LAST and then uses data should \
    when applying the actions it should create the variable aBoolean whose value is true.", async () => {
    const zodParser = new ZodParser(__dirname + "/mocks/data/lastData.json");
    const rules = zodParser.getRules();
    await rules[0].tryApplyActions();
    expect(() => {
      variables.getValue("aBoolean");
    }).toThrow(ValueOfTheVariableDoesNotExistError);
  });

  it("test set variable wiht sucesive calls", async () => {
    const zodParser = new ZodParser(
      __dirname + "/mocks/action/setVariableWithSuccessiveCalls.json",
    );
    const rules = zodParser.getRules();
    await rules[0].tryApplyActions();
    expect(variables.getValue("VALUE")).toBe(5);
  });

  it("test buy wiht sucesive calls", async () => {
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
    
    const zodParser = new ZodParser(
      __dirname + "/mocks/action/buyWithSuccessiveCalls.json",
    );
    const rules = zodParser.getRules();
    await rules[0].tryApplyActions();
    expect(broker.buy).toHaveBeenCalledWith("bnbusdt", 0.1);
  });
});

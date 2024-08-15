import { BooleanValue } from "../../classes/BaseTypeValues/BooleanValue";
import { NumberValue } from "../../classes/BaseTypeValues/NumberValue";
import { StringValue } from "../../classes/BaseTypeValues/StringValue";
import { Variables } from "../../classes/Variables/Variables";
import { ValueOfTheVariableDoesNotExistError } from "../../exceptions/variablesExceptions";


test("test variables set and get " , async () => {
    const aValueBasic = "hello world";
    const aValueBasic2 = 30;
    const aValueBasic3 = true;
    const aValueBasic4 = "Another world in english";
    const aUpdateValue = 80.12;

    Variables.getInstance().insert("DogeCoin", new StringValue(aValueBasic));
    Variables.getInstance().insert("Eth Coin", new NumberValue(aValueBasic2));
    Variables.getInstance().insert("Bit Coin", new BooleanValue(aValueBasic3));
    Variables.getInstance().setVariable("new Variable", new StringValue(aValueBasic4));

    expect(Variables.getInstance().getValue("DogeCoin")).toBe( aValueBasic) 
    expect(Variables.getInstance().getValue("Eth Coin")).toBe( aValueBasic2) 
    expect(Variables.getInstance().getValue("Bit Coin")).toBe( aValueBasic3)
    expect(Variables.getInstance().getValue("new Variable")).toBe( aValueBasic4)

    Variables.getInstance().setVariable("DogeCoin", new NumberValue(aUpdateValue));
    expect(Variables.getInstance().getValue("DogeCoin")).toBe(aUpdateValue) 
    expect( () => { Variables.getInstance().getValue("Another Value") } ).toThrow(ValueOfTheVariableDoesNotExistError)

})
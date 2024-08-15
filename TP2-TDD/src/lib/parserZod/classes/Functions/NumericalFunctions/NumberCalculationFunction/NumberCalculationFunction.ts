import { FunctionCannotBeEvaluatedException } from "../../../../exceptions/functionsExceptions";
import { BaseValue } from "../../../BaseTypeValues/BaseValue";
import { NumberValue } from "../../../BaseTypeValues/NumberValue";
import { Value } from "../../../Values/Value";
import { NumberFunction } from "../../NumberFunction";

export abstract class NumberCalculationFunction extends NumberFunction{
    
    public async getAmount(values: Value[]): Promise<number> {
        return await this.getValue(values);
    }

    protected async getBasicValue(values: Value[]): Promise<BaseValue> {
        return new NumberValue(await this.getValue(values)); 
    }

    public evaluate(values: Value[]): Promise<boolean> {
        this.validateArgument(values);
        throw new FunctionCannotBeEvaluatedException(); 
    }

    public abstract getValue(values: Value[]): Promise<number>;

}
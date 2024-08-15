import { FunctionCannotBeEvaluatedException } from "../../../../exceptions/functionsExceptions";
import { BaseValue } from "../../../BaseTypeValues/BaseValue";
import { NumberValue } from "../../../BaseTypeValues/NumberValue";
import { Value } from "../../../Values/Value";
import { NumberFunction } from "../../NumberFunction";

export class Maximum extends NumberFunction{
    
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

    public async getValue(values: Value[]): Promise<number> {
        const valuesCalculate = await this.getArrayNumbers(values);
        return valuesCalculate.reduce( (accum, val) => (Math.max(accum, val)) );
    }
    
}


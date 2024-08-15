import { NegateFunctionCannotHaveMoreThanOneArgumentException } from "../../../../exceptions/functionsExceptions";
import { Value } from "../../../Values/Value";
import { NumberCalculationFunction } from "./NumberCalculationFunction";

export class Negate extends NumberCalculationFunction{
    
    public async getValue(values: Value[]): Promise<number> {
        if(values.length !== 1){
            throw new NegateFunctionCannotHaveMoreThanOneArgumentException();
        }
        const valuesCalculate = await this.getArrayNumbers(values);
        return (valuesCalculate[0] * -1);
    }
}
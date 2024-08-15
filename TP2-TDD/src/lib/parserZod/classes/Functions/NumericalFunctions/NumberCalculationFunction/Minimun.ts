import { Value } from "../../../Values/Value";
import { NumberCalculationFunction } from "./NumberCalculationFunction";

export class Minimum extends NumberCalculationFunction{
    public async getValue(values: Value[]): Promise<number> {
        const valuesCalculate = await this.getArrayNumbers(values);
        return valuesCalculate.reduce( (accum, val) => (Math.min(accum, val)) );
    }
}


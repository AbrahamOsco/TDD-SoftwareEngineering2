import { Value } from "../../../Values/Value";
import { NumberCalculationFunction } from "./NumberCalculationFunction";

export class Last extends NumberCalculationFunction{
    public async getValue(values: Value[]): Promise<number> {
        const valuesCalculate = await this.getArrayNumbers(values);
        return valuesCalculate[valuesCalculate.length - 1];
    }
}


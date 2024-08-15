import { MANTISA_PRECISION } from "../../../../constant/constant";
import { Value } from "../../../Values/Value";
import { NumberCalculationFunction } from "./NumberCalculationFunction";

export class StandardDeviation extends NumberCalculationFunction{
    public async getValue(values: Value[]): Promise<number> {
        const valuesCalculate = await this.getArrayNumbers(values);
        const average = (valuesCalculate.reduce( (accum, val) => (accum + val))) / valuesCalculate.length ;
        const variance = (valuesCalculate.reduce( (accum, val) => accum + Math.pow(val - average, 2), 0)) / valuesCalculate.length;
        const standardDeviation = Math.sqrt(variance) 
        return Number(standardDeviation.toFixed(MANTISA_PRECISION)) ;
    }
}

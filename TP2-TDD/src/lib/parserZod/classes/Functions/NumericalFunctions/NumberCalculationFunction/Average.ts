import { MANTISA_PRECISION } from "../../../../constant/constant";
import { Value } from "../../../Values/Value";
import { NumberCalculationFunction } from "./NumberCalculationFunction";

export class Average extends NumberCalculationFunction{
    public async getValue(values: Value[]): Promise<number> {
        const valuesCalculate = await this.getArrayNumbers(values);
        const average = (valuesCalculate.reduce( (accum, val) => (accum + val))) / valuesCalculate.length ;
        return Number(average.toFixed(MANTISA_PRECISION));
    }
}


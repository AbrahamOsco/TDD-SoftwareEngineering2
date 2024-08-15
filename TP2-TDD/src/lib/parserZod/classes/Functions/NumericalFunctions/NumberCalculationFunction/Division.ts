import { MANTISA_PRECISION } from "../../../../constant/constant";
import { CannotBeDividedByZeroException, DivisionShouldOnlyHaveTwoArgumentsException} from "../../../../exceptions/functionsExceptions";
import { Value } from "../../../Values/Value";
import { NumberCalculationFunction } from "./NumberCalculationFunction";

export class Division extends NumberCalculationFunction{

    public async getValue(values: Value[]): Promise<number> {
        if(values.length !== 2){
            throw new DivisionShouldOnlyHaveTwoArgumentsException();
        }
        const valuesCalculate = await this.getArrayNumbers(values);
        const numerator =  valuesCalculate[0]
        const denominator =  valuesCalculate[1]
        if (denominator === 0){
                throw new CannotBeDividedByZeroException();
        }
        const result = numerator / denominator;
        return Number(result.toFixed(MANTISA_PRECISION));
    }
}
import {  SubtractionShouldOnlyHaveTwoArgumentsException } from "../../../../exceptions/functionsExceptions";
import { Value } from "../../../Values/Value";
import { NumberCalculationFunction } from "./NumberCalculationFunction";

export class Subtraction extends NumberCalculationFunction{
    
    public async getValue(values: Value[]): Promise<number> {
        if(values.length !== 2){
            throw new SubtractionShouldOnlyHaveTwoArgumentsException();
        }
        const valuesCalculate = await this.getArrayNumbers(values);
        const number1 =  valuesCalculate[0]
        const number2 =  valuesCalculate[1]
        return number1 - number2;
    }
}
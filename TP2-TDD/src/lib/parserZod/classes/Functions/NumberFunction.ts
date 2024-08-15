import { BooleanCantBeAmountError, StringCantBeAmountError } from "../../exceptions/basicValueExceptions";
import { NumericalOperationWithStringsOrBooleansException } from "../../exceptions/functionsExceptions";
import { BaseValue } from "../BaseTypeValues/BaseValue";
import { Value } from "../Values/Value";
import { CallFunction } from "./CallFunction";

export abstract class NumberFunction extends CallFunction{

    public abstract getValue(values: Value[]): Promise<number | boolean>;

    protected async getArrayNumbers(values: Value[]) : Promise<number[]>{
        this.validateArgument(values)
        let valuesCalculate: number[] = [];
        try{
            valuesCalculate = await Promise.all(values.map(aValue => aValue.getAmount()));
        }catch (error){
            if( error instanceof StringCantBeAmountError || error instanceof BooleanCantBeAmountError){
                throw new NumericalOperationWithStringsOrBooleansException();
            }
            throw error;    
        }
        return valuesCalculate; 
    }

    public abstract getAmount(values: Value[]): Promise<number>;

    protected abstract getBasicValue(values: Value[]) :Promise<BaseValue>;

    public abstract evaluate(values: Value[]): Promise<boolean>;

}
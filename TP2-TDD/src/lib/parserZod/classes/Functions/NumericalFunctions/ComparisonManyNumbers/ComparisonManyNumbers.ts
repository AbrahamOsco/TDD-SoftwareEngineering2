import { BooleanCantBeAmountError } from "../../../../exceptions/basicValueExceptions";
import { BaseValue } from "../../../BaseTypeValues/BaseValue";
import { BooleanValue } from "../../../BaseTypeValues/BooleanValue";
import { Value } from "../../../Values/Value";
import { NumberFunction } from "../../NumberFunction";

export abstract class ComparisionManyNumbers extends NumberFunction{
    
    public async getValue(values: Value[]): Promise<boolean>{
        const valuesCalculate = await this.getArrayNumbers(values);
        for (let i = 0;  i < valuesCalculate.length - 1; i++){
            if ( this.getLogicalCondition(valuesCalculate, i) ){
                    return false  
            }
        }
        return true;
    }

    protected abstract getLogicalCondition(numberValues: number[], index: number): boolean;
    
    public getAmount(values: Value[]): Promise<number> {
        throw new BooleanCantBeAmountError("In function Compare");
    }
    
    protected async getBasicValue(values: Value[]): Promise<BaseValue> {
        return  new BooleanValue(await this.getValue(values)); 
    }
    
    public async evaluate(values: Value[]): Promise<boolean> {
        return await this.getValue(values);
    }
}
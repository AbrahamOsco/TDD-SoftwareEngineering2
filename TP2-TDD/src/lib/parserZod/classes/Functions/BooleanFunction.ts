import { BooleanCantBeAmountError } from "../../exceptions/basicValueExceptions";
import { BaseValue } from "../BaseTypeValues/BaseValue";
import { BooleanValue } from "../BaseTypeValues/BooleanValue";
import { Value } from "../Values/Value";
import { CallFunction } from "./CallFunction";

export abstract class BooleanFunciton extends CallFunction{

    public abstract getValue(values: Value[]): Promise<boolean>;
    
    public async getAmount(values: Value[]): Promise<number> {
        this.validateArgument(values);
        throw new BooleanCantBeAmountError("Boolean function Can't Be Amount Error");
    }

    protected async getBasicValue(values: Value[]) :Promise<BaseValue> {
        return new BooleanValue(await this.getValue(values)); 
    }
    
    public async evaluate(values: Value[]): Promise<boolean> {
        return this.getValue(values);
    }

    protected async getArrayBasicValues(values: Value[]) : Promise<(string | number | boolean)[]>{
        this.validateArgument(values);
        const valuesObtain = await Promise.all(values.map(aValue => aValue.getValue()));
        return valuesObtain;
    }
    
}
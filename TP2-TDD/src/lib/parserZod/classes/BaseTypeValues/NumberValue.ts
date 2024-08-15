import { NumberCantEvaluatedError } from "../../exceptions/basicValueExceptions";
import { BaseValue } from "./BaseValue";

export class NumberValue implements BaseValue{
    private value: number;
    
    constructor(value: number){
        this.value = value;
    }
    
    public getValue(): number {
        return this.value;
    }

    public evaluate(): boolean {
        throw new NumberCantEvaluatedError("NumberValue can't be evaluated.");
    }

    public async getAmount(): Promise<number> {
        return this.value;
    }
}
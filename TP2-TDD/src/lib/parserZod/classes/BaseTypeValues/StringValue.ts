import { StringCantBeAmountError, StringCantEvaluatedError } from "../../exceptions/basicValueExceptions";
import { BaseValue } from "./BaseValue";

export class StringValue implements BaseValue{
    private value: string;
    constructor(value: string){
        this.value = value;
    }
    
    public getValue(): string {
        return this.value;
    }

    public evaluate(): boolean {
        throw new StringCantEvaluatedError("String Value can't be evaluated.");
    }

    public async getAmount(): Promise<number> {
        throw new StringCantBeAmountError("String Can't Be Amount");
    }

}
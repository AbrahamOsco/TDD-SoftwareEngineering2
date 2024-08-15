import { BooleanCantBeAmountError } from "../../exceptions/basicValueExceptions";
import { BaseValue } from "./BaseValue";

export class BooleanValue implements BaseValue{
    private value: boolean;
    
    constructor(value: boolean){
        this.value = value;
    }

    public getValue(): boolean{
        return this.value
    }
    
    public evaluate(): boolean {
        return this.value;
    }

    public async getAmount(): Promise<number> {
        throw new BooleanCantBeAmountError("Boolean Can't Be Amount");
    }

} 
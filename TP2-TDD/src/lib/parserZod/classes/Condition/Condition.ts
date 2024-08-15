import { Value } from "../Values/Value";

export class Condition{
    private aValue: Value;
    
    public constructor(aValue: Value){
        this.aValue = aValue;
    }

    public async evaluate(): Promise<boolean>{
        return await this.aValue.evaluate();
    }
    
}
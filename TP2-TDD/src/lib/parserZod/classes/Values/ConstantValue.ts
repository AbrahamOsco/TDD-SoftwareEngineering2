import { BaseValue } from "../BaseTypeValues/BaseValue";
import { Variables } from "../Variables/Variables";
import { Value } from "./Value";

export class ConstantValue implements Value{
    
    private baseValue: BaseValue;
    
    public constructor(baseValue:BaseValue){
        this.baseValue = baseValue;
    }
    
    public async getValue(): Promise<string | number | boolean>{
        return this.baseValue.getValue();
    }

    public async evaluate(): Promise<boolean> {
        return  this.baseValue.evaluate();
    }

    public async setValueInVariables(variableName: string): Promise<void> {
        Variables.getInstance().setVariable(variableName, this.baseValue);
    }
    
    public async getAmount(): Promise<number> {
        return await this.baseValue.getAmount();
    }

}
import { Variables } from "../Variables/Variables";
import { Value } from "./Value";

export class VariableValue implements Value{
    private variableName: string;
    
    public constructor(variableName:string){
        this.variableName = variableName;
    }
    
    public async getValue(): Promise<string | number | boolean> {
        return Variables.getInstance().getValue(this.variableName);
    }
    
    public async evaluate(): Promise<boolean> {
        return Variables.getInstance().evaluate(this.variableName);
    }

    public async setValueInVariables(variableNameInput: string): Promise<void> {
        Variables.getInstance().setVariable(variableNameInput, Variables.getInstance().findVariable(this.variableName));
    }
    
    public async getAmount(): Promise<number> {
        return await Variables.getInstance().getAmount(this.variableName);
    }
}
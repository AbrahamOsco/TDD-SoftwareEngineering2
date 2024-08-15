import { Log } from "../../../logger/Log";
import { Value } from "../Values/Value";
import { Action } from "./Action";

export class SetVariableAction implements Action{
    variableName: string;
    value: Value;

    public constructor(variableName: string, value: Value){
        this.variableName = variableName;
        this.value = value;
    }

    public async apply(): Promise<void> {
        await this.value.setValueInVariables(this.variableName);
        Log.info(`The variable ${this.variableName} was set to ${await this.value.getValue()} successfully ✅`)
    }
    
}
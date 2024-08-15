import { CallFunction } from "../Functions/CallFunction";
import { Value } from "../Values/Value";
import { CallArguments } from "./CallArguments";

export class CallArgumentsArray implements CallArguments {
    private values: Value[];

    constructor(values: Value[]) {
        this.values = values;
    }

    public async getAmount(aFunctionCall: CallFunction): Promise<number> {
        return await aFunctionCall.getAmount(this.values);
    }

    public async setValue(variableName:string, aFunctionCall: CallFunction): Promise<void> {
        return await aFunctionCall.setValue(variableName, this.values);
    }

    public async beEvaluatedBy(aFunctionCall: CallFunction): Promise<boolean> {
        return await aFunctionCall.evaluate(this.values);
    }
    
    public async getValue(aFunctionCall: CallFunction): Promise<number | boolean> {
        return await aFunctionCall.getValue(this.values);
    }
}
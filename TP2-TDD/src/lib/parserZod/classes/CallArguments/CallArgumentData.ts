import { Data } from "../Data/Data";
import { CallFunction } from "../Functions/CallFunction";
import { CallArguments } from "./CallArguments";

export class CallArgumentsData implements CallArguments {
    private data: Data;

    constructor(data: Data) {
        this.data = data;
    }
    
    public async getValue(aFunctionCall: CallFunction): Promise<number | boolean> {
        const values = await this.data.getValues();
        return await aFunctionCall.getValue(values);
    }

    public async getAmount(aFunctionCall: CallFunction): Promise<number> {
        const values = await this.data.getValues();
        return await aFunctionCall.getAmount(values);
    }

    public async setValue(variableName: string, aFunctionCall: CallFunction): Promise<void> {
        const values = await this.data.getValues();
        return await aFunctionCall.setValue(variableName, values);
    }

    public async beEvaluatedBy(aFunctionCall: CallFunction): Promise<boolean> {
        const values = await this.data.getValues();
        return await aFunctionCall.evaluate(values);
    }
}